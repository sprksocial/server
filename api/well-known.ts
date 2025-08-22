import { Hono } from "hono";
import { env } from "../utils/env.ts";
import { formatMultikey, Secp256k1Keypair } from "@atproto/crypto";

const wellKnownRouter = () => {
  const router = new Hono();

  router.get("/.well-known/did.json", async (c) => {
    const domain = env.PUBLIC_URL?.split("://")[1] || "localhost";
    const keypair = await Secp256k1Keypair.import(
      Deno.env.get("APPVIEW_K256_PRIVATE_KEY_HEX") || "",
    );
    const multikey = formatMultikey(keypair.jwtAlg, keypair.publicKeyBytes());

    return c.json({
      "@context": [
        "https://www.w3.org/ns/did/v1",
        "https://w3id.org/security/multikey/v1",
      ],
      id: `did:web:${domain}`,
      verificationMethod: [
        {
          id: `did:web:${domain}#atproto`,
          type: "Multikey",
          controller: `did:web:${domain}`,
          publicKeyMultibase: multikey,
        },
      ],
      service: [
        {
          id: "#sprk_appview",
          type: "SprkAppView",
          serviceEndpoint: `https://${domain}`,
        },
      ],
    });
  });

  return router;
};

export default wellKnownRouter;
