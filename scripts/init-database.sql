-- Create contests table
CREATE TABLE IF NOT EXISTS contests (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create problems table
CREATE TABLE IF NOT EXISTS problems (
  id VARCHAR(50) PRIMARY KEY,
  contest_id VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  difficulty VARCHAR(20),
  input_format TEXT,
  output_format TEXT,
  constraints TEXT,
  sample_input TEXT,
  sample_output TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (contest_id) REFERENCES contests(id)
);

-- Create submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id VARCHAR(100) PRIMARY KEY,
  problem_id VARCHAR(50) NOT NULL,
  username VARCHAR(100) NOT NULL,
  code TEXT NOT NULL,
  language VARCHAR(50),
  status VARCHAR(50),
  output TEXT,
  runtime VARCHAR(50),
  memory VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (problem_id) REFERENCES problems(id)
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(50) PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255),
  score INT DEFAULT 0,
  problems_solved INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample contest
INSERT INTO contests (id, title, description, start_time, end_time)
VALUES (
  'CONTEST001',
  'Shodh AI Coding Challenge',
  'Welcome to the Shodh AI Coding Challenge! Solve problems, compete with others, and climb the leaderboard.',
  NOW(),
  NOW() + INTERVAL '24 hours'
) ON CONFLICT DO NOTHING;

-- Insert sample problems
INSERT INTO problems (id, contest_id, title, difficulty, description, sample_input, sample_output)
VALUES
  (
    'PROB001',
    'CONTEST001',
    'Sum of Two Numbers',
    'Easy',
    'Given two numbers, return their sum.',
    '5 3',
    '8'
  ),
  (
    'PROB002',
    'CONTEST001',
    'Reverse a String',
    'Medium',
    'Given a string, return it reversed.',
    'hello',
    'olleh'
  ),
  (
    'PROB003',
    'CONTEST001',
    'Fibonacci Sequence',
    'Hard',
    'Generate the nth Fibonacci number.',
    '10',
    '55'
  )
ON CONFLICT DO NOTHING;
