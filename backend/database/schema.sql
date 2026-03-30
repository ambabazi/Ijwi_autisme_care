CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('parent', 'chw', 'health_officer', 'admin')),
  district TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS children (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  guardian_id INTEGER NOT NULL,
  full_name TEXT NOT NULL,
  gender TEXT NOT NULL CHECK(gender IN ('male', 'female')),
  date_of_birth DATE NOT NULL,
  district TEXT NOT NULL,
  consent_given INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (guardian_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS screenings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  child_id INTEGER NOT NULL,
  conducted_by INTEGER NOT NULL,
  screening_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  age_in_months INTEGER NOT NULL,
  result_status TEXT CHECK(result_status IN ('pass', 'monitor', 'refer')),
  no_count INTEGER DEFAULT 0,
  notes TEXT,
  FOREIGN KEY (child_id) REFERENCES children(id),
  FOREIGN KEY (conducted_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS milestone_responses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  screening_id INTEGER NOT NULL,
  milestone_id TEXT NOT NULL,
  domain TEXT NOT NULL,
  response INTEGER NOT NULL CHECK(response IN (0,1)),
  FOREIGN KEY (screening_id) REFERENCES screenings(id)
);

CREATE TABLE IF NOT EXISTS referrals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  screening_id INTEGER NOT NULL,
  child_id INTEGER NOT NULL,
  generated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  referral_note TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'seen', 'closed')),
  FOREIGN KEY (screening_id) REFERENCES screenings(id),
  FOREIGN KEY (child_id) REFERENCES children(id)
);