import { pino } from 'pino'

const logger = pino({ name: 'id-resolver' })

export interface DidDocument {
  did: string
  handle?: string
}

/**
 * Service to handle resolving DIDs to handles and vice versa
 */
export class BidirectionalResolver {
  private logger = pino({ name: 'id-resolver' })

  /**
   * Resolve a DID to its DID document
   */
  async resolveDidToDidDoc(did: string): Promise<DidDocument> {
    try {
      // TODO: Implement actual DID resolution
      // For now, return basic document
      return {
        did,
      }
    } catch (error) {
      this.logger.error({ error, did }, 'Failed to resolve DID to DID document')
      throw error
    }
  }

  /**
   * Resolve a handle to its DID document
   */
  async resolveHandleToDidDoc(handle: string): Promise<DidDocument> {
    try {
      // TODO: Implement actual handle resolution
      // For now, return basic document
      return {
        did: `did:plc:${handle.toLowerCase()}`,
        handle,
      }
    } catch (error) {
      this.logger.error({ error, handle }, 'Failed to resolve handle to DID document')
      throw error
    }
  }

  /**
   * Resolve a DID to its handle
   */
  async resolveDidToHandle(did: string): Promise<string> {
    try {
      const doc = await this.resolveDidToDidDoc(did)
      return doc.handle || did
    } catch (error) {
      this.logger.error({ error, did }, 'Failed to resolve DID to handle')
      throw error
    }
  }
} 