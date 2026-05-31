/*
  # Additional utility functions for user management

  1. Functions
    - `upgrade_user_level(user_id, new_level)` - Upgrade user to a new level
    - `process_deposit(user_id, amount, reference)` - Process a deposit
    - `process_withdrawal(user_id, amount, pin)` - Process a withdrawal request
    - `get_user_profile(user_id)` - Get complete user profile with stats
    - `reset_daily_tasks()` - Reset daily task counters (for cron job)
    - `get_leaderboard(limit)` - Get top users by earnings
    - `get_user_transactions(user_id, limit)` - Get user transaction history
  
  2. Security
    - Functions use SECURITY DEFINER for controlled access
*/

-- Function to upgrade user level
CREATE OR REPLACE FUNCTION upgrade_user_level(p_user_id uuid, p_new_level text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_level_exists boolean;
  v_investment_required decimal;
  v_current_balance decimal;
BEGIN
  -- Check if level exists
  SELECT EXISTS(SELECT 1 FROM levels WHERE name = p_new_level) INTO v_level_exists;
  
  IF NOT v_level_exists THEN
    RETURN json_build_object('success', false, 'error', 'Invalid level');
  END IF;
  
  -- Get investment required for new level
  SELECT investment_required INTO v_investment_required
  FROM levels WHERE name = p_new_level;
  
  -- Get current balance
  SELECT balance INTO v_current_balance FROM users WHERE id = p_user_id;
  
  -- Update user level
  UPDATE users SET level = p_new_level WHERE id = p_user_id;
  
  -- Create transaction for level upgrade
  INSERT INTO transactions (user_id, type, amount, status, description)
  VALUES (p_user_id, 'level_upgrade', v_investment_required, 'completed', 
          'Upgraded to ' || p_new_level);
  
  RETURN json_build_object(
    'success', true,
    'new_level', p_new_level,
    'investment_required', v_investment_required
  );
END;
$$;

-- Function to process deposit
CREATE OR REPLACE FUNCTION process_deposit(p_user_id uuid, p_amount decimal, p_reference text DEFAULT NULL)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_new_balance decimal;
BEGIN
  -- Validate amount
  IF p_amount <= 0 THEN
    RETURN json_build_object('success', false, 'error', 'Invalid amount');
  END IF;
  
  -- Update user balance
  UPDATE users 
  SET balance = balance + p_amount 
  WHERE id = p_user_id
  RETURNING balance INTO v_new_balance;
  
  -- Update user stats
  UPDATE user_stats 
  SET total_deposited = total_deposited + p_amount,
      updated_at = now()
  WHERE user_id = p_user_id;
  
  -- Create transaction
  INSERT INTO transactions (user_id, type, amount, status, description, reference_id)
  VALUES (p_user_id, 'deposit', p_amount, 'completed', 'Deposit', p_reference);
  
  RETURN json_build_object(
    'success', true,
    'amount', p_amount,
    'new_balance', v_new_balance
  );
END;
$$;

-- Function to process withdrawal request
CREATE OR REPLACE FUNCTION process_withdrawal(p_user_id uuid, p_amount decimal, p_pin text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_balance decimal;
  v_stored_pin text;
  v_new_balance decimal;
BEGIN
  -- Validate amount
  IF p_amount <= 0 THEN
    RETURN json_build_object('success', false, 'error', 'Invalid amount');
  END IF;
  
  -- Get user info
  SELECT balance, withdrawal_pin INTO v_current_balance, v_stored_pin
  FROM users WHERE id = p_user_id;
  
  -- Verify PIN
  IF v_stored_pin != p_pin THEN
    RETURN json_build_object('success', false, 'error', 'Invalid PIN');
  END IF;
  
  -- Check balance
  IF v_current_balance < p_amount THEN
    RETURN json_build_object('success', false, 'error', 'Insufficient balance');
  END IF;
  
  -- Deduct from balance
  UPDATE users 
  SET balance = balance - p_amount 
  WHERE id = p_user_id
  RETURNING balance INTO v_new_balance;
  
  -- Update user stats
  UPDATE user_stats 
  SET total_withdrawn = total_withdrawn + p_amount,
      updated_at = now()
  WHERE user_id = p_user_id;
  
  -- Create pending withdrawal transaction
  INSERT INTO transactions (user_id, type, amount, status, description)
  VALUES (p_user_id, 'withdrawal', p_amount, 'pending', 'Withdrawal request');
  
  RETURN json_build_object(
    'success', true,
    'amount', p_amount,
    'new_balance', v_new_balance
  );
END;
$$;

-- Function to get complete user profile
CREATE OR REPLACE FUNCTION get_user_profile(p_user_id uuid)
RETURNS json
LANGUAGE plpgsql
AS $$
DECLARE
  v_user record;
  v_stats record;
  v_level_benefits record;
BEGIN
  -- Get user info
  SELECT * INTO v_user FROM users WHERE id = p_user_id;
  
  -- Get stats
  SELECT * INTO v_stats FROM user_stats WHERE user_id = p_user_id;
  
  -- Get level benefits
  SELECT l.name, l.investment_required, l.is_free, l.is_locked,
         lb.daily_tasks, lb.task_payment, lb.daily_income, lb.monthly_income
  INTO v_level_benefits
  FROM users u
  JOIN levels l ON l.name = u.level
  JOIN level_benefits lb ON lb.level_id = l.id
  WHERE u.id = p_user_id;
  
  RETURN json_build_object(
    'user', row_to_json(v_user),
    'stats', row_to_json(v_stats),
    'level_benefits', row_to_json(v_level_benefits)
  );
END;
$$;

-- Function to reset daily task counters (for cron job)
CREATE OR REPLACE FUNCTION reset_daily_tasks()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE user_stats SET tasks_today = 0, updated_at = now();
  
  -- Mark expired tasks
  UPDATE tasks 
  SET status = 'expired' 
  WHERE status = 'pending' 
  AND expires_at < now();
END;
$$;

-- Function to get leaderboard
CREATE OR REPLACE FUNCTION get_leaderboard(p_limit integer DEFAULT 10)
RETURNS TABLE (
  user_id uuid,
  full_name text,
  level text,
  total_earned decimal,
  total_tasks_completed integer
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.full_name,
    u.level,
    s.total_earned,
    s.total_tasks_completed
  FROM users u
  JOIN user_stats s ON s.user_id = u.id
  ORDER BY s.total_earned DESC
  LIMIT p_limit;
END;
$$;

-- Function to get user transaction history
CREATE OR REPLACE FUNCTION get_user_transactions(p_user_id uuid, p_limit integer DEFAULT 20)
RETURNS TABLE (
  id uuid,
  type text,
  amount decimal,
  status text,
  description text,
  reference_id text,
  created_at timestamptz
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id,
    t.type,
    t.amount,
    t.status,
    t.description,
    t.reference_id,
    t.created_at
  FROM transactions t
  WHERE t.user_id = p_user_id
  ORDER BY t.created_at DESC
  LIMIT p_limit;
END;
$$;

-- Function to get team members list
CREATE OR REPLACE FUNCTION get_team_members(p_user_id uuid, p_limit integer DEFAULT 50)
RETURNS TABLE (
  member_id uuid,
  member_name text,
  member_level integer,
  joined_at timestamptz
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    tm.referred_user_id AS member_id,
    u.full_name AS member_name,
    tm.level AS member_level,
    tm.joined_at
  FROM team_members tm
  JOIN users u ON u.id = tm.referred_user_id
  WHERE tm.user_id = p_user_id
  ORDER BY tm.joined_at DESC
  LIMIT p_limit;
END;
$$;

-- Function to check and process referral bonus
CREATE OR REPLACE FUNCTION process_referral_bonus(p_new_user_id uuid, p_referrer_code text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_referrer_id uuid;
  v_bonus_amount decimal := 5000; -- Default referral bonus
BEGIN
  -- Find referrer
  SELECT id INTO v_referrer_id FROM users WHERE referral_code = p_referrer_code;
  
  IF v_referrer_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Referrer not found');
  END IF;
  
  -- Add bonus to referrer
  UPDATE users 
  SET balance = balance + v_bonus_amount 
  WHERE id = v_referrer_id;
  
  -- Update referrer stats
  UPDATE user_stats 
  SET total_earned = total_earned + v_bonus_amount
  WHERE user_id = v_referrer_id;
  
  -- Create transaction for referrer
  INSERT INTO transactions (user_id, type, amount, status, description)
  VALUES (v_referrer_id, 'referral_bonus', v_bonus_amount, 'completed', 
          'Referral bonus for new member');
  
  RETURN json_build_object(
    'success', true,
    'bonus', v_bonus_amount,
    'referrer_id', v_referrer_id
  );
END;
$$;
