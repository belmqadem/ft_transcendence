import fp from 'fastify-plugin'
import RabbitMQClient from '../libs/RabbitMQClient.js'


async function rabbitMQPlugin(fastify, options) {
    const rabbit = new RabbitMQClient(process.env.RABBITMQ_FRIENDS_QUEUE);
    try {       
        await rabbit.connect();
        console.log("RabbitMQ connected...");
        fastify.decorate('rabbit', rabbit);    
    } catch (error) {
        console.log("Failed to connect to RabbitMQ");
        throw new Error(error);
    }
}

export default fp(rabbitMQPlugin);