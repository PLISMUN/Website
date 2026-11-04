-- The whole database as it should look today. Safe to run on an existing database: anything that
-- already exists is left alone, so a change to an existing table also needs a migration (see migrations/).

-- Managed automatically. The only thing to edit by hand is isAdmin.
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  isGoogleUser BOOLEAN NOT NULL,
  isAdmin BOOLEAN NOT NULL DEFAULT FALSE
);

-- Personal details, one row per user with the same id. Managed automatically.
CREATE TABLE IF NOT EXISTS people (
  id INTEGER PRIMARY KEY UNIQUE,
  name TEXT NOT NULL,
  birth DATE NOT NULL,
  phone TEXT,
  nationality TEXT NOT NULL,
  delegation TEXT, -- NULL for a supervisor whose delegation has not been created yet
  diet TEXT NOT NULL,
  notes TEXT,
  FOREIGN KEY (delegation) REFERENCES delegations(name),
  FOREIGN KEY (id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS delegations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  shorthand TEXT NOT NULL UNIQUE,
  country TEXT NOT NULL,
  notes TEXT
);

-- Filled in by hand every year. See committees in sample-data.ts for what roles and topics look like.
CREATE TABLE IF NOT EXISTS committees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  shorthand TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  roles JSON NOT NULL,
  topics JSON NOT NULL,
  icon TEXT NOT NULL
);

-- Delegate and chair applications. Managed automatically.
CREATE TABLE IF NOT EXISTS applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL,
  userId INTEGER NOT NULL,
  committeeId INTEGER NOT NULL,
  role TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (committeeId) REFERENCES committees(id)
);

-- One row per user with the same id. Managed automatically.
CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY,
  valueCzk int NOT NULL,
  valueEur int NOT NULL,
  status BOOLEAN NOT NULL DEFAULT FALSE,
  FOREIGN KEY (id) REFERENCES users(id)
);

-- Supervisor applications. Only accepted rows give access to a delegation. Managed automatically.
CREATE TABLE IF NOT EXISTS supervisors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  delegation TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  country TEXT,
  students INTEGER,
  FOREIGN KEY (userId) REFERENCES users(id)
);

-- Created from the Documents admin page. Delete them there, or their PDFs stay in the Blob store.
CREATE TABLE IF NOT EXISTS documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  groupId TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  path TEXT NOT NULL UNIQUE,
  url TEXT, -- url, size and uploadedAt are NULL until a PDF has been uploaded
  size INTEGER,
  uploadedAt TEXT
);

-- Supervisor ids start at 9991, because the admin endpoint that accepts applications takes the ids of
-- both applications and supervisors, so the two must never overlap.
INSERT INTO sqlite_sequence (name, seq)
SELECT 'supervisors', 9990
WHERE NOT EXISTS (SELECT 1 FROM sqlite_sequence WHERE name = 'supervisors');
