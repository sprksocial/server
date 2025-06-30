export interface JetstreamEvent {
  kind: string;
  time_us: number;
  did: string;
  commit: {
    operation: "create" | "update" | "delete";
    collection: string;
    rkey: string;
    record: { [_ in string]: unknown };
    cid: string;
    rev: string;
  };
}

export interface NormalizedEvent {
  did: string;
  handle: string | null;
  commit: {
    operation: "create" | "update" | "delete";
    collection: string;
    rkey: string;
    record: { [_ in string]: unknown };
    cid: string;
    rev: string;
  };
  time_us: number;
  event: "create" | "update" | "delete";
  collection: string;
  rkey: string;
  record: { [_ in string]: unknown };
  uri: string;
}
