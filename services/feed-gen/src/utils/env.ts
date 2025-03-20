import dotenv from 'dotenv'
import { cleanEnv, port, str, testOnly } from 'envalid'

dotenv.config()

export const env = cleanEnv(process.env, {
  NODE_ENV: str({
    devDefault: testOnly('test'),
    choices: ['development', 'production', 'test'],
  }),

  FEEDGEN_DOMAIN: str({
    default: 'example.com',
    desc: 'Domain of the feed generator for did:web'
  }),

  DB_NAME: str({ devDefault: 'dev' }),
  DB_HOST: str({ devDefault: 'localhost' }),
  DB_PORT: port({ devDefault: 27017 }),
  DB_USER: str({ devDefault: 'mongo' }),
  DB_PASSWORD: str({ devDefault: 'mongo' }),
})