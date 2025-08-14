function gameLogic(gameState) {
  // Don't process game logic if countdown is active
  if (gameState.countdownActive) {
    return gameState;
  }

  let step = 8;
  if (
    gameState.keypressd === "w" &&
    gameState.playerId === 1 &&
    gameState.paddleLeftY > 0
  )
    gameState.paddleLeftY -= step;
  if (
    gameState.keypressd === "s" &&
    gameState.playerId === 1 &&
    gameState.paddleLeftY < 600 - 100
  )
    gameState.paddleLeftY += step;

  if (
    gameState.keypressd === "w" &&
    gameState.playerId === 2 &&
    gameState.paddelRightY > 0
  )
    gameState.paddelRightY -= step;
  if (
    gameState.keypressd === "s" &&
    gameState.playerId === 2 &&
    gameState.paddelRightY < 600 - 100
  )
    gameState.paddelRightY += step;

  gameState.keypressd = "";

  if (
    gameState.flagX ||
    (gameState.ballX >= 980 &&
      gameState.ballY >= gameState.paddelRightY &&
      gameState.ballY <= gameState.paddelRightY + 100)
  ) {
    if (
      gameState.ballX >= 980 &&
      gameState.ballY >= gameState.paddelRightY &&
      gameState.ballY <= gameState.paddelRightY + 100
    ) {
      gameState.hitCount++;
      if (gameState.hitCount === 2) {
        gameState.ballSpeed += 1;
        gameState.hitCount = 0;
      }
      gameState.rightPlayerBallHit++;
    }
    (gameState.ballX -= gameState.ballSpeed), (gameState.flagX = true);
  }
  if (
    !gameState.flagX ||
    (gameState.ballX <= 20 &&
      gameState.ballY >= gameState.paddleLeftY &&
      gameState.ballY <= gameState.paddleLeftY + 100)
  ) {
    if (
      gameState.ballX <= 20 &&
      gameState.ballY >= gameState.paddleLeftY &&
      gameState.ballY <= gameState.paddleLeftY + 100
    )
      gameState.leftPlayerBallHit++;
    (gameState.ballX += gameState.ballSpeed), (gameState.flagX = false);
  }

  if (gameState.ballY >= 600 || gameState.flagY)
    (gameState.ballY -= gameState.ballSpeed), (gameState.flagY = true);
  if (gameState.ballY <= 0 || !gameState.flagY)
    (gameState.ballY += gameState.ballSpeed), (gameState.flagY = false);

  // Check for scoring and trigger countdown
  if (gameState.ballX > 1000 || gameState.ballX <= 0) {
    if (gameState.ballX > 1000) gameState.leftPlayerScore += 1;
    if (gameState.ballX <= 0) gameState.rightPlayerScore += 1;

    gameState.paddleLeftY = 240;
    gameState.paddelRightY = 240;
    gameState.ballX = 1000 / 2;
    gameState.ballY = 300;
    gameState.ballSpeed = 3;
    gameState.hitCount = 0;

    // Start countdown after scoring (but not if game is over)
    if (
      gameState.leftPlayerScore < gameState.rounds &&
      gameState.rightPlayerScore < gameState.rounds
    ) {
      gameState.countdownActive = true;
      gameState.countdownTime = 3;
      gameState.needsCountdown = true; // Flag to trigger countdown in main handler
    }
  }
  return gameState;
}

function serializeGameState(gameState) {
  const compact = {
    p: gameState.playerId,
    bx: gameState.ballX,
    by: gameState.ballY,
    fx: gameState.flagX,
    fy: gameState.flagY,
    pl: gameState.paddleLeftY,
    pr: gameState.paddelRightY,
    kp: gameState.keypressd,
    dc: gameState.disconnected,
    ls: gameState.leftPlayerScore,
    rs: gameState.rightPlayerScore,
    rd: gameState.rounds,
    bs: gameState.ballSpeed,
    hc: gameState.hitCount,
    r: gameState.gameEndResult,
    e: gameState.endGame,
    al: gameState.alive,
    lh: gameState.leftPlayerBallHit,
    rh: gameState.rightPlayerBallHit,
    st: gameState.startTime,
    et: gameState.endTime,
    ei: gameState.enemyId,
    mi: gameState.matchId,
    ca: gameState.countdownActive, // Add countdown active
    ct: gameState.countdownTime, // Add countdown time
  };
  return Buffer.from(JSON.stringify(compact));
}

