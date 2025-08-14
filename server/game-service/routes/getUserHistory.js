async function getUserHistory(req, reply, db) {
  const userId = req.body.userId;

  console.log("Fetching history for user ID:", userId);

  if (!userId) {
    return reply.status(400).send({ error: "User ID is required" });
  }

  const query = `
    SELECT * FROM games
    WHERE user_id = ?
    ORDER BY created_at DESC
  `;

  try {
    // Use the Promise-based API from your SQLite plugin
    const rows = await db.all(query, [userId]);
    
    console.log(`Found ${rows.length} games for user ${userId}`);
    
    return reply.send(rows);
  } catch (err) {
    console.error("Error fetching user history:", err.message);
    return reply.status(500).send({ error: "Database error" });
  }
}

export default getUserHistory;