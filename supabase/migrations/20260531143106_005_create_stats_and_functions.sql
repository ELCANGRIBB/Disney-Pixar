/*
  # Create user stats table and database functions

  1. New Tables
    - `user_stats`
      - `id` (uuid, primary key)
      - `user_id` (foreign key to users, unique)
      - `total_tasks_completed` (integer) - Total tasks completed
      - `total_earned` (decimal) - Total earnings
      - `total_deposited` (decimal) - Total deposits
      - `total_withdrawn` (decimal) - Total withdrawals
      - `team_size` (integer) - Total team size
      - `tasks_today` (integer) - Tasks completed today
      - `last_task_at` (timestamp) - Last task completion time
      - `updated_at` (timestamp)
  
  2. Functions
    - `get_user_level_benefits(user_id)` - Get benefits for user's level
    - `get_user_available_tasks(user_id)` - Get available tasks for today
    - `complete_task(user_id, task_id)` - Complete a task and add reward
    - `add_referral(referrer_code, new_user_id)` - Add a referral relationship
    - `get_team_stats(user_id)` - Get team statistics for a user
    - `can_upgrade_level(user_id, new_level)` - Check if user can upgrade
    - `get_daily_task_progress(user_id)` - Get today's task progress
  
  3. Security
    - Enable RLS on user_stats
    - Users can only read/update their own stats
*/

CREATE TABLE IF NOT EXISTS user_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  total_tasks_completed integer DEFAULT 0,
  total_earned decimal DEFAULT 0,
  total_deposited decimal DEFAULT 0,
  total_withdrawn decimal DEFAULT 0,
  team_size integer DEFAULT 0,
  tasks_today integer DEFAULT 0,
  last_task_at timestamptz,
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON user_stats(user_id);

-- Enable RLS
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read own stats
CREATE POLICY "Users can read own stats"
  ON user_stats FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Users can update own stats
CREATE POLICY "Users can update own stats"
  ON user_stats FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Service role can manage all stats
CREATE POLICY "Service role can manage user stats"
  ON user_stats FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Function to get user's level benefits
