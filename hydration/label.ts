import { AtUri } from "@atp/syntax";
import { DataPlane } from "../data-plane/index.ts";
import * as com from "../lex/com.ts";
import * as so from "../lex/so.ts";
import { ParsedLabelers } from "../util.ts";
import {
  HydrationMap,
  Merges,
  parseRecord,
  parseString,
  RecordInfo,
} from "./util.ts";

export type Label = com.atproto.label.defs.Label;
export type LabelerRecord = so.sprk.labeler.service.Main;

export type SubjectLabels = {
  isImpersonation: boolean;
  isTakendown: boolean;
  needsReview: boolean;
  labels: HydrationMap<Label>; // src + val -> label
};

export class Labels extends HydrationMap<SubjectLabels> implements Merges {
  static key(label: Label) {
    return `${label.src}::${label.val}`;
  }
  override merge(map: Labels): this {
    map.forEach((theirs, key) => {
      if (!theirs) return;
      const mine = this.get(key);
      if (mine) {
        mine.isTakendown = mine.isTakendown || theirs.isTakendown;
        mine.labels = mine.labels.merge(theirs.labels);
      } else {
        this.set(key, theirs);
      }
    });
    return this;
  }
  getBySubject(sub: string): Label[] {
    const it = this.get(sub)?.labels.values();
    if (!it) return [];
    const labels: Label[] = [];
    for (const label of it) {
      if (label) labels.push(label);
    }
    return labels;
  }
}

export type LabelerAgg = {
  likes: number;
};

export type LabelerAggs = HydrationMap<LabelerAgg>;

export type Labeler = RecordInfo<LabelerRecord>;
export type Labelers = HydrationMap<Labeler>;

export type LabelerViewerState = {
  like?: string;
};

export type LabelerViewerStates = HydrationMap<LabelerViewerState>;

export class LabelHydrator {
  constructor(public dataplane: DataPlane) {}

  async getLabelsForSubjects(
    subjects: string[],
    labelers: ParsedLabelers,
  ): Promise<Labels> {
    if (!subjects.length || !labelers.dids.length) return new Labels();
    const res = await this.dataplane.labels.getLabels(
      subjects,
      labelers.dids,
    );

    return res.labels.reduce((acc, cur) => {
      const label = cur as unknown as Label;
      if (!label || label.neg) return acc;
      const { sig: _, ...labelWithoutSig } = label;
      let entry = acc.get(label.uri);
      if (!entry) {
        entry = {
          isImpersonation: false,
          isTakendown: false,
          needsReview: false,
          labels: new HydrationMap(),
        };
        acc.set(label.uri, entry);
      }

      const isActionableNeedsReview = label.val === NEEDS_REVIEW_LABEL &&
        !label.neg &&
        labelers.redact.has(label.src);

      // we action needs review labels on backend for now so don't send to client until client has proper logic for them
      if (!isActionableNeedsReview) {
        entry.labels.set(Labels.key(labelWithoutSig), labelWithoutSig);
      }

      if (
        TAKEDOWN_LABELS.includes(label.val) &&
        !label.neg &&
        labelers.redact.has(label.src)
      ) {
        entry.isTakendown = true;
      }
      if (isActionableNeedsReview) {
        entry.needsReview = true;
      }
      if (
        label.val === IMPERSONATION_LABEL &&
        !label.neg &&
        labelers.redact.has(label.src)
      ) {
        entry.isImpersonation = true;
      }

      return acc;
    }, new Labels());
  }

  async getLabelers(
    dids: string[],
    includeTakedowns = false,
  ): Promise<Labelers> {
    const uris = dids.map(labelerDidToUri);
    const res = await this.dataplane.records.getRecords(uris);
    return dids.reduce((acc, did, i) => {
      const record = parseRecord<LabelerRecord>(
        so.sprk.labeler.service.main,
        res.records[i],
        includeTakedowns,
      );
      return acc.set(did, record ?? null);
    }, new HydrationMap<Labeler>());
  }

  async getLabelerViewerStates(
    dids: string[],
    viewer: string,
  ): Promise<LabelerViewerStates> {
    const refs = dids.map((did) => ({ uri: labelerDidToUri(did) }));
    const likes = await this.dataplane.likes.byActorAndSubjects(viewer, refs);
    return dids.reduce((acc, did, i) => {
      return acc.set(did, {
        like: parseString(likes.uris[i]),
      });
    }, new HydrationMap<LabelerViewerState>());
  }

  async getLabelerAggregates(
    dids: string[],
    _viewer: string | null,
  ): Promise<LabelerAggs> {
    const refs = dids.map((did) => ({ uri: labelerDidToUri(did) }));
    const counts = await this.dataplane.interactions.getInteractionCounts(refs);
    return dids.reduce((acc, did, i) => {
      return acc.set(did, {
        likes: counts.likes[i] ?? 0,
      });
    }, new HydrationMap<LabelerAgg>());
  }
}

const labelerDidToUri = (did: string): string => {
  return AtUri.make(did, so.sprk.labeler.service.$type, "self").toString();
};

const IMPERSONATION_LABEL = "impersonation";
const TAKEDOWN_LABELS = ["!takedown", "!suspend"];
const NEEDS_REVIEW_LABEL = "needs-review";
