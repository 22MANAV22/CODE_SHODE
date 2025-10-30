-- Create contests table
CREATE TABLE IF NOT EXISTS contests (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create problems table
CREATE TABLE IF NOT EXISTS problems (
  id VARCHAR(50) PRIMARY KEY,
  contest_id VARCHAR(50) NOT NULL REFERENCES contests(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  difficulty VARCHAR(20),
  input_format TEXT,
  output_format TEXT,
  constraints TEXT,
  sample_input TEXT,
  sample_output TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id VARCHAR(100) PRIMARY KEY,
  problem_id VARCHAR(50) NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  username VARCHAR(100) NOT NULL,
  code TEXT NOT NULL,
  language VARCHAR(50),
  status VARCHAR(50) DEFAULT 'Processing',
  output TEXT,
  runtime VARCHAR(50),
  memory VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(50) PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255),
  score INTEGER DEFAULT 0,
  problems_solved INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_problems_contest_id ON problems(contest_id);
CREATE INDEX IF NOT EXISTS idx_submissions_problem_id ON submissions(problem_id);
CREATE INDEX IF NOT EXISTS idx_submissions_username ON submissions(username);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at);

-- Insert sample contest
INSERT INTO contests (id, title, description, start_time, end_time)
VALUES (
  'CONTEST001',
  'Welcome to Shodh-a-Code',
  'A beginner-friendly coding contest to test your skills',
  NOW(),
  NOW() + INTERVAL '24 hours'
) ON CONFLICT DO NOTHING;

-- Insert sample problems
INSERT INTO problems (id, contest_id, title, difficulty, description, input_format, output_format, constraints, sample_input, sample_output)
VALUES
  (
    'PROB001',
    'CONTEST001',
    'Sum of Two Numbers',
    'Easy',
    'Given two numbers, find their sum.',
    'Two integers separated by space',
    'A single integer representing the sum',
    '1 ≤ a, b ≤ 1000',
    '5 3',
    '8'
  ),
  (
    'PROB002',
    'CONTEST001',
    'Fibonacci Sequence',
    'Medium',
    'Find the nth Fibonacci number.',
    'A single integer n',
    'The nth Fibonacci number',
    '1 ≤ n ≤ 50',
    '10',
    '55'
  ),
  (
    'PROB003',
    'CONTEST001',
    'Prime Number Checker',
    'Hard',
    'Check if a number is prime.',
    'A single integer n',
    'Yes if prime, No otherwise',
    '1 ≤ n ≤ 10^9',
    '17',
    'Yes'
  )
ON CONFLICT DO NOTHING;
