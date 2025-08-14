const rooms = {};

const ROOM_ID_LENGTH = 12;
const CHARACTERS = "abcdefghijklmnopqrstuvwxyz0123456789";
const PADDLE_INITIAL_Y = 240;
const PADDLE_HEIGHT = 100;
const RIGHT_PADDLE_X = 975;
const LEFT_PADDLE_X = 20;

function generateNewRoomId(params) {
  let roomId = "";

  for (let index = 0; index < ROOM_ID_LENGTH; index++) {
    roomId += CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
  }
  return roomId;
}

export function localGame(connection) {
  let roomId = generateNewRoomId();

  rooms[roomId] = {
    paddleLeftY: PADDLE_INITIAL_Y,
    paddelRightY: PADDLE_INITIAL_Y,
    ballX: 500,
    ballY: 300,
    keypressd: [],
    rightPlayerScore: 0,
    leftPlayerScore: 0,
    flagX: false,
    flagY: false,
    ballSpeed: 5,
    count: 0,
  };
  connection.on("close", () => {
    console.log("Client disconnected");
  });
  connection.on("message", (msg) => {
    try {
      rooms[roomId] = JSON.parse(msg);
    } catch (error) {
      connection.send(JSON.stringify({ error: "Invalid JSON format" }));
      return;
    }

    let step = 10;
    if (rooms[roomId].keypressd.includes("w"))
      rooms[roomId].paddleLeftY -= step;
    if (rooms[roomId].keypressd.includes("s"))
      rooms[roomId].paddleLeftY += step;

    if (rooms[roomId].keypressd.includes("ArrowDown"))
      rooms[roomId].paddelRightY += step;
    if (rooms[roomId].keypressd.includes("ArrowUp"))
      rooms[roomId].paddelRightY -= step;

    if (
      rooms[roomId].flagX ||
      (rooms[roomId].ballX >= RIGHT_PADDLE_X &&
        rooms[roomId].ballY >= rooms[roomId].paddelRightY &&
        rooms[roomId].ballY <= rooms[roomId].paddelRightY + PADDLE_HEIGHT)
    ) {
      if (
        rooms[roomId].ballX >= RIGHT_PADDLE_X &&
        rooms[roomId].ballY >= rooms[roomId].paddelRightY &&
        rooms[roomId].ballY <= rooms[roomId].paddelRightY + PADDLE_HEIGHT
      ) {
        rooms[roomId].count++;
        if (rooms[roomId].count === 2) {
          rooms[roomId].ballSpeed += 1;
          rooms[roomId].count = 0;
        }
      }
      (rooms[roomId].ballX -= rooms[roomId].ballSpeed),
        (rooms[roomId].flagX = true);
    }
    if (
      !rooms[roomId].flagX ||
      (rooms[roomId].ballX <= LEFT_PADDLE_X &&
        rooms[roomId].ballY >= rooms[roomId].paddleLeftY &&
        rooms[roomId].ballY <= rooms[roomId].paddleLeftY + PADDLE_HEIGHT)
    ) {
      (rooms[roomId].ballX += rooms[roomId].ballSpeed),
        (rooms[roomId].flagX = false);
    }

    if (rooms[roomId].ballY >= 600 || rooms[roomId].flagY)
      (rooms[roomId].ballY -= rooms[roomId].ballSpeed),
        (rooms[roomId].flagY = true);
    if (rooms[roomId].ballY <= 0 || !rooms[roomId].flagY)
      (rooms[roomId].ballY += rooms[roomId].ballSpeed),
        (rooms[roomId].flagY = false);

    rooms[roomId].keypressd = [];

    if (rooms[roomId].ballX > 1000 || rooms[roomId].ballX <= 0) {
      if (rooms[roomId].ballX > 1000) rooms[roomId].leftPlayerScore += 1;
      if (rooms[roomId].ballX <= 0) rooms[roomId].rightPlayerScore += 1;
      rooms[roomId].paddleLeftY = 240;
      rooms[roomId].paddelRightY = 240;
      rooms[roomId].ballX = 1000 / 2;
      rooms[roomId].ballY = 300;
      rooms[roomId].ballSpeed = 5;
    }
    connection.send(JSON.stringify(rooms[roomId]));
  });
}
