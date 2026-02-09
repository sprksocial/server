import { MongoMemoryServer } from "mongodb-memory-server-core";
import mongoose, { Connection } from "mongoose";
import * as models from "../data-plane/db/models.ts";
import { Hono } from "hono";
import { createApp } from "../main.ts";
import { AppContext, AppEnv } from "../context.ts";
import { Database } from "../data-plane/db/index.ts";
import { createAuthVerifier } from "../auth-verifier.ts";
import { getLogger } from "@logtape/logtape";
import { DataPlane } from "../data-plane/index.ts";
import { Hydrator } from "../hydration/index.ts";
import { Views } from "../views/index.ts";
import { IdResolver } from "@atp/identity";
import { ServerConfig, ServerConfigValues } from "../config.ts";
import { defaultLabelerHeader } from "../util.ts";
import { PushService } from "../utils/push.ts";

// Configure mongodb-memory-server to use a specific download directory
// This prevents issues with empty paths when running with restricted permissions
const downloadDir = Deno.env.get("MONGOMS_DOWNLOAD_DIR") ||
  `${Deno.env.get("HOME")}/.cache/mongodb-binaries`;
Deno.env.set("MONGOMS_DOWNLOAD_DIR", downloadDir);

// ============================================================================
// Test Data Options
// ============================================================================

export interface TestDataOptions {
  actors?: boolean;
  profiles?: boolean;
  posts?: boolean;
  replies?: boolean;
  stories?: boolean;
  likes?: boolean;
  reposts?: boolean;
  follows?: boolean;
  blocks?: boolean;
  audio?: boolean;
  generators?: boolean;
  preferences?: boolean;
  records?: boolean;
  actorSync?: boolean;
}

// ============================================================================
// Test Database Types
// ============================================================================

export interface TestDatabase {
  mongoServer: MongoMemoryServer;
  connection: Connection;
  models: models.DatabaseModels;
  cleanup: () => Promise<void>;
}

// ============================================================================
// Test App Types
// ============================================================================

export interface TestApp {
  app: Hono<AppEnv>;
  ctx: AppContext;
  cleanup: () => Promise<void>;
}

// ============================================================================
// Default Test Config
// ============================================================================

const DEFAULT_TEST_CONFIG: ServerConfigValues = {
  relayUrl: "http://localhost:8080",
  serverDid: "did:web:localhost",
  modServiceDid: "did:web:test",
  adminPasswords: ["test"],
  privateKey:
    "5676df35fd3a185a1771a43536635ad90057e0c0d1fd91436344bb50ce23a460",
  publicUrl: "http://localhost:4000",
  alternateAudienceDids: [],
  bigThreadUris: new Set(["did:web:test"]),
  maxThreadParents: 10,
  labelsFromIssuerDids: [],
  notificationsDelayMs: 1000,
  pushEnabled: false,
};

// ============================================================================
// Test Users
// ============================================================================

export const TEST_USERS = [
  { did: "did:plc:testuser1", handle: "alice.test" },
  { did: "did:plc:testuser2", handle: "bob.test" },
  { did: "did:plc:testuser3", handle: "charlie.test" },
  { did: "did:plc:testuser4", handle: "diana.test" },
] as const;

// ============================================================================
// Database Setup Functions
// ============================================================================

/**
 * Creates an in-memory MongoDB instance with fake sample data for testing
 * @param options - Options to control which data categories to create
 * @returns TestDatabase instance with connection and cleanup method
 */
