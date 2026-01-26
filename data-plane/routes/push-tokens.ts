import { Database } from "../db/index.ts";

export interface PushTokenInput {
  did: string;
  token: string;
  platform: "ios" | "android" | "web";
  appId: string;
  serviceDid: string;
}

export interface PushToken {
  did: string;
  token: string;
  platform: "ios" | "android" | "web";
  appId: string;
  serviceDid: string;
  createdAt: string;
  updatedAt: string;
}

export class PushTokens {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async upsert(input: PushTokenInput): Promise<void> {
    const now = new Date().toISOString();

    await this.db.models.PushToken.findOneAndUpdate(
      {
        did: input.did,
        token: input.token,
        platform: input.platform,
        appId: input.appId,
      },
      {
        $set: {
          serviceDid: input.serviceDid,
          updatedAt: now,
        },
        $setOnInsert: {
          did: input.did,
          token: input.token,
          platform: input.platform,
          appId: input.appId,
          createdAt: now,
        },
      },
      { upsert: true },
    );
  }

  async delete(did: string, token: string): Promise<void> {
    await this.db.models.PushToken.deleteOne({ did, token });
  }

  async getTokensForDid(did: string): Promise<PushToken[]> {
    const tokens = await this.db.models.PushToken.find({ did }).lean();
    return tokens.map((t) => ({
      did: t.did,
      token: t.token,
      platform: t.platform,
      appId: t.appId,
      serviceDid: t.serviceDid,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    }));
  }

  async deleteInvalidTokens(tokens: string[]): Promise<void> {
    if (tokens.length === 0) return;
    await this.db.models.PushToken.deleteMany({ token: { $in: tokens } });
  }
}
