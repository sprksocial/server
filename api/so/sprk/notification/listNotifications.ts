import { mapDefined } from "@atp/common";
import { InvalidRequestError } from "@atp/xrpc-server";
import { ServerConfig } from "../../../../config.ts";
import { AppContext } from "../../../../context.ts";
import { Notification } from "../../../../data-plane/routes/notifs.ts";
import { HydrateCtx, Hydrator } from "../../../../hydration/index.ts";
import { Server } from "../../../../lex/index.ts";
import { QueryParams } from "../../../../lex/types/so/sprk/notification/listNotifications.ts";
import {
  createPipeline,
  HydrationFnInput,
  PresentationFnInput,
  RulesFnInput,
  SkeletonFnInput,
} from "../../../../pipeline.ts";
import { Views } from "../../../../views/index.ts";
import { resHeaders } from "../../../util.ts";

export default function (server: Server, ctx: AppContext) {
  const listNotifications = createPipeline(
    skeleton,
    hydration,
    noBlockOrMutesOrNeedsFiltering,
    presentation,
  );
  server.so.sprk.notification.listNotifications({
    auth: ctx.authVerifier.standard,
    handler: async ({ params, auth, req }) => {
      const viewer = auth.credentials.iss;
      const labelers = ctx.reqLabelers(req);
      const hydrateCtx = await ctx.hydrator.createContext({ labelers, viewer });
      const result = await listNotifications(
        { ...params, hydrateCtx: hydrateCtx.copy({ viewer }) },
        ctx,
      );
      return {
        encoding: "application/json",
        body: result,
        headers: resHeaders({ labelers: hydrateCtx.labelers }),
      };
    },
  });
}

const paginateNotifications = async (opts: {
  ctx: Context;
  priority: boolean;
  reasons?: string[];
  cursor?: string;
  limit: number;
  viewer: string;
}) => {
  const { ctx, priority, reasons, limit, viewer } = opts;

  // if not filtering, then just pass through the response from dataplane
  if (!reasons) {
    const res = await ctx.hydrator.dataplane.notifications.getNotifications(
      viewer,
      limit,
      opts.cursor,
      priority,
    );
    return {
      notifications: res.notifications,
      cursor: res.cursor,
    };
  }

  let nextCursor: string | undefined = opts.cursor;
  let toReturn: Notification[] = [];
  const maxAttempts = 10;
  const attemptSize = Math.ceil(limit / 2);
  for (let i = 0; i < maxAttempts; i++) {
    const res = await ctx.hydrator.dataplane.notifications.getNotifications(
      viewer,
      limit,
      nextCursor,
      priority,
    );
    const filtered = res.notifications.filter((notif) =>
      reasons.includes(notif.reason)
    );
    toReturn = [...toReturn, ...filtered];
    nextCursor = res.cursor ?? undefined;
    if (toReturn.length >= attemptSize || !nextCursor) {
      break;
    }
  }
  return {
    notifications: toReturn,
    cursor: nextCursor,
  };
};

/**
 * Applies a configurable delay to the datetime string of a cursor,
 * effectively allowing for a delay on listing the notifications.
 * This is useful to allow time for services to process notifications
 * before they are listed to the user.
 */
export const delayCursor = (
  cursorStr: string | undefined,
  _delayMs: number,
): string | undefined => {
  // The cursor is a packed keyset cursor (base36:cid), not an ISO timestamp.
  // We can't apply time-based delays to it without unpacking/repacking.
  // For now, just pass through the cursor as-is.
  // If no cursor, return undefined to fetch from the beginning.
  return cursorStr;
};

const skeleton = async (
  input: SkeletonFnInput<Context, Params>,
): Promise<SkeletonState> => {
  const { params, ctx } = input;
  if (params.seenAt) {
    throw new InvalidRequestError("The seenAt parameter is unsupported");
  }

  const originalCursor = params.cursor;
  const delayedCursor = delayCursor(
    originalCursor,
    ctx.cfg.notificationsDelayMs,
  );
  const viewer = params.hydrateCtx.viewer;
  const priority = params.priority ?? false;
  const [res, lastSeenRes] = await Promise.all([
    paginateNotifications({
      ctx,
      priority,
      reasons: params.reasons,
      cursor: delayedCursor,
      limit: params.limit,
      viewer,
    }),
    ctx.hydrator.dataplane.notifications.getNotificationSeen(
      viewer,
      priority,
    ),
  ]);
  // @NOTE for the first page of results if there's no last-seen time, consider top notification unread
  // rather than all notifications. bit of a hack to be more graceful when seen times are out of sync.
  let lastSeenAt = lastSeenRes.timestamp;
  if (!lastSeenAt && !originalCursor) {
    // Set to 1ms before the first notification so it shows as unread (since we use >= comparison)
    const firstSortAt = res.notifications.at(0)?.sortAt;
    if (firstSortAt) {
      const firstTime = new Date(firstSortAt);
      firstTime.setMilliseconds(firstTime.getMilliseconds() - 1);
      lastSeenAt = firstTime.toISOString();
    }
  }
  return {
    notifs: res.notifications,
    cursor: res.cursor || undefined,
    priority,
    lastSeenNotifs: lastSeenAt,
  };
};

const hydration = async (
  input: HydrationFnInput<Context, Params, SkeletonState>,
) => {
  const { skeleton, params, ctx } = input;
  return await ctx.hydrator.hydrateNotifications(
    skeleton.notifs,
    params.hydrateCtx,
  );
};

const noBlockOrMutesOrNeedsFiltering = (
  input: RulesFnInput<Context, Params, SkeletonState>,
) => {
  const { skeleton, hydration, ctx } = input;
  skeleton.notifs = skeleton.notifs.filter((item) => {
    // Use authorDid directly (the person who created the notification action)
    // For likes, this is the liker; for replies, this is the replier, etc.
    const did = item.authorDid;
    if (
      ctx.views.viewerBlockExists(did, hydration) ||
      ctx.views.viewerMuteExists(did, hydration)
    ) {
      return false;
    }
    // Filter out notifications from users that need review unless moots
    if (
      item.reason === "reply" ||
      item.reason === "mention" ||
      item.reason === "like" ||
      item.reason === "follow"
    ) {
      const seesNeedsReview = ctx.views.viewerSeesNeedsReview(
        { did, uri: item.uri },
        hydration,
      );
      if (!seesNeedsReview) {
        return false;
      }
    }
    return true;
  });
  return skeleton;
};

const presentation = (
  input: PresentationFnInput<Context, Params, SkeletonState>,
) => {
  const { skeleton, hydration, ctx } = input;
  const { notifs, lastSeenNotifs, cursor } = skeleton;
  const notifications = mapDefined(
    notifs,
    (notif) => ctx.views.notification(notif, lastSeenNotifs, hydration),
  );
  return {
    notifications,
    cursor,
    priority: skeleton.priority,
    seenAt: skeleton.lastSeenNotifs,
  };
};

type Context = {
  hydrator: Hydrator;
  views: Views;
  cfg: ServerConfig;
};

type Params = QueryParams & {
  hydrateCtx: HydrateCtx & { viewer: string };
};

type SkeletonState = {
  notifs: Notification[];
  priority: boolean;
  lastSeenNotifs?: string;
  cursor?: string;
};
