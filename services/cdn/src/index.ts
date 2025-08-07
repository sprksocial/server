import { Hono } from "hono";
import { pino } from "pino";
import { createBidirectionalResolver, createIdResolver } from "./id-resolver";
import { imageHandler } from "./imageHandler";
import { videoHandler } from "./videoHandler";

const logger = pino({
  name: "cdn"
});

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
let app: Hono;

export default {
  port,
  fetch: (request: Request) => app.fetch(request),
};

async function main() {
  logger.info("Starting Spark CDN service");

  try {
    const resolver = createIdResolver();
    const bidirectionalResolver = createBidirectionalResolver(resolver);
    app = new Hono();

    app.get("/", (c) => {
      return c.text(
        "✧･ﾟ: ✧･ﾟ:. ݁₊ ⊹ . ݁˖ . ݁ SPARK CDN . ݁₊ ⊹ . ݁˖ . ݁ :･ﾟ✧:･ﾟ✧",
      );
    });

    app.get("/video/:did/:cid", (c) => videoHandler(c, bidirectionalResolver));

    // Routes for avatar images with size and format options
    app.get(
      "/avatar/:size/:did/:cid",
      (c) => imageHandler(c, bidirectionalResolver),
    );
    app.get(
      "/avatar/:size/:did/:cid/:format",
      (c) => imageHandler(c, bidirectionalResolver),
    );

    // Routes for regular images with size and format options
    app.get(
      "/img/:size/:did/:cid",
      (c) => imageHandler(c, bidirectionalResolver),
    );
    app.get(
      "/img/:size/:did/:cid/:format",
      (c) => imageHandler(c, bidirectionalResolver),
    );

    // Backward compatibility routes (default to 'full' size)
    app.get("/avatar/:did/:cid", (c) => {
      c.req.param = Object.assign(c.req.param, { size: "full" });
      return imageHandler(c, bidirectionalResolver);
    });

    app.get("/img/:did/:cid", (c) => {
      c.req.param = Object.assign(c.req.param, { size: "full" });
      return imageHandler(c, bidirectionalResolver);
    });

    logger.info({ port }, "CDN service is running");
  } catch (err) {
    logger.error({ err }, "Failed to start CDN service");
    process.exit(1);
  }
}

// Handle shutdown gracefully
const shutdown = () => {
  logger.info("Shutting down CDN service...");
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

main().catch((err) => {
  logger.error({ err }, "Fatal error in main process");
  process.exit(1);
});