CREATE OR REPLACE FUNCTION get_user_level_benefits(p_user_id uuid)
RETURNS TABLE (
  level_name text,
  daily_tasks integer,
  task_payment decimal,
  daily_income decimal,
  monthly_income decimal,
  yearly_income decimal
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    l.name::text,
    lb.daily_tasks,
    lb.task_payment,
    lb.daily_income,
    lb.monthly_income,
    lb.yearly_income
  FROM users u
  JOIN levels l ON l.name = u.level
  JOIN level_benefits lb ON lb.level_id = l.id
  WHERE u.id = p_user_id;
END;
$$;

-- Function to get available tasks for today
CREATE OR REPLACE FUNCTION get_user_available_tasks(p_user_id uuid)
RETURNS TABLE (
  id uuid,
  task_type_id integer,
  task_type_name text,
  status text,
  reward decimal,
  expires_at timestamptz,
  created_at timestamptz
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id,
    t.task_type_id,
    tt.name::text,
    t.status,
    t.reward,
    t.expires_at,
    t.created_at
  FROM tasks t
  JOIN task_types tt ON tt.id = t.task_type_id
  WHERE t.user_id = p_user_id
    AND t.status = 'pending'
    AND (t.expires_at IS NULL OR t.expires_at > now())
  ORDER BY t.created_at DESC;
END;
$$;

-- Function to complete a task
CREATE OR REPLACE FUNCTION complete_task(p_user_id uuid, p_task_id uuid)
RETURNS json
LANGUAGE plpgsql
AS $$
DECLARE
  v_reward decimal;
  v_task_reward decimal;
  v_task_exists boolean;
BEGIN
  -- Check if task belongs to user and is pending
  SELECT EXISTS(
    SELECT 1 FROM tasks 
    WHERE id = p_task_id 
    AND user_id = p_user_id 
    AND status = 'pending'
  ) INTO v_task_exists;
  
  IF NOT v_task_exists THEN
    RETURN json_build_object('success', false, 'error', 'Task not found or already completed');
  END IF;
  
  -- Get the reward
  SELECT reward INTO v_task_reward FROM tasks WHERE id = p_task_id;
  
  -- Update task status
  UPDATE tasks 
  SET status = 'completed', 
      completed_at = now() 
  WHERE id = p_task_id;
  
  -- Add reward to user balance
  UPDATE users 
  SET balance = balance + v_task_reward 
  WHERE id = p_user_id
  RETURNING balance INTO v_reward;
  
  -- Update user stats
  INSERT INTO user_stats (user_id, total_tasks_completed, total_earned, tasks_today, last_task_at)
  VALUES (p_user_id, 1, v_task_reward, 1, now())
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    total_tasks_completed = user_stats.total_tasks_completed + 1,
    total_earned = user_stats.total_earned + v_task_reward,
    tasks_today = user_stats.tasks_today + 1,
    last_task_at = now(),
    updated_at = now();
  
  -- Create transaction
  INSERT INTO transactions (user_id, type, amount, status, description)
  VALUES (p_user_id, 'reward', v_task_reward, 'completed', 'Task reward');
  
  RETURN json_build_object(
    'success', true, 
    'reward', v_task_reward, 
    'new_balance', v_reward
  );
END;
$$;

-- Function to add referral
CREATE OR REPLACE FUNCTION add_referral(p_referrer_code text, p_new_user_id uuid)
RETURNS json
LANGUAGE plpgsql
AS $$
DECLARE
  v_referrer_id uuid;
  v_referrer_level text;
BEGIN
  -- Find referrer by code
  SELECT id INTO v_referrer_id FROM users WHERE referral_code = p_referrer_code;
  
  IF v_referrer_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Invalid referral code');
  END IF;
  
  -- Don't allow self-referral
  IF v_referrer_id = p_new_user_id THEN
    RETURN json_build_object('success', false, 'error', 'Cannot refer yourself');
  END IF;
  
  -- Check if already referred
  IF EXISTS (SELECT 1 FROM team_members WHERE referred_user_id = p_new_user_id) THEN
    RETURN json_build_object('success', false, 'error', 'User already has a referrer');
  END IF;
  
  -- Create referral relationship (level 1 = direct referral)
  INSERT INTO team_members (user_id, referred_user_id, level)
  VALUES (v_referrer_id, p_new_user_id, 1);
  
  -- Update referred_by in users table
  UPDATE users SET referred_by = p_referrer_code WHERE id = p_new_user_id;
  
  -- Update team size for referrer
  INSERT INTO user_stats (user_id, team_size)
  VALUES (v_referrer_id, 1)
  ON CONFLICT (user_id) 
  DO UPDATE SET team_size = user_stats.team_size + 1;
  
  -- Check for level 2 referrals (referrer's referrer)
  SELECT referred_by INTO v_referrer_level FROM users WHERE id = v_referrer_id;
  
  IF v_referrer_level IS NOT NULL THEN
    INSERT INTO team_members (user_id, referred_user_id, level)
    SELECT id, p_new_user_id, 2
    FROM users 
    WHERE referral_code = v_referrer_level;
    
    -- Update team size for level 2 referrer
    UPDATE user_stats 
    SET team_size = team_size + 1 
    WHERE user_id = (SELECT id FROM users WHERE referral_code = v_referrer_level);
  END IF;
  
  RETURN json_build_object('success', true);
END;
$$;

-- Function to get team stats
CREATE OR REPLACE FUNCTION get_team_stats(p_user_id uuid)
RETURNS json
LANGUAGE plpgsql
AS $$
DECLARE
  v_direct_referrals integer;
  v_level2_referrals integer;
  v_total_team integer;
BEGIN
  SELECT COUNT(*) INTO v_direct_referrals
  FROM team_members WHERE user_id = p_user_id AND level = 1;
  
  SELECT COUNT(*) INTO v_level2_referrals
  FROM team_members WHERE user_id = p_user_id AND level = 2;
  
  SELECT COALESCE(team_size, 0) INTO v_total_team
  FROM user_stats WHERE user_id = p_user_id;
  
  RETURN json_build_object(
    'direct_referrals', v_direct_referrals,
    'level2_referrals', v_level2_referrals,
    'total_team', v_total_team
  );
END;
$$;

-- Function to get daily task progress
CREATE OR REPLACE FUNCTION get_daily_task_progress(p_user_id uuid)
RETURNS json
LANGUAGE plpgsql
AS $$
DECLARE
  v_completed_today integer;
  v_daily_limit integer;
BEGIN
  -- Get completed tasks today
  SELECT COALESCE(tasks_today, 0) INTO v_completed_today
  FROM user_stats WHERE user_id = p_user_id;
  
  -- Get daily limit from level
  SELECT lb.daily_tasks INTO v_daily_limit
  FROM users u
  JOIN levels l ON l.name = u.level
  JOIN level_benefits lb ON lb.level_id = l.id
  WHERE u.id = p_user_id;
  
  RETURN json_build_object(
    'completed', v_completed_today,
    'remaining', v_daily_limit - v_completed_today,
    'limit', v_daily_limit
  );
END;
$$;

-- Function to generate tasks for user
CREATE OR REPLACE FUNCTION generate_daily_tasks(p_user_id uuid)
RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
  v_daily_limit integer;
  v_tasks_created integer := 0;
  v_task_type record;
BEGIN
  -- Get daily limit from level
  SELECT lb.daily_tasks INTO v_daily_limit
  FROM users u
  JOIN levels l ON l.name = u.level
  JOIN level_benefits lb ON lb.level_id = l.id
  WHERE u.id = p_user_id;
  
  -- Check if already generated tasks today
  IF EXISTS (
    SELECT 1 FROM tasks 
    WHERE user_id = p_user_id 
    AND created_at::date = now()::date
  ) THEN
    RETURN 0;
  END IF;
  
  -- Reset daily task counter
  UPDATE user_stats SET tasks_today = 0 WHERE user_id = p_user_id;
  
  -- Generate tasks up to daily limit
  FOR v_task_type IN 
    SELECT id, base_reward 
    FROM task_types 
    WHERE is_active = true 
    ORDER BY random() 
    LIMIT v_daily_limit
  LOOP
    INSERT INTO tasks (user_id, task_type_id, reward, expires_at)
    VALUES (p_user_id, v_task_type.id, v_task_type.base_reward, now() + interval '24 hours');
    
    v_tasks_created := v_tasks_created + 1;
  END LOOP;
  
  RETURN v_tasks_created;
END;
$$;

-- Trigger to create user_stats when a new user is created
CREATE OR REPLACE FUNCTION create_user_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO user_stats (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$;

-- Apply the trigger
DROP TRIGGER IF EXISTS on_user_created ON users;
CREATE TRIGGER on_user_created
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_stats();
