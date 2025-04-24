import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { HTTPException } from 'hono/http-exception'
import { TakedownService } from '../../../../services/takedown.js'
import { authMiddleware } from '../../../../auth/middleware.js'
import { AppContext } from '../../../../index.js'
import type * as ComAtprotoAdminUpdateSubjectStatus from '../../../../lexicon/types/com/atproto/admin/updateSubjectStatus.js'
import type * as ComAtprotoAdminDefs from '../../../../lexicon/types/com/atproto/admin/defs.js'
import type * as ComAtprotoRepoStrongRef from '../../../../lexicon/types/com/atproto/repo/strongRef.js'

export const createGetAccountInfosRouter = (ctx: AppContext) => {
  const router = new Hono()

  // XRPC endpoint for Ozone integration: com.atproto.admin.getAccountInfos
  router.get(
    '/xrpc/com.atproto.admin.getAccountInfos',
    (c, next) => authMiddleware(c, next, true),
    zValidator(
      'json',
      z.object({
        dids: z.array(z.string()),
      }),
    ),
    async (c) => {
      
    }
  )
}
