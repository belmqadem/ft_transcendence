# Auth Service 

## Overview
The `auth-service` handles user authentication, registration, session management, and two-factor authentication (2FA). It is designed for a secure microservices architecture using JWT tokens and secure HTTP-only cookies.

---

## 📚 Session Managment (`/auth`)

### 🧍 Authentication

| Method | Path           | Description                           | Auth Required | Body                      | Rate Limited |
|--------|----------------|---------------------------------------|---------------|---------------------------|--------------|
| POST   | `/login`       | Login with email/username & password  | ❌            | `{ email, password }`     | ✅           |
| POST   | `/register`    | Register new user                     | ❌            | `{ username, email, password, confirmPassword }` | ✅ |
| GET    | `/google`      | Google OAuth login                    | ❌            | none                      | ✅           |
| GET    | `/42`          | 42 OAuth login                        | ❌            | none                      | ✅           |
| POST   | `/logout`      | Logout & revoke refresh token         | ✅            | none                      | ❌           |
| GET    | `/me`          | Get current user info                 | ✅            | none                      | ❌           |
| POST   | `/refresh`     | Refresh JWT tokens                    | ✅            | none                      | ❌           |

### 🔒 Account Recovery

| Method | Path                | Description                        | Auth Required | Body                      | Rate Limited |
|--------|---------------------|------------------------------------|---------------|---------------------------|--------------|
| POST   | `/lost-password`    | Request OTP code via email         | ❌            | `{ email }`               | ✅           |
| POST   | `/verify-code`      | Verify received OTP code           | ✅            | `{ otpCode }`             | ✅           |
| POST   | `/update-password`  | Update password using OTP session  | ✅            | `{ password, confirmPassword }` | ✅     |

### ⚙️ Credential Management

| Method | Path                          | Description                                      | Auth Required | Body                      | Rate Limited |
|--------|-------------------------------|--------------------------------------------------|---------------|---------------------------|--------------|
| POST   | `/update-credentials`         | Update email and/or password (2FA OTP if enabled)| ✅            | `{ email?, password?, confirmPassword? }` | ✅ |
| POST   | `/verify-update-credentials` | Verify OTP & finalize credential updates         | ✅            | `{ otpCode }`             | ✅           |
| DELETE | `/delete`                     | Delete user across all services                  | ✅            | none                      | ✅           |

---

## 🔐 Two-Factor Authentication (`/2fa`)

### 📱 App-based 2FA

| Method | Path               | Description                            | Auth Required | Body        | Rate Limited |
|--------|--------------------|----------------------------------------|---------------|-------------|--------------|
| POST   | `/app/setup`       | Generate QR code                       | ✅            | none        | ✅           |
| POST   | `/app/verify-setup`| Verify code to enable 2FA              | ✅            | `{ otpCode }`| ✅          |
| POST   | `/app/verify-login`| Verify 2FA login code                  | ✅            | `{ otpCode }`| ✅          |

### 📧 Email-based 2FA

| Method | Path                  | Description                         | Auth Required | Body        | Rate Limited |
|--------|-----------------------|-------------------------------------|---------------|-------------|--------------|
| POST   | `/email/setup`        | Send 2FA code to email              | ✅            | none        | ✅           |
| POST   | `/email/verify-setup` | Verify email code & enable 2FA     | ✅            | `{ otpCode }`| ✅          |
| POST   | `/email/verify-login` | Verify login code from email       | ✅            | `{ otpCode }`| ✅          |

### 🔧 2FA Settings

| Method | Path        | Description                       | Auth Required | Body        | Rate Limited |
|--------|-------------|-----------------------------------|---------------|-------------|--------------|
| GET    | `/`         | Get enabled 2FA methods           | ✅            | none        | ❌           |
| POST   | `/enable`   | Enable 2FA method                 | ✅            | `{ method }`| ❌           |
| POST   | `/disable`  | Disable 2FA method                | ✅            | `{ method }`| ❌           |
| POST   | `/primary`  | Set primary 2FA method            | ✅            | `{ method }`| ❌           |

---


## Schemas

- **Login Schema**:
  - `email`: string, required
  - `password`: string, required

- **Register Schema**:
  - `username`: string, required
  - `email`: string, required
  - `password`: string, required

- **Token Schema**:
  - `token`: string, required

- **otpCode Schema**:
  - `otpCode`: string, required

- **methodType Schema**
  - `method`: string, required
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

**Token Error Codes**
```yaml
  401: {
    TOKEN_REQUIRED
    TEMP_TOKEN_EXPIRED
    TEMP_TOKEN_INVALID
    ACCESS_TOKEN_EXPIRED
    ACCESS_TOKEN_INVALID
  }
  500: INTERNAL_SERVER_ERROR
```

**Rate Limit Respose**
```yaml
{
  {
    statusCode: 429,
    error: 'Too Many Requests',
    message: 'Rate limit exceeded, retry in 1 minute'
  }
}
```

**Prefix: /auth**

- `/delete`

```yaml

  401: UNAUTHORIZED
  200: USER_DATA_DELETED
  500: INTERNAL_SERVER_ERROR

```

- `/login`

```yaml

  400: {
    INVALID_CREDENTIALS
    USER_ALREADY_LINKED
    INVALID_PASSWORD
  }
  200: USER_LOGGED_IN
  206: TWOFA_REQUIRED
  500: INTERNAL_SERVER_ERROR

```

- `/register`

```yaml

  400: {
    UNMATCHED_PASSWORDS
    PASSWORD_POLICY
    USER_EXISTS
  }
  201: USER_REGISTERED
  500: INTERNAL_SERVER_ERROR

```

- `/google`

