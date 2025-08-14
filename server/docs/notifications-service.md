# Notifications Service

## Overview

The `notifications-service` is responsible for sending notifications to authenticated users via websocket.

## How does it work

- This service is utilizing `RabbitMQ` to create a single queue bound to `microservices-exchange` with a routing key of `notifications.#` with a purpose of receiving messages from other services.
- a `RabbitMQClient` class is used across all notification-sending services and placed under the libs folder.
- A message received from a service is a notification following the schema down below :

```yaml
{
    type: TYPE_OF_NOTIFICATION,
    sender_id: 123, 
    recipient_id: 456,
}
```

- The `notification_id` property is added at the notifications-service level to manage read notifications properly by id.

- A user is verified and authenticated after connecting, if not valid the connection is closed immediately.
- After authentication a user is mapped to all his current connections `Map(id, Set())`.
- If there are some stored unread/undelivered notifications for the current connect user, they're all sent right after authentication.

- Notifications are sent to the connected authenticated users following the schema below :

```yaml
{
  type: TYPE_OF_NOTIFICATION,
  sender_id: 123,
  recipient_id: 456,
  notification_id: 789,
}
```

- When a user is connected all related notifications are grouped together by sender_id and type of notification, and sent following the schema below :

```yaml
{
  type: TYPE_OF_NOTIFICATION,
  sender_id: 123,
  notifications_count: 11,
  last_notfication_at: "2025-07-15 19:09:40",
  notification_ids: [789, ...],
}
```

- To mark a notification as read a message is expected to be received following the next schema :

```yaml
{ type: NOTIFICATION_READ, notification_ids: [789, ...] }
```

- These are the types of notifications :

## Friends notifications

- `FRIEND_REQUEST_SENT`
- `FRIEND_REQUEST_ACCEPTED`

## chat notifications

- `MESSAGE_RECEIVED`

## Notifications Sent to Users

### UNREAD_COUNT

When a user connects, the server sends the total count of unread notifications along with their IDs:

```yaml
{ type: "UNREAD_COUNT", count: 3, notification_ids: [123, 456, 789] }
```
