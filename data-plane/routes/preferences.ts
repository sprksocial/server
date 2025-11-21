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
    const exists = await this.db.models.Preference.exists({ userDid });

    const updateData = {
      ...data,
      updatedAt: now,
    };

    if (!exists) {
      await this.db.models.Preference.create({
        userDid,
        ...updateData,
        createdAt: now,
      });
    } else {
      await this.db.models.Preference.updateOne(
        { userDid },
        { $set: updateData },
      );
    }
  }
}
