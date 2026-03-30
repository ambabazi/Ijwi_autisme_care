CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('parent', 'chw', 'health_officer', 'admin')),
  district TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS children (
  id SERIAL PRIMARY KEY,
  guardian_id INTEGER NOT NULL REFERENCES users(id),
  full_name TEXT NOT NULL,
  gender TEXT NOT NULL CHECK(gender IN ('male', 'female')),
  date_of_birth DATE NOT NULL,
  district TEXT NOT NULL,
  consent_given INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS screenings (
  id SERIAL PRIMARY KEY,
  child_id INTEGER NOT NULL REFERENCES children(id),
  conducted_by INTEGER NOT NULL REFERENCES users(id),
  screening_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  age_in_months INTEGER NOT NULL,
  result_status TEXT CHECK(result_status IN ('pass', 'monitor', 'refer')),
  no_count INTEGER DEFAULT 0,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS milestone_responses (
  id SERIAL PRIMARY KEY,
  screening_id INTEGER NOT NULL REFERENCES screenings(id),
  milestone_id TEXT NOT NULL,
  domain TEXT NOT NULL,
  response INTEGER NOT NULL CHECK(response IN (0,1))
);

CREATE TABLE IF NOT EXISTS referrals (
  id SERIAL PRIMARY KEY,
  screening_id INTEGER NOT NULL REFERENCES screenings(id),
  child_id INTEGER NOT NULL REFERENCES children(id),
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  referral_note TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'seen', 'closed'))
);