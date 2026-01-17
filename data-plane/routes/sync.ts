import { Database } from "../db/index.ts";

async function getLatestRev(actorDid: string, db: Database) {
  const res = await db.models.ActorSync.findOne({ did: actorDid });
  return {
    rev: res?.repoRev ?? undefined,
  };
}

export class Sync {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async latestRev(actorDid: string) {
    const { rev } = await getLatestRev(actorDid, this.db);
    return { rev };
  }
}
