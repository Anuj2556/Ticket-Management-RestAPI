# Ticket Management REST API

## Base URL

```text
http://localhost:3000
```

All resources are available under `/api/v1`.

## Response shapes

Single resource success:

```json
{
  "success": true,
  "data": {}
}
```

Collection success:

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalItems": 0,
    "totalPages": 0
  }
}
```

Error response:

```json
{
  "success": false,
  "error": {
    "statusCode": 400,
    "message": "Validation Failed",
    "details": []
  }
}
```

## API table

| Method | Path | Purpose |
|---|---|---|
| GET | `/health` | Health check |
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login and receive a JWT Bearer token |
| GET | `/auth/register` | HTML registration form |
| GET | `/auth/login` | HTML login form |
| POST | `/api/v1/tickets` | Create a ticket (Requires Bearer token) |
| GET | `/api/v1/tickets` | List tickets (Requires Bearer token) |
| GET | `/api/v1/tickets/:ticketId` | Get one ticket (Requires Bearer token) |
| PATCH | `/api/v1/tickets/:ticketId` | Update ticket fields (Requires Bearer token) |
| PATCH | `/api/v1/tickets/:ticketId/status` | Change ticket status (Requires Bearer token) |
| DELETE | `/api/v1/tickets/:ticketId` | Delete a ticket (Requires Admin role) |
| POST | `/api/v1/tickets/:ticketId/comments` | Create a comment (Requires Bearer token) |
| GET | `/api/v1/tickets/:ticketId/comments` | List comments (Requires Bearer token) |
| GET | `/api/v1/tickets/:ticketId/comments/:commentId` | Get one comment (Requires Bearer token) |
| PATCH | `/api/v1/tickets/:ticketId/comments/:commentId` | Update a comment (Requires Bearer token) |
| DELETE | `/api/v1/tickets/:ticketId/comments/:commentId` | Delete a comment (Requires Bearer token) |

## Ticket requests

### Create ticket

`POST /api/v1/tickets`

Accepts JSON or `application/x-www-form-urlencoded`.

```text
title=Payment issue
description=Payment is failing during checkout.
priority=high
requester=user@example.com
assignee=support@example.com
```

Allowed priorities: `low`, `medium`, `high`.

### List tickets

`GET /api/v1/tickets`

Query parameters:

| Parameter | Values | Default |
|---|---|---|
| `page` | Positive integer | `1` |
| `limit` | `1` to `100` | `10` |
| `status` | `open`, `in_progress`, `resolved`, `closed` | none |
| `priority` | `low`, `medium`, `high` | none |
| `sortBy` | `createdAt`, `updatedAt`, `title`, `priority`, `status` | `createdAt` |
| `sortOrder` | `asc`, `desc` | `desc` |

Example:

```text
GET /api/v1/tickets?page=1&limit=10&status=open&sortBy=createdAt&sortOrder=desc
```

### Update ticket

`PATCH /api/v1/tickets/:ticketId`

```text
priority=medium
assignee=agent@example.com
```

Use the status endpoint to change `status`.

### Change ticket status

`PATCH /api/v1/tickets/:ticketId/status`

```text
status=in_progress
```

Allowed transitions:

```text
open -> in_progress, closed
in_progress -> resolved, closed
resolved -> closed, open
closed -> none
```

## Comment requests

### Create comment

`POST /api/v1/tickets/:ticketId/comments`

```text
author=agent@example.com
body=We are investigating this issue.
```

### List comments

`GET /api/v1/tickets/:ticketId/comments`

```text
?page=1&limit=10&sortBy=createdAt&sortOrder=desc
```

### Update comment

`PATCH /api/v1/tickets/:ticketId/comments/:commentId`

```text
body=The issue has been escalated to the support team.
```

## Common status codes

| Status | Meaning |
|---|---|
| `200` | Successful read, update, or delete |
| `201` | Resource created |
| `400` | Invalid request or validation failure |
| `404` | Ticket, comment, or route not found |
| `500` | Unexpected server error |
