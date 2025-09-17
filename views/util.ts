import { BlobRef } from "@atproto/lexicon";

// Simple string format function to replace util.format
const format = (template: string, ...args: string[]): string => {
  return template.replace(/%s/g, () => args.shift() || "");
};

export const cidFromBlobJson = (json: BlobRef) => {
  if (json instanceof BlobRef) {
    return json.ref.toString();
  }
  // @NOTE below handles the fact that parseRecordBytes() produces raw json rather than lexicon values
  if (json["$type"] === "blob") {
    return (json["ref"]?.["$link"] ?? "") as string;
  }
  return (json["cid"] ?? "") as string;
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
