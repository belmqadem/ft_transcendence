export default async function savePlayerData(req, reply, db) {
  try {
    const data = req.body;
    const insertQuery = `
      INSERT OR IGNORE INTO games (
        user_name,
        match_id,
        player_id,
        enemy_id,
        user_id,
        left_player_score,
        right_player_score,
        game_duration,
        game_end_result,
        left_player_ball_hit,
        right_player_ball_hit,
        level,
        matchPlayed,
        matchWon,
        matchLost
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      data.userName,
      data.matchId,
      data.playerId,
      data.enemyId,
      data.userId,
      data.leftPlayerScore,
      data.rightPlayerScore,
      data.gameDuration,
      data.gameEndResult,
      data.leftPlayerBallHit,
      data.rightPlayerBallHit,
      data.level,
      data.matchPlayed,
      data.matchWon,
      data.matchLost,
    ];
    await new Promise((resolve, reject) => {
      db.run(insertQuery, values, function (err) {
        if (err) {
          if (err.code === 'SQLITE_CONSTRAINT') {
            console.log("Unique constraint violated:", err.message);
            // reject(reply.status(409).send({ error: "Duplicate entry" }));
          } else {
            console.error("Error inserting data:", err.message);
            reject(reply.status(500).send({ error: "Database error" }));
          }
        } else {
          resolve(
            reply.status(200).send({
              message: "Player data saved successfully",
              id: this.lastID,
            })
          );
        }
      });
    });
  } catch (error) {
    console.log("Error saving player data:", error);
    return reply.status(500).send({ error: "Server error" });
  }
}