export async function createTestDatabase(
  options: TestDataOptions = {},
): Promise<TestDatabase> {
  // Default to creating all data types
  const opts = {
    actors: true,
    profiles: true,
    posts: true,
    replies: true,
    stories: true,
    likes: true,
    reposts: true,
    follows: true,
    blocks: true,
    audio: true,
    generators: true,
    preferences: true,
    records: true,
    actorSync: true,
    ...options,
  };

  // Start MongoDB Memory Server
  const mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  // Create connection
  const connection = mongoose.createConnection(uri, {
    autoIndex: true,
    autoCreate: true,
  });

  // Initialize models
  const dbModels: models.DatabaseModels = {
    Record: connection.model<models.RecordDocument>(
      "Record",
      models.recordSchema,
    ),
    ArchivedRecord: connection.model<models.ArchivedRecordDocument>(
      "ArchivedRecord",
      models.archivedRecordSchema,
    ),
    DuplicateRecord: connection.model<models.DuplicateRecordDocument>(
      "DuplicateRecord",
      models.duplicateRecordSchema,
    ),
    Like: connection.model<models.LikeDocument>("Like", models.likeSchema),
    Post: connection.model<models.PostDocument>("Post", models.postSchema),
    Reply: connection.model<models.ReplyDocument>("Reply", models.replySchema),
    Story: connection.model<models.StoryDocument>("Story", models.storySchema),
    Follow: connection.model<models.FollowDocument>(
      "Follow",
      models.followSchema,
    ),
    Block: connection.model<models.BlockDocument>("Block", models.blockSchema),
    Profile: connection.model<models.ProfileDocument>(
      "Profile",
      models.profileSchema,
    ),
    Audio: connection.model<models.AudioDocument>("Audio", models.audioSchema),
    Repost: connection.model<models.RepostDocument>(
      "Repost",
      models.repostSchema,
    ),
    Generator: connection.model<models.GeneratorDocument>(
      "Generator",
      models.generatorSchema,
    ),
    Takedown: connection.model<models.TakedownDocument>(
      "Takedown",
      models.takedownSchema,
    ),
    RepoTakedown: connection.model<models.RepoTakedownDocument>(
      "RepoTakedown",
      models.repoTakedownSchema,
    ),
    BlobTakedown: connection.model<models.BlobTakedownDocument>(
      "BlobTakedown",
      models.blobTakedownSchema,
    ),
    Actor: connection.model<models.ActorDocument>("Actor", models.actorSchema),
    ActorSync: connection.model<models.ActorSyncDocument>(
      "ActorSync",
      models.actorSyncSchema,
    ),
    Preference: connection.model<models.PreferenceDocument>(
      "Preference",
      models.preferenceSchema,
    ),
    CursorState: connection.model<models.CursorStateDocument>(
      "CursorState",
      models.cursorStateSchema,
    ),
    Labeler: connection.model<models.LabelerDocument>(
      "Labeler",
      models.labelerSchema,
    ),
    Label: connection.model<models.LabelDocument>(
      "Label",
      models.labelSchema,
    ),
    Notification: connection.model<models.NotificationDocument>(
      "Notification",
      models.notificationSchema,
    ),
    PushToken: connection.model<models.PushTokenDocument>(
      "PushToken",
      models.pushTokenSchema,
    ),
  };

  // Seed data
  await seedTestData(dbModels, opts);

  const cleanup = async () => {
    try {
      await connection.close();
    } catch (_err) {
      // Ignore close errors
    }
    await mongoServer.stop();
  };

  return {
    mongoServer,
    connection,
    models: dbModels,
    cleanup,
  };
}

/**
 * Helper function to get a test database URI without creating the full database
 * Useful for testing Database class initialization
 */
export async function getTestDatabaseUri(): Promise<{
  uri: string;
  cleanup: () => Promise<void>;
}> {
  const mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  const cleanup = async () => {
    await mongoServer.stop();
  };

  return { uri, cleanup };
}

// ============================================================================
// App Setup Functions
// ============================================================================

/**
 * Creates a mock context for testing without a real database connection
 * @param configOverrides - Optional config values to override defaults
 * @returns AppContext instance with mock database
 */
export function createMockContext(
  configOverrides: Partial<ServerConfigValues> = {},
): AppContext {
  const cfg = new ServerConfig({ ...DEFAULT_TEST_CONFIG, ...configOverrides });
  const appLogger = getLogger(["appview"]);
  const idResolver = new IdResolver();

  // Create mock database that doesn't actually connect
  const mockDb = {
    connect: () => Promise.resolve(),
    disconnect: () => Promise.resolve(),
    ping: () => Promise.resolve(),
    models: {},
    getCursorState: () => Promise.resolve(null),
    saveCursorState: () => Promise.resolve(),
    idResolver,
  } as unknown as Database;

  const dataplane = new DataPlane(mockDb, idResolver);
  const hydrator = new Hydrator(dataplane, cfg.labelsFromIssuerDids);
  const views = new Views(cfg);
  const authVerifier = createAuthVerifier(dataplane, {
    ownDid: cfg.serverDid,
    alternateAudienceDids: cfg.alternateAudienceDids,
    modServiceDid: cfg.modServiceDid,
    adminPasses: cfg.adminPasswords,
  });
  const pushService = new PushService(dataplane.pushTokens, mockDb, {
    enabled: cfg.pushEnabled,
    fcmServiceAccount: cfg.fcmServiceAccount,
  });

  return {
    db: mockDb,
    dataplane,
    hydrator,
    views,
    logger: appLogger,
    idResolver,
    cfg,
    authVerifier,
    reqLabelers: () => defaultLabelerHeader(cfg.labelsFromIssuerDids),
    pushService,
  };
}

