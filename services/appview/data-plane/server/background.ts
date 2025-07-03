import PQueue from "p-queue";
import { Database } from "./index.ts";

// A simple queue for in-process, out-of-band/backgrounded work

export class BackgroundQueue {
  queue = new PQueue();
  destroyed = false;
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
          this.db.logger.debug(
            { err: err.message },
            "Ignoring MongoDB connection error during shutdown",
          );
          return;
        }

        // Check for MongoDB duplicate key errors
        const mongoError = err as { code?: number };
        if (mongoError.code === 11000) {
          this.db.logger.warn(
            { err: err.message },
            "Ignoring duplicate key error in background task",
          );
          return;
        }

        this.db.logger.error({ err }, "background queue task failed");
      });
  }

  async processAll() {
    await this.queue.onIdle();
  }

  // On destroy we stop accepting new tasks, but complete all pending/in-progress tasks.
  // The application calls this only once http connections have drained (tasks no longer being added).
  async destroy() {
    this.destroyed = true;
    await this.queue.onIdle();
  }
}

type Task = (db: Database) => Promise<void>;