import dotenv from 'dotenv'
import { cleanEnv, host, port, str, testOnly } from 'envalid'

dotenv.config()

export const env = cleanEnv(process.env, {
  NODE_ENV: str({
    devDefault: testOnly('test'),
    choices: ['development', 'production', 'test'],
  }),

  JETSTREAM_URL: str({
    default: 'wss://jetstream2.us-east.bsky.network/subscribe',
    desc: 'Websocket URL for Jetstream connection'
  }),

  DB_NAME: str({ devDefault: 'dev' }),
  DB_HOST: str({ devDefault: 'localhost' }),
  DB_PORT: port({ devDefault: 27017 }),
  DB_USER: str({ devDefault: 'mongo' }),
  DB_PASSWORD: str({ devDefault: 'mongo' }),
})