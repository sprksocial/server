import mongoose, { Connection, Document, Schema } from "mongoose";

/**
 * Interface for a reactive list of hosts, i.e. for use with the dataplane client.
 */
export interface HostList {
  get: () => Iterable<string>;
  onUpdate(handler: HostListHandler): void;
}

type HostListHandler = (hosts: Iterable<string>) => void;

/**
 * Maintains a reactive HostList based on a simple setter.
 */
export class BasicHostList implements HostList {
  private hosts: Iterable<string>;
  private handlers: HostListHandler[] = [];

  constructor(hosts: Iterable<string>) {
    this.hosts = hosts;
  }

  get() {
    return this.hosts;
  }

  set(hosts: Iterable<string>) {
    this.hosts = hosts;
    this.update();
  }

  private update() {
    for (const handler of this.handlers) {
      handler(this.hosts);
    }
  }

  onUpdate(handler: HostListHandler) {
    this.handlers.push(handler);
  }
}

interface HostDocument extends Document {
  url: string;
  active: boolean;
  updatedAt: Date;
}

const hostSchema = new Schema<HostDocument>({
  url: { type: String, required: true, unique: true },
  active: { type: Boolean, required: true, default: true },
  updatedAt: { type: Date, required: true, default: Date.now },
});

/**
 * Maintains a reactive HostList based on MongoDB documents.
 * When fallback is provided, ensures that this fallback is used whenever no hosts are available.
 */
export class MongoHostList implements HostList {
  private connection: Connection;
  private inner = new BasicHostList(new Set());
  private fallback: Set<string>;
  private changeStream: mongoose.mongo.ChangeStream | null = null;
  private model: mongoose.Model<HostDocument>;

  constructor(connection: Connection, fallback?: string[]) {
    this.fallback = new Set(fallback);
    this.connection = connection;
    this.model = this.connection.model<HostDocument>("Host", hostSchema);
  }

  async connect() {
    await this.updateHosts();
    this.startWatching();
  }

  private async updateHosts() {
    const hosts = new Set<string>();
    const activeHosts = await this.model.find({ active: true }).exec();

    for (const host of activeHosts) {
      if (URL.canParse(host.url)) {
        hosts.add(host.url);
      }
    }

    if (hosts.size) {
      this.inner.set(hosts);
    } else if (this.fallback.size) {
      this.inner.set(this.fallback);
    }
  }

  private startWatching() {
    this.changeStream = this.model.watch();

    this.changeStream.on("change", async () => {
      await this.updateHosts();
    });
  }

  get() {
    return this.inner.get();
  }

  onUpdate(handler: HostListHandler) {
    this.inner.onUpdate(handler);
  }

  async disconnect() {
    if (this.changeStream) {
      await this.changeStream.close();
      this.changeStream = null;
    }
  }
}
