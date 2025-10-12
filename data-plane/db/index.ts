import mongoose, { Connection } from "mongoose";
import { IdResolver, MemoryCache } from "@atp/identity";
import { env } from "../../utils/env.ts";
import * as models from "./models.ts";
import { getResultFromDoc } from "../util.ts";
import { getLogger } from "@logtape/logtape";

const HOUR = 60 * 60 * 1000;
const DAY = HOUR * 24;

export class Database {
  private connection!: Connection;
  public models!: models.DatabaseModels;
  public logger = getLogger(["appview", "database"]);
  public idResolver: IdResolver;

  constructor() {
    this.idResolver = new IdResolver({
      didCache: new MemoryCache(HOUR, DAY),
    });
  }

  connect() {
    const { DB_URI, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = env;

    const uri = DB_URI ||
      `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/?appName=appview`;

    this.logger.info(
      DB_URI
        ? `Connecting to MongoDB using provided URI`
        : `Connecting to MongoDB at ${DB_HOST}:${DB_PORT}/?appName=appview`,
    );

    try {
      this.connection = mongoose.createConnection(uri, {
        autoIndex: true,
        autoCreate: true,
        dbName: DB_NAME,
        maxPoolSize: env.MONGO_MAX_POOL_SIZE,
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
        VideoMapping: this.connection.model<models.VideoMappingDocument>(
          "VideoMapping",
          models.videoMappingSchema,
        ),
        Audio: this.connection.model<models.AudioDocument>(
          "Audio",
          models.audioSchema,
        ),
        Repost: this.connection.model<models.RepostDocument>(
          "Repost",
          models.repostSchema,
        ),
        Music: this.connection.model<models.MusicDocument>(
          "Music",
          models.musicSchema,
        ),
        BskyGenerator: this.connection.model<models.BskyGeneratorDocument>(
          "Generator",
          models.bskyGeneratorSchema,
        ),
        SprkGenerator: this.connection.model<models.SprkGeneratorDocument>(
          "SprkGenerator",
          models.sprkGeneratorSchema,
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
        UserPreference: this.connection.model<models.UserPreferenceDocument>(
          "UserPreference",
          models.userPreferenceSchema,
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
