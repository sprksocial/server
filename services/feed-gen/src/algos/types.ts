import { Database } from '../db/connection'

export interface feedParams {
  feed: string,
  limit: number,
  cursor: string,
  requesterDid: string
}

export interface AlgoInfo {
  handler: AlgoHandler,
  needsAuth: boolean
}

export type AlgoHandler = (db: Database, params: feedParams) => Promise<any>