```yaml

  400: AUTH_CODE_REQUIRED
  200: USER_LOGGED_IN
  201: USER_REGISTERED
  500: INTERNAL_SERVER_ERROR

```

- `/42`

```yaml

  400: AUTH_CODE_REQUIRED
  200: USER_LOGGED_IN
  201: USER_REGISTERED
  500: INTERNAL_SERVER_ERROR

```

- `/logout`

```yaml

  401: {
    UNAUTHORIZED
    REFRESH_TOKEN_REQUIRED
    REFRESH_TOKEN_INVALID
  }
  200: USER_LOGGED_OUT
  500: INTERNAL_SERVER_ERROR

```

- `/me`

```yaml

  401: UNAUTHORIZED
  200: USER_FETCHED
  500: INTERNAL_SERVER_ERROR

```

- `/refresh`

```yaml

  401: {
    REFRESH_TOKEN_REQUIRED
    REFRESH_TOKEN_INVALID
    REFRESH_TOKEN_EXPIRED
  }
  200: TOKEN_REFRESHED
  500: INTERNAL_SERVER_ERROR

```

- `/verify-code`
```yaml

  400: CODE_NOT_SET
  401: {
    UNAUTHORIZED
    OTP_REQUIRED
    OTP_INVALID
  }
  200: CODE_VERIFIED
  500: INTERNAL_SERVER_ERROR

```

- `/update-password`
```yaml

  400: {
    USER_LINKED
    UNMATCHED_PASSWORDS
  } 
  401: UNAUTHORIZED
  200: USER_LOGGED_IN
  206: TWOFA_REQUIRED
  500: INTERNAL_SERVER_ERROR

```

- `/update-credentials`
```yaml

  400: {
    PASSWORDS_REQUIRED
    INVALID_PASSWORD
    UNMATCHED_PASSWORDS
    PASSWORD_POLICY
    EMAIL_EXISTS
  } 
  401: UNAUTHORIZED
  200: CREDENTIALS_UPDATED
  206: TWOFA_REQUIRED
  500: INTERNAL_SERVER_ERROR

```

- `/verify-update-credentials`
```yaml

  400: {
    NO PENDING_CREDENTIALS
    TWOFA_NOT_SET
    TWOFA_NOT_ENABLED
    EMAIL_EXISTS
  } 
  401: {
    UNAUTHORIZED
    OTP_REQUIRED
    OTP_INVALID
  }
  200: CREDENTIALS_UPDATED
  500: INTERNAL_SERVER_ERROR

```

**Prefix: /2fa**

- `/app/setup`
```yaml

  401: UNAUTHORIZED
  400: TWOFA_ALREADY_ENABLED
  400: TWOFA_ALREADY_PENDING
  200: SCAN_QR
  500: INTERNAL_SERVER_ERROR

```

- `/app/verify-setup`
```yaml

  400: {
    TWOFA_NOT_SET
    TWOFA_ALREADY_ENABLED
  } 
  401: {
    UNAUTHORIZED
    OTP_REQUIRED
    OTP_INVALID
  }
  200: TWOFA_ENABLED
  500: INTERNAL_SERVER_ERROR

```

- `/app/verify-login`
```yaml

  400: {
    TWOFA_NOT_SET
    TWOFA_NOT_ENABLED
  }
  401: {
    UNAUTHORIZED
    OTP_REQUIRED
    OTP_INVALID
  }
  200: USER_LOGGED_IN
  500: INTERNAL_SERVER_ERROR

```

- `/email/setup`
```yaml

  401: UNAUTHORIZED
  400: TWOFA_ALREADY_ENABLED
  200: CODE_SENT
  500: INTERNAL_SERVER_ERROR

```

- `/email/verify-setup`
```yaml

  401: {
    UNAUTHORIZED
    OTP_REQUIRED
    OTP_INVALID
  }
  400: {
    TWOFA_NOT_SET
    TWOFA_ALREADY_ENABLED
  }
  200: TWOFA_ENABLED
  500: INTERNAL_SERVER_ERROR

```

- `/email/verify-login`
```yaml

  400: {
    TWOFA_NOT_SET
    TWOFA_NOT_ENABLED
  } 
  401: {
    UNAUTHORIZED
    OTP_REQUIRED
    OTP_INVALID
  }
  200: USER_LOGGED_IN
  500: INTERNAL_SERVER_ERROR

```

- `/lost-password`
```yaml

  400: {
    INVALID_EMAIL
    USER_LINKED (linked to google or 42 = no password)
  } 
  200: CODE_SENT
  500: INTERNAL_SERVER_ERROR

```

- `/`
```yaml

  401: UNAUTHORIZED
  404: NO_METHODS_FOUND
  200: METHODS_FETCHED
  500: INTERNAL_SERVER_ERROR

```

- `/disable`
```yaml

  401: UNAUTHORIZED
  400: METHODS_NOT_ENABLED
  200: METHOD_DISABLED
  500: INTERNAL_SERVER_ERROR

```

- `/enable`
```yaml

  401: UNAUTHORIZED
  400: METHODS_NOT_ENABLED
  200: METHOD_DISABLED
  500: INTERNAL_SERVER_ERROR

```

- `/primary`
```yaml

  401: UNAUTHORIZED
  400: METHODS_NOT_ENABLED
  200: PRIMARY_METHOD_UPDATED
  500: INTERNAL_SERVER_ERROR

```
---


## Notes

-  All tokens are JWTs and sent via secure, HTTP-only cookies.
-  refresh endpoint issues a new refresh + access token.
-  delete triggers cross-service user deletion via RabbitMQ.
-  2FA setup is required before enabling it as primary.
-  App 2FA uses TOTP with QR code (e.g., Google Authenticator).
-  Email 2FA sends time-limited codes to the user's inbox.