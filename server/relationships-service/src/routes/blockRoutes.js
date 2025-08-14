import { verifyToken } from "../middleware/authMiddleware.js"
import { blockHandler, unblockHandler, getListHandler, isBlockedHandler } from '../controllers/blockController.js'
import { blockSchema } from "../schemas/blockSchema.js";

async function blockRoutes(fastify) {
    fastify.post('/:blockedId', {
        schema: {
            params: blockSchema
        },
        preHandler: verifyToken,
        handler: blockHandler
    })
    
    fastify.delete('/:blockedId', {
        schema: {
            params: blockSchema
        },
        preHandler: verifyToken,
        handler: unblockHandler
    })

    fastify.get('/list', {
        preHandler: verifyToken,
        handler: getListHandler
    })

    fastify.get('/isBlocked/:blockedId', {
        schema: {
            params: blockSchema
        },
        preHandler: verifyToken,
        handler: isBlockedHandler,
    })
}

export default blockRoutes;