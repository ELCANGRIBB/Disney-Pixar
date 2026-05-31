/*
  # Create tasks tables

  1. New Tables
    - `task_types`
      - `id` (serial, primary key)
      - `name` (text) - Name of the task type
      - `description` (text) - Description of the task
      - `base_reward` (decimal) - Base reward for completing the task
      - `is_active` (boolean) - Whether the task type is active
      - `created_at` (timestamp)
    
    - `tasks`
      - `id` (uuid, primary key)
      - `user_id` (foreign key to users)
      - `task_type_id` (foreign key to task_types)
      - `status` (text) - Status: 'pending', 'completed', 'expired'
      - `reward` (decimal) - Reward earned for this task
      - `completed_at` (timestamp) - When the task was completed
      - `expires_at` (timestamp) - When the task expires
      - `created_at` (timestamp)
  
  2. Security
    - Enable RLS on both tables
    - Users can only read/write their own tasks
    - All authenticated users can read active task types
*/

CREATE TABLE IF NOT EXISTS task_types (
  id serial PRIMARY KEY,
  name text NOT NULL,
  description text,
  base_reward decimal DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  task_type_id integer REFERENCES task_types(id) ON DELETE CASCADE NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'expired')),
  reward decimal DEFAULT 0,
  completed_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);
CREATE INDEX IF NOT EXISTS idx_task_types_active ON task_types(is_active);

-- Enable RLS
ALTER TABLE task_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Policy: All authenticated users can read active task types
CREATE POLICY "Authenticated users can read active task types"
  ON task_types FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Policy: Users can read their own tasks
CREATE POLICY "Users can read own tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own tasks
CREATE POLICY "Users can insert own tasks"
  ON tasks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own tasks
CREATE POLICY "Users can update own tasks"
  ON tasks FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Insert default task types
INSERT INTO task_types (name, description, base_reward) VALUES
('Ver video promocional', 'Mira un video promocional completo', 1000),
('Visitar sitio web', 'Visita un sitio web patrocinado', 800),
('Compartir en redes', 'Comparte contenido en redes sociales', 1500),
('Encuesta rápida', 'Responde una encuesta corta', 2000),
('Revisar producto', 'Revisa y califica un producto', 1200),
('Descargar app', 'Descarga y prueba una aplicación', 3000),
('Referir amigo', 'Invita a un amigo a unirse', 5000),
('Completar perfil', 'Completa tu perfil de usuario', 2500),
('Ver anuncio', 'Mira un anuncio publicitario', 500),
('Tarea especial', 'Tarea especial con bonificación', 10000);
