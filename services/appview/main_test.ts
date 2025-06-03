import { assertEquals } from 'jsr:@std/assert'
import app from './main.ts'

Deno.test({
  name: 'Server Running', 
  permissions: {
    net: true,
    sys: true,
    env: "inherit",
  },
  fn: async () => {
    const testEnv = {
      SERVICE_DID: "did:web:test",
      MOD_SERVICE_DID: "did:web:test",
      ADMIN_PASSWORD: "test",
    };

    const res = await app.request('/', {
      headers: {
        'Content-Type': 'application/json',
      },
    }, testEnv);
    
    assertEquals(res.status, 200)
  }
})
