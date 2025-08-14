# Chat Service

## Overview
A real-time WebSocket-based `chat-service` for user-to-user messaging. Built with `ws`, `SQLite`, `Redis`, and `RabbitMQ`. Designed to be used within a microservices architecture, fully authenticated via JWT.

## Message types

**MESSAGE_SENT**

```yaml
{
  "type": "MESSAGE_SENT",
  "sender_id": 123,
  "recipient_id": 456,
  "message_id" : 789,
  "content": "Hey there!"
}
```

- Checks Redis to confirm recipient exists.
- Ensures sender hasn’t blocked recipient.
- Stores message in SQLite.
- Sends message using RabbitMQ to notifications service.
- Sends message in real-time if recipient is online.
- Marks message as delivered in DB.

**MESSAGE_READ**

```yaml
{
  "type": "MESSAGE_READ",
  "message_id": 11
}
```

- Marks the given message as read in the database.

## Multi-Session Support

A `Map<userId, Set<ws>>` stores all open connections per user.
Messages are broadcast to all active sockets for a user.


