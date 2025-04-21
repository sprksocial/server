import * as dotenv from 'dotenv'
import { envBool, envInt, envList, envStr } from '@atproto/common'

dotenv.config()

export const env = {
  NODE_ENV: envStr('NODE_ENV'),

  FEEDGEN_DOMAIN: envStr('FEEDGEN_DOMAIN'),

  DB_NAME: envStr('DB_NAME'),
  DB_HOST: envStr('DB_HOST'),
  DB_PORT: envInt('DB_PORT'),
  DB_USER: envStr('DB_USER'),
  DB_PASSWORD: envStr('DB_PASSWORD')
}