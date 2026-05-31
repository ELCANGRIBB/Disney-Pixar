/*
  # Create transactions and team tables

  1. New Tables
    - `transactions`
      - `id` (uuid, primary key)
      - `user_id` (foreign key to users)
      - `type` (text) - Type: 'deposit', 'withdrawal', 'reward', 'referral_bonus', 'level_upgrade'
      - `amount` (decimal) - Amount of the transaction
      - `status` (text) - Status: 'pending', 'completed', 'failed'
      - `description` (text) - Description of the transaction
      - `reference_id` (text) - External reference ID
      - `created_at` (timestamp)
    
    - `team_members`
      - `id` (uuid, primary key)
      - `user_id` (foreign key to users) - The referrer
      - `referred_user_id` (foreign key to users) - The referred user
      - `level` (integer) - Level in the referral hierarchy (1 = direct referral)
      - `joined_at` (timestamp)
  
  2. Security
    - Enable RLS on both tables
    - Users can only read their own transactions and team members
*/

CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'reward', 'referral_bonus', 'level_upgrade')),
  amount decimal NOT NULL DEFAULT 0,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  description text,
  reference_id text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  referred_user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  level integer DEFAULT 1,
  joined_at timestamptz DEFAULT now(),
  UNIQUE(user_id, referred_user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_referred_user_id ON team_members(referred_user_id);

-- Enable RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read own transactions
CREATE POLICY "Users can read own transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Users can insert own transactions
CREATE POLICY "Users can insert own transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Service role can manage all transactions
CREATE POLICY "Service role can manage transactions"
  ON transactions FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy: Users can read own team members (as referrer)
CREATE POLICY "Users can read own team as referrer"
  ON team_members FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Users can read own team members (as referred)
CREATE POLICY "Users can read own referral info"
  ON team_members FOR SELECT
  TO authenticated
  USING (auth.uid() = referred_user_id);

-- Policy: Service role can manage team members
CREATE POLICY "Service role can manage team members"
  ON team_members FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
