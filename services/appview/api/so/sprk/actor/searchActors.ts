import { Server } from "../../../../lexicon/index.ts";
import { AppContext } from "../../../../main.ts";
import type { Label } from "../../../../lexicon/types/com/atproto/label/defs.ts";
import type * as SoSprkActorDefs from "../../../../lexicon/types/so/sprk/actor/defs.ts";
import type * as SoSprkActorSearch from "../../../../lexicon/types/so/sprk/actor/searchActors.ts";

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

      const filter: Record<string, unknown> = {};
      const sort: { createdAt: -1 } = { createdAt: -1 };

      const escaped = escapeRegExp(q.trim());
      const regex = new RegExp(escaped, "i");
      filter.$or = [
        { displayName: regex },
        { description: regex },
        { handle: regex },
      ];

      const profiles = await ctx.db.models.Profile.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean();

      // For handle search, exclude DIDs already found
      const foundDids = profiles.map((p: { authorDid: string }) => p.authorDid);
      const handleFilter = { ...filter, did: { $nin: foundDids } };
      const handles = await ctx.db.models.Actor.find(handleFilter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean();

      const handleProfiles = await ctx.db.models.Profile.find({
        authorDid: { $in: handles.map((h: { did: string }) => h.did) },
      }).lean();

      const fullProfiles = [...profiles, ...handleProfiles];

      const actors: SoSprkActorDefs.ProfileView[] = (
        await Promise.all(
          fullProfiles.map(async (p) => {
            const avatar = p.avatar
              ? `https://media.sprk.so/avatar/tiny/${p.authorDid}/${
                (p.avatar as { ref: { $link: string } }).ref.$link
              }/webp`
              : undefined;
            const labels = Array.isArray(p.labels)
              ? (p.labels as Label[])
              : undefined;
            const now = new Date().toISOString();
            await ctx.indexingService.indexHandle(p.authorDid, now);
            const actor = await ctx.db.models.Actor.findOne({
              did: p.authorDid,
            });
            if (!actor || !actor.handle) {
              return undefined;
            }

            let viewer: SoSprkActorDefs.ViewerState | undefined = undefined;
            if (userDid) {
              const [follow, followedBy, block, blockedBy] = await Promise.all([
                ctx.db.models.Follow.findOne({
                  subject: p.authorDid,
                  authorDid: userDid,
                }),
                ctx.db.models.Follow.findOne({
                  subject: userDid,
                  authorDid: p.authorDid,
                }),
                ctx.db.models.Block.findOne({
                  subject: p.authorDid,
                  authorDid: userDid,
                }),
                ctx.db.models.Block.findOne({
                  subject: userDid,
                  authorDid: p.authorDid,
                }),
              ]);
              viewer = {};
              if (follow) viewer.following = follow.uri;
              if (followedBy) viewer.followedBy = followedBy.uri;
              if (block) viewer.blocking = block.uri;
              if (blockedBy) viewer.blockedBy = true;
              if (Object.keys(viewer).length === 0) viewer = undefined;
            }

            return {
              $type: "so.sprk.actor.defs#profileView",
              did: p.authorDid,
              handle: actor.handle,
              displayName: p.displayName,
              description: p.description,
              avatar,
              indexedAt: p.indexedAt,
              createdAt: p.createdAt,
              labels,
              viewer,
            } as SoSprkActorDefs.ProfileView;
          }),
        )
      ).filter(
        (actor): actor is SoSprkActorDefs.ProfileView => actor !== undefined,
      );

      const nextCursor = profiles.length === limit
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
