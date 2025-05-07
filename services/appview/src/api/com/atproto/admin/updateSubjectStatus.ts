import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { HTTPException } from 'hono/http-exception'
import { TakedownService } from '../../../../services/takedown.js'
import { authMiddleware } from '../../../../auth/middleware.js'
import { AppContext } from '../../../../index.js'
import { Server } from '../../../../lexicon/index.js'
import type * as ComAtprotoAdminUpdateSubjectStatus from '../../../../lexicon/types/com/atproto/admin/updateSubjectStatus.js'
import type * as ComAtprotoAdminDefs from '../../../../lexicon/types/com/atproto/admin/defs.js'
import type * as ComAtprotoRepoStrongRef from '../../../../lexicon/types/com/atproto/repo/strongRef.js'
import { AuthRequiredError } from '@atproto/xrpc-server'

export default function (server: Server, ctx: AppContext) {
  server.com.atproto.admin.updateSubjectStatus({
    auth: ctx.authVerifier.optionalStandardOrRole,
    handler: async ({ input, auth }) => {
      const { subject, takedown } = input.body
      if (!takedown || typeof takedown.applied !== 'boolean') {
        throw new HTTPException(400, { message: 'Invalid takedown status' })
      }

      const { canPerformTakedown } = ctx.authVerifier.parseCreds(auth)
      if (!canPerformTakedown) {
        throw new AuthRequiredError('Requires admin privileges')
      }

      try {
        if (subject.$type === 'com.atproto.admin.defs#repoRef') {
          const repoRef = subject as ComAtprotoAdminDefs.RepoRef
          if (!repoRef.did) {
            throw new HTTPException(400, { message: 'DID is required for repo takedowns' })
          }

          if (takedown.applied) {
            await ctx.takedownService.takedownRepo({
              did: repoRef.did,
              reason: 'Moderation action',
              adminDid: auth.credentials.type === 'standard' ? auth.credentials.iss : 'admin',
              ref: takedown.ref,
            })
            await ctx.takedownService.updateRepoTakedownApplied(repoRef.did, takedown.applied)
          } else {
            await ctx.takedownService.removeRepoTakedown(repoRef.did)
          }
        } else if (subject.$type === 'com.atproto.admin.defs#recordRef') {
          const recordRef = subject as ComAtprotoRepoStrongRef.Main
          if (!recordRef.uri || !recordRef.cid) {
            throw new HTTPException(400, { message: 'URI and CID are required for record takedowns' })
          }

          if (takedown.applied) {
            await ctx.takedownService.takedownContent({
              targetUri: recordRef.uri,
              targetCid: recordRef.cid,
              reason: 'Moderation action',
              adminDid: auth.credentials.type === 'standard' ? auth.credentials.iss : 'admin',
            })
            await ctx.takedownService.updateTakedownApplied(recordRef.uri, takedown.applied)
          } else {
            await ctx.takedownService.removeTakedown(recordRef.uri)
          }
        } else if (subject.$type === 'com.atproto.admin.defs#repoBlobRef') {
          const repoBlobRef = subject as ComAtprotoAdminDefs.RepoBlobRef
          if (!repoBlobRef.did || !repoBlobRef.cid) {
            throw new HTTPException(400, { message: 'DID and CID are required for blob takedowns' })
          }

          if (takedown.applied) {
            await ctx.takedownService.takedownBlob({
              did: repoBlobRef.did,
              cid: repoBlobRef.cid,
              reason: 'Moderation action',
              adminDid: auth.credentials.type === 'standard' ? auth.credentials.iss : 'admin',
              ref: takedown.ref,
            })
            await ctx.takedownService.updateBlobTakedownApplied(repoBlobRef.did, repoBlobRef.cid, takedown.applied)
          } else {
            await ctx.takedownService.removeBlobTakedown(repoBlobRef.did, repoBlobRef.cid)
          }
        } else {
          throw new HTTPException(400, { message: `Unsupported subject type: ${subject.$type}` })
        }

        return {
          encoding: 'application/json',
          body: {
            subject,
            takedown: takedown.applied ? takedown : undefined
          }
        }
      } catch (err) {
        if (err instanceof HTTPException) throw err
        throw new HTTPException(500, { message: 'Internal server error' })
      }
    }
  })
}

