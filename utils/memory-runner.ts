import PQueue from "p-queue";
import { ConsecutiveList, EventRunner } from "@atproto/sync";

export type MemoryRunnerOptions = {
  setCursor?: (cursor: number) => Promise<void> | void;
  concurrency?: number;
  startCursor?: number;
  cursorSaveIntervalMs?: number;
};

// A queue with arbitrarily many partitions, each processing work sequentially.
// Partitions are created lazily and taken out of memory when they go idle.
export class MemoryRunner implements EventRunner {
  consecutive = new ConsecutiveList<number>();
  mainQueue: PQueue;
  partitions = new Map<string, PQueue>();
  cursor: number | undefined;
  private lastSaveTime = 0;
  private lastCursor: number | undefined;
  private saveTimeout: number | undefined;

  constructor(public opts: MemoryRunnerOptions = {}) {
    this.mainQueue = new PQueue({ concurrency: opts.concurrency ?? Infinity });
    this.cursor = opts.startCursor;
  }

  getCursor() {
    return this.cursor;
  }

  addTask(partitionId: string, task: () => Promise<void>) {
    if (this.mainQueue.isPaused) return;
    return this.mainQueue.add(() => {
      return this.getPartition(partitionId).add(task);
    });
  }

  private getPartition(partitionId: string) {
    let partition = this.partitions.get(partitionId);
    if (!partition) {
      partition = new PQueue({ concurrency: 1 });
      partition.once("idle", () => this.partitions.delete(partitionId));
      this.partitions.set(partitionId, partition);
    }
    return partition;
  }

  async trackEvent(did: string, seq: number, handler: () => Promise<void>) {
    if (this.mainQueue.isPaused) return;
    const item = this.consecutive.push(seq);
    await this.addTask(did, async () => {
      await handler();
      const latest = item.complete().at(-1);
      if (latest !== undefined) {
        this.cursor = latest;
        if (this.opts.setCursor) {
          await this.throttledSaveCursor(this.cursor);
        }
      }
    });
  }

  async processAll() {
    await this.mainQueue.onIdle();
  }

  async destroy() {
    this.mainQueue.pause();
    await this.mainQueue.onIdle();
    this.mainQueue.clear();
    this.partitions.forEach((p) => p.clear());

    // Force save the latest cursor before shutdown
    await this.forceSaveCursor();
  }

  private async throttledSaveCursor(cursor: number): Promise<void> {
    if (!this.opts.setCursor) return;

    this.lastCursor = cursor;
    const now = Date.now();
    const saveInterval = this.opts.cursorSaveIntervalMs ?? 30000;

    // If we haven't saved recently, save immediately
    if (now - this.lastSaveTime >= saveInterval) {
      this.lastSaveTime = now;
      await this.opts.setCursor(cursor);
    } else {
      // Schedule a save for later if not already scheduled
      if (this.saveTimeout === undefined) {
        const timeUntilNextSave = saveInterval - (now - this.lastSaveTime);
        this.saveTimeout = setTimeout(async () => {
          if (this.lastCursor !== undefined && this.opts.setCursor) {
            this.lastSaveTime = Date.now();
            await this.opts.setCursor(this.lastCursor);
          }
          this.saveTimeout = undefined;
        }, timeUntilNextSave);
      }
    }
  }

  async forceSaveCursor(): Promise<void> {
    if (this.saveTimeout !== undefined) {
      clearTimeout(this.saveTimeout);
      this.saveTimeout = undefined;
    }
    if (this.lastCursor !== undefined && this.opts.setCursor) {
      await this.opts.setCursor(this.lastCursor);
    }
  }
}
