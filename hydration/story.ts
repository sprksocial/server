import { Record as StoryRecord } from "../lex/types/so/sprk/story/post.ts";
import {
  HydrationMap,
  ItemRef,
  parseRecord,
  RecordInfo,
  split,
} from "./util.ts";
import { DataPlane } from "../data-plane/index.ts";

export type Story = RecordInfo<StoryRecord>;
export type Stories = HydrationMap<Story>;

export class StoryHydrator {
  constructor(public dataplane: DataPlane) {}

  async getActorStories(
    dids: string[],
  ): Promise<HydrationMap<ItemRef[]>> {
    const refsByActor = await this.dataplane.stories.getActorStories(dids);
    const result = new HydrationMap<ItemRef[]>();
    for (const [did, refs] of refsByActor) {
      result.set(did, refs);
    }
    return result;
  }

  async getStories(
    uris: string[],
    includeTakedowns = false,
    given = new HydrationMap<Story>(),
  ): Promise<Stories> {
    const [have, need] = split(uris, (uri) => given.has(uri));
    const base = have.reduce(
      (acc, uri) => acc.set(uri, given.get(uri) ?? null),
      new HydrationMap<Story>(),
    );
    if (!need.length) return base;
    const res = await this.dataplane.records.getStoryRecords(need);

    return need.reduce((acc, uri, i) => {
      const record = parseRecord<StoryRecord>(res.records[i], includeTakedowns);
      return acc.set(
        uri,
        record ?? null,
      );
    }, base);
  }
}