const rooms = {};
function startSinglePlayerTimeout(roomId, playerId) {
  if (!rooms[roomId]) return;
  
  
  const timeoutId = setTimeout(() => {
    if (!rooms[roomId]) return;
    
    if (rooms[roomId].players.length === 1) {
      console.log(`Timeout reached. Removing player ${playerId} from room ${roomId}`);
      
      const player = rooms[roomId].players[0];
      if (player.connection.readyState === WebSocket.OPEN) {
        player.connection.send("No opponent found. Returning to lobby.");
        player.connection.close();
      }
      
      delete rooms[roomId];
    }
  }, 10000); 
  
  rooms[roomId].singlePlayerTimeout = timeoutId;
}
export function remoteGame(connection, req) {
  let roomId;
  const token = req.query.token;
  const playerRoomdId = req.query.roomId;
  let joined = false;

  console.log("Remote game connection established with userId:", token);
  console.log("Player room ID:", playerRoomdId);

  // First, check if this is a reconnection to an existing room
  if (rooms[playerRoomdId]) {
    // Check if this player is reconnecting
    const existingPlayer = rooms[playerRoomdId].players.find(
      (player) => player.token === token
    );

    if (existingPlayer) {
      // Player is reconnecting
      if (rooms[playerRoomdId].rateLimited >= 2) {
        rooms[playerRoomdId].players.forEach((player) => {
          player.connection.send("disconnected.");
          player.connection.close();
        });
        delete rooms[playerRoomdId];
        return;
      }

      // Clear timeouts and update connection
      if (rooms[playerRoomdId].player1Timeout)
        clearTimeout(rooms[playerRoomdId].player1Timeout);
      if (rooms[playerRoomdId].player2Timeout)
        clearTimeout(rooms[playerRoomdId].player2Timeout);
      if (rooms[playerRoomdId].singlePlayerTimeout)
        clearTimeout(rooms[playerRoomdId].singlePlayerTimeout);

      rooms[playerRoomdId].gameState.alive = true;
      rooms[playerRoomdId].gameState.disconnected = true;
      rooms[playerRoomdId].rateLimited++;
      existingPlayer.connection = connection;
      joined = true;
      roomId = playerRoomdId;

      console.log(`Player ${token} reconnected to room ${roomId}`);
    } else if (rooms[playerRoomdId].players.length < 2) {
      rooms[playerRoomdId].players.push({
        token: token,
        connection: connection,
      });
      joined = true;
      roomId = playerRoomdId;

      console.log(
        `Player ${token} joined existing room ${roomId}. Players: ${rooms[roomId].players.length}/2`
      );
    } else {
      // Room is full
      connection.send("Room is full");
      connection.close();
      return;
    }
  }
  
  if (!joined) {
    roomId = playerRoomdId;
    rooms[roomId] = {
      players: [{ token: token, connection: connection }],
      rateLimited: 0,
      gameState: {
        matchId: "",
        playerId: 1,
        ballX: 500,
        ballY: 300,
        flagX: false,
        flagY: false,
        paddleLeftY: 240,
        paddelRightY: 240,
        keypressd: [],
        disconnected: false,
        leftPlayerScore: 0,
        rightPlayerScore: 0,
        rounds: 5,
        ballSpeed: 3,
        hitCount: 0,
        gameEndResult: "",
        endGame: false,
        alive: true,
        leftPlayerBallHit: 0,
        rightPlayerBallHit: 0,
        startTime: Date.now(),
        endTime: 0,
        enemyId: 0,
        countdownActive: false, // Add countdown state
        countdownTime: 0, // Add countdown time
        needsCountdown: false, // Add this flag
      },
    };
    startSinglePlayerTimeout(roomId, token);
  }

  if (rooms[roomId].players.length === 2) {
    if (
      !rooms[roomId].players.every(
        (player) => player.connection.readyState === WebSocket.OPEN
      )
    ) {
      rooms[roomId].players.forEach((player) => {
        player.connection.send("One or both players are not connected.");
        player.connection.close();
      });
      delete rooms[roomId];
      return;
    }

    const [
      { token: token1, connection: player1 },
      { token: token2, connection: player2 },
    ] = rooms[roomId].players;

    // console.log(rooms[roomId].players);
    rooms[roomId].gameState.startTime = Date.now();

    // Start countdown when both players are connected
    startCountdown(roomId, player1, player2);

    const handleMessage = (playerId) => (msg) => {
      try {
        const gameState = JSON.parse(msg);

        if (gameState.endGame) {
          delete rooms[roomId];
          player1.close();
          player2.close();
          return;
        }

        const serverGameState = rooms[roomId].gameState;

        // Only process input if countdown is not active
        // if (!serverGameState.countdownActive) {
        serverGameState.keypressd = gameState.keypressd;
        // }

        serverGameState.playerId = playerId;
        serverGameState.matchId = roomId;

        const updatedState = gameLogic(serverGameState);

        // Check if we need to start a new countdown after scoring
        if (updatedState.needsCountdown) {
          updatedState.needsCountdown = false; // Reset the flag
          startPointCountdown(roomId, player1, player2); // Start countdown for next point
          return; // Don't send game state yet, countdown will handle it
        }

        if (updatedState.rightPlayerScore === updatedState.rounds) {
          updatedState.endTime = (Date.now() - updatedState.startTime) / 1000;
          updatedState.gameEndResult = "Lost";
          updatedState.playerId = 1;
          updatedState.enemyId = token2;
          player1.send(serializeGameState(updatedState));

          updatedState.playerId = 2;
          updatedState.enemyId = token1;
          updatedState.gameEndResult = "Won";
          player2.send(serializeGameState(updatedState));
          return;
        }

        if (updatedState.leftPlayerScore === updatedState.rounds) {
          updatedState.endTime = (Date.now() - updatedState.startTime) / 1000;
          updatedState.playerId = 1;
          updatedState.enemyId = token2;
          updatedState.gameEndResult = "Won";

          player1.send(serializeGameState(updatedState));

          updatedState.playerId = 2;
          updatedState.enemyId = token1;
          updatedState.gameEndResult = "Lost";
          player2.send(serializeGameState(updatedState));
          return;
        }

        updatedState.playerId = 1;
        player1.send(serializeGameState(updatedState));
        updatedState.playerId = 2;
        player2.send(serializeGameState(updatedState));
      } catch (error) {
        // console.error("Invalid JSON format", error);
      }
    };

    player1.on("message", handleMessage(1));
    player2.on("message", handleMessage(2));

    player1.on("close", () => {
      if (!rooms[roomId]) return;
      if (rooms[roomId].singlePlayerTimeout) {
        clearTimeout(rooms[roomId].singlePlayerTimeout);
      }
      rooms[roomId].gameState.alive = false;
      rooms[roomId].player1Timeout = setTimeout(() => {
        if (rooms[roomId] && !rooms[roomId].gameState.alive) {
          player2.send("player 1 disconnected");
          delete rooms[roomId];
          player1.close();
          player2.close();
        }
      }, 10000);
      player1.removeAllListeners();
      player2.removeAllListeners();
    });

    player2.on("close", () => {
      if (!rooms[roomId]) return;
      if (rooms[roomId].singlePlayerTimeout) {
        clearTimeout(rooms[roomId].singlePlayerTimeout);
      }
      rooms[roomId].gameState.alive = false;
      rooms[roomId].player2Timeout = setTimeout(() => {
        if (rooms[roomId] && !rooms[roomId].gameState.alive) {
          player1.send("player 2 disconnected");
          delete rooms[roomId];
          player2.close();
          player1.close();
        }
      }, 10000);
      player1.removeAllListeners();
      player2.removeAllListeners();
    });
  }
}
// Add countdown function for when someone scores
function startPointCountdown(roomId, player1, player2) {
  if (!rooms[roomId]) return;

  const gameState = rooms[roomId].gameState;
  gameState.countdownActive = true;
  gameState.countdownTime = 3;

  // console.log(`Starting point countdown for room ${roomId}`);

  const countdownInterval = setInterval(() => {
    if (!rooms[roomId]) {
      clearInterval(countdownInterval);
      return;
    }

    const currentGameState = rooms[roomId].gameState;

    // console.log(`Point countdown: ${currentGameState.countdownTime}`);

    if (currentGameState.countdownTime > 0) {
      // Send countdown update to both players
      currentGameState.playerId = 1;
      if (player1.readyState === WebSocket.OPEN) {
        player1.send(serializeGameState(currentGameState));
      }

      currentGameState.playerId = 2;
      if (player2.readyState === WebSocket.OPEN) {
        player2.send(serializeGameState(currentGameState));
      }

      currentGameState.countdownTime--;
    } else {
      // Countdown finished, resume the game
      currentGameState.countdownActive = false;
      currentGameState.countdownTime = 0;

      // Send game resume signal to both players
      currentGameState.playerId = 1;
      if (player1.readyState === WebSocket.OPEN) {
        player1.send(serializeGameState(currentGameState));
      }

      currentGameState.playerId = 2;
      if (player2.readyState === WebSocket.OPEN) {
        player2.send(serializeGameState(currentGameState));
      }

      clearInterval(countdownInterval);
    }
  }, 1000); // Update every second
}

// Add countdown function
function startCountdown(roomId, player1, player2) {
  if (!rooms[roomId]) return;

  rooms[roomId].gameState.countdownActive = true;
  rooms[roomId].gameState.countdownTime = 3;

  const countdownInterval = setInterval(() => {
    if (!rooms[roomId]) {
      clearInterval(countdownInterval);
      return;
    }

    const gameState = rooms[roomId].gameState;

    if (gameState.countdownTime > 0) {
      // Send countdown update to both players
      gameState.playerId = 1;
      player1.send(serializeGameState(gameState));

      gameState.playerId = 2;
      player2.send(serializeGameState(gameState));

      gameState.countdownTime--;
    } else {
      // Countdown finished, start the game
      gameState.countdownActive = false;
      gameState.countdownTime = 0;

      // Send game start signal to both players
      gameState.playerId = 1;
      player1.send(serializeGameState(gameState));

      gameState.playerId = 2;
      player2.send(serializeGameState(gameState));

      clearInterval(countdownInterval);
      console.log(`Game started in room ${roomId}`);
    }
  }, 1000); // Update every second
}
