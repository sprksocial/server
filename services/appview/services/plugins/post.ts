import { AtUri } from "@atproto/syntax";
import { CID } from "multiformats/cid";
import { Database } from "../../data-plane/server/index.ts";
import { PostDocument } from "../../data-plane/server/models.ts";
import { getLogger } from "@logtape/logtape";

const logger = getLogger(["appview", "indexing"]);

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
            "Actor not found when indexing post",
            { did: uri.hostname },
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
          "Error inserting post record",
          { error, uri: uri.toString(), cid: cid.toString() },
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
            "Actor not found when updating post",
            { did: uri.hostname },
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
          "Error updating post record",
          { error, uri: uri.toString(), cid: cid.toString() },
        );
        return null;
      }
    },

    async deleteRecord(uri: AtUri, cascading = false): Promise<void> {
      try {
        // Get the post to check author
        const post = await db.models.Post.findOne({ uri: uri.toString() });
        if (!post) {
          logger.warn("Post not found for deletion", { uri: uri.toString() });
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
          "Error deleting post record",
          { error, uri: uri.toString() },
        );
      }
    },
  };
}
