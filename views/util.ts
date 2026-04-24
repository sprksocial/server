import type { BlobRef } from "@atp/lex";

type BlobJson = BlobRef | {
  $type?: string;
  ref?: {
    $link?: string;
    toString?: () => string;
  };
  cid?: string;
};

// Simple string format function to replace util.format
const format = (template: string, ...args: string[]): string => {
  return template.replace(/%s/g, () => args.shift() || "");
};

export const cidFromBlobJson = (json: BlobJson) => {
  // @NOTE below handles the fact that parseRecordBytes() produces raw json rather than lexicon values
  if (json.$type === "blob") {
    const ref = json.ref as { $link?: string; toString?: () => string };
    return ref?.$link ?? ref?.toString?.() ?? "";
  }
  return "cid" in json ? json.cid ?? "" : "";
};

export class VideoUriBuilder {
  constructor(
    private opts: {
      playlistUrlPattern: string; // e.g. https://hostname/vid/%s/%s/playlist.m3u8
      thumbnailUrlPattern: string; // e.g. https://hostname/vid/%s/%s/thumbnail.jpg
    },
  ) {}
  playlist({ did, cid }: { did: string; cid: string }) {
    return format(
      this.opts.playlistUrlPattern,
      encodeURIComponent(did),
      encodeURIComponent(cid),
    );
  }
  thumbnail({ did, cid }: { did: string; cid: string }) {
    return format(
      this.opts.thumbnailUrlPattern,
      encodeURIComponent(did),
      encodeURIComponent(cid),
    );
  }
}
