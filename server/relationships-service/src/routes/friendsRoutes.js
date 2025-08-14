import { verifyToken } from '../middleware/authMiddleware.js';
import {
    sendRequest,
    acceptRequest,
    rejectRequest,
    removeFriend,
    listFriends,
    listRequests
} from '../controllers/friendsController.js';

import { 
    deleteFriendSchema,
    friendDecisionSchema,
    friendRequestSchema
} from '../schemas/friendsSchema.js';

async function friendsRoutes(fastify) {
    
    fastify.post('/request', {
        schema :{
            body: friendRequestSchema
        },
        preHandler: verifyToken,
        handler: sendRequest
    });

    fastify.post('/accept', {
        schema :{
            body: friendDecisionSchema
        },
        preHandler: verifyToken,
        handler: acceptRequest
    });

    fastify.post('/reject', {
        schema :{
            body: friendDecisionSchema
        },
        preHandler: verifyToken,
        handler: rejectRequest
    });

    fastify.delete('/:friendId', {
        schema :{
            params: deleteFriendSchema
        },
        preHandler: verifyToken,
        handler: removeFriend
    });

    fastify.get('/', {
        preHandler: verifyToken,
        handler: listFriends
    });

    fastify.get('/requests', {
        preHandler: verifyToken,
        handler: listRequests
    });
}

export default friendsRoutes;
