import { Database } from "../db/index.ts";
import { PreferenceDocument } from "../db/models.ts";

export class Preferences {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async getPreferences(userDid: string) {
    return await this.db.models.Preference.findOne({ userDid });
  }

  async putPreferences(userDid: string, data: Partial<PreferenceDocument>) {
    const now = new Date().toISOString();

    const updateData = {
      ...data,
      updatedAt: now,
    };

    await this.db.models.Preference.findOneAndUpdate(
      { userDid },
      {
        $set: updateData,
        $setOnInsert: { userDid, createdAt: now },
      },
      { upsert: true },
    );
  }
}