/**
 * Creates a full test context with an in-memory MongoDB database
 * @param options - Options to control test data seeding
 * @param configOverrides - Optional config values to override defaults
 * @returns AppContext instance with real database and cleanup function
 */
export async function createTestContext(
  options: TestDataOptions = {},
  configOverrides: Partial<ServerConfigValues> = {},
): Promise<{ ctx: AppContext; cleanup: () => Promise<void> }> {
  const testDb = await createTestDatabase(options);
  const cfg = new ServerConfig({ ...DEFAULT_TEST_CONFIG, ...configOverrides });
  const appLogger = getLogger(["appview"]);
  const idResolver = new IdResolver();

  // Create a wrapper Database object that uses the test connection and models
  const db = {
    connection: testDb.connection,
    models: testDb.models,
    idResolver,
    logger: getLogger(["appview", "database"]),
    connect: () => Promise.resolve(),
    disconnect: async () => {
      await testDb.cleanup();
    },
    getCursorState: async () => {
      const cursorState = await testDb.models.CursorState.findOne({
        identifier: "last_processed_cursor",
      });
      return cursorState?.cursorValue || null;
    },
    saveCursorState: async (cursorPosition: number) => {
      await testDb.models.CursorState.findOneAndUpdate(
        { identifier: "last_processed_cursor" },
        {
          cursorValue: cursorPosition,
          updatedAt: new Date(),
        },
        { upsert: true },
      );
    },
    resolveHandle: async (handle: string) => {
      return await idResolver.handle.resolve(handle);
    },
    resolveDid: async (did: string) => {
      const data = await idResolver.did.resolveAtprotoData(did);
      return { did: data.did, handle: data.handle };
    },
    getIdentityByDid: async ({ did }: { did: string }) => {
      const doc = await idResolver.did.resolve(did);
      if (!doc) throw new Error("DID not found");
      return { did };
    },
  } as unknown as Database;

  const dataplane = new DataPlane(db, idResolver);
  const hydrator = new Hydrator(dataplane, cfg.labelsFromIssuerDids);
  const views = new Views(cfg);
  const authVerifier = createAuthVerifier(dataplane, {
    ownDid: cfg.serverDid,
    alternateAudienceDids: cfg.alternateAudienceDids,
    modServiceDid: cfg.modServiceDid,
    adminPasses: cfg.adminPasswords,
  });
  const pushService = new PushService(dataplane.pushTokens, db, {
    enabled: cfg.pushEnabled,
    fcmServiceAccount: cfg.fcmServiceAccount,
  });

  const ctx: AppContext = {
    db,
    dataplane,
    hydrator,
    views,
    logger: appLogger,
    idResolver,
    cfg,
    authVerifier,
    reqLabelers: () => defaultLabelerHeader(cfg.labelsFromIssuerDids),
    pushService,
  };

  const cleanup = async () => {
    await testDb.cleanup();
  };

  return { ctx, cleanup };
}

/**
 * Creates a full test app with an in-memory MongoDB database
 * This is the primary function to use for integration tests
 * @param options - Options to control test data seeding
 * @param configOverrides - Optional config values to override defaults
 * @returns TestApp instance with app, context, and cleanup function
 */
export async function createTestApp(
  options: TestDataOptions = {},
  configOverrides: Partial<ServerConfigValues> = {},
): Promise<TestApp> {
  const { ctx, cleanup } = await createTestContext(options, configOverrides);
  const app = createApp(ctx);

  return {
    app,
    ctx,
    cleanup,
  };
}

/**
 * Creates a test app with a mock database (no real MongoDB connection)
 * Useful for testing routes that don't require database access
 * @param configOverrides - Optional config values to override defaults
 * @returns Hono app instance with mock context
 */
