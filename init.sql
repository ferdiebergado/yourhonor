CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,
  google_id TEXT UNIQUE NOT NULL,
  name TEXT,
  email TEXT UNIQUE,
  picture TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  is_active INTEGER DEFAULT 1 CHECK (is_active IN (0, 1)),
  last_login_at TEXT DEFAULT (STRFTIME ('%Y-%m-%dT%H:%M:%fZ', 'NOW')),
  created_at TEXT DEFAULT (STRFTIME ('%Y-%m-%dT%H:%M:%fZ', 'NOW')),
  updated_at TEXT DEFAULT (STRFTIME ('%Y-%m-%dT%H:%M:%fZ', 'NOW'))
);

CREATE TABLE IF NOT EXISTS sessions (
  id INTEGER PRIMARY KEY,
  session_id TEXT UNIQUE NOT NULL,
  user_id INTEGER NOT NULL,
  expires_at TEXT NOT NULL,
  last_active_at TEXT DEFAULT (STRFTIME ('%Y-%m-%dT%H:%M:%fZ', 'NOW')),
  created_at TEXT DEFAULT (STRFTIME ('%Y-%m-%dT%H:%M:%fZ', 'NOW')),
  updated_at TEXT DEFAULT (STRFTIME ('%Y-%m-%dT%H:%M:%fZ', 'NOW')),
  deleted_at TEXT,
  is_revoked INTEGER DEFAULT 0 CHECK (is_revoked IN (0, 1)),
  FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions (user_id);

CREATE INDEX IF NOT EXISTS idx_sessions_session_id ON sessions (session_id);

CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions (expires_at);

CREATE TRIGGER IF NOT EXISTS update_user_timestamp AFTER
UPDATE ON users BEGIN
UPDATE users
SET
  updated_at = (STRFTIME ('%Y-%m-%dT%H:%M:%fZ', 'NOW'))
WHERE
  id = old.id;

END;

-- Focal persons
CREATE TABLE IF NOT EXISTS focals (
  id INTEGER PRIMARY KEY,
  firstname TEXT NOT NULL,
  mi TEXT,
  lastname TEXT NOT NULL,
  position_id INTEGER NOT NULL,
  sex TEXT NOT NULL CHECK (sex IN ('M', 'F')),
  created_at TEXT DEFAULT (STRFTIME ('%Y-%m-%dT%H:%M:%fZ', 'NOW')),
  updated_at TEXT DEFAULT (STRFTIME ('%Y-%m-%dT%H:%M:%fZ', 'NOW')),
  deleted_at TEXT,
  created_by INTEGER NOT NULL,
  updated_by INTEGER NOT NULL,
  UNIQUE (firstname, lastname),
  FOREIGN KEY (position_id) REFERENCES positions (id),
  FOREIGN KEY (created_by) REFERENCES users (id),
  FOREIGN KEY (updated_by) REFERENCES users (id)
);

-- Positions
CREATE TABLE IF NOT EXISTS positions (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TEXT DEFAULT (STRFTIME ('%Y-%m-%dT%H:%M:%fZ', 'NOW')),
  updated_at TEXT DEFAULT (STRFTIME ('%Y-%m-%dT%H:%M:%fZ', 'NOW')),
  deleted_at TEXT,
  created_by INTEGER NOT NULL,
  updated_by INTEGER NOT NULL,
  FOREIGN KEY (created_by) REFERENCES users (id),
  FOREIGN KEY (updated_by) REFERENCES users (id)
);

-- Activities
CREATE TABLE IF NOT EXISTS activities (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  venue_id INTEGER NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  fund_source TEXT NOT NULL,
  focal_id INTEGER NOT NULL,
  created_at TEXT DEFAULT (STRFTIME ('%Y-%m-%dT%H:%M:%fZ', 'NOW')),
  updated_at TEXT DEFAULT (STRFTIME ('%Y-%m-%dT%H:%M:%fZ', 'NOW')),
  deleted_at TEXT,
  created_by INTEGER NOT NULL,
  updated_by INTEGER NOT NULL,
  FOREIGN KEY (venue_id) REFERENCES venues (id),
  FOREIGN KEY (focal_id) REFERENCES focals (id),
  FOREIGN KEY (created_by) REFERENCES users (id),
  FOREIGN KEY (updated_by) REFERENCES users (id)
);

-- Venues
CREATE TABLE IF NOT EXISTS venues (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  location TEXT NOT NULL,
  created_at TEXT DEFAULT (STRFTIME ('%Y-%m-%dT%H:%M:%fZ', 'NOW')),
  updated_at TEXT DEFAULT (STRFTIME ('%Y-%m-%dT%H:%M:%fZ', 'NOW')),
  deleted_at TEXT,
  created_by INTEGER NOT NULL,
  updated_by INTEGER NOT NULL,
  FOREIGN KEY (created_by) REFERENCES users (id),
  FOREIGN KEY (updated_by) REFERENCES users (id)
);

-- Payees
CREATE TABLE IF NOT EXISTS payees (
  id INTEGER PRIMARY KEY,
  firstname TEXT NOT NULL,
  mi TEXT,
  lastname TEXT NOT NULL,
  tin TEXT,
  created_at TEXT DEFAULT (STRFTIME ('%Y-%m-%dT%H:%M:%fZ', 'NOW')),
  updated_at TEXT DEFAULT (STRFTIME ('%Y-%m-%dT%H:%M:%fZ', 'NOW')),
  deleted_at TEXT,
  created_by INTEGER NOT NULL,
  updated_by INTEGER NOT NULL,
  FOREIGN KEY (created_by) REFERENCES users (id),
  FOREIGN KEY (updated_by) REFERENCES users (id)
);

-- Offices
CREATE TABLE IF NOT EXISTS offices (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TEXT DEFAULT (STRFTIME ('%Y-%m-%dT%H:%M:%fZ', 'NOW')),
  updated_at TEXT DEFAULT (STRFTIME ('%Y-%m-%dT%H:%M:%fZ', 'NOW')),
  deleted_at TEXT,
  created_by INTEGER NOT NULL,
  updated_by INTEGER NOT NULL,
  FOREIGN KEY (created_by) REFERENCES users (id),
  FOREIGN KEY (updated_by) REFERENCES users (id)
);

-- Payee offices
CREATE TABLE IF NOT EXISTS payee_offices (
  id INTEGER PRIMARY KEY,
  payee_id INTEGER NOT NULL,
  office_id INTEGER NOT NULL,
  created_at TEXT DEFAULT (STRFTIME ('%Y-%m-%dT%H:%M:%fZ', 'NOW')),
  updated_at TEXT DEFAULT (STRFTIME ('%Y-%m-%dT%H:%M:%fZ', 'NOW')),
  deleted_at TEXT,
  created_by INTEGER NOT NULL,
  updated_by INTEGER NOT NULL,
  FOREIGN KEY (payee_id) REFERENCES payees (id),
  FOREIGN KEY (office_id) REFERENCES offices (id),
  FOREIGN KEY (created_by) REFERENCES users (id),
  FOREIGN KEY (updated_by) REFERENCES users (id)
);

-- Banks
CREATE TABLE IF NOT EXISTS banks (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TEXT DEFAULT (STRFTIME ('%Y-%m-%dT%H:%M:%fZ', 'NOW')),
  updated_at TEXT DEFAULT (STRFTIME ('%Y-%m-%dT%H:%M:%fZ', 'NOW')),
  deleted_at TEXT,
  created_by INTEGER NOT NULL,
  updated_by INTEGER NOT NULL,
  FOREIGN KEY (created_by) REFERENCES users (id),
  FOREIGN KEY (updated_by) REFERENCES users (id)
);

-- Payee bank accounts
CREATE TABLE IF NOT EXISTS accounts (
  id INTEGER PRIMARY KEY,
  payee_id INTEGER NOT NULL,
  bank_id INTEGER NOT NULL,
  details BLOB NOT NULL,
  created_at TEXT DEFAULT (STRFTIME ('%Y-%m-%dT%H:%M:%fZ', 'NOW')),
  updated_at TEXT DEFAULT (STRFTIME ('%Y-%m-%dT%H:%M:%fZ', 'NOW')),
  deleted_at TEXT,
  created_by INTEGER NOT NULL,
  updated_by INTEGER NOT NULL,
  FOREIGN KEY (payee_id) REFERENCES payees (id),
  FOREIGN KEY (bank_id) REFERENCES banks (id),
  FOREIGN KEY (created_by) REFERENCES users (id),
  FOREIGN KEY (updated_by) REFERENCES users (id)
);

-- Roles
CREATE TABLE IF NOT EXISTS roles (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TEXT DEFAULT (STRFTIME ('%Y-%m-%dT%H:%M:%fZ', 'NOW')),
  updated_at TEXT DEFAULT (STRFTIME ('%Y-%m-%dT%H:%M:%fZ', 'NOW')),
  deleted_at TEXT,
  created_by INTEGER NOT NULL,
  updated_by INTEGER NOT NULL,
  FOREIGN KEY (created_by) REFERENCES users (id),
  FOREIGN KEY (updated_by) REFERENCES users (id)
);

-- Honoraria
CREATE TABLE IF NOT EXISTS honoraria (
  id INTEGER PRIMARY KEY,
  activity_code TEXT NOT NULL,
  payee_id INTEGER NOT NULL,
  role_id INTEGER NOT NULL,
  salary REAL NOT NULL,
  amount REAL NOT NULL,
  tax_rate REAL NOT NULL,
  hours_rendered REAL NOT NULL,
  actual REAL NOT NULL,
  net REAL NOT NULL,
  account_id INTEGER NOT NULL,
  created_at TEXT DEFAULT (STRFTIME ('%Y-%m-%dT%H:%M:%fZ', 'NOW')),
  updated_at TEXT DEFAULT (STRFTIME ('%Y-%m-%dT%H:%M:%fZ', 'NOW')),
  deleted_at TEXT,
  created_by INTEGER NOT NULL,
  updated_by INTEGER NOT NULL,
  FOREIGN KEY (activity_code) REFERENCES activities (code),
  FOREIGN KEY (role_id) REFERENCES roles (id),
  FOREIGN KEY (payee_id) REFERENCES payees (id),
  FOREIGN KEY (account_id) REFERENCES accounts (id),
  FOREIGN KEY (created_by) REFERENCES users (id),
  FOREIGN KEY (updated_by) REFERENCES users (id)
);
