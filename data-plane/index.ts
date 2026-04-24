import { IdResolver } from "@atp/identity";
import { Database } from "./db/index.ts";
import { Blocks } from "./routes/blocks.ts";
import { FeedGens } from "./routes/feed-gens.ts";
import { Feeds } from "./routes/feeds.ts";
import { Follows } from "./routes/follows.ts";
import { Likes } from "./routes/likes.ts";
import { Moderation } from "./routes/moderation.ts";
import { Actors } from "./routes/actors.ts";
import { Identity } from "./routes/identity.ts";
import { Notifications } from "./routes/notifs.ts";
import { Records } from "./routes/records.ts";
import { Relationships } from "./routes/relationships.ts";
import { Interactions } from "./routes/interactions.ts";
import { Reposts } from "./routes/reposts.ts";
import { Sounds } from "./routes/sounds.ts";
import { Stories } from "./routes/stories.ts";
import { Sync } from "./routes/sync.ts";
import { Threads } from "./routes/threads.ts";
import { Preferences } from "./routes/preferences.ts";
import { Search } from "./routes/search.ts";
import { Labels } from "./routes/labels.ts";
import { PushTokens } from "./routes/push-tokens.ts";
import { CrosspostThread } from "./routes/crosspost-threads.ts";

export type ServerContext = {
  db: Database;
  idResolver?: IdResolver;
};

export class DataPlane {
  private db: Database;
  private idResolver?: IdResolver;

  // Route handlers as root-level properties
  public blocks: Blocks;
  public feedGens: FeedGens;
  public feeds: Feeds;
  public follows: Follows;
  public likes: Likes;
  public moderation: Moderation;
  public actors: Actors;
  public identity: Identity;
  public notifications: Notifications;
  public records: Records;
  public relationships: Relationships;
  public interactions: Interactions;
  public reposts: Reposts;
  public sounds: Sounds;
  public stories: Stories;
  public sync: Sync;
  public threads: Threads;
  public preferences: Preferences;
  public search: Search;
  public labels: Labels;
  public pushTokens: PushTokens;
  public crosspostThread: CrosspostThread;

  constructor(
    db: Database,
    idResolver?: IdResolver,
  ) {
    this.db = db;
    this.idResolver = idResolver;

    // Initialize all route handlers
    this.blocks = new Blocks(db);
    this.feedGens = new FeedGens(db);
    this.feeds = new Feeds(db);
    this.follows = new Follows(db);
    this.likes = new Likes(db);
    this.moderation = new Moderation(db);
    this.actors = new Actors(db);
    this.identity = new Identity(idResolver);
    this.notifications = new Notifications(db);
    this.records = new Records(db);
    this.relationships = new Relationships(db);
    this.interactions = new Interactions(db);
    this.reposts = new Reposts(db);
    this.sounds = new Sounds(db);
    this.stories = new Stories(db);
    this.sync = new Sync(db);
    this.threads = new Threads(db);
    this.preferences = new Preferences(db);
    this.search = new Search(db);
    this.labels = new Labels(db);
    this.pushTokens = new PushTokens(db);
    this.crosspostThread = new CrosspostThread(db);
  }
}
