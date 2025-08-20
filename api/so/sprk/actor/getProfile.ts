import { Server } from "../../../../lex/index.ts";
import { AppContext } from "../../../../main.ts";
import { getProfile } from "../../../../utils/profile-helper.ts";

export default function (server: Server, ctx: AppContext) {
  server.so.sprk.actor.getProfile({
    auth: ctx.authVerifier.standardOptional,
    handler: async ({ params, auth }) => {
      const { actor: actorParam } = params;
      const viewerDid = auth.credentials.type === "standard"
        ? auth.credentials.iss
        : undefined;

      const profileView = await getProfile(ctx, actorParam, viewerDid);

      return {
        encoding: "application/json",
        body: profileView,
      };
    },
  });
}
