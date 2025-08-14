# Game Service Routes Documentation

## `/invite`

### Description
This route is used to send an invitation to another player to join a game room.

### Request
- **Method:** POST
- **URL:** `/invite`
- **Body:**
  ```json
  {
    "senderId": "<string>",
    "receiverId": "<string>"
  }
  ```

### Response
- **Success:**
  ```json
  {
    "message": "Invite notification queued"
  }
  ```
- **Error:**
  - `500`: Redis client is not available
  - `400`: Missing fields
  - `500`: Failed to queue notification

### Notes
- The `roomId` is generated automatically and stored in Redis for 5 minutes.
- RabbitMQ is used to queue the invite notification.

---

## `/accept`

### Description
This route is used to accept an invitation and confirm the game room.

### Request
- **Method:** POST
- **URL:** `/accept`
- **Body:**
  ```json
  {
    "roomId": "<string>",
    "senderId": "<string>",
    "receiverId": "<string>"
  }
  ```

### Response
- **Success:**
  ```json
  {
    "message": "Invite accepted",
    "roomId": "<string>",
    "receiverId": "<string>"
  }
  ```
- **Error:**
  - `500`: Redis client is not available
  - `400`: Missing fields
  - `500`: Internal server error

### Notes
- The `roomId` is stored in Redis for 5 minutes.
- Ensure all required fields are provided in the request body.

## `/recent-activity` (WebSocket)

### Description
This WebSocket endpoint provides real-time updates about recent game activity. It monitors the database for new game completions and sends updates to connected clients whenever a match finishes.

### Connection
- **Method:** WebSocket
- **URL:** `ws://localhost:5000/recent-activity`
- **Protocol:** WebSocket

### How It Works
1. **Connection**: Client connects to the WebSocket endpoint
2. **Monitoring**: Server continuously polls the database for new completed games
3. **Updates**: When a new game completes, server sends game data to all connected clients
4. **Real-time**: Updates are sent in real-time as games finish

### Response Format
When a new game completes, the server sends an array of game data:

```json
[
  {
    "enemyId": "<string>",
    "userId": "<string>",
    "gameEndResult": "Won" | "Lost"
  },
  {
    "enemyId": "<string>",
    "userId": "<string>",
    "gameEndResult": "Won" | "Lost"
  }
]
```

### Response Fields
- **enemyId**: The ID of the opponent player
- **userId**: The ID of the current player
- **gameEndResult**: The result of the game ("Won" or "Lost")