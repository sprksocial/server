import WebSocket from "ws";
import { AtUri } from "@atproto/syntax";
import { CID } from "multiformats/cid";
import { env } from "../../utils/env.ts";
import type { JetstreamEvent } from "../../utils/events.ts";
import { Database } from "../../data-plane/server/index.ts";
import type { BidirectionalResolver } from "../../utils/id-resolver.ts";
import { IndexingService } from "./indexing/index.ts";
import { BackgroundQueue } from "./background.ts";
import { Buffer } from "node:buffer";
import { WriteOpAction } from "@atproto/repo";

export interface JetstreamClientOptions {
  filterCollections?: string[];
  initialCursor?: number | null;
}

export async function createJetstreamClient(
  db: Database,
  resolver: BidirectionalResolver,
) {
  // Initialize background queue and indexing service
  const background = new BackgroundQueue(db);
  const indexingSvc = new IndexingService(db, resolver.baseResolver, background);

  // Load initial cursor from DB
  let cursorPosition: number | null = await db.getCursorState();
  if (cursorPosition) {
    db.logger.info(
      {
        initialCursor: cursorPosition,
        formattedDate: new Date(Math.floor(cursorPosition / 1000))
          .toISOString(),
      },
      "Loaded initial cursor from DB",
    );
  } else {
    db.logger.info("No initial cursor found in DB, will start from live feed.");
  }

  let wsConnection: WebSocket | null = null;
  let heartbeatInterval: number | null = null;
  let saveCursorInterval: number | null = null; // Added for periodic cursor saving
  let lastSavedCursorPosition: number | null = cursorPosition;

  function connect(options: JetstreamClientOptions = {}): {
    close: () => void;
  } {
    // Use the loaded cursorPosition as default if no initialCursor is provided in options
    const {
      filterCollections = ["so.sprk.*"],
      initialCursor = cursorPosition,
    } = options;

    // Update cursorPosition if an initialCursor was explicitly passed in options or from DB
    if (initialCursor) {
      cursorPosition = initialCursor;
    }

    let url = filterCollections.reduce((acc, collection) => {
      return `${acc}wantedCollections=${collection}&`;
    }, `${env.JETSTREAM_URL}?`);

    if (cursorPosition) {
      // Subtract a few seconds (in microseconds) to ensure no gaps
      const rewindCursor = parseInt(cursorPosition.toString()) - 5000000; // 5 seconds in microseconds
      url += `cursor=${rewindCursor}`;
    }

    db.logger.info(`Connecting to Jetstream: ${url}`);

    wsConnection = new WebSocket(url);

    wsConnection.on("open", () => {
      db.logger.info("Connected to Jetstream");
      // Start periodic cursor saving only after successful connection
      startPeriodicCursorSave();
    });

    wsConnection.on("message", async (data: Buffer) => {
      try {
        const event = JSON.parse(data.toString()) as JetstreamEvent;

        // Save cursor position for each event
        if (event.time_us) {
          cursorPosition = event.time_us;
        }

        // Process events
        await processEvent(event);
      } catch (error) {
        db.logger.error({ error }, "Error parsing or processing message");
      }
    });

    wsConnection.on("error", (error: Error) => {
      db.logger.error({ error }, "WebSocket error");
      handleReconnect(options);
    });

    wsConnection.on("close", () => {
      db.logger.info("Connection closed. Attempting to reconnect...");
      handleReconnect(options);
    });

    // Setup heartbeat to keep the connection alive
    heartbeatInterval = setInterval(() => {
      if (wsConnection && wsConnection.readyState === WebSocket.OPEN) {
        wsConnection.ping();
      } else {
        clearHeartbeatInterval();
      }
    }, 30000);

    return {
      close: () => {
        clearHeartbeatInterval();
        clearSaveCursorInterval(); // Clear cursor save interval on close/error
        if (wsConnection && wsConnection.readyState === WebSocket.OPEN) {
          wsConnection.close();
          wsConnection = null;
        }
      },
    };
  }

  function clearHeartbeatInterval() {
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval);
      heartbeatInterval = null;
    }
  }

  function clearSaveCursorInterval() {
    if (saveCursorInterval) {
      clearInterval(saveCursorInterval);
      saveCursorInterval = null;
    }
  }

  function startPeriodicCursorSave() {
    clearSaveCursorInterval(); // Clear any existing interval first
    saveCursorInterval = setInterval(async () => {
      if (
        cursorPosition !== null && cursorPosition !== lastSavedCursorPosition
      ) {
        try {
          await db.saveCursorState(cursorPosition);
          lastSavedCursorPosition = cursorPosition;
        } catch (error) {
          db.logger.error(
            { cursorPosition, error },
            "Failed to periodically save cursor state",
          );
        }
      }
    }, 30000); // Save every 30 seconds
  }

  function handleReconnect(options: JetstreamClientOptions) {
    clearHeartbeatInterval();
    clearSaveCursorInterval(); // Clear cursor save interval before reconnecting

    if (wsConnection) {
      wsConnection = null;
    }

    // Use setTimeout to avoid immediate reconnection
    setTimeout(() => connect(options), 5000);
  }

  async function processEvent(event: JetstreamEvent) {
    try {
      // Only process commit events
      if (event.kind !== "commit") {
        return;
      }

      const { did, time_us } = event;
      const { operation, collection, rkey, record, cid } = event.commit;

      db.logger.trace(
        `Processing ${operation} operation for DID: ${did}, collection: ${collection}, rkey: ${rkey}`,
      );

      const uri = `at://${did}/${collection}/${rkey}`;
      const timestamp = new Date(Math.floor(time_us / 1000)).toISOString();

      // Handle different event types similar to firehose pattern
      if (operation === "delete") {
        await indexingSvc.deleteRecord(new AtUri(uri));
      } else {
        const isCreate = operation === "create";
        
        await indexingSvc.indexRecord(
          new AtUri(uri),
          CID.parse(cid),
          record,
          isCreate ? WriteOpAction.Create : WriteOpAction.Update,
          timestamp,
        );
      }

      // Always update handle
      await indexingSvc.indexHandle(did, timestamp);

    } catch (err) {
      // Log the error but don't re-throw to prevent connection from crashing
      const mongoError = err as { code?: number; message?: string };

      // Handle MongoDB duplicate key errors specifically
      if (mongoError.code === 11000) {
        db.logger.warn(
          {
            err: mongoError.message,
            operation: event.kind === "commit" ? event.commit.operation : event.kind,
            did: event.did,
            uri: event.kind === "commit" ? `at://${event.did}/${event.commit.collection}/${event.commit.rkey}` : undefined,
            collection: event.kind === "commit" ? event.commit.collection : undefined,
          },
          "Duplicate key error - record may have been processed concurrently",
        );
        return; // Silently skip duplicate key errors
      }

      db.logger.error(
        { 
          err, 
          operation: event.kind === "commit" ? event.commit.operation : event.kind, 
          did: event.did 
        },
        "Error processing jetstream event, continuing",
      );
    }
  }

  return { connect };
}
