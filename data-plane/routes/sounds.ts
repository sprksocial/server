import { Database } from "../db/index.ts";
import { TimeCidKeyset } from "../db/pagination.ts";
import { compositeTime } from "../util.ts";

export interface SoundItem {
  uri: string;
  cid: string;
  authorDid: string;
  createdAt: string;
  indexedAt: string;
  sortAt: string;
}

export class Sounds {
  private db: Database;
  private timeCidKeyset: TimeCidKeyset;

  constructor(db: Database) {
    this.db = db;
    this.timeCidKeyset = new TimeCidKeyset();
  }

  /**
   * Search audios by title and details metadata
   */
  async searchAudios(
    term: string,
    limit = 25,
    cursor?: string,
  ): Promise<{ audios: SoundItem[]; cursor?: string }> {
    const cleanedTerm = term.trim();
    if (!cleanedTerm) {
      return { audios: [] };
    }

    let skip = 0;
    if (cursor) {
      const parsed = parseInt(cursor, 10);
      if (!isNaN(parsed) && parsed > 0) skip = parsed;
    }

    const audios = await this.db.models.Audio.find({
      $text: { $search: cleanedTerm },
    })
      .sort({
        score: { $meta: "textScore" },
        useCount: -1,
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit)
      .lean();

    const transformedAudios = audios.map(toSoundItem);

    let nextCursor: string | undefined;
    if (transformedAudios.length === limit) {
      nextCursor = (skip + limit).toString();
    }

    return {
      audios: transformedAudios,
      cursor: nextCursor,
    };
  }

  /**
   * Get audios by URIs
   */
  async getAudios(uris: string[]): Promise<SoundItem[]> {
    if (!uris.length) return [];

    const audios = await this.db.models.Audio.find({
      uri: { $in: uris },
    }).lean();

    return audios.map(toSoundItem);
  }

  /**
   * Get a single audio by URI
   */
  async getAudio(uri: string): Promise<SoundItem | null> {
    const audio = await this.db.models.Audio.findOne({ uri }).lean();

    if (!audio) return null;

    return toSoundItem(audio);
  }

  /**
   * Get audios by an actor
   */
  async getActorAudios(
    actorDid: string,
    limit = 50,
    cursor?: string,
  ): Promise<{ audios: SoundItem[]; cursor?: string }> {
    const audiosQuery = this.db.models.Audio.find({
      authorDid: actorDid,
    });

    const paginatedQuery = this.timeCidKeyset.paginate(audiosQuery, {
      limit: limit + 1,
      cursor,
      direction: "desc",
    });

    const audios = await paginatedQuery.exec();

    const hasMore = audios.length > limit;
    const resultAudios = hasMore ? audios.slice(0, limit) : audios;

    const transformedAudios = resultAudios.map(toSoundItem);

    let nextCursor: string | undefined;
    if (hasMore && transformedAudios.length > 0) {
      const lastAudio = transformedAudios[transformedAudios.length - 1];
      nextCursor = this.timeCidKeyset.pack({
        primary: lastAudio.sortAt,
        secondary: lastAudio.cid,
      });
    }

    return {
      audios: transformedAudios,
      cursor: nextCursor,
    };
  }

  /**
   * Get trending audios sorted by use count
   */
  async getTrendingAudios(
    limit = 25,
    cursor?: string,
  ): Promise<{ audios: SoundItem[]; cursor?: string }> {
    let skip = 0;
    if (cursor) {
      const parsed = parseInt(cursor, 10);
      if (!isNaN(parsed) && parsed > 0) skip = parsed;
    }

    const audios = await this.db.models.Audio.find({})
      .sort({ useCount: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const transformedAudios = audios.map(toSoundItem);

    let nextCursor: string | undefined;
    if (transformedAudios.length === limit) {
      nextCursor = (skip + limit).toString();
    }

    return {
      audios: transformedAudios,
      cursor: nextCursor,
    };
  }

  /**
   * Get posts that use a specific audio
   */
  async getAudioPosts(
    audioUri: string,
    limit = 50,
    cursor?: string,
  ): Promise<{ posts: string[]; cursor?: string }> {
    const postsQuery = this.db.models.Post.find({
      "sound.uri": audioUri,
      reply: null,
    });

    const paginatedQuery = this.timeCidKeyset.paginate(postsQuery, {
      limit: limit + 1,
      cursor,
      direction: "desc",
    });

    const posts = await paginatedQuery.exec();

    const hasMore = posts.length > limit;
    const resultPosts = hasMore ? posts.slice(0, limit) : posts;

    const postUris = resultPosts.map((p) => p.uri);

    let nextCursor: string | undefined;
    if (hasMore && resultPosts.length > 0) {
      const lastPost = resultPosts[resultPosts.length - 1];
      const sortAt = compositeTime(lastPost.createdAt, lastPost.indexedAt) ||
        lastPost.createdAt;
      nextCursor = this.timeCidKeyset.pack({
        primary: sortAt,
        secondary: lastPost.cid,
      });
    }

    return {
      posts: postUris,
      cursor: nextCursor,
    };
  }
}

const toSoundItem = (audio: {
  uri: string;
  cid: string;
  authorDid: string;
  createdAt: string;
  indexedAt: string;
}): SoundItem => ({
  uri: audio.uri,
  cid: audio.cid,
  authorDid: audio.authorDid,
  createdAt: audio.createdAt,
  indexedAt: audio.indexedAt,
  sortAt: compositeTime(audio.createdAt, audio.indexedAt) || audio.createdAt,
});
