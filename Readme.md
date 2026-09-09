# Team Task Management API

A RESTful backend API for managing teams, projects, and tasks with role-based access control, JWT authentication, task assignment, filtering, pagination, and real-time Socket.IO notifications.

## Features

- JWT-based authentication
- Access and refresh token authentication
- Role-based authorization
- User management
- Project management
- Project member management
- Task CRUD operations
- Task assignment
- Task status management
- Task priority management
- Task ownership and access control
- Search tasks by title and description
- Filter tasks by status and priority
- Pagination
- Real-time task assignment notifications
- Real-time task status change notifications
- MongoDB database integration
- Password hashing
- Input validation
- Centralized error handling
- Swagger/OpenAPI API documentation

---

## 🛠️ Tech Stack

| Technology        | Purpose                       |
| ----------------- | ----------------------------- |
| Node.js           | Backend runtime               |
| Express.js        | REST API framework            |
| MongoDB           | Database                      |
| Mongoose          | MongoDB ODM                   |
| Socket.IO         | Real-time communication       |
| JWT               | Authentication                |
| bcrypt            | Password hashing              |
| dotenv            | Environment configuration     |
| Swagger / OpenAPI | API documentation and testing |

---

## 📚 API Documentation

The API is documented using **Swagger/OpenAPI 3.0**.

Swagger provides an interactive interface where you can view and test the REST API endpoints directly from the browser.

### Swagger UI

After starting the application, open:

```text
http://localhost:3000/api-docs
```

From Swagger UI, you can:

- View all available API endpoints
- View request parameters and request bodies
- Test authentication and protected endpoints
- Authorize requests using JWT Bearer tokens
- Test different user roles and permissions
- View API responses and HTTP status codes
- Test task filtering, searching, and pagination
- Test CRUD operations for users, projects, and tasks

### Authentication

For protected endpoints:

1. Login using:

```text
POST /api/auth/login
```

2. Copy the `accessToken` from the response.

3. Click **Authorize 🔒** in Swagger UI.

4. Enter:

```text
Bearer YOUR_ACCESS_TOKEN
```

5. Click **Authorize**.

You can then test protected endpoints according to the authenticated user's role and permissions.

> **Note:** Swagger documents and tests the REST API. Real-time Socket.IO notifications are tested separately using the included `test-socket.js` client.

---

## 📁 Project Structure

```text
Team Task Management API/
│
├── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   ├── taskController.js
│   │   └── userController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── validationMiddleware.js
│   │
│   ├── models/
│   │   ├── userSchema.js
│   │   ├── projectSchema.js
│   │   └── taskSchema.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── taskRoutes.js
│   │   └── userRoutes.js
│   │
│   ├── socket/
│   │   └── socket.js
│   │
│   ├── utils/
│   │   └── jwt.js
│   │
│   └── server.js
│
├── test-socket.js
├── .env
├── .gitignore
├── package.json
└── README.md
```

---

## 🔐 User Roles

The API supports role-based access control.

| Role    | Description                                  |
| ------- | -------------------------------------------- |
| ADMIN   | Full administrative access                   |
| MANAGER | Manage projects, members, and tasks          |
| MEMBER  | Access assigned tasks and update task status |

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd "Team Task Management API"
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
```

Add any additional environment variables required by the application.

### 4. Start the server

```bash
node src/server.js
```

The server will run at:

```text
http://localhost:3000
```

### 5. Open Swagger

```text
http://localhost:3000/api-docs
```

---

## 🔄 Real-Time Notifications

The application uses Socket.IO to provide real-time notifications.

Currently supported notifications include:

- Task assignment notifications
- Task status change notifications

To test Socket.IO:

### Start the API server

```bash
node src/server.js
```

### Run the Socket.IO test client

In another terminal:

```bash
node test-socket.js
```

The Socket.IO client connects using a JWT access token and listens for real-time task notifications.

---

## 🔎 API Overview

### Authentication

| Method | Endpoint             | Description         |
| ------ | -------------------- | ------------------- |
| POST   | `/api/auth/register` | Register a new user |
| POST   | `/api/auth/login`    | Login user          |

### Users

| Method | Endpoint                | Description        |
| ------ | ----------------------- | ------------------ |
| GET    | `/api/users`            | Get all users      |
| GET    | `/api/users/:id`        | Get user by ID     |
| PATCH  | `/api/users/:id/role`   | Update user role   |
| PATCH  | `/api/users/:id/status` | Update user status |

### Projects

| Method | Endpoint                    | Description             |
| ------ | --------------------------- | ----------------------- |
| GET    | `/api/projects`             | Get all projects        |
| POST   | `/api/projects`             | Create a project        |
| GET    | `/api/projects/:id`         | Get project by ID       |
| PUT    | `/api/projects/:id`         | Update a project        |
| DELETE | `/api/projects/:id`         | Delete a project        |
| POST   | `/api/projects/:id/members` | Add a project member    |
| DELETE | `/api/projects/:id/members` | Remove a project member |

### Tasks

| Method | Endpoint         | Description    |
| ------ | ---------------- | -------------- |
| POST   | `/api/tasks`     | Create a task  |
| GET    | `/api/tasks`     | Get tasks      |
| GET    | `/api/tasks/:id` | Get task by ID |
| PUT    | `/api/tasks/:id` | Update a task  |
| DELETE | `/api/tasks/:id` | Delete a task  |

The task listing endpoint supports:

- Status filtering
- Priority filtering
- Search by title and description
- Pagination

Example:

```text
GET /api/tasks?status=IN_PROGRESS
```

```text
GET /api/tasks?priority=HIGH
```

```text
GET /api/tasks?search=Socket
```

```text
GET /api/tasks?page=1&limit=10
```

---

## 🧪 Testing

REST API endpoints can be tested using:

- Swagger UI
- cURL
- Postman

Socket.IO real-time functionality can be tested using:

```bash
node test-socket.js
```

---

## 🔒 Security

The API implements:

- JWT access tokens
- Refresh tokens
- Password hashing using bcrypt
- Authentication middleware
- Role-based authorization
- Input validation
- Protected API endpoints
- User account status validation

Sensitive environment variables such as database credentials and JWT secrets should be stored in `.env` and excluded from Git using `.gitignore`.

---

## 📌 Project Status

The API is fully implemented with authentication, authorization, user management, project management, task management, filtering, searching, pagination, Swagger/OpenAPI documentation, and real-time Socket.IO notifications.

---
