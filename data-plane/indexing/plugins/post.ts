import { Cid } from "@atp/lex";
import { AtUri } from "@atp/syntax";
import * as so from "../../../lex/so.ts";
import { BackgroundQueue } from "../../background.ts";
import { Database } from "../../db/index.ts";
import { PostDocument } from "../../db/models.ts";
import { getDescendents } from "../../util.ts";
import { RecordProcessor } from "../processor.ts";

type PostAncestor = {
  uri: string;
  height: number;
};
type PostDescendent = {
  uri: string;
  depth: number;
  cid: string;
  creator: string;
  sortAt: string;
};
type MediaImages = so.sprk.media.images.Main;
type MediaImage = so.sprk.media.image.Main;
type MediaVideo = so.sprk.media.video.Main;
type PostRecord = so.sprk.feed.post.Main;
type GateRecord = so.sprk.feed.threadgate.Main;
type IndexedPost = {
  post: PostDocument;
  facets?: { type: "mention" | "link"; value: string }[];
  medias?: Array<{
    position?: number;
    imageCid?: string;
    alt?: string | null;
    thumbCid?: string | null;
    videoCid?: string;
  }>;
  ancestors?: PostAncestor[];
  descendents?: PostDescendent[];
  threadgate?: GateRecord;
};

const schema = so.sprk.feed.post.main;
const isMediaImages = so.sprk.media.images.$matches;
const isMediaVideo = so.sprk.media.video.$matches;
const isMention = so.sprk.richtext.facet.mention.$matches;
const isLink = so.sprk.richtext.facet.link.$matches;

const REPLY_NOTIF_DEPTH = 5;

const insertFn = async (
  db: Database,
  uri: AtUri,
  cid: Cid,
  obj: PostRecord,
  timestamp: string,
): Promise<IndexedPost | null> => {
  const post = {
    uri: uri.toString(),
    cid: cid.toString(),
    authorDid: uri.host,
    caption: obj.caption
      ? {
        text: obj.caption.text || "",
        facets: obj.caption.facets || [],
      }
      : undefined,
    media: obj.media || null,
    sound: obj.sound || null,
    langs: obj.langs || [],
    labels: obj.labels || null,
    tags: obj.tags || [],
    crossposts: obj.crossposts || [],
    createdAt: obj.createdAt,
    indexedAt: timestamp,
  };

  const insertedPost = await db.models.Post.findOneAndUpdate(
    { uri: post.uri },
    { $set: post },
    { upsert: true, returnDocument: "after" },
  );

  const facets = (obj.caption?.facets || [])
    .flatMap((facet) => facet.features)
    .flatMap((feature) => {
      if (isMention(feature)) {
        return {
          type: "mention" as const,
          value: feature.did,
        };
      }
      if (isLink(feature)) {
        return {
          type: "link" as const,
          value: feature.uri,
        };
      }
      return [];
    });

  // Media processing - medias are stored inline in the Post model
  const medias: Array<{
    position?: number;
    imageCid?: string;
    alt?: string | null;
    thumbCid?: string | null;
    videoCid?: string;
  }> = [];
  const postMedias = separateMedia(obj.media);
  for (const postMedia of postMedias) {
    if (isMediaImages(postMedia)) {
      const { images } = postMedia as MediaImages;
      const imagesMedia = images.map((
        img: MediaImage,
        i: number,
      ) => ({
        position: i,
        imageCid: img.image.ref.toString(),
        alt: img.alt,
      }));
      medias.push(...imagesMedia);
    } else if (isMediaVideo(postMedia)) {
      const media = postMedia as MediaVideo;
      const videoMedia = {
        postUri: uri.toString(),
        videoCid: media.video.ref.toString(),
        alt: media.alt ?? null,
      };
      medias.push(videoMedia);
    }
  }

  const descendents = await getDescendents(db, {
    uri: post.uri,
    depth: REPLY_NOTIF_DEPTH,
  });

  return {
    post: insertedPost,
    facets,
    medias,
    descendents,
  };
};

const findDuplicate = (): AtUri | null => {
  return null;
};

