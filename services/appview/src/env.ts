import * as dotenv from 'dotenv'
import { envStr, envList, envInt } from '@atproto/common'

dotenv.config()

export const env = {
  NODE_ENV: envStr('NODE_ENV') ?? 'test',
  HOST: envStr('HOST') ?? '0.0.0.0',
  PORT: envInt('PORT') ?? 3000,
  PUBLIC_URL: envStr('PUBLIC_URL') ?? '',
  APPVIEW_K256_PRIVATE_KEY_HEX: envStr('APPVIEW_K256_PRIVATE_KEY_HEX') ?? '',
  SERVICE_DID: envStr('SERVICE_DID') ?? 'did:web:localhost',
  MOD_SERVICE_DID: envStr('MOD_SERVICE_DID') ?? 'did:web:localhost',
  ADMIN_PASSWORDS: envList('ADMIN_PASSWORDS') ?? [],

  DB_NAME: envStr('DB_NAME') ?? 'dev',
  DB_HOST: envStr('DB_HOST') ?? 'localhost',
  DB_PORT: envInt('DB_PORT') ?? 27017,
  DB_USER: envStr('DB_USER') ?? 'mongo',
  DB_PASSWORD: envStr('DB_PASSWORD') ?? 'mongo',
}
