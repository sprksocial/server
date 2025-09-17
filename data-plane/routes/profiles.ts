import { keyBy } from "@atproto/common";
import { Database } from "../db/index.ts";
import { getRecords } from "./records.ts";

export class Profiles {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async getActors(dids: string[]) {
    const profileUris = dids.map(
      (did) => `at://${did}/so.sprk.actor.profile/self`,
    );

    const [
      handlesRes,
      profiles,
    ] = await Promise.all([
      this.db.models.Actor.find({
        did: { $in: dids },
      }),
      getRecords(this.db, profileUris),
    ]);

    const byDid = keyBy(handlesRes, "did");
    const actors = dids.map((did, i) => {
      const row = byDid.get(did);

      return {
        exists: !!row,
        handle: row?.handle ?? undefined,
        profile: profiles.records[i],
        takenDown: !!row?.takedownRef,
        takedownRef: row?.takedownRef || undefined,
        tombstonedAt: undefined, // in current implementation, tombstoned actors are deleted
        upstreamStatus: row?.upstreamStatus ?? "",
        createdAt: profiles.records[i].createdAt, // @NOTE profile creation date not trusted in production
        tags: [],
        profileTags: [],
      };
    });

    return { actors };
  }

  async getDidsByHandles(handles: string[]) {
    if (handles.length === 0) {
      return { dids: [] };
    }

    const res = await this.db.models.Actor.find({
      handle: { $in: handles },
    }).select("did handle");

    const byHandle = keyBy(res, "handle");
    const dids = handles.map((handle) => byHandle.get(handle)?.did ?? "");
    return { dids };
  }

  async updateActorUpstreamStatus(actorDid: string, upstreamStatus: string) {
    await this.db.models.Actor.updateOne(
      { did: actorDid },
      { $set: { upstreamStatus } },
    );

    return { success: true };
  }
}
