
import { Database } from '../db/connection'
import * as simpleDesc from './simpleDesc'

type AlgoHandler = (db: Database, params: any) => Promise<any>

const algos: Record<string, AlgoHandler> = {
  [simpleDesc.shortname]: simpleDesc.handler,
}

export default algos