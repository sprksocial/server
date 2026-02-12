import { Database } from "./data-plane/db/index.ts";
import { DataPlane } from "./data-plane/index.ts";
import { Hydrator } from "./hydration/index.ts";
import { Views } from "./views/index.ts";
import { IdResolver } from "@atp/identity";
import { AuthVerifier } from "./auth-verifier.ts";
import { ServerConfig } from "./config.ts";
import { ParsedLabelers } from "./util.ts";
import { PushService } from "./utils/push.ts";

export type AppContext = {
  db: Database;
  dataplane: DataPlane;
  hydrator: Hydrator;
  views: Views;
  idResolver: IdResolver;
  authVerifier: AuthVerifier;
  cfg: ServerConfig;
  reqLabelers: (req: Request) => ParsedLabelers;
  pushService: PushService;
};

export type AppEnv = {
  Bindings: AppContext;
  Variables: {
    did: string;
    isAdmin: boolean;
  };
};