const notifsForInsert = (obj: IndexedPost) => {
  const notifs: Array<{
    did: string;
    reason: string;
    author: string;
    recordUri: string;
    recordCid: string;
    sortAt: string;
    reasonSubject?: string;
  }> = [];
  const notified = new Set([obj.post.authorDid]);
  const maybeNotify = (notif: {
    did: string;
    reason: string;
    author: string;
    recordUri: string;
    recordCid: string;
    sortAt: string;
    reasonSubject?: string;
  }) => {
    if (!notified.has(notif.did)) {
      notified.add(notif.did);
      notifs.push(notif);
    }
  };
  for (const facet of obj.facets ?? []) {
    if (facet.type === "mention") {
      maybeNotify({
        did: facet.value,
        reason: "mention",
        author: obj.post.authorDid,
        recordUri: obj.post.uri,
        recordCid: obj.post.cid,
        sortAt: obj.post.createdAt,
      });
    }
  }

  const threadgateHiddenReplies = (obj.threadgate?.hiddenReplies || [])
    .map(String);

  // reply notifications
  for (const ancestor of obj.ancestors ?? []) {
    if (ancestor.uri === obj.post.uri) continue; // no need to notify for own post
    if (ancestor.height < REPLY_NOTIF_DEPTH) {
      const ancestorUri = new AtUri(ancestor.uri);
      maybeNotify({
        did: ancestorUri.host,
        reason: "reply",
        reasonSubject: ancestorUri.toString(),
        author: obj.post.authorDid,
        recordUri: obj.post.uri,
        recordCid: obj.post.cid,
        sortAt: obj.post.createdAt,
      });
      // found hidden reply, don't notify any higher ancestors
      if (threadgateHiddenReplies.includes(ancestorUri.toString())) break;
    }
  }

  // descendents indicate out-of-order indexing: need to notify
  // the current post and upwards.
  for (const descendent of obj.descendents ?? []) {
    for (const ancestor of obj.ancestors ?? []) {
      const totalHeight = descendent.depth + ancestor.height;
      if (totalHeight < REPLY_NOTIF_DEPTH) {
        const ancestorUri = new AtUri(ancestor.uri);
        maybeNotify({
          did: ancestorUri.host,
          reason: "reply",
          reasonSubject: ancestorUri.toString(),
          author: descendent.creator,
          recordUri: descendent.uri,
          recordCid: descendent.cid,
          sortAt: descendent.sortAt,
        });
      }
    }
  }

  return notifs;
};

const deleteFn = async (
  db: Database,
  uri: AtUri,
): Promise<IndexedPost | null> => {
  const uriStr = uri.toString();
  const deleted = await db.models.Post.findOneAndDelete({ uri: uriStr });

  if (!deleted) {
    return null;
  }

  return {
    post: deleted,
    facets: [],
  };
};

const notifsForDelete = (
  deleted: IndexedPost,
  replacedBy: IndexedPost | null,
) => {
  const notifs = replacedBy ? notifsForInsert(replacedBy) : [];
  return {
    notifs,
    toDelete: [deleted.post.uri],
  };
};

const updateAggregates = async (db: Database, postIdx: IndexedPost) => {
  // Update posts count for author
  const postsCount = await db.models.Post.countDocuments({
    authorDid: postIdx.post.authorDid,
  });

  // First check if profile exists to avoid creating one with null URI
  const existingProfile = await db.models.Profile.findOne({
    authorDid: postIdx.post.authorDid,
  });

  if (existingProfile) {
    // Only update existing profiles
    await db.models.Profile.findOneAndUpdate(
      { authorDid: postIdx.post.authorDid },
      { $set: { postsCount } },
      { returnDocument: "after" },
    );
  }
};

export type PluginType = RecordProcessor<typeof schema, IndexedPost>;

export const makePlugin = (
  db: Database,
  background: BackgroundQueue,
): PluginType => {
  return new RecordProcessor(db, background, {
    schema,
    insertFn,
    findDuplicate,
    deleteFn,
    notifsForInsert,
    notifsForDelete,
    updateAggregates,
  });
};

export default makePlugin;

function separateMedia(
  media: PostRecord["media"],
): Array<NonNullable<PostRecord["media"]>> {
  if (!media) {
    return [];
  }
  return [media];
}
