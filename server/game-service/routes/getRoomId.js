const getRoomId = async (req, reply, fastify) => {
    const { userId } = req.body;
    const redis = fastify.redis; // Access the Redis client from Fastify instance

    if (!redis) {
        console.error("Redis client is not available");
        return reply.code(500).send({ error: "Redis client is not available" });
    }

    if (!userId) {
        return reply.code(400).send({ error: "Missing fields" });
    }
    
    try {
        const roomData = await redis.get(`invite:${userId}`);
        if (!roomData) {
            return reply.code(404).send({ error: "Room not found" });
        }
        return reply.code(200).send({ message: "Room found", roomData: roomData });
    } catch (error) {
        console.error("Error retrieving room data:", error);
        return reply.code(500).send({ error: "Internal server error" });
    }
}
export default getRoomId;