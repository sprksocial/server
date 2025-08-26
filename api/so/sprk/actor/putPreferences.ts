import { Server } from "../../../../lex/index.ts";
import { SavedFeedsPref } from "../../../../lex/types/so/sprk/actor/defs.ts";
import { AppContext } from "../../../../main.ts";

export default function (server: Server, ctx: AppContext) {
  server.so.sprk.actor.putPreferences({
    auth: ctx.authVerifier.standard,
    handler: async ({ input, auth }) => {
      const userDid = auth.credentials.iss;
      const body = input.body;

      try {
        const now = new Date().toISOString();
        let userPref = await ctx.db.models.UserPreference.findOne({ userDid });

        for (const pref of body.preferences) {
          if (pref as SavedFeedsPref) {
            const savedFeedsPref = pref as SavedFeedsPref;

            const savedFeeds = savedFeedsPref.items;

            if (!userPref) {
              userPref = await ctx.db.models.UserPreference.create({
                userDid,
                savedFeeds: { $each: savedFeeds },
                createdAt: now,
                updatedAt: now,
              });
            } else {
              await ctx.db.models.UserPreference.updateOne(
                { userDid },
                {
                  $push: {
                    savedFeeds: { $each: savedFeeds },
                  },
                },
              );
            }
          }
        }

        return;
      } catch (error) {
        ctx.logger.error("Failed to put preferences", { error, userDid });
        throw error;
      }
    },
  });
}
