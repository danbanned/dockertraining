CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  career VARCHAR(255),
  income_goal DECIMAL,
  city_goal VARCHAR(255),
  fitness_goal VARCHAR(255),
  communication_goal VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE goals (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50),
  target TEXT,
  deadline DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE career_paths (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE roadmaps (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255),
  start_date DATE,
  end_date DATE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE roadmap_steps (
  id SERIAL PRIMARY KEY,
  roadmap_id INTEGER REFERENCES roadmaps(id) ON DELETE CASCADE,
  month INTEGER,
  title VARCHAR(255),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE daily_tasks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  date DATE,
  task TEXT,
  category VARCHAR(50),
  reason TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE job_applications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  company VARCHAR(255),
  position VARCHAR(255),
  date_applied DATE,
  status VARCHAR(50) DEFAULT 'Applied',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE progress_metrics (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  skills_score DECIMAL,
  applications_score DECIMAL,
  communication_score DECIMAL,
  health_score DECIMAL,
  environment_score DECIMAL,
  consistency_score DECIMAL,
  total_score DECIMAL,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ai_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  model_used VARCHAR(50),
  prompt TEXT,
  response TEXT,
  duration_ms INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
