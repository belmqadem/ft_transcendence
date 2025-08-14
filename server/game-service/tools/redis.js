import fp from 'fastify-plugin';
import { createClient } from 'redis';


async function redisPlugin(fastify, options) {

    const redis = await createClient({
        url: 'redis://redis:6379'
    })
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();
    // console.log('Redis is connected...', redis);

    fastify.decorate('redis', redis);
};

export default fp(redisPlugin);
