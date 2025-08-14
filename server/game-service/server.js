
import Fastify from "fastify";
import websocket from "@fastify/websocket";
// import cors from "@fastify/cors";
import redisPlugin from "./tools/redis.js";
import { verifyToken, verifyWSToken } from "./tools/authMiddleware.js";
import sqlitePlugin, { createGamesTable } from "./tools/sqlite-plugin.js";
import { pollForNewMatches } from "./routes/recentActivity.js"; // Import the polling function
const fastify = Fastify();

await fastify.register(redisPlugin);
await fastify.register(sqlitePlugin);
await createGamesTable(fastify.db);
setInterval(() => {
  pollForNewMatches(fastify.db);
}, 2000);
fastify.register(websocket);


// local games
import { localGame } from "./routes/localGameRoute.js";
fastify.register(async function (fastify) {
  fastify.get("/game/ws", { websocket: true }, (connection, req) => {
    localGame(connection)
  });
});

// remote games route
import { remoteGame } from "./routes/remoteGameRoute.js";
// ...existing code...
fastify.register(async function (fastify) {
  fastify.get("/game/remoteGame", { websocket: true }, async (socket, req) => {
    try {
      console.log("WebSocket connection attempt - verifying token...");
      
      socket.userId = null; // Initialize userId
      socket.isAuthenticated = false; // Initialize authentication status
      // Verify the token first
      await verifyWSToken(socket, req, fastify.redis);
            
      // Check if the socket is still open after verification
      if (socket.readyState !== socket.OPEN) {
        console.log("Socket closed during verification");
        return;
      }
      console.log("enterig remote games");
      remoteGame(socket, req);
      
    } catch (error) {
      console.error("Error in WebSocket route:", error);
      if (socket.readyState === socket.OPEN) {
        socket.close(3000, 'Authentication failed');
      }
    }
  });
});
// ...existing code...
// route to store the game stats
import savePlayerData  from "./routes/storePlayerData.js";
fastify.register(async function name(fastify) {
  fastify.post("/game/storePlayerData", { preHandler: [verifyToken] }, async (req, reply) => {
    await savePlayerData(req, reply, fastify.db);
  });
});

import invitePlayer from './routes/invite.js';
fastify.register(async function name(fastify) {
  fastify.post("/game/invite", { preHandler: [verifyToken] }, async (req, reply) => {
    return invitePlayer(req, reply, fastify);
  });
});

import Accept from "./routes/accept.js";
fastify.register(async function name(fastify) {
  fastify.post("/game/accept", { preHandler: [verifyToken] }, async (req, reply) => {
    return Accept(req, reply, fastify);
  });
});

import getRoomId from "./routes/getRoomId.js";
fastify.register(async function name(req, reply) {
  fastify.post("/game/getRoomId", { preHandler: [verifyToken] }, async (req, reply) => {
    return getRoomId(req, reply, fastify);
  });
});

import getUserHistory from "./routes/getUserHistory.js";
fastify.register(async function name(fastify) {
  fastify.post("/game/user-history", { preHandler: [verifyToken] },async (req, reply) => {
    return getUserHistory(req, reply, fastify.db);
  });
});

import recentAtivity from "./routes/recentActivity.js";
fastify.register(async function (fastify) {
  fastify.get("/game/recent-activity", { websocket: true }, (connection, req) => {
     recentAtivity(connection, req, fastify.db);
  });
});
import playAgain from "./routes/playAgain.js";
fastify.register(async function (fastify) {
  fastify.post("/game/restart-match", { preHandler: [verifyToken] }, async (req, reply) => {
    return playAgain(req, reply);
  });
});
fastify.listen({ port: 5000 , host: '0.0.0.0'}, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
});
