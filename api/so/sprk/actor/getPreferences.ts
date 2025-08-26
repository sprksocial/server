import { Server } from "../../../../lex/index.ts";
import { AppContext } from "../../../../main.ts";
import { Preferences } from "../../../../lex/types/so/sprk/actor/defs.ts";

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
            preferences: [{
              $type: "so.sprk.actor.defs#savedFeedsPref",
              items: (userPref?.savedFeeds ?? []),
            }] as Preferences,
          },
        };
      } catch (error) {
        ctx.logger.error("Failed to get preferences", { error, userDid });
        throw error;
      }
    },
  });
}
