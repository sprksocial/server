import { noUndefinedVals } from "@atp/common";
import { Database } from "../db/index.ts";

export class Labels {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async getLabels(subjects: string[], issuers: string[]) {
    if (subjects.length === 0 || issuers.length === 0) {
      return { labels: [] };
    }

    const now = new Date().toISOString();

    const res = await this.db.models.Label.find({
      uri: { $in: subjects },
      src: { $in: issuers },
      $or: [
        { exp: null },
        { exp: { $gt: now } },
      ],
    }).lean();

    const labelsBySubject = new Map<string, typeof res>();
    res.forEach((l) => {
      const labels = labelsBySubject.get(l.uri) ?? [];
      labels.push(l);
      labelsBySubject.set(l.uri, labels);
    });

    // intentionally duplicate label results, appview frontend should be defensive to this
    const labels = subjects.flatMap((sub) => {
      const labelsForSub = labelsBySubject.get(sub) ?? [];
      return labelsForSub.map((l) => {
        return noUndefinedVals({
          src: l.src,
          uri: l.uri,
          cid: l.cid === "" ? undefined : l.cid,
          val: l.val,
          neg: l.neg === true ? true : undefined,
          cts: l.cts,
          exp: l.exp === null ? undefined : l.exp,
        });
      });
    });

    return { labels };
  }

  getAllLabelers() {
    throw new Error("not implemented");
  }
}
