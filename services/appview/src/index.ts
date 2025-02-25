import { createDb, migrateToLatest } from "./db";
import { createClient } from "./auth/client";
import { isValidHandle } from "@atproto/syntax";
import { pino } from "pino";
import { Database } from "./db";
import { createIngester } from "./ingester";
import {
  BidirectionalResolver,
  createBidirectionalResolver,
  createIdResolver,
} from "./id-resolver";
import type { OAuthClient } from "@atproto/oauth-client-node";
import { Firehose } from "@atproto/sync";
import { getIronSession } from "iron-session";
import { env } from "./env";
import assert from "node:assert";
import express from "express";

export type AppContext = {
  db: Database;
  ingester: Firehose;
  logger: pino.Logger;
  oauthClient: OAuthClient;
  resolver: BidirectionalResolver;
};

type Session = { did: string };

export class Server {
  constructor(public app: express.Application, public ctx: AppContext) {}

  static async create() {
    const express = require("express");
    const logger = pino({ name: "server start" });

    const db = createDb();
    await migrateToLatest(db);

    const oauthClient = await createClient(db);
    const baseIdResolver = createIdResolver();
    const ingester = createIngester(db, baseIdResolver);
    const resolver = createBidirectionalResolver(baseIdResolver);

    const ctx = {
      db,
      ingester,
      logger,
      oauthClient,
      resolver,
    };

    // Subscribe to events on the firehose
    ingester.start();

    const app = express();
    app.use(express.json());

    app.get("/login", async (req: express.Request, res: express.Response) => {
      // const handle = req.body.handle;

      const handle = req.query.handle?.toString() || "";

      if (!isValidHandle(handle)) {
        return res.status(400).json({ error: "Invalid handle" });
      }

      const url = await oauthClient.authorize(handle, {
        scope: "atproto transition:generic",
      });
      return res.redirect(url.toString());
    });

    app.get(
      "/oauth/callback",
      async (req: express.Request, res: express.Response) => {
        const params = new URLSearchParams(req.originalUrl.split("?")[1]);
        try {
          const { session } = await ctx.oauthClient.callback(params);
          const clientSession = await getIronSession<Session>(req, res, {
            cookieName: "sid",
            password: env.COOKIE_SECRET,
          });
          assert(!clientSession.did, "session already exists");
          clientSession.did = session.did;
          await clientSession.save();
        } catch (err) {
          ctx.logger.error({ err }, "oauth callback failed");
          return res.redirect("/?error");
        }
        return res.redirect("/");
      }
    );

    app.get("/session", async (req: express.Request, res: express.Response) => {
      const clientSession = await getIronSession<Session>(req, res, {
        cookieName: "sid",
        password: env.COOKIE_SECRET,
      });
      const session = clientSession.did;
      res.send(session);
    });

    app.get("/", (req: express.Request, res: express.Response) => {
      res.header("Content-Type", "text/plain");
      res.send("Hello Express");
    });

    const server = app.listen(3000, () => {
      logger.info(`Server running on port http://localhost:3000`);
    });

    return new Server(server, ctx);
  }

  async close() {
    this.ctx.logger.info("sigint received, shutting down");
    await this.ctx.ingester.destroy();
    // return new Promise<void>((resolve) => {
    //   this.server.close(() => {
    //     this.ctx.logger.info("server closed");
    //     resolve();
    //   });
    // });
  }
}
const run = async () => {
  const server = await Server.create();

  // const onCloseSignal = async () => {
  //   setTimeout(() => process.exit(1), 10000).unref(); // Force shutdown after 10s
  //   await server.close();
  //   process.exit();
  // };

  // process.on("SIGINT", onCloseSignal);
  // process.on("SIGTERM", onCloseSignal);
};

run();
