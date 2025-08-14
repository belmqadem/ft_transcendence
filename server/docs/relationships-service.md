# Relationships Service

## Overview
The `relationship-service` manages user connections including **friendships**, **friend requests**, and **blocks**. It enforces business rules such as blocking behavior, mutual friendship logic, and notification support via RabbitMQ.

---

## Endpoints
### Prefix: /friends

| Method | Path         | Description                                                           | Authentication Required  | Body Required    |  
| :----: | ------------ | --------------------------------------------------------------------- | :----------------------: | :--------------: |
| POST   | `/request`   | Send a friend request                                                 | Yes                      | { addresseeId }  |
| POST   | `/accept`    | Accept a friend request                                               | Yes                      | { requesterId }  |
| POST   | `/reject`    | Reject a friend request                                               | Yes                      | { requesterId }  |
| DELETE | `/:friendId` | Remove a friend by ID                                                 | Yes                      | (none)           |
| GET    | `/`          | List all accepted friends of user                                     | Yes                      | (none)           |
| GET    | `/requests`  | List all pending friend requests for user                             | Yes                      | (none)           |

---

### Prefix: /block

| Method | Path         | Description                                                           | Authentication Required  | Body Required    |  
| :----: | ------------ | --------------------------------------------------------------------- | :----------------------: | :--------------: |
| POST   | `/:blockedId`| Blockes a user                                                        | Yes                      | (none)    |
| DELETE | `/:blockedId`| Unblock a user                                                        | Yes                      | (none)    |
| GET    | `/list`      | Fetched block list of the current user                                | Yes                      | (none)           |
| GET    | `/isBlocked/:blockedId`| Queries Redis to check if the current user has a block-relationship with `:blockedId`| Yes                      | (none)           |

---

## Schemas

- **Friend Request Schema**:
  - `addresseeId`: string, required

- **Friend Decision Schema**:
  - `requesterId`: string, required

- **Delete Friend Schema**:
  - `friendId`: string, required

- **Block/Unblock Schema**:
  - `blockedId`: string, required
---

## Response Schema

```yaml
{
  statusCode: number,
  code: string,
  data: {
    ...
  }
}

```

## Response Codes

**Prefix: /friends**

- `/request`
```yaml

  400: {
    ADDRESSEE_REQUIRED
    ADDRESSEE_INVALID
    FRIEND_REQUEST_ALREADY_SENT
    BLOCK_EXISTS
  }
  200: FRIEND_REQUEST_SENT
  500: INTERNAL_SERVER_ERROR

```

- `/accept`
```yaml

  400: {
    REQUESTER_REQUIRED
    REQUESTER_INVALID
    FRIEND_REQUEST_INVALID
  }
  200: FRIEND_REQUEST_ACCEPTED
  500: INTERNAL_SERVER_ERROR

```

- `/reject`
```yaml

  400: {
    REQUESTER_REQUIRED
    REQUESTER_INVALID
    FRIEND_REQUEST_INVALID
  }
  200: FRIEND_REQUEST_REJECTED
  500: INTERNAL_SERVER_ERROR

```

- `/:friendId` (DELETE)
```yaml

  400: {
    FRIEND_REQUIRED
    FRIEND_INVALID
    FRIEND_REQUEST_INVALID
  }
  200: FRIEND_REMOVED
  500: INTERNAL_SERVER_ERROR

```

- `/` (GET)
```yaml

  200: FRIENDS_LISTED
  500: INTERNAL_SERVER_ERROR

```

- `/requests`
```yaml

  200: REQUESTS_LISTED
  500: INTERNAL_SERVER_ERROR

```



**Prefix: /block**

- `/:blockedId` (POST)
```yaml
  400: {
    BLOCKED_REQUIRED
    BLOCKED_INVALID
    BLOCKED_EXISTS
  }
  200: BLOCK_SUCCESS
  500: INTERNAL_SERVER_ERROR
```

- `/:blockedId` (DELETE)
```yaml
  400: {
    BLOCKED_REQUIRED
    BLOCKED_INVALID
    BLOCKED_NOT_FOUND
  } 
  200: UNBLOCK_SUCCESS
  500: INTERNAL_SERVER_ERROR
```

- `/list`
```yaml
  200: BLOCK_LIST_FETCHED
  500: INTERNAL_SERVER_ERROR
```

- `/isBlocked:blockedId` (GET)
```yaml
  400: {
    BLOCKED_REQUIRED
    BLOCKED_INVALID
  }
  200: IS_BLOCKED
  500: INTERNAL-SERVER-ERROR
``` 
---

## Notes
- Only authenticated users can manage friend operations.
- Accepting or rejecting requests updates the friendship status.
- Friends list includes only accepted friends.