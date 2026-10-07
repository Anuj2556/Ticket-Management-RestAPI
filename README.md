# Ticket Management REST API

A layered Express API for managing tickets and comments, featuring JWT authentication and role-based access control.

## Requirements

- Node.js 20+ recommended
- npm

## Environment Configuration

Create a `.env` file in the root directory (refer to `.env.example`):

```env
PORT=3000
DB_PATH=ticket-management.db
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=1d
```

## Setup

```powershell
npm install
npm run dev
```

The API runs at `http://localhost:3000` by default.

## Available scripts

```text
npm run dev    Start the development server with Nodemon
npm start      Start the production server
npm test       Run tests
```

## Authentication & Authorization

The API supports both JSON REST API requests and browser form submissions via EJS views.

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/auth/register` | Register a new user | Public |
| `POST` | `/auth/login` | Login and receive a JWT Bearer token | Public |
| `GET` | `/auth/register` | Browser registration UI page | Public |
| `GET` | `/auth/login` | Browser login UI page | Public |

### Protected Endpoints

All `/api/v1/tickets` and `/api/v1/tickets/:ticketId/comments` routes require a valid JWT token in the `Authorization` header:

```text
Authorization: Bearer <your_jwt_token>
```

- When creating tickets (`POST /api/v1/tickets`), the `requester` defaults automatically to the authenticated user's email.
- When creating comments (`POST /api/v1/tickets/:ticketId/comments`), the `author` defaults automatically to the authenticated user's email.
- Deleting tickets (`DELETE /api/v1/tickets/:ticketId`) requires an `admin` role.

---

## Example Usage

### 1. Register a user
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/auth/register" -Method Post -ContentType "application/json" -Body '{"email":"agent@example.com","password":"password123"}'
```

### 2. Login to get token
```powershell
$res = Invoke-RestMethod -Uri "http://localhost:3000/auth/login" -Method Post -ContentType "application/json" -Body '{"email":"agent@example.com","password":"password123"}'
$token = $res.data.token
```

### 3. Create a ticket (using Bearer token)
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/v1/tickets" -Method Post -ContentType "application/json" -Headers @{ Authorization = "Bearer $token" } -Body '{"title":"Login issue","description":"Users cannot log in to dashboard","priority":"high"}'
```

### 4. List tickets
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/v1/tickets" -Headers @{ Authorization = "Bearer $token" }
```

---

## API Documentation

See [docs/API.md](docs/API.md) for full endpoint specifications, pagination, sorting, status transitions, and error shapes.

## Architecture

```text
src/
├── config/         Database and environment setup
├── constants/      Status enums and transitions
├── controllers/    Route handlers and HTTP responses
├── middleware/     Authentication (JWT), error handlers, not-found
├── repositories/   Database access boundary (better-sqlite3)
├── routes/         Express route definitions
├── services/       Business logic and authentication
├── validators/     Zod request validators
└── views/          EJS templates (login, register)
```

## Persistence

The API uses SQLite through `better-sqlite3`. Tables (`tickets`, `comments`, `users`) and indexes are initialized automatically when the application starts.
