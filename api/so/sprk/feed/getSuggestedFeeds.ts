import { Server } from "../../../../lex/index.ts";
import { AppContext } from "../../../../main.ts";
import {
  BskyGeneratorDocument,
  SprkGeneratorDocument,
} from "../../../../data-plane/db/models.ts";
import { getProfileView } from "../../../../utils/profile-helper.ts";
import type * as SoSprkFeedDefs from "../../../../lex/types/so/sprk/feed/defs.ts";
import { decodeBase64, encodeBase64 } from "@std/encoding";

interface CursorData {
  likeCount: number;
  id: string;
}

// Helper function to parse cursor
function parseCursor(cursor: string): CursorData {
  try {
    const decodedCursor = new TextDecoder().decode(decodeBase64(cursor));
    const [likeCountStr, id] = decodedCursor.split("::");

    if (!likeCountStr || !id) {
      throw new Error("Invalid cursor format");
    }

    const likeCount = parseInt(likeCountStr, 10);
    if (isNaN(likeCount)) {
      throw new Error("Invalid cursor format");
    }

    return { likeCount, id };
  } catch {
    throw new Error("Invalid cursor format");
  }
}

// Helper function to generate cursor
function generateCursor(likeCount: number, id: string): string {
  return encodeBase64(
    new TextEncoder().encode(`${likeCount}::${id}`),
  );
}

// Transform GeneratorDocument to GeneratorView
async function transformGeneratorToView(
  generator: BskyGeneratorDocument | SprkGeneratorDocument,
  ctx: AppContext,
  viewerDid?: string,
): Promise<SoSprkFeedDefs.GeneratorView> {
  // Create the creator profile view
  const creator = await getProfileView(ctx, generator.authorDid, viewerDid);

  // Handle viewer state if user is authenticated
  let viewer: SoSprkFeedDefs.GeneratorViewerState | undefined;
  if (viewerDid) {
    const like = await ctx.db.models.Like.findOne({
      authorDid: viewerDid,
      subject: generator.uri,
    }).lean();

    if (like) {
      viewer = {
        $type: "so.sprk.feed.defs#generatorViewerState",
        like: like.uri,
      };
    }
  }

  return {
    $type: "so.sprk.feed.defs#generatorView",
    uri: generator.uri,
    cid: generator.cid,
    did: generator.authorDid,
    creator,
    displayName: generator.displayName,
    description: generator.description || undefined,
    descriptionFacets: generator.descriptionFacets || undefined,
    avatar: generator.avatar?.ref?.$link
      ? `https://media.sprk.so/avatar/tiny/${generator.authorDid}/${generator.avatar.ref.$link}/webp`
      : undefined,
    likeCount: generator.likeCount || 0,
    acceptsInteractions: generator.acceptsInteractions || undefined,
    labels: undefined, // Labels will be handled separately if needed
    viewer,
    indexedAt: generator.indexedAt,
  };
}

export default function (server: Server, ctx: AppContext) {
  server.so.sprk.feed.getSuggestedFeeds({
    auth: ctx.authVerifier.standardOptional,
    handler: async ({ params, auth }) => {
      try {
        const { limit = 50, cursor } = params;
        const userDid = auth.credentials.type === "standard"
          ? auth.credentials.iss
          : undefined;

        // Validate limit
        if (limit < 1 || limit > 100) {
          throw new Error("Limit must be between 1 and 100");
        }

        // Parse cursor if provided
        let cursorData: CursorData | undefined;
        if (cursor) {
          cursorData = parseCursor(cursor);
        }

        // Build query for generators sorted by like count
        const query: Record<string, unknown> = {};

        // Add cursor-based pagination
        if (cursorData) {
          query.$or = [
            { likeCount: { $lt: cursorData.likeCount } },
            { likeCount: cursorData.likeCount, _id: { $lt: cursorData.id } },
          ];
        }

        // Get both BskyGenerator and SprkGenerator documents
        const [bskyGenerators, sprkGenerators] = await Promise.all([
          ctx.db.models.BskyGenerator.find(query)
            .sort({ likeCount: -1, _id: -1 })
            .lean(),
          ctx.db.models.SprkGenerator.find(query)
            .sort({ likeCount: -1, _id: -1 })
            .lean(),
        ]);

        // Combine and sort all generators by like count
        const allGenerators = [...bskyGenerators, ...sprkGenerators]
          .sort((a, b) => {
            const aLikes = a.likeCount || 0;
            const bLikes = b.likeCount || 0;
            if (aLikes !== bLikes) {
              return bLikes - aLikes; // Sort by like count descending
            }
            // If like counts are equal, sort by _id descending for consistency
            return String(b._id).localeCompare(String(a._id));
          });

        // Apply limit and check for more results
        const generators = allGenerators.slice(0, limit + 1);

        // Check if there are more results
        const hasMore = generators.length > limit;
        if (hasMore) {
          generators.pop(); // Remove the extra item
        }

        // Transform generators to GeneratorView format
        const generatorViews = await Promise.all(
          generators.map((generator) =>
            transformGeneratorToView(generator, ctx, userDid)
          ),
        );

        // Generate next cursor if there are more results
        let nextCursor: string | undefined;
        if (hasMore && generators.length > 0) {
          const lastGenerator = generators[generators.length - 1];
          nextCursor = generateCursor(
            lastGenerator.likeCount || 0,
            String(lastGenerator._id),
          );
        }

        // Prepare response
        const response: {
          feeds: SoSprkFeedDefs.GeneratorView[];
          cursor?: string;
        } = {
          feeds: generatorViews,
        };

        if (nextCursor) {
          response.cursor = nextCursor;
        }

        return {
          encoding: "application/json",
          body: response,
        };
      } catch (error) {
        // Handle specific error cases
        if (error instanceof Error) {
          const message = error.message;

          if (message.includes("cursor") || message.includes("Cursor")) {
            return {
              status: 400,
              message: "The provided cursor is invalid",
            };
          }

          if (message.includes("limit") || message.includes("Limit")) {
            return {
              status: 400,
              message: "Limit must be between 1 and 100",
            };
          }
        }

        // Log unexpected errors and rethrow
        console.error("Unexpected error in getSuggestedFeeds:", error);
        throw error;
      }
    },
  });
}
