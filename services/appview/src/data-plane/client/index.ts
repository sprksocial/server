import assert from 'node:assert'
import { randomInt } from 'node:crypto'
import mongoose from 'mongoose'
import { Code, ConnectError } from './util.js'
import { HostList } from './hosts.js'

export * from './hosts.js'
export * from './util.js'

export interface DataPlaneClient {
  getIdentityByDid: (params: { did: string }) => Promise<GetIdentityByDidResponse>
}

export interface GetIdentityByDidResponse {
  did: string
  keys: Uint8Array
  services: Uint8Array
  handle?: string
}

const MAX_RETRIES = 3

export const createDataPlaneClient = (
  hostList: HostList,
  opts: { rejectUnauthorized?: boolean } = {}
) => {
  const clients = new DataPlaneClients(hostList, opts)
  
  // Create the base implementation
  const implementation: DataPlaneClient = {
    async getIdentityByDid(params) {
      let tries = 0
      let error: unknown
      let remainingClients = clients.get()
      while (tries < MAX_RETRIES) {
        const client = randomElement(remainingClients)
        assert(client, 'no clients available')
        try {
          return await client.getIdentityByDid(params)
        } catch (err) {
          if (
            err instanceof Error &&
            (err.name === 'MongoNetworkError' || err.name === 'MongoServerError')
          ) {
            tries++
            error = err
            remainingClients = getRemainingClients(remainingClients, client)
          } else {
            throw err
          }
        }
      }
      assert(error)
      throw error
    }
  }

  // Create a proxy that wraps the implementation with retry logic
  return new Proxy(implementation, {
    get: (target, method: string) => {
      // Return the method from our implementation if it exists
      if (method in target) {
        return target[method as keyof DataPlaneClient]
      }
      // For any methods we haven't implemented yet, return a function that throws
      return () => {
        throw new Error(`Method ${method} not implemented`)
      }
    }
  })
}

export { Code }

/**
 * Uses a reactive HostList in order to maintain a pool of DataPlaneClients.
 * Each DataPlaneClient is cached per host so that it maintains connections
 * and other internal state when the underlying HostList is updated.
 */
class DataPlaneClients {
  private clients: DataPlaneClient[] = []
  private clientsByHost = new Map<string, DataPlaneClient>()

  constructor(
    private hostList: HostList,
    private clientOpts: { rejectUnauthorized?: boolean }
  ) {
    this.refresh()
    this.hostList.onUpdate(() => this.refresh())
  }

  get(): readonly DataPlaneClient[] {
    return this.clients
  }

  private refresh() {
    this.clients = []
    for (const host of this.hostList.get()) {
      let client = this.clientsByHost.get(host)
      if (!client) {
        client = this.createClient(host)
        this.clientsByHost.set(host, client)
      }
      this.clients.push(client)
    }
  }

  private createClient(host: string): DataPlaneClient {
    const connection = mongoose.createConnection(host)
    
    return {
      async getIdentityByDid({ did }: { did: string }): Promise<GetIdentityByDidResponse> {
        const Actor = connection.model('Actor', new mongoose.Schema({
          did: { type: String, required: true },
          keys: { type: Buffer, required: true },
          services: { type: Buffer, required: true },
          handle: String,
        }))

        const actor = await Actor.findOne({ did }).exec()
        if (!actor) {
          throw new ConnectError('Actor not found', Code.NotFound)
        }

        if (!actor.did || !actor.keys || !actor.services) {
          throw new ConnectError('Invalid actor data', Code.InternalError)
        }

        return {
          did: actor.did,
          keys: new Uint8Array(actor.keys),
          services: new Uint8Array(actor.services),
          handle: actor.handle || undefined
        }
      }
    }
  }
}

const getRemainingClients = (
  clients: readonly DataPlaneClient[],
  lastClient: DataPlaneClient,
) => {
  if (clients.length < 2) return clients // no clients to choose from
  return clients.filter((c) => c !== lastClient)
}

const randomElement = <T>(arr: readonly T[]): T | undefined => {
  if (arr.length === 0) return
  return arr[randomInt(arr.length)]
}