import { Database } from "../db/index.ts";

export class Moderation {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async getActorTakedown(did: string) {
    const actor = await this.db.models.Actor.findOne({ did }).select(
      "takedownRef",
    );

    return {
      takenDown: !!actor?.takedownRef,
      takedownRef: actor?.takedownRef || undefined,
    };
  }

  async getBlobTakedown(did: string, cid: string) {
    const blobTakedown = await this.db.models.BlobTakedown.findOne({
      did,
      cid,
    }).select("ref");

    return {
      takenDown: !!blobTakedown,
      takedownRef: blobTakedown?.ref || undefined,
    };
  }

  async getRecordTakedown(recordUri: string) {
    const record = await this.db.models.Record.findOne({
      uri: recordUri,
    }).select("takedownRef");

    return {
      takenDown: !!record?.takedownRef,
      takedownRef: record?.takedownRef || undefined,
    };
  }

  async takedownActor(did: string, ref?: string) {
    await this.db.models.Actor.updateOne(
      { did },
      { $set: { takedownRef: ref || "TAKEDOWN" } },
    );

    return { success: true };
  }

  async takedownBlob(did: string, cid: string, ref?: string) {
    await this.db.models.BlobTakedown.findOneAndUpdate(
      { did, cid },
      {
        did,
        cid,
        ref: ref || "TAKEDOWN",
        reason: "Manual takedown",
        takenDownBy: "system",
        takenDownAt: new Date().toISOString(),
        applied: true,
      },
      { upsert: true, new: true },
    );

    return { success: true };
  }

  async takedownRecord(recordUri: string, ref?: string) {
    await this.db.models.Record.updateOne(
      { uri: recordUri },
      { $set: { takedownRef: ref || "TAKEDOWN" } },
    );

    return { success: true };
  }

  async untakedownActor(did: string) {
    await this.db.models.Actor.updateOne(
      { did },
      { $unset: { takedownRef: "" } },
    );

    return { success: true };
  }

  async untakedownBlob(did: string, cid: string) {
    await this.db.models.BlobTakedown.deleteOne({ did, cid });

    return { success: true };
  }

  async untakedownRecord(recordUri: string) {
    await this.db.models.Record.updateOne(
      { uri: recordUri },
      { $unset: { takedownRef: "" } },
    );

    return { success: true };
  }
}
