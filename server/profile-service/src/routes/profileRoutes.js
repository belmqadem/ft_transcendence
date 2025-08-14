import { fetchOnlineStatuses, getAllProfiles, getAvatarUrl, getProfile, updateProfile, uploadAvatarUrl } from "../controllers/profileController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { profileIdSchema, updateProfileSchema } from "../schemas/profileSchema.js";

async function profileRoutes(fastify) {
    fastify.get('/statuses', {
        websocket: true,
        handler: fetchOnlineStatuses
    });

    fastify.get('/all', {
        preHandler: verifyToken,
        handler: getAllProfiles
    })
    
    fastify.post('/upload', {
        preHandler: verifyToken,
        handler: uploadAvatarUrl
    })
    
    fastify.get('/avatar/:fileName', {
        preHandler: verifyToken,
        handler: getAvatarUrl
    })
    
    fastify.get('/user/:id', {
        schema: {
            params: profileIdSchema
        },
        preHandler: verifyToken,
        handler: getProfile
    })
    
    fastify.patch('/user/:id', {
        schema: {
            params: profileIdSchema,
            body: updateProfileSchema
        },
        preHandler: verifyToken,
        handler: updateProfile
    })
}

export default profileRoutes;
