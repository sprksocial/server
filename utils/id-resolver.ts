import { AtprotoData, IdResolver, MemoryCache } from "@atp/identity";

const HOUR = 60e3 * 60;
const DAY = HOUR * 24;

export function createIdResolver() {
  return new IdResolver({
    didCache: new MemoryCache(HOUR, DAY),
  });
}

export interface BidirectionalResolver {
  baseResolver: IdResolver;
  resolveDidToHandle(did: string): Promise<string>;
  resolveDidToDidDoc(did: string): Promise<AtprotoData>;
  resolveHandleToDidDoc(handle: string): Promise<AtprotoData>;
  resolveDidsToHandles(dids: string[]): Promise<Record<string, string>>;
}

export function createBidirectionalResolver(resolver: IdResolver) {
  return {
    baseResolver: resolver,

    async resolveDidToHandle(did: string): Promise<string> {
      const didDoc = await resolver.did.resolveAtprotoData(did);
      const resolvedDid = await resolver.handle.resolve(didDoc.handle);
      if (resolvedDid === did) {
        return didDoc.handle;
      }
      return "unknown.invalid";
    },

    async resolveDidToDidDoc(did: string): Promise<AtprotoData> {
      const didDoc = await resolver.did.resolveAtprotoData(did);
      return didDoc;
    },

    async resolveHandleToDidDoc(handle: string): Promise<AtprotoData> {
      const did = await resolver.handle.resolve(handle);
      if (!did) {
        throw new Error("Handle not found");
      }
      const didDoc = await resolver.did.resolveAtprotoData(did);
      return didDoc;
    },

    async resolveDidsToHandles(
      dids: string[],
    ): Promise<Record<string, string>> {
      const didHandleMap: Record<string, string> = {};
      const resolves = await Promise.all(
        dids.map((did) => this.resolveDidToHandle(did).catch((_) => did)),
      );
      for (let i = 0; i < dids.length; i++) {
        didHandleMap[dids[i]] = resolves[i];
      }
      return didHandleMap;
    },
  };
}
