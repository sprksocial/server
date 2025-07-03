import { pino } from "pino";
import { Database } from "../data-plane/server/index.ts";
import {
  createBidirectionalResolver,
  createIdResolver,
} from "../utils/id-resolver.ts";
import { createJetstreamClient } from "./utils/jetstream-client.ts";
import { customConfig } from "./utils/logger-config.ts";

const logger = pino(customConfig("ingester"));

export default async function startJetstreamIngester() {
  logger.info("Starting Jetstream ingester service");

  // Set up database connection
  const db = new Database();
  try {
    await db.connect();
  } catch (err) {
    logger.error({ err }, "Failed to connect to database");
    Deno.exit(1);
  }

  // Create ID resolver
  const resolver = createIdResolver();
  const bidirectionalResolver = createBidirectionalResolver(resolver);

  // Create and start Jetstream client
  const jetstreamClient = await createJetstreamClient(
    db,
    bidirectionalResolver,
  );
  const connection = jetstreamClient.connect({
    filterCollections: ["so.sprk.*", "app.bsky.graph.follow"],
  });

  // Handle shutdown gracefully
  const shutdown = async () => {
    logger.info("Shutting down...");
    connection.close();
    await db.disconnect();
    Deno.exit(0);
  };

  Deno.addSignalListener("SIGINT", shutdown);
  Deno.addSignalListener("SIGTERM", shutdown);

  logger.info("Ingester service is running");
}
