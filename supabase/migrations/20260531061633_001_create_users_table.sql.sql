/*
  # Create users table

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `full_name` (text)
      - `phone` (text)
      - `referral_code` (text, unique) - Codigo de referido unico del usuario
      - `referred_by` (text) - Codigo de quien lo refirio
      - `withdrawal_pin` (text) - PIN de retiro
      - `balance` (decimal, default 0) - Saldo actual
      - `level` (text, default 'PASANTIA') - Nivel actual del usuario
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on `users` table
    - Add policy for authenticated users to read their own data
    - Add policy for authenticated users to update their own data
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE,
  full_name text NOT NULL,
  phone text NOT NULL,
  referral_code text UNIQUE NOT NULL,
  referred_by text,
  withdrawal_pin text NOT NULL,
  balance decimal DEFAULT 0,
  level text DEFAULT 'PASANTIA',
  created_at timestamptz DEFAULT now()
);

-- Create index for faster referral code lookups
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON users(referral_code);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own data
CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Policy: Users can update their own data
CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy: Allow insert during registration (service role only)
CREATE POLICY "Service role can insert users"
  ON users FOR INSERT
  TO service_role
  WITH CHECK (true);
