require("dotenv/config")

const Db=require("better-sqlite3")

const db=new Db(process.env.DB_PATH || "ticket-management.db")

db.pragma("foreign_keys=ON")

db.exec(`
  CREATE TABLE IF NOT EXISTS tickets (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open',
    priority TEXT NOT NULL,
    requester TEXT NOT NULL,
    assignee TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS comments (
    id TEXT PRIMARY KEY,
    ticket_id TEXT NOT NULL,
    author TEXT NOT NULL,
    body TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (ticket_id)
      REFERENCES tickets(id)
      ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'requester',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
  CREATE INDEX IF NOT EXISTS comments_ticket_id_idx
    ON comments(ticket_id);
`);

module.exports=db