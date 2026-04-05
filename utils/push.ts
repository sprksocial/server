import { jsonStringToLex } from "@atp/lexicon";
import { PushToken, PushTokens } from "../data-plane/routes/push-tokens.ts";
import { Database } from "../data-plane/db/index.ts";

export interface PushPayload {
  recipientDid: string;
  reason: string;
  author: string;
  recordUri: string;
  reasonSubject?: string;
}

export interface PushConfig {
  enabled: boolean;
  fcmServiceAccount?: string; // JSON string of Firebase service account
}

interface FcmServiceAccount {
  project_id: string;
  private_key: string;
  client_email: string;
}

export class PushService {
  private pushTokens: PushTokens;
  private db: Database;
  private config: PushConfig;
  private fcmAccessToken: string | null = null;
  private fcmTokenExpiry: number = 0;
  private fcmServiceAccount: FcmServiceAccount | null = null;

  constructor(pushTokens: PushTokens, db: Database, config: PushConfig) {
    this.pushTokens = pushTokens;
    this.db = db;
    this.config = config;

    if (config.fcmServiceAccount) {
      try {
        this.fcmServiceAccount = JSON.parse(config.fcmServiceAccount);
      } catch {
        console.error("Failed to parse FCM service account JSON");
      }
    }
  }

  get enabled(): boolean {
    return this.config.enabled;
  }

  async sendPush(did: string, payload: PushPayload): Promise<void> {
    if (!this.config.enabled) {
      return;
    }

    const tokens = await this.pushTokens.getTokensForDid(did);
    if (tokens.length === 0) {
      return;
    }

    // Get unread count for badge
    const badgeCount = await this.getUnreadCount(did);

    const invalidTokens: string[] = [];

    for (const token of tokens) {
      try {
        const success = await this.sendFcm(token, payload, badgeCount);
        if (!success) {
          invalidTokens.push(token.token);
        }
      } catch (err) {
        console.error("Failed to send push notification", {
          err,
          platform: token.platform,
          did,
        });
      }
    }

    // Clean up invalid tokens
    if (invalidTokens.length > 0) {
      await this.pushTokens.deleteInvalidTokens(invalidTokens);
      console.info("Removed invalid push tokens", {
        count: invalidTokens.length,
      });
    }
  }

  /**
   * Send a silent push to reset the badge count to 0
   * Called when notifications are marked as seen
   */
  async sendBadgeReset(did: string): Promise<void> {
    if (!this.config.enabled) {
      return;
    }

    const tokens = await this.pushTokens.getTokensForDid(did);
    if (tokens.length === 0) {
      return;
    }

    const invalidTokens: string[] = [];

    for (const token of tokens) {
      // Only iOS needs badge reset (Android handles badges differently)
      if (token.platform !== "ios") {
        continue;
      }

      try {
        const success = await this.sendSilentBadgeUpdate(token, 0);
        if (!success) {
          invalidTokens.push(token.token);
        }
      } catch (err) {
        console.error("Failed to send badge reset", {
          err,
          did,
        });
      }
    }

    // Clean up invalid tokens
    if (invalidTokens.length > 0) {
      await this.pushTokens.deleteInvalidTokens(invalidTokens);
    }
  }

  /**
   * Get unread notification count for a user
   */
  private async getUnreadCount(did: string): Promise<number> {
    try {
      // Get last seen timestamp
      const actor = await this.db.models.Actor.findOne({ did }).lean();
      const lastSeen = actor?.lastSeenNotifs;

      // Build query for unread notifications
      const filter: Record<string, unknown> = { did };
      if (lastSeen) {
        filter.sortAt = { $gt: lastSeen };
      }

      const count = await this.db.models.Notification.countDocuments(filter);
      return count;
    } catch (err) {
      console.error("Failed to get unread count", { err, did });
      return 1; // Default to 1 if we can't get the count
    }
  }