type UpdateSubjectStatusContext = {
  takedownService: TakedownService
}

export const createUpdateSubjectStatusRouter = (
  ctx: UpdateSubjectStatusContext,
) => {
  const router = new Hono()
  const takedownService = ctx.takedownService

  // XRPC endpoint for Ozone integration: com.atproto.admin.updateSubjectStatus
  router.post(
    '/xrpc/com.atproto.admin.updateSubjectStatus',
    (c, next) => authMiddleware(c, next, true),
    zValidator(
      'json',
      z.object({
        subject: z.object({
          $type: z.string(),
          did: z.string().optional(),
          uri: z.string().optional(),
          cid: z.string().optional(),
        }),
        takedown: z.object({
          applied: z.boolean(),
          ref: z.string().optional(),
        }),
      }),
    ),
    async (c) => {
      const { subject, takedown } = c.req.valid('json')
      const adminDid = c.get('did')

      try {
        // Handle different subject types
        if (subject.$type === 'com.atproto.admin.defs#repoRef') {
          // Repository (user account) takedown
          if (!subject.did) {
            throw new HTTPException(400, {
              message: 'DID is required for repo takedowns',
            })
          }

          if (takedown.applied) {
            // Apply takedown
            await takedownService.takedownRepo({
              did: subject.did,
              reason: 'Moderation via Ozone',
              adminDid,
              ref: takedown.ref,
            })
            await takedownService.updateRepoTakedownApplied(subject.did, takedown.applied)
          } else {
            // Remove takedown
            await takedownService.removeRepoTakedown(subject.did)
          }
        } else if (subject.$type === 'com.atproto.repo.strongRef') {
          // Record (post) takedown
          if (!subject.uri || !subject.cid) {
            throw new HTTPException(400, {
              message: 'URI and CID are required for record takedowns',
            })
          }

          if (takedown.applied) {
            // Apply takedown
            await takedownService.takedownContent({
              targetUri: subject.uri,
              targetCid: subject.cid,
              reason: 'Moderation via Ozone',
              adminDid,
            })
            await takedownService.updateTakedownApplied(subject.uri, takedown.applied)
          } else {
            // Remove takedown
            await takedownService.removeTakedown(subject.uri)
          }
        } else if (subject.$type === 'com.atproto.admin.defs#repoBlobRef') {
          // Blob (image/attachment) takedown
          if (!subject.did || !subject.cid) {
            throw new HTTPException(400, {
              message: 'DID and CID are required for blob takedowns',
            })
          }

          if (takedown.applied) {
            // Apply takedown
            await takedownService.takedownBlob({
              did: subject.did,
              cid: subject.cid,
              reason: 'Moderation via Ozone',
              adminDid,
              ref: takedown.ref,
            })
            await takedownService.updateBlobTakedownApplied(subject.did, subject.cid, takedown.applied)
          } else {
            // Remove takedown
            await takedownService.removeBlobTakedown(subject.did, subject.cid)
          }
        } else {
          throw new HTTPException(400, {
            message: `Unsupported subject type: ${subject.$type}`,
          })
        }

        // Return the response format expected by Ozone
        return c.json({
          subject,
          takedown: takedown.applied
            ? {
                applied: takedown.applied,
                ref: takedown.ref,
              }
            : undefined,
        })
      } catch (error) {
        if (error instanceof HTTPException) {
          throw error
        }
        throw new HTTPException(500, {
          message: 'Failed to update subject status',
        })
      }
    },
  )

  return router
}
