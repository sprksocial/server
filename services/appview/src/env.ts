import dotenv from 'dotenv'
import { cleanEnv, host, port, str, testOnly } from 'envalid'

dotenv.config()

export const env = cleanEnv(process.env, {
  NODE_ENV: str({
    devDefault: testOnly('test'),
    choices: ['development', 'production', 'test'],
  }),
  HOST: host({ devDefault: '0.0.0.0' }),
  PORT: port({ devDefault: 3000 }),
  PUBLIC_URL: str({ devDefault: '' }),
  APPVIEW_K256_PRIVATE_KEY_HEX: str({ devDefault: '' }),
  SERVICE_DID: str({ devDefault: 'did:web:localhost' }),

  DB_NAME: str({ devDefault: 'dev' }),
  DB_HOST: str({ devDefault: 'localhost' }),
  DB_PORT: port({ devDefault: 27017 }),
  DB_USER: str({ devDefault: 'mongo' }),
  DB_PASSWORD: str({ devDefault: 'mongo' }),
})
