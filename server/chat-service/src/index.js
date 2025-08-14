import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { createChatMessagesTable } from './database/initDatabase.js';
import RabbitMQClient from './libs/rabbitMQ.js';
import { WebSocketServer, WebSocket } from 'ws';
import { verifyToken } from './middleware/authMiddleware.js';
import dotenv from 'dotenv';
import { 
    addMessage, 
    deleteMessages, 
    getAllMessages, 
    getMessageById, 
    markAsDelivered, 
    markAsRead 
} from './database/chatMessagesDAO.js';
import { createClient } from 'redis';


dotenv.config();
let db;

(async () => {
  try {
    db = await open({
      filename: './messages.db.sqlite',
      driver: sqlite3.Database
    });
    console.log('Database connected.');

    await createChatMessagesTable(db);
  } catch (error) {
    console.error('Failed to connect to database or create table:', error);
    process.exit(1);
  }
})();

let redis;

(async() => {
  try {
    redis = await createClient({
      url: 'redis://redis:6379'
    })
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();
    console.log('Redis is connected...', redis);
  } catch (error) {
    console.error('Failed to connect redis-server:', error);
    process.exit(1);
  }
})();

const users = new Map();

const wss = new WebSocketServer({ port: 3004, maxPayload: 25000000 });

const rabbit = new RabbitMQClient(process.env.RABBITMQ_CHAT_QUEUE);

await rabbit.connect();

wss.on('connection', async (ws, request) => {
    console.log('WebSocket: Client connected.');
    ws.isAuthenticated = false;
    ws.userId = null;
    await verifyToken(ws, request, redis);
    if (ws.userId) {
        if (!users.has(ws.userId))
            users.set(ws.userId, new Set());
        users.get(ws.userId).add(ws);
        const messages = await getAllMessages(db, ws.userId);
        if (messages && ws.readyState === WebSocket.OPEN) {
            for (const message of messages)
                ws.send(JSON.stringify(message));
        }
    }
    else {
        ws.close(3000, 'Unauthorized');
        return ;
    }


    ws.on('message', async (message) => {
        if (!ws.isAuthenticated) {
            ws.close(3000, 'Unauthorized');
            return ;
        }
        const payload = JSON.parse(message);
        if (payload.type === 'MESSAGE_SENT') {
            console.log('WebSocket: payload received: ', payload);
            const recipient = payload.recipient_id;
            console.log('WebSocket: recipient: ', recipient);
            
            const idExist = await redis.sIsMember('userIds', `${recipient}`);
            console.log('idExist value: ', idExist);
            if (!idExist)
                return ;
            if (recipient) {
                let isBlocked = await redis.sIsMember(`blocker:${ws.userId}`, `${recipient}`)
                if (!isBlocked)
                    isBlocked = await redis.sIsMember(`blocker${recipient}`, `${ws.userId}`)
                if (recipient === payload.sender_id || recipient === ws.userId || isBlocked) 
                    return ;

                const messageId = await addMessage(db, payload);

                payload.message_id = messageId;

                rabbit.produceMessage({
                    type: 'MESSAGE_RECEIVED',
                    recipient_id: payload.recipient_id,
                    sender_id: ws.userId
                }, 'notifications.message.received');

                const connections = users.get(recipient);
                if (connections) {
                    for (const conn of connections) {
                        if (conn.isAuthenticated && conn.readyState === WebSocket.OPEN)
                            conn.send(JSON.stringify(payload));
                    }
                    await markAsDelivered(db, messageId);
                }
            }
        }
        else if (payload.type === 'MESSAGE_READ') {
            console.log('WebSocket: payload received: ', payload);
            if (payload.message_id) {
                const msg = await getMessageById(db, payload.message_id)
                if (!msg) 
                    return ;
                await markAsRead(db, msg.id);
            } else 
                return ;
        }
        else
            return ;
    })

    ws.on('error', (error) => {
        console.error('WebSocket: Client error:', error);
    });

    ws.on('close', () => {
        console.log('WebSocket: Client disconnected.');
        if (ws.isAuthenticated && users.has(ws.userId)) {
            users.get(ws.userId).delete(ws);
            if (users.get(ws.userId).size === 0) 
                users.delete(ws.userId);
        }
    })

});


wss.on('error', (error) => {
    console.error('WebSocket: Server error:', error);
    process.exit(1);
});


rabbit.consumeMessages(async (request) => {
    if (request.type === 'DELETE') {
        const userId = request.userId;

        const idExist = await redis.sIsMember('userIds', `${userId}`);
        console.log('idExist value: ', idExist);
        if (!idExist)
            return ;
        await deleteMessages(db, userId);
        users.get(userId)?.forEach((ws) => {
            ws.close(1010, 'Mandatory exit');
        });
    }
})

const handleShutDown = async (signal) => {
    try {
        console.log(`Caught a signal or type ${signal}`);
        await rabbit.close();
        await db.close();
        await redis.close();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(0);
    }
}
process.on('SIGINT', handleShutDown);
process.on('SIGTERM', handleShutDown);
