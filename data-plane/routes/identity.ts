import { Database } from "../db/index.ts";
import { IdResolver } from "@atproto/identity";
import { DidDocument, getDid, getHandle } from "@atproto/identity";

// Helper function to format DID document result
function getResultFromDoc(doc: DidDocument) {
  const keys: Record<string, { Type: string; PublicKeyMultibase: string }> = {};
  doc.verificationMethod?.forEach((method) => {
    const id = method.id.split("#").at(1);
    if (!id) return;
    keys[id] = {
      Type: method.type,
      PublicKeyMultibase: method.publicKeyMultibase || "",
    };
  });

  const services: Record<string, { Type: string; URL: string }> = {};
  doc.service?.forEach((service) => {
    const id = service.id.split("#").at(1);
    if (!id) return;
    if (typeof service.serviceEndpoint !== "string") return;
    services[id] = {
      Type: service.type,
      URL: service.serviceEndpoint,
    };
  });

  return {
    did: getDid(doc),
    handle: getHandle(doc),
    keys: JSON.stringify(keys),
    services: JSON.stringify(services),
    updated: new Date().toISOString(),
  };
}

export class Identity {
  private db: Database;
  private idResolver?: IdResolver;

  constructor(db: Database, idResolver?: IdResolver) {
    this.db = db;
    this.idResolver = idResolver;
  }

  async getByDid(did: string) {
    if (!this.idResolver) {
      throw new Error("ID resolver not available");
    }

    try {
      const doc = await this.idResolver.did.resolve(did);
      if (!doc) {
        throw new Error("Identity not found");
      }

      const result = getResultFromDoc(doc);
      return result;
    } catch (error) {
      console.error("Error resolving DID:", error);
      throw new Error("Failed to resolve identity");
    }
  }

  async getByHandle(handle: string) {
    if (!this.idResolver) {
      throw new Error("ID resolver not available");
    }

    try {
      const did = await this.idResolver.handle.resolve(handle);
      if (!did) {
        throw new Error("Identity not found");
      }

      const doc = await this.idResolver.did.resolve(did);
      if (!doc || did !== getDid(doc)) {
        throw new Error("Identity not found");
      }

      const result = getResultFromDoc(doc);
      return result;
    } catch (error) {
      console.error("Error resolving handle:", error);
      throw new Error("Failed to resolve identity");
    }
  }

  async resolve(identifier: string, type?: "did" | "handle") {
    if (!this.idResolver) {
      throw new Error("ID resolver not available");
    }

    try {
      let doc: DidDocument | null = null;
      let resolvedDid: string | null = null;

      // Auto-detect type if not specified
      const identifierType = type ||
        (identifier.startsWith("did:") ? "did" : "handle");

      if (identifierType === "did") {
        doc = await this.idResolver.did.resolve(identifier);
        resolvedDid = identifier;
      } else {
        resolvedDid = await this.idResolver.handle.resolve(identifier) || null;
        if (resolvedDid) {
          doc = await this.idResolver.did.resolve(resolvedDid);
        }
      }

      if (!doc || (resolvedDid && resolvedDid !== getDid(doc))) {
        throw new Error("Identity not found");
      }

      const result = getResultFromDoc(doc);
      return {
        ...result,
        resolvedFrom: {
          identifier,
          type: identifierType,
        },
      };
    } catch (error) {
      console.error("Error resolving identity:", error);
      throw new Error("Failed to resolve identity");
    }
  }

  async resolveBatch(
    identifiers: Array<{ value: string; type?: "did" | "handle" }>,
  ) {
    if (!this.idResolver) {
      throw new Error("ID resolver not available");
    }

    const results = await Promise.allSettled(
      identifiers.map(async ({ value, type }) => {
        try {
          let doc: DidDocument | null = null;
          let resolvedDid: string | null = null;

          const identifierType = type ||
            (value.startsWith("did:") ? "did" : "handle");

          if (identifierType === "did") {
            doc = await this.idResolver!.did.resolve(value);
            resolvedDid = value;
          } else {
            resolvedDid = await this.idResolver!.handle.resolve(value) || null;
            if (resolvedDid) {
              doc = await this.idResolver!.did.resolve(resolvedDid);
            }
          }

          if (!doc || (resolvedDid && resolvedDid !== getDid(doc))) {
            return {
              identifier: value,
              type: identifierType,
              error: "Identity not found",
            };
          }

          return {
            identifier: value,
            type: identifierType,
            ...getResultFromDoc(doc),
          };
        } catch (_error) {
          return {
            identifier: value,
            type: type || "unknown",
            error: "Failed to resolve identity",
          };
        }
      }),
    );

    const resolved = results.map((result, index) => ({
      index,
      success: result.status === "fulfilled",
      data: result.status === "fulfilled" ? result.value : null,
      error: result.status === "rejected" ? result.reason?.message : null,
    }));

    return {
      results: resolved,
      summary: {
        total: identifiers.length,
        successful: resolved.filter((r) => r.success).length,
        failed: resolved.filter((r) => !r.success).length,
      },
    };
  }
}
