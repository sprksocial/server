import { Hono } from "hono";
import { formatMultikey, Secp256k1Keypair } from "@atp/crypto";
import { AppEnv } from "../context.ts";

const app = new Hono<AppEnv>();

app.get("/did.json", (c) => {
  const did = c.env.cfg.serverDid;
  const keypair = Secp256k1Keypair.import(
    c.env.cfg.privateKey,
  );
  const multikey = formatMultikey(keypair.jwtAlg, keypair.publicKeyBytes());

  return c.json({
    "@context": [
      "https://www.w3.org/ns/did/v1",
      "https://w3id.org/security/multikey/v1",
    ],
    id: did,
    verificationMethod: [
      {
        id: `${did}#atproto`,
        type: "Multikey",
        controller: did,
        publicKeyMultibase: multikey,
      },
    ],
    service: [
      {
        id: "#sprk_appview",
        type: "SprkAppView",
        serviceEndpoint: c.env.cfg.publicUrl,
      },
    ],
  });
});

export default app;
