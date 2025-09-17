import { Database } from "../db/index.ts";
import { TimeCidKeyset } from "../db/pagination.ts";

export class Likes {
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

    // Build query for likes on this subject
    const likesQuery = this.db.models.Like.find({ subject: subject.uri });

    // Apply pagination using TimeCidKeyset
    const paginatedQuery = this.timeCidKeyset.paginate(likesQuery, {
      limit,
      cursor,
      direction: "desc",
    });

    const likes = await paginatedQuery.exec();

    // Generate cursor from the last item if we have a full page
    let nextCursor: string | undefined;
    if (likes.length === limit && likes.length > 0) {
      const lastLike = likes[likes.length - 1];
      nextCursor = this.timeCidKeyset.pack({
        primary: lastLike.createdAt,
        secondary: lastLike.cid,
      });
    }

    return {
      uris: likes.map((l) => l.uri),
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

    // Get all likes by this actor for the specified subjects
    const subjectUris = refs.map(({ uri }) => uri);
    const likes = await this.db.models.Like.find({
      authorDid: actorDid,
      subject: { $in: subjectUris },
    });

    // Create a map for quick lookup
    const likeMap = new Map(likes.map((l) => [l.subject, l.uri]));
    const uris = refs.map(({ uri }) => likeMap.get(uri) || "");

    return { uris };
  }

  async getActor(actorDid: string, limit = 50, cursor?: string) {
    // Build query for likes by this actor
    const likesQuery = this.db.models.Like.find({ authorDid: actorDid });

    // Apply pagination using TimeCidKeyset
    const paginatedQuery = this.timeCidKeyset.paginate(likesQuery, {
      limit,
      cursor,
      direction: "desc",
    });

    const likes = await paginatedQuery.exec();

    // Generate cursor from the last item if we have a full page
    let nextCursor: string | undefined;
    if (likes.length === limit && likes.length > 0) {
      const lastLike = likes[likes.length - 1];
      nextCursor = this.timeCidKeyset.pack({
        primary: lastLike.createdAt,
        secondary: lastLike.cid,
      });
    }

    return {
      likes: likes.map((l) => ({
        uri: l.uri,
        subject: l.subject,
      })),
      cursor: nextCursor,
    };
  }
}
