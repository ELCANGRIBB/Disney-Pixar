/*
  # Create levels and level benefits tables

  1. New Tables
    - `levels`
      - `id` (serial, primary key)
      - `name` (text, unique) - Name of the level (PASANTÍA, J1, J2, etc.)
      - `investment_required` (decimal) - Amount required to invest
      - `is_free` (boolean, default false) - Whether this level is free
      - `is_locked` (boolean, default false) - Whether this level is locked
      - `time_commitment_days` (integer) - Days of commitment
      - `created_at` (timestamp)
    
    - `level_benefits`
      - `id` (serial, primary key)
      - `level_id` (foreign key to levels)
      - `daily_tasks` (integer) - Number of daily tasks allowed
      - `task_payment` (decimal) - Payment per task
      - `daily_income` (decimal) - Daily income potential
      - `monthly_income` (decimal) - Monthly income potential
      - `yearly_income` (decimal) - Yearly income potential
  
  2. Security
    - Enable RLS on both tables
    - Allow all authenticated users to read levels and benefits
*/

CREATE TABLE IF NOT EXISTS levels (
  id serial PRIMARY KEY,
  name text UNIQUE NOT NULL,
  investment_required decimal DEFAULT 0,
  is_free boolean DEFAULT false,
  is_locked boolean DEFAULT false,
  time_commitment_days integer DEFAULT 365,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS level_benefits (
  id serial PRIMARY KEY,
  level_id integer REFERENCES levels(id) ON DELETE CASCADE NOT NULL,
  daily_tasks integer NOT NULL DEFAULT 0,
  task_payment decimal DEFAULT 0,
  daily_income decimal DEFAULT 0,
  monthly_income decimal DEFAULT 0,
  yearly_income decimal DEFAULT 0
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_level_benefits_level_id ON level_benefits(level_id);

-- Enable RLS
ALTER TABLE levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE level_benefits ENABLE ROW LEVEL SECURITY;

-- Policy: All authenticated users can read levels
CREATE POLICY "Authenticated users can read levels"
  ON levels FOR SELECT
  TO authenticated
  USING (true);

-- Policy: All authenticated users can read level benefits
CREATE POLICY "Authenticated users can read level benefits"
  ON level_benefits FOR SELECT
  TO authenticated
  USING (true);

-- Insert default levels
INSERT INTO levels (name, investment_required, is_free, is_locked) VALUES
('PASANTÍA', 0, true, false),
('J1', 150000, false, false),
('J2', 480000, false, false),
('J3', 1300000, false, false),
('J4', 4700000, false, true),
('J5', 12800000, false, true),
('J6', 31000000, false, true),
('J7', 67200000, false, true),
('J8', 135000000, false, true),
('J9', 325000000, false, true)
ON CONFLICT (name) DO NOTHING;

-- Insert level benefits
INSERT INTO level_benefits (level_id, daily_tasks, task_payment, daily_income, monthly_income, yearly_income) VALUES
(1, 5, 1000, 5000, 20000, 0),
(2, 5, 1200, 6000, 180000, 2190000),
(3, 10, 1600, 16000, 480000, 5840000),
(4, 15, 2800, 42000, 1260000, 15330000),
(5, 30, 5600, 168000, 5040000, 61320000),
(6, 50, 9200, 460000, 13800000, 167900000),
(7, 80, 14000, 1120000, 33600000, 408800000),
(8, 150, 16000, 2400000, 72000000, 876000000),
(9, 250, 20000, 5000000, 150000000, 1825000000),
(10, 500, 25000, 12500000, 375000000, 4562500000)
ON CONFLICT DO NOTHING;
