import fastify from 'fastify';
import dotenv from 'dotenv';
import sqlitePlugin from './plugins/sqlite-plugin.js'
import friendsRoutes from './routes/friendsRoutes.js';
import { createFriendshipTable } from './database/createFriendshipsTable.js';
import rabbitmqPlugin from './plugins/rabbitmq-plugin.js';
import { deleteFriendships } from './models/friendshipDAO.js';
import { createBlockTable } from './database/createBlockTable.js';
import blockRoutes from './routes/blockRoutes.js';
import redisPlugin from './plugins/redis-plugin.js';
dotenv.config();

const server = fastify({ logger: true });

await server.register(sqlitePlugin);
await createFriendshipTable(server.db);
await createBlockTable(server.db);

await server.register(rabbitmqPlugin);
await server.register(redisPlugin);


server.rabbit.consumeMessages(async (request) => {
    if (request.type === 'DELETE') {
        const userId = request.userId;
        const idExist = await server.redis.sIsMember('userIds', `${userId}`);
        console.log('idExist value: ', idExist);
        if (idExist)
            await deleteFriendships(server.db, userId);
    }
})


await server.register(friendsRoutes, { prefix: '/friends' });
await server.register(blockRoutes, { prefix: '/block' });

console.log("relationships service initialization is done...");

const start = async () => {
    try {
        await server.listen({ host: `${process.env.HOST_NAME}`, port: 3002 });
        server.log.info("Server is listening on port 3002");
    }
    catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();

const handleShutDown = async (signal) => {
    try {
        console.log(`Caught a signal or type ${signal}`);
        await server.redis.close();
        await server.db.close();
        await server.rabbit.close();
        await server.close();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(0);
    }
}
process.on('SIGINT', handleShutDown);
process.on('SIGTERM', handleShutDown);