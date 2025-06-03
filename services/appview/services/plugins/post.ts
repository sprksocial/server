import { AtUri } from "@atproto/syntax";
import { CID } from "multiformats/cid";
import { pino } from "pino";
import {
  Database,
  PostDocument,
} from "../../services/data-plane/server/index.ts";

const logger = pino({ name: "post-processor" });

export type PostRecord = {
  text: string;
  createdAt: string;
  facets?: Array<unknown>;
  reply?: {
    root: { uri: string; cid: string };
    parent: { uri: string; cid: string };
  };
  embed?: unknown;
  langs?: string[];
  labels?: unknown;
  tags?: string[];
};

export type PostPluginType = {
  collection: string;
  insertRecord: (
    uri: AtUri,
    cid: CID,
    record: unknown,
    timestamp: string,
  ) => Promise<PostDocument | null>;
  updateRecord: (
    uri: AtUri,
    cid: CID,
    record: unknown,
    timestamp: string,
  ) => Promise<PostDocument | null>;
  deleteRecord: (uri: AtUri, cascading?: boolean) => Promise<void>;
};

/**
 * Create a post processor plugin for the indexing service
 */
export function makePlugin(db: Database): PostPluginType {
  return {
    collection: "so.sprk.feed.post",

    async insertRecord(
      uri: AtUri,
      cid: CID,
      recordObj: unknown,
      timestamp: string,
    ): Promise<PostDocument | null> {
      const record = recordObj as PostRecord;
      if (!record) return null;

      try {
        // Find author information
        const actor = await db.models.Actor.findOne({ did: uri.hostname });
        if (!actor) {
          logger.warn(
            { did: uri.hostname },
            "Actor not found when indexing post",
          );
          return null;
        }

        // Extract post data
        const postData = {
          uri: uri.toString(),
          cid: cid.toString(),
          text: record.text,
          facets: record.facets || [],
          reply: record.reply || null,
          embed: record.embed || null,
          langs: record.langs || [],
          labels: record.labels || null,
          tags: record.tags || [],
          authorDid: uri.hostname,
          authorHandle: actor.handle || uri.hostname,
          createdAt: record.createdAt,
          indexedAt: timestamp,
        };

        // Create the post
        const post = await db.models.Post.findOneAndUpdate(
          { uri: uri.toString() },
          { $set: postData },
          { upsert: true, new: true },
        );

        // Increment post count for actor
        await db.models.Actor.updateOne(
          { did: uri.hostname },
          { $inc: { postsCount: 1 } },
        );

        return post;
      } catch (error) {
        logger.error(
          { error, uri: uri.toString(), cid: cid.toString() },
          "Error inserting post record",
        );
        return null;
      }
    },

    async updateRecord(
      uri: AtUri,
      cid: CID,
      recordObj: unknown,
      timestamp: string,
    ): Promise<PostDocument | null> {
      const record = recordObj as PostRecord;
      if (!record) return null;

      try {
        // Find author information
        const actor = await db.models.Actor.findOne({ did: uri.hostname });
        if (!actor) {
          logger.warn(
            { did: uri.hostname },
            "Actor not found when updating post",
          );
          return null;
        }

        // Update post data
        const postData = {
          uri: uri.toString(),
          cid: cid.toString(),
          text: record.text,
          facets: record.facets || [],
          reply: record.reply || null,
          embed: record.embed || null,
          langs: record.langs || [],
          labels: record.labels || null,
          tags: record.tags || [],
          authorDid: uri.hostname,
          authorHandle: actor.handle || uri.hostname,
          indexedAt: timestamp,
        };

        // Update the post
        const post = await db.models.Post.findOneAndUpdate(
          { uri: uri.toString() },
          { $set: postData },
          { new: true },
        );

        return post;
      } catch (error) {
        logger.error(
          { error, uri: uri.toString(), cid: cid.toString() },
          "Error updating post record",
        );
        return null;
      }
    },

    async deleteRecord(uri: AtUri, cascading = false): Promise<void> {
      try {
        // Get the post to check author
        const post = await db.models.Post.findOne({ uri: uri.toString() });
        if (!post) {
          logger.warn({ uri: uri.toString() }, "Post not found for deletion");
          return;
        }

        // Delete the post
        await db.models.Post.deleteOne({ uri: uri.toString() });

        // Decrement post count for author
        await db.models.Actor.updateOne(
          { did: post.authorDid },
          { $inc: { postsCount: -1 } },
        );

        if (cascading) {
          // TODO: Handle cascading deletion (e.g. delete replies, reposts, etc.)
        }
      } catch (error) {
        logger.error(
          { error, uri: uri.toString() },
          "Error deleting post record",
        );
      }
    },
  };
}
