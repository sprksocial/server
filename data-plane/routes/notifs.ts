import { Database } from "../db/index.ts";
import { GenericKeyset } from "../db/pagination.ts";

type SortAtCidResult = { sortAt: string; recordCid: string };
type SortAtCidLabeledResult = { primary: string; secondary: string };

class SortAtCidKeyset extends GenericKeyset<
  SortAtCidResult,
  SortAtCidLabeledResult
> {
  constructor() {
    super("sortAt", "recordCid");
  }

  labelResult(result: SortAtCidResult): SortAtCidLabeledResult {
    const sortAt = result.sortAt || new Date().toISOString();
    return { primary: sortAt, secondary: result.recordCid };
  }

  labeledResultToCursor(labeled: SortAtCidLabeledResult) {
    const timestamp = new Date(labeled.primary).getTime();
    if (isNaN(timestamp)) {
      throw new Error("Invalid date for cursor");
    }
    const secondsBase36 = Math.floor(timestamp / 1000).toString(36);
    return {
      primary: secondsBase36,
      secondary: labeled.secondary,
    };
  }

  cursorToLabeledResult(cursor: { primary: string; secondary: string }) {
    const seconds = parseInt(cursor.primary, 36);
    if (isNaN(seconds)) {
      throw new Error("Malformed cursor: invalid timestamp");
    }
    const primaryDate = new Date(seconds * 1000);
    if (isNaN(primaryDate.getTime())) {
      throw new Error("Malformed cursor: invalid date");
    }
    return {
      primary: primaryDate.toISOString(),
      secondary: cursor.secondary,
    };
  }
}

export interface Notification {
  recipientDid: string;
  uri: string;
  cid: string;
  reason: string;
  reasonSubject?: string;
  sortAt: string;
  authorDid: string;
  priority?: boolean;
}

export class Notifications {
  private db: Database;
  private sortAtCidKeyset: SortAtCidKeyset;

  constructor(db: Database) {
    this.db = db;
    this.sortAtCidKeyset = new SortAtCidKeyset();
  }

  async getNotifications(
    actorDid: string,
    limit = 50,
    cursor?: string,
    priority?: boolean,
  ): Promise<{ notifications: Notification[]; cursor?: string }> {
    // Get follows for priority filtering
    let priorityDids: string[] | undefined;
    if (priority) {
      const follows = await this.db.models.Follow.find({
        authorDid: actorDid,
      }).select("subject");
      priorityDids = follows.map((f) => f.subject);
      if (priorityDids.length === 0) {
        return { notifications: [], cursor: undefined };
      }
    }

    // Build base query
    const baseFilter: Record<string, unknown> = { did: actorDid };

    // If priority, filter to only notifications from followed users
    if (priorityDids) {
      baseFilter.author = { $in: priorityDids };
    }

    // Get notifications
    const notifsQuery = this.db.models.Notification.find(baseFilter);

    // Apply pagination
    const paginatedQuery = this.sortAtCidKeyset.paginate(notifsQuery, {
      limit,
      cursor,
      direction: "desc",
    });

    const notifs = await paginatedQuery.exec();

    // Filter out notifications with missing reasonSubject records
    const filteredNotifs = await this.filterValidReasonSubjects(notifs);

    // Get priority status for each notification
    const followedDids = priorityDids ?? await this.getFollowedDids(actorDid);
    const followedSet = new Set(followedDids);

    // Generate cursor from the last item if we have results
    let nextCursor: string | undefined;
    if (notifs.length === limit && notifs.length > 0) {
      const lastNotif = notifs[notifs.length - 1];
      nextCursor = this.sortAtCidKeyset.pack({
        primary: lastNotif.sortAt,
        secondary: lastNotif.recordCid,
      });
    }

    const notifications = filteredNotifs.map((notif) => ({
      recipientDid: actorDid,
      uri: notif.recordUri,
      cid: notif.recordCid,
      reason: notif.reason,
      reasonSubject: notif.reasonSubject ?? undefined,
      sortAt: notif.sortAt,
      authorDid: notif.author,
      priority: followedSet.has(notif.author),
    }));

    return {
      notifications,
      cursor: nextCursor,
    };
  }

  async getNotificationSeen(
    actorDid: string,
    _priority?: boolean,
  ): Promise<{ timestamp?: string }> {
    const actor = await this.db.models.Actor.findOne({ did: actorDid });
    if (!actor || !actor.lastSeenNotifs) {
      return {};
    }

    return { timestamp: actor.lastSeenNotifs };
  }

  async getUnreadNotificationCount(
    actorDid: string,
    lastSeen?: string,
    priority?: boolean,
  ): Promise<{ count: number }> {
    const baseFilter: Record<string, unknown> = { did: actorDid };

    // Filter by lastSeen if provided
    if (lastSeen) {
      baseFilter.sortAt = { $gt: lastSeen };
    }

    // If priority, filter to only notifications from followed users
    if (priority) {
      const follows = await this.db.models.Follow.find({
        authorDid: actorDid,
      }).select("subject");
      const priorityDids = follows.map((f) => f.subject);
      if (priorityDids.length === 0) {
        return { count: 0 };
      }
      baseFilter.author = { $in: priorityDids };
    }

    const count = await this.db.models.Notification.countDocuments(baseFilter);

    return { count };
  }

  async updateNotificationSeen(
    actorDid: string,
    timestamp: string,
    _priority?: boolean,
  ): Promise<void> {
    await this.db.models.Actor.findOneAndUpdate(
      { did: actorDid },
      { $set: { lastSeenNotifs: timestamp } },
      { upsert: false },
    );
  }

  // Helper methods

  private async getFollowedDids(actorDid: string): Promise<string[]> {
    const follows = await this.db.models.Follow.find({
      authorDid: actorDid,
    }).select("subject");
    return follows.map((f) => f.subject);
  }

  private async filterValidReasonSubjects(
    notifs: Array<{
      recordUri: string;
      recordCid: string;
      author: string;
      reason: string;
      reasonSubject: string | null;
      sortAt: string;
    }>,
  ): Promise<
    Array<{
      recordUri: string;
      recordCid: string;
      author: string;
      reason: string;
      reasonSubject: string | null;
      sortAt: string;
    }>
  > {
    // Filter out notifications where reasonSubject exists but the record doesn't
    const notifsWithSubject = notifs.filter((n) => n.reasonSubject);
    if (notifsWithSubject.length === 0) {
      return notifs;
    }

    const subjectUris = notifsWithSubject.map((n) => n.reasonSubject as string);

    const existingRecords = await this.db.models.Record.find({
      uri: { $in: subjectUris },
    }).select("uri").lean();

    const existingUris = new Set(existingRecords.map((r) => r.uri));

    return notifs.filter(
      (n) => !n.reasonSubject || existingUris.has(n.reasonSubject),
    );
  }
}
