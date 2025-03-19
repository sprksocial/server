export interface JetstreamEvent {
  kind: string
  time_us: number
  did: string
  commit: {
    operation: 'create' | 'update' | 'delete'
    collection: string
    rkey: string
    record: any
    cid: string
  }
}

export interface NormalizedEvent {
  did: string
  handle: string | null
  commit: {
    operation: 'create' | 'update' | 'delete'
    collection: string
    rkey: string
    record: any
    cid: string
  }
  time_us: number
  event: 'create' | 'update' | 'delete'
  collection: string
  rkey: string
  record: any
  uri: string
}