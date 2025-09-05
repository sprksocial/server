import {
  BlobTakedownDocument,
  RepoTakedownDocument,
  TakedownDocument,
} from "../data-plane/db/models.ts";
import { Database } from "../data-plane/db/index.ts";

export class TakedownService {
  constructor(private db: Database) {}

  async takedownContent(params: {
    targetUri: string;
    targetCid: string;
    reason: string;
    adminDid: string;
    ref?: string;
  }): Promise<void> {
    const { targetUri, targetCid, reason, adminDid, ref } = params;

    // Create a takedown record
    await this.db.models.Takedown.create({
      targetUri,
      targetCid,
      reason,
      takenDownBy: adminDid,
      takenDownAt: new Date().toISOString(),
      ref: ref || null,
      applied: true,
    });

    // Update the record document with takedown status
    await this.updateRecordTakedownStatus(
      targetUri,
      true,
      ref || "BSKY-TAKEDOWN-UNKNOWN",
    );
  }

  // Add a method to handle user repo takedowns
  async takedownRepo(params: {
    did: string;
    reason: string;
    adminDid: string;
    ref?: string;
  }): Promise<void> {
    const { did, reason, adminDid, ref } = params;

    // Create a repo takedown record
    await this.db.models.RepoTakedown.create({
      did,
      reason,
      takenDownBy: adminDid,
      takenDownAt: new Date().toISOString(),
      ref: ref || null,
      applied: false,
    });

    // Update all records from this DID with takedown status
    await this.updateAllRecordsTakedownStatusByDid(
      did,
      true,
      ref || "BSKY-TAKEDOWN-UNKNOWN",
    );
  }

  // Add a method to handle blob takedowns
  async takedownBlob(params: {
    did: string;
    cid: string;
    reason: string;
    adminDid: string;
    ref?: string;
  }): Promise<void> {
    const { did, cid, reason, adminDid, ref } = params;

    // Create a blob takedown record
    await this.db.models.BlobTakedown.create({
      did,
      cid,
      reason,
      takenDownBy: adminDid,
      takenDownAt: new Date().toISOString(),
      ref: ref || null,
      applied: false,
    });
  }

  async isTakenDown(uri: string): Promise<boolean> {
    const takedown = await this.db.models.Takedown.findOne({ targetUri: uri });
    return !!takedown;
  }

  /**
   * Get takedown information for a URI if it exists
   * @param uri The URI of the content to check
   * @returns Takedown information or null if not taken down
   */
  async getTakedown(uri: string): Promise<
    {
      targetUri: string;
      targetCid: string;
      reason: string;
      takenDownBy: string;
      takenDownAt: string;
      applied: boolean;
    } | null
  > {
    const takedown = await this.db.models.Takedown.findOne({ targetUri: uri })
      .lean();
    return takedown;
  }

  // Add a method to check if a repo is taken down
  async isRepoTakenDown(did: string): Promise<boolean> {
    const takedown = await this.db.models.RepoTakedown.findOne({ did });
    return !!takedown;
  }

  // Add a method to check if a blob is taken down
  async isBlobTakenDown(did: string, cid: string): Promise<boolean> {
    const takedown = await this.db.models.BlobTakedown.findOne({ did, cid });
    return !!takedown;
  }

  async removeTakedown(targetUri: string): Promise<boolean> {
    const result = await this.db.models.Takedown.deleteOne({ targetUri });

    // Update the record document to remove takedown status
    if (result.deletedCount > 0) {
      await this.updateRecordTakedownStatus(targetUri, false);
    }

    return result.deletedCount > 0;
  }

  // Add a method to remove repo takedown
  async removeRepoTakedown(did: string): Promise<boolean> {
    const result = await this.db.models.RepoTakedown.deleteOne({ did });

    // Update all records from this DID to remove takedown status
    if (result.deletedCount > 0) {
      await this.updateAllRecordsTakedownStatusByDid(did, false);
    }

    return result.deletedCount > 0;
  }

  // Add a method to remove blob takedown
  async removeBlobTakedown(did: string, cid: string): Promise<boolean> {
    const result = await this.db.models.BlobTakedown.deleteOne({ did, cid });
    return result.deletedCount > 0;
  }

  async listTakedowns(limit: number = 50, cursor?: string): Promise<{
    takedowns: Array<{
      targetUri: string;
      targetCid: string;
      reason: string;
      takenDownBy: string;
      takenDownAt: string;
    }>;
    cursor?: string;
  }> {
    const query = cursor ? { targetUri: { $lt: cursor } } : {};

    const takedowns = await this.db.models.Takedown
      .find(query)
      .sort({ targetUri: -1 })
      .limit(limit + 1)
      .lean();

    const items = takedowns.slice(0, limit);

    return {
      takedowns: items.map((t: TakedownDocument) => ({
        targetUri: t.targetUri,
        targetCid: t.targetCid,
        reason: t.reason,
        takenDownBy: t.takenDownBy,
        takenDownAt: t.takenDownAt,
      })),
      cursor: takedowns.length > limit
        ? takedowns[limit - 1].targetUri
        : undefined,
    };
  }