export function createMockApp(
  configOverrides: Partial<ServerConfigValues> = {},
): Hono<AppEnv> {
  const ctx = createMockContext(configOverrides);
  return createApp(ctx);
}

// ============================================================================
// Test Data Seeding
// ============================================================================

/**
 * Seeds the test database with fake sample data
 */
async function seedTestData(
  models: models.DatabaseModels,
  options: Required<TestDataOptions>,
): Promise<void> {
  const now = new Date().toISOString();
  const baseCid = "bafyreihivhfhv6rh4x4a4znkqrvqwp5xw4xvqjq";

  // Create Actors
  if (options.actors) {
    for (const user of TEST_USERS) {
      await models.Actor.create({
        did: user.did,
        handle: user.handle,
        indexedAt: now,
        takedownRef: "",
        upstreamStatus: "active",
        keys: JSON.stringify({ signing: "key123" }),
        services: JSON.stringify({ pds: "https://pds.test" }),
      });
    }
  }

  // Create ActorSync records
  if (options.actorSync) {
    for (const user of TEST_USERS) {
      await models.ActorSync.create({
        did: user.did,
        commitCid: `${baseCid}commit${user.did.slice(-1)}`,
        repoRev: "rev123",
      });
    }
  }

  // Create Profiles
  if (options.profiles) {
    await models.Profile.create({
      uri: `at://${TEST_USERS[0].did}/app.bsky.actor.profile/self`,
      cid: `${baseCid}profile1`,
      authorDid: TEST_USERS[0].did,
      createdAt: now,
      indexedAt: now,
      displayName: "Alice",
      description: "Software engineer and coffee enthusiast",
      avatar: {
        $type: "blob",
        ref: { $link: `${baseCid}avatar1` },
        mimeType: "image/jpeg",
        size: 50000,
      },
      banner: {
        $type: "blob",
        ref: { $link: `${baseCid}banner1` },
        mimeType: "image/jpeg",
        size: 100000,
      },
      labels: [],
      pinnedPost: "",
      postsCount: 5,
      followersCount: 100,
      followsCount: 50,
    });

    await models.Profile.create({
      uri: `at://${TEST_USERS[1].did}/app.bsky.actor.profile/self`,
      cid: `${baseCid}profile2`,
      authorDid: TEST_USERS[1].did,
      createdAt: now,
      indexedAt: now,
      displayName: "Bob",
      description: "Music lover and tech geek",
      labels: [],
      pinnedPost: "",
      postsCount: 3,
      followersCount: 75,
      followsCount: 80,
    });

    await models.Profile.create({
      uri: `at://${TEST_USERS[2].did}/app.bsky.actor.profile/self`,
      cid: `${baseCid}profile3`,
      authorDid: TEST_USERS[2].did,
      createdAt: now,
      indexedAt: now,
      displayName: "Charlie",
      description: "Adventure seeker",
      labels: [],
      pinnedPost: "",
      postsCount: 10,
      followersCount: 200,
      followsCount: 150,
    });
  }

  // Create Audio
  const audioUris: string[] = [];
  if (options.audio) {
    const audio1 = await models.Audio.create({
      uri: `at://${TEST_USERS[1].did}/app.sprk.audio/audio1`,
      cid: `${baseCid}audio1`,
      authorDid: TEST_USERS[1].did,
      createdAt: now,
      indexedAt: now,
      sound: {
        $type: "blob",
        ref: { $link: `${baseCid}sound1` },
        mimeType: "audio/mpeg",
        size: 1000000,
      },
      origin: "original",
      title: "Chill Beats",
      details: "Relaxing music for coding",
      labels: [],
      useCount: 10,
    });
    audioUris.push(audio1.uri);

    const audio2 = await models.Audio.create({
      uri: `at://${TEST_USERS[1].did}/app.sprk.audio/audio2`,
      cid: `${baseCid}audio2`,
      authorDid: TEST_USERS[1].did,
      createdAt: now,
      indexedAt: now,
      sound: {
        $type: "blob",
        ref: { $link: `${baseCid}sound2` },
        mimeType: "audio/mpeg",
        size: 800000,
      },
      origin: "original",
      title: "Summer Vibes",
      details: "Upbeat summer track",
      labels: [],
      useCount: 5,
    });
    audioUris.push(audio2.uri);
  }

  // Create Posts
  const postUris: string[] = [];
  if (options.posts) {
    const post1 = await models.Post.create({
      uri: `at://${TEST_USERS[0].did}/app.sprk.post/post1`,
      cid: `${baseCid}post1`,
      authorDid: TEST_USERS[0].did,
      createdAt: now,
      indexedAt: now,
      caption: {
        text: "Just posted my first video! #excited",
        facets: [
          {
            index: { byteStart: 30, byteEnd: 38 },
            features: [{
              $type: "app.bsky.richtext.facet#tag",
              tag: "excited",
            }],
          },
        ],
      },
      media: {
        $type: "app.sprk.post#videoMedia",
        video: {
          $type: "blob",
          ref: { $link: `${baseCid}video1` },
          alt: "My first video",
          aspectRatio: { width: 1080, height: 1920 },
          mimeType: "video/mp4",
          size: 5000000,
        },
      },
      sound: audioUris.length > 0
        ? { uri: audioUris[0], cid: `${baseCid}audio1` }
        : undefined,
      langs: ["en"],
      labels: [],
      tags: ["excited"],
      likeCount: 25,
      replyCount: 3,
      repostCount: 5,
    });
    postUris.push(post1.uri);

    const post2 = await models.Post.create({
      uri: `at://${TEST_USERS[2].did}/app.sprk.post/post2`,
      cid: `${baseCid}post2`,
      authorDid: TEST_USERS[2].did,
      createdAt: now,
      indexedAt: now,
      caption: {
        text: "Check out these amazing photos from my hike!",
        facets: [],
      },
      media: {
        $type: "app.sprk.post#imageMedia",
        images: [
          {
            $type: "blob",
            ref: { $link: `${baseCid}img1` },
            alt: "Mountain view",
            aspectRatio: { width: 4, height: 3 },
            mimeType: "image/jpeg",
            size: 200000,
          },
          {
            $type: "blob",
            ref: { $link: `${baseCid}img2` },
            alt: "Trail path",
            aspectRatio: { width: 4, height: 3 },
            mimeType: "image/jpeg",
            size: 180000,
          },
        ],
      },
      langs: ["en"],
      labels: [],
      tags: [],
      likeCount: 50,
      replyCount: 8,
      repostCount: 12,
    });
    postUris.push(post2.uri);

    const post3 = await models.Post.create({
      uri: `at://${TEST_USERS[1].did}/app.sprk.post/post3`,
      cid: `${baseCid}post3`,
      authorDid: TEST_USERS[1].did,
      createdAt: now,
      indexedAt: now,
      caption: {
        text: "Simple text post without media",
        facets: [],
      },
      langs: ["en"],
      labels: [],
      tags: [],
      likeCount: 10,
      replyCount: 2,
      repostCount: 1,
    });
    postUris.push(post3.uri);
  }

  // Create Replies
  if (options.replies && postUris.length > 0) {
    await models.Reply.create({
      uri: `at://${TEST_USERS[1].did}/app.sprk.reply/reply1`,
      cid: `${baseCid}reply1`,
      authorDid: TEST_USERS[1].did,
      createdAt: now,
      indexedAt: now,
      text: "This is awesome!",
      facets: [],
      reply: {
        root: { uri: postUris[0], cid: `${baseCid}post1` },
        parent: { uri: postUris[0], cid: `${baseCid}post1` },
      },
      langs: ["en"],
      labels: [],
      likeCount: 5,
      replyCount: 0,
    });

    await models.Reply.create({
      uri: `at://${TEST_USERS[2].did}/app.sprk.reply/reply2`,
      cid: `${baseCid}reply2`,
      authorDid: TEST_USERS[2].did,
      createdAt: now,
      indexedAt: now,
      text: "Great content!",
      facets: [],
      reply: {
        root: { uri: postUris[0], cid: `${baseCid}post1` },
        parent: { uri: postUris[0], cid: `${baseCid}post1` },
      },
      media: {
        $type: "app.sprk.reply#imageMedia",
        images: [
          {
            $type: "blob",
            ref: { $link: `${baseCid}replyimg1` },
            alt: "Reply image",
            aspectRatio: { width: 1, height: 1 },
            mimeType: "image/jpeg",
            size: 100000,
          },
        ],
      },
      langs: ["en"],
      labels: [],
      likeCount: 3,
      replyCount: 0,
    });
  }

  // Create Stories
  if (options.stories) {
    await models.Story.create({
      uri: `at://${TEST_USERS[0].did}/app.sprk.story/story1`,
      cid: `${baseCid}story1`,
      authorDid: TEST_USERS[0].did,
      createdAt: now,
      indexedAt: now,
      media: {
        $type: "app.sprk.story#videoMedia",
        video: {
          $type: "blob",
          ref: { $link: `${baseCid}storyvid1` },
          alt: "Story video",
          aspectRatio: { width: 1080, height: 1920 },
          mimeType: "video/mp4",
          size: 3000000,
        },
      },
      sound: audioUris.length > 0
        ? { uri: audioUris[1], cid: `${baseCid}audio2` }
        : undefined,
      labels: [],
    });

    await models.Story.create({
      uri: `at://${TEST_USERS[2].did}/app.sprk.story/story2`,
      cid: `${baseCid}story2`,
      authorDid: TEST_USERS[2].did,
      createdAt: now,
      indexedAt: now,
      media: {
        $type: "app.sprk.story#imageMedia",
        image: {
          $type: "blob",
          ref: { $link: `${baseCid}storyimg1` },
          alt: "Story image",
          aspectRatio: { width: 1080, height: 1920 },
          mimeType: "image/jpeg",
          size: 250000,
        },
      },
      labels: [],
    });
  }

  // Create Likes
  if (options.likes && postUris.length > 0) {
    await models.Like.create({
      uri: `at://${TEST_USERS[1].did}/app.bsky.feed.like/like1`,
      cid: `${baseCid}like1`,
      authorDid: TEST_USERS[1].did,
      createdAt: now,
      indexedAt: now,
      subject: postUris[0],
      subjectCid: `${baseCid}post1`,
    });

    await models.Like.create({
      uri: `at://${TEST_USERS[2].did}/app.bsky.feed.like/like2`,
      cid: `${baseCid}like2`,
      authorDid: TEST_USERS[2].did,
      createdAt: now,
      indexedAt: now,
      subject: postUris[0],
      subjectCid: `${baseCid}post1`,
    });

    await models.Like.create({
      uri: `at://${TEST_USERS[0].did}/app.bsky.feed.like/like3`,
      cid: `${baseCid}like3`,
      authorDid: TEST_USERS[0].did,
      createdAt: now,
      indexedAt: now,
      subject: postUris[1],
      subjectCid: `${baseCid}post2`,
    });
  }

  // Create Reposts
  if (options.reposts && postUris.length > 0) {
    await models.Repost.create({
      uri: `at://${TEST_USERS[1].did}/app.bsky.feed.repost/repost1`,
      cid: `${baseCid}repost1`,
      authorDid: TEST_USERS[1].did,
      createdAt: now,
      indexedAt: now,
      subject: postUris[0],
      subjectCid: `${baseCid}post1`,
    });

    await models.Repost.create({
      uri: `at://${TEST_USERS[3].did}/app.bsky.feed.repost/repost2`,
      cid: `${baseCid}repost2`,
      authorDid: TEST_USERS[3].did,
      createdAt: now,
      indexedAt: now,
      subject: postUris[1],
      subjectCid: `${baseCid}post2`,
    });
  }

  // Create Follows
  if (options.follows) {
    // Alice follows Bob
    await models.Follow.create({
      uri: `at://${TEST_USERS[0].did}/app.bsky.graph.follow/follow1`,
      cid: `${baseCid}follow1`,
      authorDid: TEST_USERS[0].did,
      createdAt: now,
      indexedAt: now,
      subject: TEST_USERS[1].did,
    });

    // Bob follows Alice
    await models.Follow.create({
      uri: `at://${TEST_USERS[1].did}/app.bsky.graph.follow/follow2`,
      cid: `${baseCid}follow2`,
      authorDid: TEST_USERS[1].did,
      createdAt: now,
      indexedAt: now,
      subject: TEST_USERS[0].did,
    });

    // Charlie follows Alice
    await models.Follow.create({
      uri: `at://${TEST_USERS[2].did}/app.bsky.graph.follow/follow3`,
      cid: `${baseCid}follow3`,
      authorDid: TEST_USERS[2].did,
      createdAt: now,
      indexedAt: now,
      subject: TEST_USERS[0].did,
    });

    // Alice follows Charlie
    await models.Follow.create({
      uri: `at://${TEST_USERS[0].did}/app.bsky.graph.follow/follow4`,
      cid: `${baseCid}follow4`,
      authorDid: TEST_USERS[0].did,
      createdAt: now,
      indexedAt: now,
      subject: TEST_USERS[2].did,
    });
  }

  // Create Blocks
  if (options.blocks) {
    await models.Block.create({
      uri: `at://${TEST_USERS[0].did}/app.bsky.graph.block/block1`,
      cid: `${baseCid}block1`,
      authorDid: TEST_USERS[0].did,
      createdAt: now,
      indexedAt: now,
      subject: TEST_USERS[3].did,
    });
  }

  // Create Generators
  if (options.generators) {
    await models.Generator.create({
      uri: `at://${TEST_USERS[0].did}/app.bsky.feed.generator/gen1`,
      cid: `${baseCid}gen1`,
      authorDid: TEST_USERS[0].did,
      createdAt: now,
      indexedAt: now,
      displayName: "Trending Videos",
      description: "Hot video content from the community",
      descriptionFacets: [],
      avatar: {
        $type: "blob",
        ref: { $link: `${baseCid}genav1` },
        mimeType: "image/png",
        size: 40000,
      },
      acceptsInteractions: true,
      labels: [],
      likeCount: 150,
    });

    await models.Generator.create({
      uri: `at://${TEST_USERS[2].did}/app.bsky.feed.generator/gen2`,
      cid: `${baseCid}gen2`,
      authorDid: TEST_USERS[2].did,
      createdAt: now,
      indexedAt: now,
      displayName: "Nature & Adventure",
      description: "Outdoor content and adventure videos",
      descriptionFacets: [],
      acceptsInteractions: true,
      labels: [],
      likeCount: 80,
    });
  }

  // Create Preferences
  if (options.preferences) {
    await models.Preference.create({
      userDid: TEST_USERS[0].did,
      contentLabelPrefs: JSON.stringify({
        labelerDids: [],
        labels: {},
      }),
      savedFeeds: JSON.stringify([]),
      personalDetailsPref: JSON.stringify({}),
      feedViewPrefs: JSON.stringify({}),
      threadViewPref: JSON.stringify({}),
      interestsPref: JSON.stringify({ tags: ["tech", "music"] }),
      mutedWordsPref: JSON.stringify([]),
      hiddenPostsPref: JSON.stringify([]),
      labelersPref: JSON.stringify([]),
      postInteractionSettingsPref: JSON.stringify({}),
      createdAt: now,
      updatedAt: now,
    });

    await models.Preference.create({
      userDid: TEST_USERS[1].did,
      contentLabelPrefs: JSON.stringify({
        labelerDids: [],
        labels: {},
      }),
      savedFeeds: JSON.stringify([]),
      personalDetailsPref: JSON.stringify({}),
      feedViewPrefs: JSON.stringify({}),
      threadViewPref: JSON.stringify({}),
      interestsPref: JSON.stringify({ tags: ["music", "art"] }),
      mutedWordsPref: JSON.stringify([]),
      hiddenPostsPref: JSON.stringify([]),
      labelersPref: JSON.stringify([]),
      postInteractionSettingsPref: JSON.stringify({}),
      createdAt: now,
      updatedAt: now,
    });
  }

  // Create Records
  if (options.records && postUris.length > 0) {
    await models.Record.create({
      uri: postUris[0],
      cid: `${baseCid}post1`,
      did: TEST_USERS[0].did,
      collectionName: "app.sprk.post",
      rkey: "post1",
      createdAt: now,
      indexedAt: now,
      json: JSON.stringify({
        $type: "app.sprk.post",
        caption: { text: "Just posted my first video! #excited" },
        createdAt: now,
      }),
      takenDown: false,
      takedownRef: "",
    });

    await models.Record.create({
      uri: postUris[1],
      cid: `${baseCid}post2`,
      did: TEST_USERS[2].did,
      collectionName: "app.sprk.post",
      rkey: "post2",
      createdAt: now,
      indexedAt: now,
      json: JSON.stringify({
        $type: "app.sprk.post",
        caption: { text: "Check out these amazing photos from my hike!" },
        createdAt: now,
      }),
      takenDown: false,
      takedownRef: "",
    });
  }
}
