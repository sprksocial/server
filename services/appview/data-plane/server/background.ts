import PQueue from "p-queue";
import { Database } from "./index.ts";
import { Logger } from "@logtape/logtape";

// A simple queue for in-process, out-of-band/backgrounded work

export class BackgroundQueue {
  queue = new PQueue();
  destroyed = false;
  private processAllInterval: number | null = null;
  private isProcessingAll = false;

  constructor(public db: Database, public logger: Logger) {}

  add(task: Task) {
    if (this.destroyed) {
      return;
    }
    this.queue
      .add(() => task(this.db))
      .catch((err: Error) => {
        // Check if this is a MongoDB connection error during shutdown
        if (
          err.message?.includes("Client must be connected") && this.destroyed
        ) {
          this.logger.debug(
            "Ignoring MongoDB connection error during shutdown",
            { err: err.message },
          );
          return;
        }

        // Check for MongoDB duplicate key errors
        const mongoError = err as { code?: number };
        if (mongoError.code === 11000) {
          this.logger.warn(
            "Ignoring duplicate key error in background task",
            { err: err.message },
          );
          return;
        }

        this.logger.error("background queue task failed", { err });
      });
  }

  async processAll() {
    this.isProcessingAll = true;

    // Log immediately when starting processAll
    const initialPending = this.queue.size;
    const initialRunning = this.queue.pending;
    this.logger.info("Background queue starting processAll", {
      pending: initialPending,
      running: initialRunning,
      total: initialPending + initialRunning,
      mode: "processAll",
      action: "starting",
    });

    // Start logging queue progress every 10 seconds
    this.processAllInterval = setInterval(() => {
      if (!this.destroyed && this.isProcessingAll) {
        const pending = this.queue.size;
        const running = this.queue.pending;

        this.logger.info("Background queue processing progress", {
          pending,
          running,
          total: pending + running,
          mode: "processAll",
        });

        // Stop logging if queue is empty
        if (pending === 0 && running === 0) {
          this.logger.info("Background queue processing completed", {
            pending: 0,
            running: 0,
            total: 0,
            mode: "processAll",
            action: "completed",
          });
          this.stopProcessAllLogging();
        }
      }
    }, 10000); // Log every 10 seconds

    try {
      // Add timeout protection to prevent hanging
      const processPromise = this.queue.onIdle();
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Background queue processing timeout")),
          30000,
        )
      );

      await Promise.race([processPromise, timeoutPromise]);
    } catch (error) {
      this.logger.error(
        "Background queue processing failed or timed out",
        { error },
      );
      throw error;
    } finally {
      this.stopProcessAllLogging();
    }
  }

  private stopProcessAllLogging() {
    if (this.processAllInterval) {
      clearInterval(this.processAllInterval);
      this.processAllInterval = null;
    }
    this.isProcessingAll = false;
  }

  // On destroy we stop accepting new tasks, but complete all pending/in-progress tasks.
  // The application calls this only once http connections have drained (tasks no longer being added).
  async destroy() {
    this.destroyed = true;
    this.stopProcessAllLogging();
    await this.queue.onIdle();
  }
}

type Task = (db: Database) => Promise<void>;
