const connectedClients = [];
let lastSentGameId = 0; // replaces lastMatchId

async function pollForNewMatches(db) {
  try {
    // console.log("Polling for new matches...");
    
    // First, let's check if we can query the database at all
    const countResult = await db.get(`SELECT COUNT(*) as total FROM games`);
    // console.log("Total games in database:", countResult.total);
    
    // Use Promise-based API instead of callback-based
    const latestRow = await db.get(`SELECT match_id FROM games ORDER BY id DESC LIMIT 1`);
    
    if (!latestRow) {
      // console.log("No games found in database");
      return;
    }

    const latestMatchId = latestRow.match_id;
    // console.log("Latest match ID:", latestMatchId);
    
    // Get last two games with that match_id
    const rows = await db.all(
      `SELECT id, enemy_id, user_id, left_player_score, right_player_score, player_id, game_end_result
       FROM games
       WHERE match_id = ?
       ORDER BY id DESC LIMIT 2`,
      [latestMatchId]
    );

    if (!rows || rows.length === 0) {
      // console.log("No games found for match ID:", latestMatchId);
      return;
    }

    // console.log("Found", rows.length, "games for match ID:", latestMatchId);

    // Check if the most recent game was already sent
    const maxGameId = rows[0].id;
    if (maxGameId <= lastSentGameId) {
      // console.log("Game already sent, skipping...");
      return;
    }

    lastSentGameId = maxGameId; // update tracker
    // console.log("Sending new game data, game ID:", maxGameId);

    const payload = rows.map((row) => ({
      enemyId: row.enemy_id,
      userId: row.user_id,
      leftPlayerScore: row.left_player_score,
      rightPlayerScore: row.right_player_score,
      playerId: row.player_id,
      gameEndResult: row.game_end_result,
    }));

    // console.log("Payload to send:", payload);
    // console.log("Connected clients:", connectedClients.length);

    for (const client of connectedClients) {
      try {
        client.send(JSON.stringify(payload));
        // console.log("Sent data to client");
      } catch (err) {
        console.error("WebSocket send error:", err.message);
      }
    }
  } catch (err) {
    console.error("Polling error:", err.message);
  }
}

// This is the function you will import
export default function recentActivity(connection, req, db) {
  // console.log("Initializing recentActivity function..."); // Log initialization
  connectedClients.push(connection);

  // console.log("Recent activity client connected");

  connection.on("message", (msg) => {
    // console.log("Message from client:", msg.toString());
  });

  connection.on("close", () => {
    // console.log("Recent activity client disconnected");
    const idx = connectedClients.indexOf(connection);
    if (idx !== -1) connectedClients.splice(idx, 1);
  });

  // console.log("Setting up polling interval..."); // Log setInterval setup

  connection.on("error", (err) => {
    console.error("Webconnection error:", err);
  });
}

export { pollForNewMatches };
