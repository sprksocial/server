import mongoose, { Connection } from "mongoose";
import { pino } from "pino";
import { IdResolver, MemoryCache } from "@atproto/identity";
import { env } from "../../utils/env.ts";
import { DataPlaneClient, GetIdentityByDidResponse } from "../client/index.ts";
import * as models from "./models.ts";
import { getResultFromDoc } from "./util.ts";

const HOUR = 60 * 60 * 1000;
const DAY = HOUR * 24;

export class Database implements DataPlaneClient {
  private connection!: Connection;
  public models!: models.DatabaseModels;
  public logger = pino({ name: "database" });
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
        Look: this.connection.model<models.LookDocument>(
          "Look",
          models.lookSchema,
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
        UserPreference: this.connection.model<models.UserPreferenceDocument>(
          "UserPreference",
          models.userPreferenceSchema,
        ),
        CursorState: this.connection.model<models.CursorStateDocument>(
          "CursorState",
          models.cursorStateSchema,
        ),
      };

      this.logger.info("Connected to MongoDB");
    } catch (error) {
      this.logger.error(error, "Failed to connect to MongoDB");
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
      this.logger.error({ err, handle }, "Failed to resolve handle");
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
      this.logger.error({ err, did }, "Failed to resolve DID");
      return undefined;
    }
  }

  // Implement DataPlaneClient interface
  async getIdentityByDid(
    { did }: { did: string },
  ): Promise<GetIdentityByDidResponse> {
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
      this.logger.error({ error }, "Failed to get cursor state");
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
        { error, cursorPosition },
        "Failed to save cursor state",
      );
    }
  }
}
