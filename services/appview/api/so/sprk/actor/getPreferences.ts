import { Hono } from "hono";
import { AppContext, AppEnv } from "../../../../main.ts";
import { authMiddleware } from "../../../../services/auth/middleware.ts";

export const createGetPreferencesRouter = (ctx: AppContext) => {
  const router = new Hono<AppEnv>();

  router.get(
    "/xrpc/so.sprk.actor.getPreferences",
    authMiddleware,
    async (c) => {
      const userDid = c.get("did") as string;

      try {
        const userPref = await ctx.db.models.UserPreference.findOne({
          userDid,
        });

        return c.json(
          {
            followMode: userPref?.followMode || "sprk",
          },
          200,
        );
      } catch (error) {
        ctx.logger.error({ error, userDid }, "Failed to get preferences");
        return c.json({ error: "Failed to get preferences" }, 500);
      }
    },
  );

  return router;
};
