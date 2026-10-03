# Ticket Management REST API

A layered Express API for managing tickets and comments.

## Requirements

- Node.js 20+ recommended
- npm

## Setup

```powershell
npm install
npm run dev
```

The API runs at `http://localhost:3000` by default.

## Available scripts

```text
npm run dev    Start the development server with Nodemon
npm start      Start the server
npm test       Run Node's test command when tests are added
```

## API documentation

See [docs/API.md](docs/API.md) for the endpoint table, request fields, pagination, filtering, sorting, status transitions, and response shapes.

## Postman

Import [postman/Ticket-Management.postman_collection.json](postman/Ticket-Management.postman_collection.json) into Postman. The collection uses `http://localhost:3000` as its default base URL and supports the API's JSON and `application/x-www-form-urlencoded` request bodies.

## Architecture

```text
src/
├── constants/
├── controllers/
├── middleware/
├── repositories/
├── routes/
├── services/
└── validators/
```

Routes receive HTTP requests, validators reject invalid input, controllers coordinate the request, services contain business rules, and repositories provide the persistence boundary.

## Current persistence

The current repository implementation uses in-memory seed data. Data resets when the server restarts. A database repository can be introduced later without changing controllers or routes.

## Example request

```text
POST /api/v1/tickets
Content-Type: application/x-www-form-urlencoded
```

```text
title=Payment issue
description=Payment is failing during checkout.
priority=high
requester=user@example.com
```
"# Ticket-Management-RestAPI" 
