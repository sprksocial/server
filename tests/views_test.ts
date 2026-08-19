import { assertEquals } from "@std/assert";
import { parseCid } from "@atp/lex/data";
import * as so from "../lex/so.ts";
import { Views } from "../views/index.ts";

const DID = "did:plc:testuser";
const CID = "bafyreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku";

const videoMedia = so.sprk.media.video.$build({
  video: {
    $type: "blob",
    ref: parseCid(CID),
    mimeType: "video/mp4",
    size: 12345,
  },
});

Deno.test("video view serves playlists and thumbnails from the video service", () => {
  const views = new Views({ videoCdn: "https://video.example.com" });

  const view = views.videoMedia(DID, videoMedia);

  assertEquals(
    view.playlist,
    `https://video.example.com/watch/${DID}/${CID}/playlist.m3u8`,
  );
  assertEquals(
    view.thumbnail,
    `https://video.example.com/watch/${DID}/${CID}/thumbnail.jpg`,
  );
});
