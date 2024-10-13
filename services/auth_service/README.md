# Authentication Service

This Authentication Service is a REST API built with Node.js and Express for managing user authentication and authorization. It integrates Firebase Authentication, JWT (JSON Web Tokens), Redis for caching tokens, and other middleware to secure routes and handle token management effectively.

## Features

- User Registration and Login
- Token-based Authentication with JWT
- Firebase Authentication Integration
- Refresh Token Management
- Redis Caching for tokens
- Role-based Access Control (RBAC)
- Social Login with Firebase
- Logout functionality (revoking tokens)

## Technologies Used

- **Node.js** - Server-side JavaScript runtime.
- **Express.js** - Web framework for Node.js.
- **Firebase Authentication** - User authentication service for login and social login.
- **JWT** - JSON Web Tokens for secure route protection.
- **Redis** - Caching for session tokens and user data.
- **Mocha, Chai, Sinon** - Testing framework and libraries.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v14.x or higher)
- **Redis** (for token caching)
- **Firebase Admin SDK** (for Firebase authentication)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/johnamet/ecommerce_app.git
   cd auth_service
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables. Create a `.env` file in the root directory and add the following values:

   ```bash
   PORT=5000
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=1h
   FIREBASE_PROJECT_ID=your_firebase_project_id
   FIREBASE_PRIVATE_KEY=your_firebase_private_key
   FIREBASE_CLIENT_EMAIL=your_firebase_client_email
   REDIS_HOST=localhost
   REDIS_PORT=6379
   ```

4. Set up Firebase Admin SDK:

   Download your Firebase Admin SDK credentials and place the JSON file in the root directory. Update the `.env` file accordingly.

## Running the Service

1. Ensure Redis is running locally or provide the correct Redis host and port in the `.env` file.
   
2. Start the server:

   ```bash
   npm run start-server
   ```

   The service will be available at `http://localhost:5000`.

## API Endpoints

Here’s a summary of the key endpoints in the authentication service:

### Authentication Routes

| Method | Endpoint                | Description                                      |
|--------|-------------------------|--------------------------------------------------|
| POST   | `/api/v1/auth/register`  | Register a new user with email and password.     |
| POST   | `/api/v1/auth/login`     | Log in an existing user and return tokens.       |
| POST   | `/api/v1/auth/refresh`   | Refresh the access token using the refresh token.|
| POST   | `/api/v1/auth/logout`    | Log out the user and revoke their tokens.        |

### Token Management

| Method | Endpoint                     | Description                                      |
|--------|------------------------------|--------------------------------------------------|
| POST   | `/api/v1/auth/revoke-token`   | Revoke refresh tokens manually (if needed).      |

### Error Codes

The API returns standard HTTP status codes. For example:

- `200 OK` - Success
- `400 Bad Request` - Invalid input or missing fields.
- `401 Unauthorized` - Invalid or expired token.
- `403 Forbidden` - No permission to access the resource.
- `500 Internal Server Error` - Something went wrong on the server.

## Middleware

The service includes the following middleware:

- **Token Verifier** - Verifies access tokens in the `Authorization` header.
- **Role-based Access Control** - Grants/denies access based on the user's role (admin, user).
- **Error Handling** - Handles errors and sends appropriate responses.

## Testing

The service is fully tested using **Mocha**, **Chai**, **Chai-HTTP**, and **Sinon** for unit and integration tests.

### Running Tests

To run the test suite, use:

```bash
npm test
```

Tests are located in the `tests/` directory, and they cover:

- User Registration and Login
- Token Management (Access and Refresh)
- Protected Routes
- Error Handling

### Example Test Configuration

If tests are in a different directory, ensure the `package.json` is updated accordingly:

```json
{
  "scripts": {
    "test": "./node_modules/.bin/mocha src/test/*.js --require @babel/register --exit"
  }
}
```

### Example Test Case

Here's a sample test for the login route:

```javascript
const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const server = require('../src/server');
const { expect } = chai;

chai.use(chaiHttp);

describe('AuthController - Login', () => {
  it('should login the user and return tokens', (done) => {
    chai.request(server)
      .post('/api/v1/auth/login')
      .send({ email: 'test@example.com', password: 'password123' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('accessToken');
        expect(res.body).to.have.property('refreshToken');
        done();
      });
  });

  // Additional tests...
});
```

## Project Structure

```
/project-root
  /src
    /controllers
      - AuthController.js
      - AppController.js
    /middlewares
      - TokenVerification.js
      - PrettyPrint.js
   /routes
      - auth.js
      - index.js
    /utils
      - firebase.js
      - redis.js
      - tokens.js
    - server.js
  /tests
    - authController.test.js
  - package.json
  - .env
```

## Future Enhancements

- **OAuth 2.0**: Add more OAuth providers for social login.
- **Rate Limiting**: Implement rate limiting for login attempts.
- **Multi-Factor Authentication**: Add support for MFA using Firebase's built-in MFA functionality.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---