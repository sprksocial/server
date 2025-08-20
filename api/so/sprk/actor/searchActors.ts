import { Server } from "../../../../lex/index.ts";
import { AppContext } from "../../../../main.ts";
import type * as SoSprkActorSearch from "../../../../lex/types/so/sprk/actor/searchActors.ts";
import { getProfileViews } from "../../../../utils/profile-helper.ts";

// Helper to escape user input for safe RegExp usage
function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default function (server: Server, ctx: AppContext) {
  server.so.sprk.actor.searchActors({
    auth: ctx.authVerifier.standardOptional,
    handler: async ({ params, auth }) => {
      const { q, limit: limitParam = 25, cursor: cursorParam } = params;
      const userDid = auth.credentials.type === "standard"
        ? auth.credentials.iss
        : undefined;

      if (!q?.trim()) {
        throw new Error("Search query (q) is required");
      }

      let limit = typeof limitParam === "string"
        ? parseInt(limitParam)
        : limitParam;
      if (isNaN(limit)) limit = 25;
      if (limit < 1 || limit > 100) {
        throw new Error("Limit must be between 1 and 100");
      }

      let skip = 0;
      if (cursorParam) {
        skip = parseInt(cursorParam);
        if (isNaN(skip) || skip < 0) {
          throw new Error("Invalid cursor");
        }
      }

      const escaped = escapeRegExp(q.trim());
      const regex = new RegExp(escaped, "i");

      // Build aggregation pipeline to search both profiles and actors efficiently
      const profilesPromise = ctx.db.models.Profile.aggregate([
        {
          $match: {
            $or: [
              { displayName: regex },
              { description: regex },
            ],
          },
        },
        {
          $lookup: {
            from: "actors",
            localField: "authorDid",
            foreignField: "did",
            as: "actor",
          },
        },
        {
          $match: {
            "actor.0": { $exists: true }, // Only include profiles with valid actors
          },
        },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
      ]);

      // Also search by handle in actors
      const actorsPromise = ctx.db.models.Actor.aggregate([
        {
          $match: {
            handle: regex,
          },
        },
        {
          $lookup: {
            from: "profiles",
            localField: "did",
            foreignField: "authorDid",
            as: "profile",
          },
        },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
      ]);

      const [profileResults, actorResults] = await Promise.all([
        profilesPromise,
        actorsPromise,
      ]);

      // Combine and deduplicate results
      const seenDids = new Set<string>();
      const allCandidates: string[] = [];

      // Add profiles from profile search
      for (const result of profileResults) {
        if (!seenDids.has(result.authorDid)) {
          seenDids.add(result.authorDid);
          allCandidates.push(result.authorDid);
        }
      }

      // Add profiles from actor search
      for (const result of actorResults) {
        if (!seenDids.has(result.did) && result.profile?.[0]) {
          seenDids.add(result.did);
          allCandidates.push(result.did);
        }
      }

      // Limit final results
      const finalDids = allCandidates.slice(0, limit);

      // Batch fetch profile views using the optimized function
      const actors = await getProfileViews(ctx, finalDids, userDid);

      const nextCursor = allCandidates.length === limit
        ? String(skip + limit)
        : undefined;

      return {
        encoding: "application/json",
        body: {
          actors,
          ...(nextCursor ? { cursor: nextCursor } : {}),
        } as SoSprkActorSearch.OutputSchema,
      };
    },
  });
}
