import { Logger } from "@logtape/logtape";
import { Database } from "./data-plane/db/index.ts";
import { DataPlane } from "./data-plane/index.ts";
import { Hydrator } from "./hydration/index.ts";
import { Views } from "./views/index.ts";
import { IdResolver } from "@atp/identity";
import { AuthVerifier } from "./auth-verifier.ts";

export type AppContext = {
  db: Database;
  dataplane: DataPlane;
  hydrator: Hydrator;
  views: Views;
  logger: Logger;
  idResolver: IdResolver;
  serviceDid: string;
  authVerifier: AuthVerifier;
};

export type AppEnv = {
  Bindings: AppContext;
  Variables: {
    did: string;
    isAdmin: boolean;
  };
};
