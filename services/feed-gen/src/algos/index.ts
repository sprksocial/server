import * as simpleDesc from './simpleDesc'
import * as following from './following'
import { AlgoInfo } from './types'

const algos: Record<string, AlgoInfo> = {
  [simpleDesc.shortname]: simpleDesc.info,
  [following.shortname]: following.info
}

export default algos