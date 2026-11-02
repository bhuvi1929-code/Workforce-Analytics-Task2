-- Workforce Analytics Platform: SQLite schema
CREATE TABLE IF NOT EXISTS departments (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS employees (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  code          TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  department_id INTEGER NOT NULL REFERENCES departments(id),
  location      TEXT NOT NULL,
  status        TEXT NOT NULL CHECK (status IN ('Active', 'Probation', 'Notice period')),
  joined_on     TEXT NOT NULL            -- ISO date YYYY-MM-DD
);
CREATE INDEX IF NOT EXISTS idx_employees_department ON employees(department_id);
CREATE INDEX IF NOT EXISTS idx_employees_location   ON employees(location);
CREATE INDEX IF NOT EXISTS idx_employees_status     ON employees(status);

CREATE TABLE IF NOT EXISTS attendance (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  date        TEXT NOT NULL,             -- ISO date YYYY-MM-DD
  status      TEXT NOT NULL CHECK (status IN ('Present', 'Absent', 'On Leave')),
  check_in    TEXT,                      -- HH:MM, only for Present
  UNIQUE (employee_id, date)
);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
