import { Server } from "../../../../lexicon/index.ts";
import { AppContext } from "../../../../main.ts";

export default function (server: Server, ctx: AppContext) {
  server.so.sprk.actor.getPreferences({
    auth: ctx.authVerifier.standard,
    handler: async ({ auth }) => {
      const userDid = auth.credentials.iss;

      try {
        const userPref = await ctx.db.models.UserPreference.findOne({
          userDid,
        });

        return {
          encoding: "application/json",
          body: {
            followMode: (userPref?.followMode || "sprk") as "sprk" | "bsky",
          },
        };
      } catch (error) {
        ctx.logger.error({ error, userDid }, "Failed to get preferences");
        throw error;
      }
    },
  });
}
