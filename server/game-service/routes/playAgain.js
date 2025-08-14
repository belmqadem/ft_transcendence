import RabbitMGame from "../tools/RabbitMGame.js";

const playAgain = async (req, reply) => {
  const { sender_id, recipient_id } = req.body;
  console.log("Play again request received:", {
    sender_id,
    recipient_id,
  });
  if (!sender_id || !recipient_id) {
    return reply.code(400).send({ error: "Missing required fields" });
  }
  try {
    const rabbitMQ = new RabbitMGame("game");
    await rabbitMQ.connect();
    const message = {
      type: "PLAY_AGAIN",
      sender_id,
      recipient_id,
    };
    await rabbitMQ.produceMessage(message, "notifications.game.playAgain");
    return reply.code(200).send({ message: "Play again notification queued" });
  } catch (error) {
    console.error("Failed to send to RabbitMQ:", error);
    return reply.code(500).send({ error: "Failed to queue notification" });
  }
};

export default playAgain;
