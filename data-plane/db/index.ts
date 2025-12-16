import mongoose, { Connection } from "mongoose";
import { IdResolver, MemoryCache } from "@atp/identity";
import * as models from "./models.ts";
import { getResultFromDoc } from "../util.ts";
import { getLogger } from "@logtape/logtape";
import { ServerConfig } from "../../config.ts";

const HOUR = 60 * 60 * 1000;
const DAY = HOUR * 24;

export class Database {
  private connection!: Connection;
  public models!: models.DatabaseModels;
  public logger = getLogger(["appview", "database"]);
  public idResolver: IdResolver;

  constructor(private cfg: ServerConfig) {
    this.idResolver = new IdResolver({
      didCache: new MemoryCache(HOUR, DAY),
    });
  }

  connect() {
    const uri = this.cfg.dbUri;
    const name = this.cfg.dbName;
    const user = this.cfg.dbUser;
    const pass = this.cfg.dbPass;
    if (!uri) {
      throw new Error("No database URI provided");
    }
    this.logger.info(`Connecting to ${uri}`);

    try {
      this.connection = mongoose.createConnection(uri, {
        autoIndex: true,
        autoCreate: true,
        dbName: name,
        user,
        pass,
      });

      // Attach basic listeners for visibility
      this.connection.on("connected", () => {
        this.logger.info("MongoDB connection established");
      });
      this.connection.on("disconnected", () => {
        this.logger.warn("MongoDB connection disconnected");
      });
      this.connection.on("error", (err) => {
        this.logger.error("MongoDB connection error", { err });
      });

      // Initialize models
      this.models = {
        Record: this.connection.model<models.RecordDocument>(
          "Record",
          models.recordSchema,
        ),
        DuplicateRecord: this.connection.model<models.DuplicateRecordDocument>(
          "DuplicateRecord",
          models.duplicateRecordSchema,
        ),
        Like: this.connection.model<models.LikeDocument>(
          "Like",
          models.likeSchema,
        ),
        Post: this.connection.model<models.PostDocument>(
          "Post",
          models.postSchema,
        ),
        Reply: this.connection.model<models.ReplyDocument>(
          "Reply",
          models.replySchema,
        ),
        Story: this.connection.model<models.StoryDocument>(
          "Story",
          models.storySchema,
        ),
        Follow: this.connection.model<models.FollowDocument>(
          "Follow",
          models.followSchema,
        ),
        Block: this.connection.model<models.BlockDocument>(
          "Block",
          models.blockSchema,
        ),
        Profile: this.connection.model<models.ProfileDocument>(
          "Profile",
          models.profileSchema,
        ),
        Audio: this.connection.model<models.AudioDocument>(
          "Audio",
          models.audioSchema,
        ),
        Repost: this.connection.model<models.RepostDocument>(
          "Repost",
          models.repostSchema,
        ),
        Generator: this.connection.model<models.GeneratorDocument>(
          "Generator",
          models.generatorSchema,
        ),
        Takedown: this.connection.model<models.TakedownDocument>(
          "Takedown",
          models.takedownSchema,
        ),
        RepoTakedown: this.connection.model<models.RepoTakedownDocument>(
          "RepoTakedown",
          models.repoTakedownSchema,
        ),
        BlobTakedown: this.connection.model<models.BlobTakedownDocument>(
          "BlobTakedown",
          models.blobTakedownSchema,
        ),
        Actor: this.connection.model<models.ActorDocument>(
          "Actor",
          models.actorSchema,
        ),
        ActorSync: this.connection.model<models.ActorSyncDocument>(
          "ActorSync",
          models.actorSyncSchema,
        ),
        Preference: this.connection.model<models.PreferenceDocument>(
          "Preference",
          models.preferenceSchema,
        ),
        CursorState: this.connection.model<models.CursorStateDocument>(
          "CursorState",
          models.cursorStateSchema,
        ),
      };

      this.logger.info("Started connection to MongoDB");
    } catch (error) {
      this.logger.error("Failed to start connection to MongoDB", { error });
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.close();
      this.logger.info("Disconnected from MongoDB");
    }
  }

  async ping(): Promise<void> {
    const db = this.connection?.db;
    if (!db) {
      throw new Error("Database not connected");
    }
    await db.admin().ping();
  }

  // Add methods for DID resolution
  async resolveHandle(handle: string): Promise<string | undefined> {
    try {
      return await this.idResolver.handle.resolve(handle);
    } catch (err) {
      this.logger.error("Failed to resolve handle", { err, handle });
      return undefined;
    }
  }

  async resolveDid(
    did: string,
  ): Promise<{ did: string; handle?: string } | undefined> {
    try {
      const data = await this.idResolver.did.resolveAtprotoData(did);
      return {
        did: data.did,
        handle: data.handle,
      };
    } catch (err) {
      this.logger.error("Failed to resolve DID", { err, did });
      return undefined;
    }
  }

  // Implement DataPlaneClient interface
  async getIdentityByDid(
    { did }: { did: string },
  ): Promise<{ did: string; handle?: string } | undefined> {
    const doc = await this.idResolver.did.resolve(did);
    if (!doc) {
      throw new Error("DID not found");
    }
    return getResultFromDoc(doc);
  }

  async getCursorState(): Promise<number | null> {
    try {
      const cursorState = await this.models.CursorState.findOne({
        identifier: "last_processed_cursor",
      });
      return cursorState?.cursorValue || null;
    } catch (error) {
      this.logger.error("Failed to get cursor state", { error });
      return null;
    }
  }

  async saveCursorState(cursorPosition: number): Promise<void> {
    try {
      await this.models.CursorState.findOneAndUpdate(
        { identifier: "last_processed_cursor" },
        {
          cursorValue: cursorPosition,
          updatedAt: new Date(),
        },
        { upsert: true },
      );
    } catch (error) {
      this.logger.error(
        "Failed to save cursor state",
        { error, cursorPosition },
      );
    }
  }
}