  /**
   * Send a silent push to update badge without showing notification
   */
  private async sendSilentBadgeUpdate(
    token: PushToken,
    badge: number,
  ): Promise<boolean> {
    if (!this.fcmServiceAccount) {
      return true;
    }

    const accessToken = await this.getFcmAccessToken();
    if (!accessToken) {
      return true;
    }

    // Silent push with only badge update (no notification content)
    const message = {
      message: {
        token: token.token,
        apns: {
          headers: {
            "apns-push-type": "background",
            "apns-priority": "5", // Low priority for background
          },
          payload: {
            aps: {
              "content-available": 1,
              badge: badge,
            },
          },
        },
      },
    };

    const projectId = this.fcmServiceAccount.project_id;
    const url =
      `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });

      if (!response.ok) {
        const error = await response.json();
        if (
          error.error?.details?.some(
            (d: { errorCode?: string }) =>
              d.errorCode === "UNREGISTERED" ||
              d.errorCode === "INVALID_ARGUMENT",
          )
        ) {
          return false;
        }
        console.error("Badge reset FCM request failed", {
          error,
          status: response.status,
        });
      }

      return true;
    } catch (err) {
      console.error("Badge reset FCM request error", { err });
      return true;
    }
  }

  private async sendFcm(
    token: PushToken,
    payload: PushPayload,
    badgeCount: number,
  ): Promise<boolean> {
    if (!this.fcmServiceAccount) {
      console.warn("FCM service account not configured");
      return true; // Don't mark as invalid if not configured
    }

    const accessToken = await this.getFcmAccessToken();
    if (!accessToken) {
      return true; // Don't mark as invalid if we can't get a token
    }

    const notification = await this.buildNotificationContent(payload);

    // Build base message
    const message: FcmMessage = {
      message: {
        token: token.token,
        notification: {
          title: notification.title,
          body: notification.body,
        },
        data: {
          reason: payload.reason,
          author: payload.author,
          recordUri: payload.recordUri,
          ...(payload.reasonSubject &&
            { reasonSubject: payload.reasonSubject }),
        },
      },
    };

    // Add platform-specific options
    if (token.platform === "ios") {
      const threadId = this.getThreadId(payload);
      message.message.apns = {
        headers: {
          "apns-priority": "10",
        },
        payload: {
          aps: {
            sound: "default",
            badge: badgeCount,
            "thread-id": threadId,
          },
        },
      };
    } else if (token.platform === "android") {
      const threadId = this.getThreadId(payload);
      message.message.android = {
        priority: "high",
        notification: {
          tag: threadId,
        },
      };
    }

    const projectId = this.fcmServiceAccount.project_id;
    const url =
      `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });

      if (!response.ok) {
        const error = await response.json();
        // Check for unregistered token error
        if (
          error.error?.details?.some(
            (d: { errorCode?: string }) =>
              d.errorCode === "UNREGISTERED" ||
              d.errorCode === "INVALID_ARGUMENT",
          )
        ) {
          return false; // Mark as invalid
        }
        console.error("FCM request failed", {
          error,
          status: response.status,
        });
      }

      return true;
    } catch (err) {
      console.error("FCM request error", { err });
      return true; // Don't mark as invalid on network errors
    }
  }

  private async buildNotificationContent(
    payload: PushPayload,
  ): Promise<{ title: string; body: string }> {
    // Get author handle
    const author = await this.db.models.Actor.findOne({
      did: payload.author,
    }).lean();
    const handle = author?.handle ? `${author.handle}` : "Someone";

    // Handle follow notifications specially
    if (payload.reason === "follow") {
      // Check if recipient follows the author back (making this a "followed you back")
      const recipientFollowsAuthor = await this.db.models.Follow.findOne({
        authorDid: payload.recipientDid,
        subject: payload.author,
      }).lean();

      const body = recipientFollowsAuthor
        ? `${handle} followed you back`
        : `${handle} followed you`;

      return {
        title: "New Follower",
        body,
      };
    }

    // Build title based on reason
    const reasonMap: Record<string, string> = {
      like: "liked your post",
      repost: "reposted your post",
      mention: "mentioned you",
      reply: "replied to your post",
      "like-via-repost": "liked your repost",
      "repost-via-repost": "reposted your repost",
    };

    const action = reasonMap[payload.reason] || "interacted with your content";
    const title = `${handle} ${action}`;

    // Build body based on reason type
    let body = "";

    if (
      payload.reason === "like" || payload.reason === "repost" ||
      payload.reason === "like-via-repost" ||
      payload.reason === "repost-via-repost"
    ) {
      // For likes/reposts, show the reasonSubject (the post that was liked/reposted)
      if (payload.reasonSubject) {
        body = await this.getRecordText(payload.reasonSubject);
      }
    } else if (payload.reason === "reply" || payload.reason === "mention") {
      // For replies/mentions, show the record text (the reply or post with mention)
      body = await this.getRecordText(payload.recordUri);
    }

    return { title, body };
  }

  private async getRecordText(uri: string): Promise<string> {
    try {
      const record = await this.db.models.Record.findOne({ uri }).lean();
      if (!record?.json) return "";

      const parsed = jsonStringToLex(record.json) as {
        text?: string;
        caption?: { text?: string };
      };

      // Try to get text from different record formats
      const text = parsed.text || parsed.caption?.text || "";

      // Truncate to reasonable length for push notification
      if (text.length > 100) {
        return text.substring(0, 97) + "...";
      }
      return text;
    } catch {
      return "";
    }
  }

  private async getFcmAccessToken(): Promise<string | null> {
    if (!this.fcmServiceAccount) {
      return null;
    }

    // Return cached token if still valid
    if (this.fcmAccessToken && Date.now() < this.fcmTokenExpiry - 60000) {
      return this.fcmAccessToken;
    }

    try {
      const now = Math.floor(Date.now() / 1000);
      const exp = now + 3600; // 1 hour

      const header = {
        alg: "RS256",
        typ: "JWT",
      };

      const claim = {
        iss: this.fcmServiceAccount.client_email,
        scope: "https://www.googleapis.com/auth/firebase.messaging",
        aud: "https://oauth2.googleapis.com/token",
        iat: now,
        exp: exp,
      };

      // Create JWT
      const encoder = new TextEncoder();
      const headerB64 = this.base64UrlEncode(
        encoder.encode(JSON.stringify(header)),
      );
      const claimB64 = this.base64UrlEncode(
        encoder.encode(JSON.stringify(claim)),
      );
      const unsignedJwt = `${headerB64}.${claimB64}`;

      // Import private key and sign
      const privateKey = await this.importPrivateKey(
        this.fcmServiceAccount.private_key,
      );
      const signature = await crypto.subtle.sign(
        { name: "RSASSA-PKCS1-v1_5" },
        privateKey,
        encoder.encode(unsignedJwt),
      );

      const signatureB64 = this.base64UrlEncode(new Uint8Array(signature));
      const jwt = `${unsignedJwt}.${signatureB64}`;

      // Exchange JWT for access token
      const response = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
          assertion: jwt,
        }),
      });

      if (!response.ok) {
        console.error("Failed to get FCM access token", {
          status: response.status,
        });
        return null;
      }

      const data = await response.json();
      this.fcmAccessToken = data.access_token;
      this.fcmTokenExpiry = Date.now() + (data.expires_in * 1000);

      return this.fcmAccessToken;
    } catch (err) {
      console.error("Error getting FCM access token", { err });
      return null;
    }
  }

  private async importPrivateKey(pem: string): Promise<CryptoKey> {
    const pemContents = pem
      .replace("-----BEGIN PRIVATE KEY-----", "")
      .replace("-----END PRIVATE KEY-----", "")
      .replace(/\n/g, "");

    const binaryDer = Uint8Array.from(
      atob(pemContents),
      (c) => c.charCodeAt(0),
    );

    return await crypto.subtle.importKey(
      "pkcs8",
      binaryDer,
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["sign"],
    );
  }

  private base64UrlEncode(data: Uint8Array): string {
    const base64 = btoa(String.fromCharCode(...data));
    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }

  private getThreadId(payload: PushPayload): string {
    if (payload.reason === "follow") {
      return "follows";
    }
    if (payload.reasonSubject) {
      return payload.reasonSubject;
    }
    return payload.recordUri;
  }
}

// FCM message types
interface FcmMessage {
  message: {
    token: string;
    notification: {
      title: string;
      body: string;
    };
    data: Record<string, string>;
    android?: {
      priority: string;
      notification?: {
        tag?: string;
      };
    };
    apns?: {
      headers: Record<string, string>;
      payload: {
        aps: {
          sound?: string;
          badge?: number;
          "interruption-level"?: string;
          "relevance-score"?: number;
          "mutable-content"?: number;
          "thread-id"?: string;
        };
      };
    };
  };
}
