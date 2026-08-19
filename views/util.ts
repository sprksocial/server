import type { BlobRef } from "@atp/lex";

type BlobJson = BlobRef | {
  $type?: string;
  ref?: {
    $link?: string;
    toString?: () => string;
  };
  cid?: string;
};

export const cidFromBlobJson = (json: BlobJson) => {
  // @NOTE below handles the fact that parseRecordBytes() produces raw json rather than lexicon values
  if (json.$type === "blob") {
    const ref = json.ref as { $link?: string; toString?: () => string };
    return ref?.$link ?? ref?.toString?.() ?? "";
  }
  return "cid" in json ? json.cid ?? "" : "";
};
