import { assertEquals } from "@std/assert";
import type { Server } from "@atp/xrpc-server";

import type { AppContext } from "../context.ts";
import type { PreferenceDocument } from "../data-plane/db/models.ts";
import getPreferences from "../api/so/sprk/actor/getPreferences.ts";
import putPreferences from "../api/so/sprk/actor/putPreferences.ts";

interface Auth {
  credentials: {
    iss: string;
  };
}

interface PutPreferencesArgs {
  auth: Auth;
  input: {
    body: {
      preferences: Array<{
        $type: string;
        enabled: boolean;
      }>;
    };
  };
}

interface GetPreferencesArgs {
  auth: Auth;
}

type PutPreferencesHandler = (args: PutPreferencesArgs) => Promise<void>;
type GetPreferencesHandler = (args: GetPreferencesArgs) => Promise<{
  encoding: string;
  body: {
    preferences: unknown[];
  };
}>;

function handlerServer<Handler>(
  setHandler: (handler: Handler) => void,
): Server {
  return {
    add: (
      _method: unknown,
      implementation: { handler: Handler },
    ) => setHandler(implementation.handler),
  } as unknown as Server;
}

Deno.test("Spark adult content preference round-trips when disabled", async () => {
  const userDid = "did:plc:testuser";
  let storedPreferences: Partial<PreferenceDocument> = {};

  const ctx = {
    authVerifier: {
      standard: {},
    },
    dataplane: {
      preferences: {
        putPreferences: (
          did: string,
          preferences: Partial<PreferenceDocument>,
        ) => {
          assertEquals(did, userDid);
          storedPreferences = preferences;
          return Promise.resolve();
        },
        getPreferences: (did: string) => {
          assertEquals(did, userDid);
          return Promise.resolve({
            userDid,
            createdAt: "2026-08-09T00:00:00.000Z",
            updatedAt: "2026-08-09T00:00:00.000Z",
            ...storedPreferences,
          });
        },
      },
    },
  } as unknown as AppContext;

  let putHandler: PutPreferencesHandler = () =>
    Promise.reject(new Error("putPreferences handler was not registered"));
  putPreferences(
    handlerServer((handler: PutPreferencesHandler) => putHandler = handler),
    ctx,
  );

  await putHandler({
    auth: { credentials: { iss: userDid } },
    input: {
      body: {
        preferences: [{
          $type: "so.sprk.actor.defs#adultContentPref",
          enabled: false,
        }],
      },
    },
  });

  assertEquals(storedPreferences.adultContentPref, { enabled: false });

  let getHandler: GetPreferencesHandler = () =>
    Promise.reject(new Error("getPreferences handler was not registered"));
  getPreferences(
    handlerServer((handler: GetPreferencesHandler) => getHandler = handler),
    ctx,
  );

  const response = await getHandler({
    auth: { credentials: { iss: userDid } },
  });

  assertEquals(response.body.preferences, [{
    $type: "so.sprk.actor.defs#adultContentPref",
    enabled: false,
  }]);
});
