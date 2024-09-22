# E-Commerce Backend

## Overview

This eCommerce backend is built using a **microservices architecture** to handle various aspects of an online store. The services include authentication, user management, order processing, product inventory, review management, email notifications, and activity tracking. Each service is hosted on separate servers, ensuring scalability, maintainability, and the ability to handle high traffic.

The backend system is designed with a focus on:
- **Security**: JWT authentication, role-based access control, and Firebase for social login.
- **Scalability**: Microservices architecture with communication through message brokers.
- **Performance**: Caching with Redis, optimized database queries, and asynchronous processing for heavy tasks like notifications and emails.
- **Extensibility**: Easy to add more services or modify existing ones without affecting the entire system.

## Project Structure

The backend consists of the following services:

### 1. **Authentication Service** (Node.js)
Handles:
- User registration (email and Firebase social login)
- JWT token creation and validation
- Access token and refresh token management

### 2. **User Service** (Flask)
Manages:
- User profiles (fetching and updating user data)
- Role management (user roles, admins)
- Activity logging (interacts with the activity tracking service)

### 3. **Order Service** (Flask)
Handles:
- Order creation, updating, and tracking
- Integration with payment gateways (not implemented yet)
- Notifications upon successful order placement

### 4. **Product Service** (Flask)
Manages:
- Product catalog (CRUD operations)
- Inventory management (with tracking of stock levels)
- Caching for fast product lookups

### 5. **Store Service** (Flask)
Manages:
- Store registration and updates
- Fetching store details
- Handling store activity and status (e.g., published, deactivated)

### 6. **Review Service** (Flask)
Handles:
- Review creation, editing, and deletion for products
- Aggregating product review scores

### 7. **Email Service** (Flask)
Responsible for:
- Sending transactional emails (e.g., order confirmation, password reset)
- Queueing emails with a message broker (RabbitMQ)

### 8. **Notifications Service** (Node.js)
Handles:
- Real-time push notifications for user-related events
- Uses a message broker (RabbitMQ) to receive event updates (e.g., new order, profile changes)

### 9. **Activity Tracking Service** (Flask)
Manages:
- Tracking user activity across the platform (login, purchases, profile changes)
- Stores logs for analytics and auditing purposes

### Message Broker
The services communicate using **RabbitMQ** for messaging and event-driven architecture. RabbitMQ handles:
- Sending and receiving emails
- Real-time notifications
- Activity tracking

### Caching
The system uses **Redis** for caching:
- User sessions
- Frequently accessed product data
- Recently viewed items

## Tech Stack

### Languages:
- **Node.js**: For the authentication and notifications services
- **Python (Flask)**: For user, order, product, store, review, email, and activity tracking services

### Frameworks:
- **Express.js**: For the Node.js services
- **Flask**: For the Python services

### Databases:
- **MongoDB**: For storing user profiles, orders, products, reviews, and store data
- **Redis**: For caching data across the services
- **Elasticsearch**: For indexing and searching across product catalogs

### Message Brokers:
- **RabbitMQ**: For message passing between services

### Other Libraries:
- **jsonwebtoken**: For managing JWT tokens in authentication
- **firebase-admin**: For Firebase social login token verification
- **Pika**: For RabbitMQ integration with Flask services
- **amqplib**: For RabbitMQ integration with Node.js services

## Setup and Installation

### Prerequisites:
- **Node.js** v14 or later
- **Python** 3.9 or later
- **MongoDB** 4.4 or later
- **RabbitMQ** 3.8 or later
- **Redis** 6.0 or later
- **Elasticsearch** 7.x

### Steps:
1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-repo/ecommerce-backend.git
   cd ecommerce-backend
   ```

2. **Install dependencies** for each service:
   - For Node.js services (auth, notifications):
     ```bash
     cd services/auth-service
     npm install
     cd ../notifications-service
     npm install
     ```
   - For Flask services (user, order, product, store, review, email, activity tracking):
     ```bash
     cd services/user-service
     pip install -r requirements.txt
     ```

3. **Environment Variables**:
   Set up environment variables for each service by creating a `.env` file in the root of each service folder:
   - MongoDB connection string
   - RabbitMQ connection settings
   - Redis settings
   - JWT secret keys
   - Firebase Admin credentials

4. **Run the services**:
   - For Node.js services:
     ```bash
     cd services/auth-service
     npm start
     cd ../notifications-service
     npm start
     ```
   - For Flask services:
     ```bash
     cd services/user-service
     flask run
     ```

5. **Start RabbitMQ** and **Redis** servers:
   ```bash
   sudo service rabbitmq-server start
   sudo service redis-server start
   ```

6. **Run tests**:
   Each service has its own unit and integration tests written using **Mocha**, **Chai**, and **Sinon** for Node.js services and **PyTest** for Flask services.
   - Run tests for Node.js services:
     ```bash
     npm test
     ```
   - Run tests for Flask services:
     ```bash
     pytest
     ```

## API Documentation

Each service exposes RESTful APIs, with detailed documentation available using **Swagger** (for Node.js services) and **Flask-RESTPlus** (for Python services).

### Authentication Service:
- **POST /auth/register**: Register a new user
- **POST /auth/login**: Login and receive JWT
- **POST /auth/refresh**: Get a new access token using refresh token

### Product Service:
- **GET /products**: List all products
- **POST /products**: Create a new product
- **PUT /products/:id**: Update a product
- **DELETE /products/:id**: Delete a product

... and so on for each service.

## CI/CD Pipeline

The project uses **GitHub Actions** for continuous integration and deployment:
- Unit tests and linting run on each pull request.
- Docker containers are built and pushed to a container registry on each successful merge to `main`.
- The services are deployed to **Kubernetes** clusters managed by **AWS EKS**.


"dependencies": {
    "bull": "^3.16.0",
    "chai-http": "^4.3.0",
    "express": "^4.21.0",
    "mime-types": "^2.1.27",
    "mongodb": "^3.5.9",
    "redis": "^2.8.0",
    "sha1": "^1.1.1",
    "uuid": "^8.2.0"
  },
  "devDependencies": {
    "@babel/cli": "^7.8.0",
    "@babel/core": "^7.8.0",
    "@babel/node": "^7.8.0",
    "@babel/preset-env": "^7.8.2",
    "@babel/register": "^7.8.0",
    "chai": "^4.2.0",
    "chai-http": "^4.3.0",
    "eslint": "^6.4.0",
    "eslint-config-airbnb-base": "^14.0.0",
    "eslint-plugin-import": "^2.18.2",
    "eslint-plugin-jest": "^22.17.0",
    "mocha": "^6.2.2",
    "nodemon": "^2.0.2",
    "request": "^2.88.0",
    "sinon": "^7.5.0"
  }