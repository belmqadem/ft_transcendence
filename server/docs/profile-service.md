# Profile Service Documentation

## Overview
The `profile-service` manages user profiles including avatar handling, username updates, and public statistics like matches won or lost.

---

## 📚 Endpoints (`/profile`)

### 📝 Profile Operations

| Method | Path           | Description                      | Auth Required | Body                                      |
|--------|----------------|----------------------------------|---------------|-------------------------------------------|
| POST   | `/register`    | Create a new user profile        | ✅            | `{ username, email }`                     |
| PATCH  | `/user/:id`    | Update user profile              | ✅            | `{ username?, matches_won?, matches_lost? }` |
| GET    | `/user/:id`    | Get profile by user ID           | ✅            | None                                      |
| GET    | `/all`         | Get all user profiles            | ✅            | None                                      |

### 🖼️ Avatar Handling

| Method | Path                   | Description                      | Auth Required | Body             |
|--------|------------------------|----------------------------------|---------------|------------------|
| POST   | `/upload`             | Upload avatar image              | ✅            | `formData (image)` |
| GET    | `/avatar/:fileName`  | Get uploaded avatar by filename  | ✅            | None             |

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


## Online statuses

**Endpoint: /profile/statuses**

When a user connects, they continuously receive updates about other users's online/offline statuses. It's a global broadcast to all users about everyone based on the following format:

```json
  {
    "userStatuses": [
      {
        "userId": 123,
        "isOnline": true
      },
      {
        "userId": 456,
        "isOnline": false
      }
      , //...
    ]
  }
```


## Response Codes

- `/user/:id` (GET)
```yaml

  403: UNAUTHORIZED,
  400: PROFILE_NOT_FOUND,
  200: PROFILE_FETCHED,
  500: INTERNAL_SERVER_ERROR

```

- `/user/:id` (PATCH)
```yaml

  403: UNAUTHORIZED,
  400: {
    PROFILE_NOT_FOUND,
    USERNAME_EXISTS,
    MISSING_FIELDS,
    ZERO_CHANGES
  },
  200: PROFILE_UPDATED,
  500: INTERNAL_SERVER_ERROR

```

- `/upload` 
```yaml
  413: FILE_TOO_LARGE
  401: UNAUTHORIZED,
  400: FILE_REQUIRED,
  200: AVATAR_UPLOADED,
  500: INTERNAL_SERVER_ERROR

```

- `/avatar/:fileName` 
```yaml
  401: UNAUTHORIZED,
  400: FILE_NAME_REQUIRED
  404: FILE_NOT_FOUND
  200: AVATAR_UPLOADED,
  500: INTERNAL_SERVER_ERROR

```

---
## Notes

- File uploads are handled using multipart/form-data via formData.
- Avatar images are served statically by filename via /avatar/:fileName.
- Only users with valid tokens can access these endpoints.
- PATCH is flexible and allows updating one or many fields.