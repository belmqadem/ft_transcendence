# Game Service Backend

This service powers the real-time and stats features for the BHV Pong game, including multiplayer matches, player stats, invites, and recent activity.

---

## Features

- **Local and Remote Multiplayer Games** (WebSocket)
- **Game Invitations** (REST)
- **Player Stats and Match History** (REST)
- **Recent Activity Feed** (WebSocket)
- **Integration with Redis and RabbitMQ** for invites and notifications

---

## Endpoints

### WebSocket Endpoints

| Route              | Description                            | Handler              |
| ------------------ | -------------------------------------- | -------------------- |
| `/ws`              | Local (single-player or local 2P) game | `localGameRoute.js`  |
| `/remoteGame`      | Remote multiplayer game                | `remoteGameRoute.js` |
| `/recent-activity` | Real-time feed of recent games         | `recentActivity.js`  |

### REST API Endpoints

| Route                   | Method | Description                           | Handler              |
| ----------------------- | ------ | ------------------------------------- | -------------------- |
| `/invite`               | POST   | Send a game invite                    | `invite.js`          |
| `/accept`               | POST   | Accept a game invite                  | `accept.js`          |
| `/getRoomId`            | POST   | Retrieve room ID for a pending invite | `getRoomId.js`       |
| `/storePlayerData`      | POST   | Store game results and player stats   | `storePlayerData.js` |
| `/user-history`         | GET    | Get all games for a specific player   | `getUserHistory.js`  |
| `/getData`              | GET    | Get the last 10 games                 | `gethistroy.js`      |
| `/last-match/:userName` | GET    | Get the last match for a user         | `getLastMatch.js`    |
| `/user-stats/:userName` | GET    | Get win/loss/match count for a user   | `getCount.js`        |

---

## How It Works

### Game Flow

- **Local Game:**  
  Connect to `/ws` via WebSocket for single-player or local two-player games. Game state is managed and sent over the socket.

- **Remote Game:**  
  Connect to `/remoteGame` via WebSocket with a `roomId` and `token`. The server synchronizes state between two players and manages win/loss.

- **Invites:**  
  Use `/invite` to send a game invite. The invite is stored in Redis and a notification is sent via RabbitMQ.  
  Use `/accept` to accept an invite, which is also stored in Redis.

- **Stats and History:**  
  Use `/storePlayerData` to save game results.  
  Use `/user-history`, `/getData`, `/last-match/:userName`, and `/user-stats/:userName` to retrieve stats and match history.

- **Recent Activity:**  
  Connect to `/recent-activity` via WebSocket to receive real-time updates about finished games.

Each message sent is an array of objects, each with:
```
[
  {
    "enemyId": 123,
    "userId": 456,
    "gameEndResult": "WIN" // or "LOSE" or "DRAW"
  },
  {
    "enemyId": 456,
    "userId": 123,
    "gameEndResult": "LOSE"
  }
]
```

---

## Technologies Used

- **Fastify** (HTTP/WebSocket server)
- **Redis** (invite storage, block checks)
- **RabbitMQ** (notifications)
- **SQLite** (game stats and history)
- **CORS** enabled for all origins

---

## Deployment

- Exposes port **5000** on all interfaces (`0.0.0.0`)
- See Dockerfile for containerization (if present)

---

## Extending

- Add more endpoints for richer stats or leaderboards
- Add authentication for secure sessions
- Integrate with a frontend for real-time updates

---

## Error Handling

- All routes check for required fields and Redis/DB availability
- Errors are logged and appropriate HTTP status codes are returned

---

## File Structure

- `routes/` — All route handlers (REST and WebSocket)
- `db/` — SQLite database files
- `server.js` — Main Fastify server setup

---

## Example Usage

- **Start the server:**  
  `node server.js`
- **Connect to a local game:**  
  WebSocket to `ws://localhost:5000/ws`
- **Connect to a remote game:**  
  WebSocket to `ws://localhost:5000/remoteGame`
- **Send an invite:**  
  `POST /invite` with `{ senderId, receiverId }`
- **Get recent activity:**  
  WebSocket to `ws://localhost:5000/recent-activity`

---

For more details, see the code in each route
