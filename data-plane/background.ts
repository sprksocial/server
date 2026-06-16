import PQueue from "p-queue";
import { Database } from "./db/index.ts";

// A simple queue for in-process, out-of-band/backgrounded work

export class BackgroundQueue {
  queue = new PQueue();
  destroyed = false;
  private processAllInterval: ReturnType<typeof setInterval> | null = null;
  private isProcessingAll = false;

  constructor(public db: Database) {}

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
          console.debug(
            "Ignoring MongoDB connection error during shutdown",
            { err: err.message },
          );
          return;
        }

        // Check for MongoDB duplicate key errors
        const mongoError = err as { code?: number };
        if (mongoError.code === 11000) {
          console.warn(
            "Ignoring duplicate key error in background task",
            { err: err.message },
          );
          return;
        }

        console.error("background queue task failed", { err });
      });
  }

  async processAll() {
    this.isProcessingAll = true;

    // Start logging queue progress every 10 seconds
    this.processAllInterval = setInterval(() => {
      if (!this.destroyed && this.isProcessingAll) {
        const pending = this.queue.size;
        const running = this.queue.pending;

        // Stop logging if queue is empty
        if (pending === 0 && running === 0) {
          this.stopProcessAllLogging();
        }
      }
    }, 10000); // Log every 10 seconds

    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    try {
      // Add timeout protection to prevent hanging
      const processPromise = this.queue.onIdle();
      const timeoutPromise = new Promise((_, reject) => {
        timeoutId = setTimeout(
          () => reject(new Error("Background queue processing timeout")),
          30000,
        );
      });

      await Promise.race([processPromise, timeoutPromise]);
    } catch (error) {
      console.error(
        "Background queue processing failed or timed out",
        { error },
      );
      throw error;
    } finally {
      this.stopProcessAllLogging();
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
        timeoutId = undefined;
      }
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
