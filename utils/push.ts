import { getLogger, Logger } from "@logtape/logtape";
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
  apnsKeyId?: string;
  apnsTeamId?: string;
  apnsKeyPath?: string;
  apnsTopic?: string; // Bundle ID for iOS app
}

interface FcmServiceAccount {
  project_id: string;
  private_key: string;
  client_email: string;
}

export class PushService {
  private logger: Logger;
  private pushTokens: PushTokens;
  private db: Database;
  private config: PushConfig;
  private fcmAccessToken: string | null = null;
  private fcmTokenExpiry: number = 0;
  private fcmServiceAccount: FcmServiceAccount | null = null;
  private apnsPrivateKey: CryptoKey | null = null;

  constructor(pushTokens: PushTokens, db: Database, config: PushConfig) {
    this.logger = getLogger(["appview", "push"]);
    this.pushTokens = pushTokens;
    this.db = db;
    this.config = config;

    if (config.fcmServiceAccount) {
      try {
        this.fcmServiceAccount = JSON.parse(config.fcmServiceAccount);
      } catch {
        this.logger.error("Failed to parse FCM service account JSON");
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

    const invalidTokens: string[] = [];

    for (const token of tokens) {
      try {
        if (token.platform === "ios") {
          const success = await this.sendApns(token, payload);
          if (!success) {
            invalidTokens.push(token.token);
          }
        } else if (token.platform === "android") {
          const success = await this.sendFcm(token, payload);
          if (!success) {
            invalidTokens.push(token.token);
          }
        }
      } catch (err) {
        this.logger.error("Failed to send push notification", {
          err,
          platform: token.platform,
          did,
        });
      }
    }

    // Clean up invalid tokens
    if (invalidTokens.length > 0) {
      await this.pushTokens.deleteInvalidTokens(invalidTokens);
      this.logger.info("Removed invalid push tokens", {
        count: invalidTokens.length,
      });
    }
  }

  private async sendFcm(
    token: PushToken,
    payload: PushPayload,
  ): Promise<boolean> {
    if (!this.fcmServiceAccount) {
      this.logger.warn("FCM service account not configured");
      return true; // Don't mark as invalid if not configured
    }

    const accessToken = await this.getFcmAccessToken();
    if (!accessToken) {
      return true; // Don't mark as invalid if we can't get a token
    }

    const notification = await this.buildNotificationContent(payload);
    const message = {
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
        android: {
          priority: "high" as const,
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
        this.logger.error("FCM request failed", {
          error,
          status: response.status,
        });
      }

      return true;
    } catch (err) {
      this.logger.error("FCM request error", { err });
      return true; // Don't mark as invalid on network errors
    }
  }

  private async sendApns(
    token: PushToken,
    payload: PushPayload,
  ): Promise<boolean> {
    if (
      !this.config.apnsKeyId || !this.config.apnsTeamId ||
      !this.config.apnsKeyPath
    ) {
      this.logger.warn("APNs not fully configured");
      return true; // Don't mark as invalid if not configured
    }

    const jwt = await this.getApnsJwt();
    if (!jwt) {
      return true; // Don't mark as invalid if we can't get a JWT
    }

    const notification = await this.buildNotificationContent(payload);
    const apnsPayload = {
      aps: {
        alert: {
          title: notification.title,
          body: notification.body,
        },
        sound: "default",
        badge: 1,
      },
      reason: payload.reason,
      author: payload.author,
      recordUri: payload.recordUri,
      ...(payload.reasonSubject && { reasonSubject: payload.reasonSubject }),
    };

    const topic = this.config.apnsTopic || token.appId;
    const url = `https://api.push.apple.com/3/device/${token.token}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "authorization": `bearer ${jwt}`,
          "apns-topic": topic,
          "apns-push-type": "alert",
          "apns-priority": "10",
        },
        body: JSON.stringify(apnsPayload),
      });

      if (!response.ok) {
        const status = response.status;
        // 400 = Bad device token, 410 = Token is no longer active
        if (status === 400 || status === 410) {
          return false; // Mark as invalid
        }
        this.logger.error("APNs request failed", { status });
      }

      return true;
    } catch (err) {
      this.logger.error("APNs request error", { err });
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
        this.logger.error("Failed to get FCM access token", {
          status: response.status,
        });
        return null;
      }

      const data = await response.json();
      this.fcmAccessToken = data.access_token;
      this.fcmTokenExpiry = Date.now() + (data.expires_in * 1000);

      return this.fcmAccessToken;
    } catch (err) {
      this.logger.error("Error getting FCM access token", { err });
      return null;
    }
  }

  private async getApnsJwt(): Promise<string | null> {
    if (
      !this.config.apnsKeyId || !this.config.apnsTeamId ||
      !this.config.apnsKeyPath
    ) {
      return null;
    }

    try {
      // Load APNs private key if not already loaded
      if (!this.apnsPrivateKey) {
        const keyData = await Deno.readTextFile(this.config.apnsKeyPath);
        this.apnsPrivateKey = await this.importApnsKey(keyData);
      }

      const now = Math.floor(Date.now() / 1000);
      const header = {
        alg: "ES256",
        kid: this.config.apnsKeyId,
      };

      const claim = {
        iss: this.config.apnsTeamId,
        iat: now,
      };

      const encoder = new TextEncoder();
      const headerB64 = this.base64UrlEncode(
        encoder.encode(JSON.stringify(header)),
      );
      const claimB64 = this.base64UrlEncode(
        encoder.encode(JSON.stringify(claim)),
      );
      const unsignedJwt = `${headerB64}.${claimB64}`;

      const signature = await crypto.subtle.sign(
        { name: "ECDSA", hash: "SHA-256" },
        this.apnsPrivateKey,
        encoder.encode(unsignedJwt),
      );

      // Convert DER signature to raw format for JWT
      const signatureB64 = this.base64UrlEncode(new Uint8Array(signature));
      return `${unsignedJwt}.${signatureB64}`;
    } catch (err) {
      this.logger.error("Error creating APNs JWT", { err });
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

  private async importApnsKey(pem: string): Promise<CryptoKey> {
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
      { name: "ECDSA", namedCurve: "P-256" },
      false,
      ["sign"],
    );
  }

  private base64UrlEncode(data: Uint8Array): string {
    const base64 = btoa(String.fromCharCode(...data));
    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
}
