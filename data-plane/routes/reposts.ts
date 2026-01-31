import { Database } from "../db/index.ts";
import { TimeCidKeyset } from "../db/pagination.ts";

export class Reposts {
  private db: Database;
  private timeCidKeyset: TimeCidKeyset;

  constructor(db: Database) {
    this.db = db;
    this.timeCidKeyset = new TimeCidKeyset();
  }

  async bySubject(
    subject?: { uri: string; cid?: string },
    limit = 50,
    cursor?: string,
  ) {
    if (!subject?.uri) {
      return { uris: [], cursor: undefined };
    }

    // Build query for reposts of this subject
    const repostsQuery = this.db.models.Repost.find({
      subject: subject.uri,
    });

    // Apply pagination using TimeCidKeyset
    const paginatedQuery = this.timeCidKeyset.paginate(repostsQuery, {
      limit,
      cursor,
      direction: "desc",
    });

    const reposts = await paginatedQuery.exec();

    // Generate cursor from the last item if we have a full page
    let nextCursor: string | undefined;
    if (reposts.length === limit && reposts.length > 0) {
      const lastRepost = reposts[reposts.length - 1];
      nextCursor = this.timeCidKeyset.pack({
        primary: lastRepost.indexedAt,
        secondary: lastRepost.cid,
      });
    }

    return {
      uris: reposts.map((r) => r.uri),
      cursor: nextCursor,
    };
  }

  async byActorAndSubjects(
    actorDid: string,
    refs: Array<{ uri: string; cid?: string }>,
  ) {
    if (refs.length === 0) {
      return { uris: [] };
    }

    // Get all reposts by this actor for the specified subjects
    const subjectUris = refs.map(({ uri }) => uri);
    const reposts = await this.db.models.Repost.find({
      authorDid: actorDid,
      subject: { $in: subjectUris },
    });

    // Create a map for quick lookup
    const repostMap = new Map(reposts.map((r) => [r.subject, r.uri]));
    const uris = refs.map(({ uri }) => repostMap.get(uri) || "");

    return { uris };
  }

  async getActor(actorDid: string, limit = 50, cursor?: string) {
    // Build query for reposts by this actor
    const repostsQuery = this.db.models.Repost.find({ authorDid: actorDid });

    // Apply pagination using TimeCidKeyset
    const paginatedQuery = this.timeCidKeyset.paginate(repostsQuery, {
      limit,
      cursor,
      direction: "desc",
    });

    const reposts = await paginatedQuery.exec();

    // Generate cursor from the last item if we have a full page
    let nextCursor: string | undefined;
    if (reposts.length === limit && reposts.length > 0) {
      const lastRepost = reposts[reposts.length - 1];
      nextCursor = this.timeCidKeyset.pack({
        primary: lastRepost.indexedAt,
        secondary: lastRepost.cid,
      });
    }

    return {
      reposts: reposts.map((r) => ({
        uri: r.uri,
        subject: r.subject,
      })),
      cursor: nextCursor,
    };
  }
}
