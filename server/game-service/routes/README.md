# Game Service Routes Documentation

## Overview
This document provides details about the `/invite` and `/accept` routes in the game service. These routes are used for managing game invitations and their acceptance.

---

## Endpoints

### `http://localhost:5000/invite`
**Description:**
This route is used to send a game invitation from one player to another.

**Method:**
POST

**Request Body:**
```json
{
  "senderId": "<string>",
  "receiverId": "<string>"
}
```

**Response:**
- **200 OK:**
  ```json
  {
    "message": "Invite notification queued"
  }
  ```
- **400 Bad Request:**
  ```json
  {
    "error": "Missing fields"
  }
  ```
- **500 Internal Server Error:**
  ```json
  {
    "error": "Redis client is not available"
  }
  ```

**Notes:**
- The `senderId` and `receiverId` are required.
- The invite is stored in Redis for 5 minutes.
- A message is sent to RabbitMQ for further processing.

---

### `http://localhost:5000/accept`
**Description:**
This route is used to accept a game invitation.

**Method:**
POST

**Request Body:**
```json
{
  "roomId": "<string>",
  "senderId": "<string>",
  "receiverId": "<string>"
}
```

**Response:**
- **200 OK:**
  ```json
  {
    "message": "Invite accepted",
    "roomId": "<string>",
    "receiverId": "<string>"
  }
  ```
- **400 Bad Request:**
  ```json
  {
    "error": "Missing fields"
  }
  ```
- **500 Internal Server Error:**
  ```json
  {
    "error": "Redis client is not available"
  }
  ```

**Notes:**
- The `roomId` and `receiverId` are required.
- The invite is stored in Redis for 5 minutes.
- The route retrieves the invite details from Redis.

---

## Redis Usage
Both routes use Redis to store and retrieve invite details. Ensure that the Redis client is properly configured and available in the Fastify instance.

---

## RabbitMQ Usage
The `/invite` route sends a message to RabbitMQ for further processing. Ensure that RabbitMQ is properly configured and the queue name matches the consumer's expectations.

---

## Error Handling
- Always check for missing fields in the request body.
- Ensure Redis and RabbitMQ are available and properly configured.
- Log errors for debugging purposes.
