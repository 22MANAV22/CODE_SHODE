-- Create test_cases table for storing test cases for each problem
CREATE TABLE IF NOT EXISTS test_cases (
  id VARCHAR(100) PRIMARY KEY,
  problem_id VARCHAR(50) NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  input TEXT NOT NULL,
  expected_output TEXT NOT NULL,
  is_sample BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_test_cases_problem_id ON test_cases(problem_id);

-- Insert test cases for PROB001 (Sum of Two Numbers)
INSERT INTO test_cases (id, problem_id, input, expected_output, is_sample)
VALUES
  ('TC001_1', 'PROB001', '5 3', '8', TRUE),
  ('TC001_2', 'PROB001', '10 20', '30', FALSE),
  ('TC001_3', 'PROB001', '1 1', '2', FALSE),
  ('TC001_4', 'PROB001', '100 200', '300', FALSE)
ON CONFLICT DO NOTHING;

-- Insert test cases for PROB002 (Fibonacci)
INSERT INTO test_cases (id, problem_id, input, expected_output, is_sample)
VALUES
  ('TC002_1', 'PROB002', '10', '55', TRUE),
  ('TC002_2', 'PROB002', '5', '5', FALSE),
  ('TC002_3', 'PROB002', '1', '1', FALSE),
  ('TC002_4', 'PROB002', '15', '610', FALSE)
ON CONFLICT DO NOTHING;

-- Insert test cases for PROB003 (Prime Checker)
INSERT INTO test_cases (id, problem_id, input, expected_output, is_sample)
VALUES
  ('TC003_1', 'PROB003', '17', 'Yes', TRUE),
  ('TC003_2', 'PROB003', '1', 'No', FALSE),
  ('TC003_3', 'PROB003', '2', 'Yes', FALSE),
  ('TC003_4', 'PROB003', '100', 'No', FALSE)
ON CONFLICT DO NOTHING;

-- Add score column to submissions table if it doesn't exist
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS score INTEGER DEFAULT 0;
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS test_cases_passed INTEGER DEFAULT 0;
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS total_test_cases INTEGER DEFAULT 0;
