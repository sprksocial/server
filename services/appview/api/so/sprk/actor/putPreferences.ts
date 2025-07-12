import { Server } from "../../../../lexicon/index.ts";
import { AppContext } from "../../../../main.ts";

export default function (server: Server, ctx: AppContext) {
  server.so.sprk.actor.putPreferences({
    auth: ctx.authVerifier.standard,
    handler: async ({ input, auth }) => {
      const userDid = auth.credentials.iss;
      const body = input.body;

      if (body.followMode && !["bsky", "sprk"].includes(body.followMode)) {
        throw new Error(
          'Invalid followMode parameter. Must be "bsky" or "sprk"',
        );
      }

      try {
        const now = new Date().toISOString();
        let userPref = await ctx.db.models.UserPreference.findOne({ userDid });
        const oldMode = userPref?.followMode;

        if (!userPref) {
          userPref = await ctx.db.models.UserPreference.create({
            userDid,
            createdAt: now,
            updatedAt: now,
            followMode: body.followMode || "sprk", // Default if not provided
          });
        } else {
          if (body.followMode) {
            userPref.followMode = body.followMode;
          }
          userPref.updatedAt = now;
          await userPref.save();
        }

        // Queue indexing of Bsky follows if switched to bsky mode
        if (body.followMode === "bsky" && oldMode !== "bsky") {
          ctx.sub.indexingSvc.indexRepo(userDid).catch((error) =>
            ctx.logger.error({ error, userDid }, "Failed to index repo")
          );
        }

        return;
      } catch (error) {
        ctx.logger.error({ error, userDid }, "Failed to put preferences");
        throw error;
      }
    },
  });
}
