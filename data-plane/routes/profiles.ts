import { Database } from "../db/index.ts";

export class Profiles {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async getActors(dids: string[]) {
    if (dids.length === 0) {
      return { actors: [] };
    }

    // Get actors from MongoDB
    const actors = await this.db.models.Actor.find({
      did: { $in: dids },
    }).select("did handle takedownRef upstreamStatus indexedAt");

    // Get profiles for these actors
    const profileUris = dids.map(
      (did) => `at://${did}/app.bsky.actor.profile/self`,
    );
    const profiles = await this.db.models.Record.find({
      uri: { $in: profileUris },
    }).select("uri record createdAt");

    // Create lookup maps
    const actorMap = new Map(actors.map((actor) => [actor.did, actor]));
    const profileMap = new Map(
      profiles.map((profile) => [profile.uri, profile]),
    );

    const result = dids.map((did) => {
      const actor = actorMap.get(did);
      const profileUri = `at://${did}/app.bsky.actor.profile/self`;
      const profile = profileMap.get(profileUri);

      return {
        exists: !!actor,
        handle: actor?.handle ?? undefined,
        profile: profile || null,
        takenDown: !!actor?.takedownRef,
        takedownRef: actor?.takedownRef || undefined,
        tombstonedAt: undefined,
        upstreamStatus: actor?.upstreamStatus ?? "",
        createdAt: profile?.createdAt || null,
        tags: [],
        profileTags: [],
      };
    });

    return { actors: result };
  }

  async getDidsByHandles(handles: string[]) {
    if (handles.length === 0) {
      return { dids: [] };
    }

    const actors = await this.db.models.Actor.find({
      handle: { $in: handles },
    }).select("did handle");

    // Create lookup map
    const handleMap = new Map(
      actors.map((actor) => [actor.handle, actor.did]),
    );
    const dids = handles.map((handle) => handleMap.get(handle) || "");

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
