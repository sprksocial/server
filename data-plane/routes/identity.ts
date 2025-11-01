import { DidDocument, getDid, getHandle, IdResolver } from "@atp/identity";
import { Code, DataPlaneError } from "../util.ts";

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
  private idResolver?: IdResolver;

  constructor(idResolver?: IdResolver) {
    this.idResolver = idResolver;
  }

  async getByDid(did: string) {
    if (!this.idResolver) {
      throw new DataPlaneError(Code.InternalError);
    }

    const doc = await this.idResolver.did.resolve(did);
    if (!doc) {
      throw new DataPlaneError(Code.NotFound);
    }

    const result = getResultFromDoc(doc);
    return result;
  }

  async getByHandle(handle: string) {
    if (!this.idResolver) {
      throw new DataPlaneError(Code.InternalError);
    }

    const did = await this.idResolver.handle.resolve(handle);
    if (!did) {
      throw new DataPlaneError(Code.NotFound);
    }

    const doc = await this.idResolver.did.resolve(did);
    if (!doc || did !== getDid(doc)) {
      throw new DataPlaneError(Code.NotFound);
    }

    const result = getResultFromDoc(doc);
    return result;
  }

  async resolve(identifier: string, type?: "did" | "handle") {
    if (!this.idResolver) {
      throw new DataPlaneError(Code.InternalError);
    }

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
      throw new DataPlaneError(Code.NotFound);
    }

    const result = getResultFromDoc(doc);
    return {
      ...result,
      resolvedFrom: {
        identifier,
        type: identifierType,
      },
    };
  }

  async resolveBatch(
    identifiers: Array<{ value: string; type?: "did" | "handle" }>,
  ) {
    if (!this.idResolver) {
      throw new DataPlaneError(Code.InternalError);
    }

    const results = await Promise.allSettled(
      identifiers.map(async ({ value, type }) => {
        let doc: DidDocument | null = null;
        let resolvedDid: string | undefined;

        const identifierType = type ||
          (value.startsWith("did:") ? "did" : "handle");
        if (identifierType === "did") {
          doc = await this.idResolver!.did.resolve(value);
          resolvedDid = value;
        } else {
          resolvedDid = await this.idResolver!.handle.resolve(value);
          if (!resolvedDid) throw new DataPlaneError(Code.NotFound);
          doc = await this.idResolver!.did.resolve(resolvedDid);
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