  // Add a method to list repo takedowns
  async listRepoTakedowns(limit: number = 50, cursor?: string): Promise<{
    repoTakedowns: Array<{
      did: string;
      reason: string;
      takenDownBy: string;
      takenDownAt: string;
      ref: string | null;
    }>;
    cursor?: string;
  }> {
    const query = cursor ? { did: { $lt: cursor } } : {};

    const takedowns = await this.db.models.RepoTakedown
      .find(query)
      .sort({ did: -1 })
      .limit(limit + 1)
      .lean();

    const items = takedowns.slice(0, limit);

    return {
      repoTakedowns: items.map((t: RepoTakedownDocument) => ({
        did: t.did,
        reason: t.reason,
        takenDownBy: t.takenDownBy,
        takenDownAt: t.takenDownAt,
        ref: t.ref,
      })),
      cursor: takedowns.length > limit ? takedowns[limit - 1].did : undefined,
    };
  }

  // Add a method to list blob takedowns
  async listBlobTakedowns(limit: number = 50, cursor?: string): Promise<{
    blobTakedowns: Array<{
      did: string;
      cid: string;
      reason: string;
      takenDownBy: string;
      takenDownAt: string;
      ref: string | null;
    }>;
    cursor?: string;
  }> {
    const query = cursor ? { did: { $lt: cursor } } : {};

    const takedowns = await this.db.models.BlobTakedown
      .find(query)
      .sort({ did: -1, cid: -1 })
      .limit(limit + 1)
      .lean();

    const items = takedowns.slice(0, limit);

    return {
      blobTakedowns: items.map((t: BlobTakedownDocument) => ({
        did: t.did,
        cid: t.cid,
        reason: t.reason,
        takenDownBy: t.takenDownBy,
        takenDownAt: t.takenDownAt,
        ref: t.ref,
      })),
      cursor: takedowns.length > limit ? takedowns[limit - 1].did : undefined,
    };
  }

  async updateTakedownApplied(
    targetUri: string,
    applied: boolean,
  ): Promise<void> {
    await this.db.models.Takedown.updateOne(
      { targetUri },
      { $set: { applied } },
    );
  }

  async updateRepoTakedownApplied(
    did: string,
    applied: boolean,
  ): Promise<void> {
    await this.db.models.RepoTakedown.updateOne(
      { did },
      { $set: { applied } },
    );
  }

  async updateBlobTakedownApplied(
    did: string,
    cid: string,
    applied: boolean,
  ): Promise<void> {
    await this.db.models.BlobTakedown.updateOne(
      { did, cid },
      { $set: { applied } },
    );
  }

  async getRepoTakedown(did: string): Promise<
    {
      did: string;
      reason: string;
      takenDownBy: string;
      takenDownAt: string;
      ref: string | null;
      applied: boolean;
    } | null
  > {
    const takedown = await this.db.models.RepoTakedown.findOne({ did }).lean();
    return takedown;
  }

  async getBlobTakedown(did: string, cid: string): Promise<
    {
      did: string;
      cid: string;
      reason: string;
      takenDownBy: string;
      takenDownAt: string;
      ref: string | null;
      applied: boolean;
    } | null
  > {
    const takedown = await this.db.models.BlobTakedown.findOne({ did, cid })
      .lean();
    return takedown;
  }

  /**
   * Update the takenDown and takedownRef properties on a RecordDocument
   * @param uri The URI of the record to update
   * @param takenDown Whether the record is taken down
   * @param takedownRef Optional reference for the takedown
   */
  async updateRecordTakedownStatus(
    uri: string,
    takenDown: boolean,
    takedownRef?: string,
  ): Promise<void> {
    const updateData: { takenDown: boolean; takedownRef?: string } = {
      takenDown,
    };

    if (takenDown && takedownRef) {
      updateData.takedownRef = takedownRef;
      await this.db.models.Record.updateOne(
        { uri },
        { $set: updateData },
      );
    } else if (!takenDown) {
      await this.db.models.Record.updateOne(
        { uri },
        { $set: { takenDown }, $unset: { takedownRef: "" } },
      );
    }
  }

  /**
   * Update the takenDown and takedownRef properties on all RecordDocuments for a specific DID
   * @param did The DID of the user whose records should be updated
   * @param takenDown Whether the records are taken down
   * @param takedownRef Optional reference for the takedown
   */
  async updateAllRecordsTakedownStatusByDid(
    did: string,
    takenDown: boolean,
    takedownRef?: string,
  ): Promise<void> {
    if (takenDown && takedownRef) {
      await this.db.models.Record.updateMany(
        { did },
        { $set: { takenDown, takedownRef } },
      );
    } else if (!takenDown) {
      await this.db.models.Record.updateMany(
        { did },
        { $set: { takenDown }, $unset: { takedownRef: "" } },
      );
    } else {
      await this.db.models.Record.updateMany(
        { did },
        { $set: { takenDown } },
      );
    }
  }
}
