import  RabbitMGame  from "../tools/RabbitMGame.js"

const invitePlayer = async (req, reply, fastify) => {
    const { receiverId } = req.body;
    const senderId = req.user.id; // Get the sender ID from the authenticated user
    const roomId = Math.random().toString(36).substr(2, 9);
    console.log("Invite details:", { senderId, receiverId, roomId });
    
    if (!roomId || !senderId || !receiverId)
      return reply.code(400).send({ error: "Missing fields" });
    
    const rabbitMQ = new RabbitMGame('game'); // Queue name should match what the consumer listens to
    await rabbitMQ.connect();
    
    const redis = fastify.redis; // Access the Redis client from Fastify instance
    if (!redis) {
      console.error("Redis client is not available");
      return reply.code(500).send({ error: "Redis client is not available" });
    }

    let isBlocked = await redis.sIsMember(`blocker:${senderId}`, `${receiverId}`) // Check is there is a block relationship between users first
    if (!isBlocked)
      isBlocked = await redis.sIsMember(`blocker:${receiverId}`, `${senderId}`)
    if (isBlocked)
      return reply.code(400).send({ error: "Block exists" });

    redis.set(`invite:${senderId}`, roomId, 'EX', 60 * 5); // Store the invite for 5 minutes

    try {
      const message = {
        type: "INVITE_SENT",
        sender_id: senderId,
        recipient_id: receiverId,
        roomId,
      };
      await rabbitMQ.produceMessage(message, 'notifications.game.invite');
      return reply.code(200).send({ message: "Invite notification queued" });
    } catch (error) {
      console.error("Failed to send to RabbitMQ:", error);
      return reply.code(500).send({ error: "Failed to queue notification" });
    }
}
export default invitePlayer;
