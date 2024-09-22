Here’s a README section specifically for the **Authentication Service**:

---

# Authentication Service

## Overview

The **Authentication Service** is responsible for handling user registration, login, and token management. It utilizes **JWT** (JSON Web Tokens) for secure authentication and **Firebase** for social login integration. This service issues access and refresh tokens to ensure secure communication between clients and the backend services. The service also handles token validation and renewal via refresh tokens.

The service interacts with other microservices, such as the **User Service** and the **Activity Tracking Service**, by providing verified user identity and role information.

## Architecture

### 1. **Firebase Authentication**
   - Manages user authentication via social logins (Google, Facebook, etc.) through Firebase.
   - Verifies Firebase tokens and retrieves user information.

### 2. **JWT Token Management**
   - Issues **Access Tokens** and **Refresh Tokens** upon successful login or registration.
   - Access tokens are short-lived, while refresh tokens are long-lived, allowing users to renew their sessions without re-authenticating.

### 3. **Redis Caching**
   - Access tokens are cached in Redis with a TTL (Time to Live) to prevent repetitive token generation.
   - Caching improves performance by storing user session information and preventing redundant token verifications.

### 4. **Message Broker (RabbitMQ)**
   - Sends user activity logs (e.g., successful login, failed login attempts) to the **Activity Tracking Service** for auditing purposes.

### Workflow:
1. **User Registration/Authentication**:
   - Users can register or log in using either email/password or a social login provider (handled by Firebase).
   - The service verifies the credentials and returns JWT access and refresh tokens.

2. **Token Validation**:
   - Each subsequent request from the client includes the access token in the Authorization header.
   - The service verifies the token and either grants access or denies it.

3. **Token Refresh**:
   - When the access token expires, the client sends the refresh token to obtain a new access token.

### Key Components:
- **Firebase Admin SDK**: For managing user authentication and tokens for social login.
- **jsonwebtoken**: For issuing and verifying JWT tokens.
- **Redis**: For caching and improving token validation performance.
- **RabbitMQ**: For sending activity logs to other services.

## API Routes

| Method | Endpoint                | Description                                                | Authentication Type  |
|--------|-------------------------|------------------------------------------------------------|----------------------|
| POST   | `/auth/register`         | Registers a new user with email and password               | None                 |
| POST   | `/auth/login`            | Logs in a user and returns JWT access & refresh tokens      | None                 |
| POST   | `/auth/firebase-login`   | Logs in a user via Firebase and returns JWT tokens          | Firebase Social Login|
| POST   | `/auth/refresh`          | Generates a new access token using the refresh token        | Refresh Token        |
| POST   | `/auth/logout`           | Logs out a user and invalidates their refresh token         | Access Token         |
| POST   | `/auth/verify`           | Verifies the provided access token                          | Access Token         |

### Route Breakdown:

1. **`POST /auth/register`**  
   - **Description**: Registers a new user by accepting an email and password.  
   - **Request Body**: 
     ```json
     {
       "email": "user@example.com",
       "password": "password123"
     }
     ```
   - **Response**: Returns a success message along with the user details and tokens.  
   - **Authentication**: None (public route).

2. **`POST /auth/login`**  
   - **Description**: Logs in a user using email and password.  
   - **Request Body**:
     ```json
     {
       "email": "user@example.com",
       "password": "password123"
     }
     ```
   - **Response**: Returns JWT access and refresh tokens.  
   - **Authentication**: None (public route).

3. **`POST /auth/firebase-login`**  
   - **Description**: Logs in a user through a social login (Google, Facebook, etc.) handled by Firebase.  
   - **Request Body**:
     ```json
     {
       "firebaseToken": "FIREBASE_ID_TOKEN"
     }
     ```
   - **Response**: Returns JWT access and refresh tokens.  
   - **Authentication**: Firebase social login token.

4. **`POST /auth/refresh`**  
   - **Description**: Generates a new access token when the old one has expired, using the refresh token.  
   - **Request Body**:
     ```json
     {
       "refreshToken": "REFRESH_TOKEN"
     }
     ```
   - **Response**: Returns a new access token.  
   - **Authentication**: Requires refresh token.

5. **`POST /auth/logout`**  
   - **Description**: Logs out a user, invalidating the refresh token.  
   - **Request Body**: None.  
   - **Response**: Returns a success message upon successful logout.  
   - **Authentication**: Requires a valid access token.

6. **`POST /auth/verify`**  
   - **Description**: Verifies the provided access token.  
   - **Request Body**:
     ```json
     {
       "accessToken": "ACCESS_TOKEN"
     }
     ```
   - **Response**: Returns the token verification status and user data if valid.  
   - **Authentication**: Requires access token.

## Setup and Installation

### Prerequisites:
- **Node.js** v14 or later
- **Redis** v6.0 or later
- **Firebase Project** for social login integration

### Installation Steps:
1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-repo/auth-service.git
   cd auth-service
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Variables**:
   Create a `.env` file in the root directory with the following variables:
   ```bash
   JWT_SECRET=your_jwt_secret
   REDIS_HOST=localhost
   REDIS_PORT=6379
   FIREBASE_ADMIN_SDK=path_to_your_firebase_service_account_key.json
   ```

4. **Run the service**:
   ```bash
   npm start
   ```

5. **Start Redis**:
   ```bash
   sudo service redis-server start
   ```

### Running Tests:
Tests for the authentication service can be run using **Mocha**:
```bash
npm test
```

## Security Considerations

- **Access Token Expiry**: The access tokens are short-lived (typically 15 minutes) to minimize the impact of token leakage.
- **Refresh Tokens**: Long-lived, but securely stored, and refreshed only when necessary.
- **Rate Limiting**: Implement rate-limiting middleware to prevent brute force attacks.
- **Firebase Security**: Firebase's admin SDK handles secure social login token verification.

---

This README section outlines the **Authentication Service** with its architecture, key components, API routes, and setup steps. It also provides the necessary details for installing, running, and testing the service.