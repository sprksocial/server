import { Server } from "../../../../lex/index.ts";
import { AppContext } from "../../../../main.ts";
import { getProfiles } from "../../../../utils/profile-helper.ts";

export default function (server: Server, ctx: AppContext) {
  server.so.sprk.actor.getProfiles({
    auth: ctx.authVerifier.standardOptional,
    handler: async ({ params, auth }) => {
      const { actors: actorParams } = params;
      const viewerDid = auth.credentials.type === "standard"
        ? auth.credentials.iss
        : undefined;

      const profiles = await getProfiles(ctx, actorParams, viewerDid);

      return {
        encoding: "application/json",
        body: {
          profiles,
        },
      };
    },
  });
}
