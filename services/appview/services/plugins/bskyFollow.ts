import { AtUri } from "@atproto/syntax";
import { CID } from "multiformats/cid";
import { Database } from "../../data-plane/server/index.ts";
import { FollowDocument } from "../../data-plane/server/models.ts";
import { getLogger } from "@logtape/logtape";

const logger = getLogger(["appview"]);

export type BskyFollowRecord = {
  subject: string;
  createdAt: string;
};

export function makePlugin(db: Database) {
  return {
    collection: "app.bsky.graph.follow",

    async insertRecord(
      uri: AtUri,
      cid: CID,
      recordObj: unknown,
      timestamp: string,
    ): Promise<FollowDocument | null> {
      const record = recordObj as BskyFollowRecord;
      if (!record?.subject) return null;

      try {
        const actor = await db.models.Actor.findOne({ did: uri.hostname });
        if (!actor) {
          logger.warn(
            "Actor not found when indexing bsky follow",
            { did: uri.hostname },
          );
          return null;
        }

        const followData = {
          uri: uri.toString(),
          subject: record.subject,
          authorDid: uri.hostname,
          createdAt: record.createdAt,
          indexedAt: timestamp,
          cid: cid.toString(),
          type: "bsky" as const,
        };

        const follow = await db.models.Follow.findOneAndUpdate(
          { uri: uri.toString() },
          { $set: followData },
          { upsert: true, new: true },
        );

        return follow;
      } catch (error) {
        logger.error(
          "Error indexing bsky follow record",
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
    ): Promise<FollowDocument | null> {
      const record = recordObj as BskyFollowRecord;
      if (!record?.subject) return null;

      try {
        const actor = await db.models.Actor.findOne({ did: uri.hostname });
        if (!actor) {
          logger.warn(
            "Actor not found when updating bsky follow",
            { did: uri.hostname },
          );
          return null;
        }

        const updateData = {
          cid: cid.toString(),
          indexedAt: timestamp,
        };

        const follow = await db.models.Follow.findOneAndUpdate(
          { uri: uri.toString() },
          { $set: updateData },
          { new: true },
        );

        return follow;
      } catch (error) {
        logger.error(
          "Error updating bsky follow record",
          { error, uri: uri.toString(), cid: cid.toString() },
        );
        return null;
      }
    },

    async deleteRecord(uri: AtUri): Promise<void> {
      try {
        const follow = await db.models.Follow.findOne({ uri: uri.toString() });
        if (!follow) {
          logger.warn("Follow not found for deletion", { uri: uri.toString() });
          return;
        }

        await db.models.Follow.deleteOne({ uri: uri.toString() });
      } catch (error) {
        logger.error(
          "Error deleting bsky follow record",
          { error, uri: uri.toString() },
        );
      }
    },
  };
}
