import { InvalidRequestError, Server } from "@atp/xrpc-server";

import { AppContext } from "../../../../context.ts";
import { Hydrator } from "../../../../hydration/index.ts";
import * as so from "../../../../lex/so.ts";
import { $Params } from "../../../../lex/so/sprk/notification/getUnreadCount.ts";
import {
  createPipeline,
  HydrationFnInput,
  PresentationFnInput,
  SkeletonFnInput,
} from "../../../../pipeline.ts";

export default function (server: Server, ctx: AppContext) {
  const getUnreadCount = createPipeline({
    skeleton,
    hydration,
    presentation,
  });
  server.add(so.sprk.notification.getUnreadCount, {
    auth: ctx.authVerifier.standard,
    handler: async ({ auth, params }) => {
      const viewer = auth.credentials.iss;
      const result = await getUnreadCount({ ...params, viewer }, ctx);
      return {
        encoding: "application/json",
        body: result,
      };
    },
  });
}

const skeleton = async (
  input: SkeletonFnInput<Context, Params>,
): Promise<SkeletonState> => {
  const { params, ctx } = input;
  if (params.seenAt) {
    throw new InvalidRequestError("The seenAt parameter is unsupported");
  }
  const priority = params.priority ?? false;

  // Get the stored lastSeenNotifs timestamp
  const lastSeenRes = await ctx.hydrator.dataplane.notifications
    .getNotificationSeen(params.viewer, priority);

  const res = await ctx.hydrator.dataplane.notifications
    .getUnreadNotificationCount(
      params.viewer,
      lastSeenRes.timestamp,
      priority,
    );
  return {
    count: res.count,
  };
};

const hydration = (
  _input: HydrationFnInput<Context, Params, SkeletonState>,
) => {
  return Promise.resolve({});
};

const presentation = (
  input: PresentationFnInput<Context, Params, SkeletonState>,
) => {
  const { skeleton } = input;
  return { count: skeleton.count };
};

type Context = {
  hydrator: Hydrator;
};

type Params = $Params & {
  viewer: string;
};

type SkeletonState = {
  count: number;
};
