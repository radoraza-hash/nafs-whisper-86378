
-- Migration: 20251105004821

-- Migration: 20251105002116
-- ============================================
-- NAFSAI - Base Schema for MVP
-- ============================================

-- Extension pour UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- PROFILES (user data beyond auth)
-- ============================================
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username text UNIQUE,
  display_name text,
  locale text DEFAULT 'fr',
  timezone text DEFAULT 'Europe/Paris',
  main_goals text[],
  current_phase text DEFAULT 'stable' CHECK (current_phase IN ('up', 'down', 'stable')),
  ai_enabled boolean DEFAULT true,
  onboarding_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- JOURNALS (daily reflections)
-- ============================================
CREATE TABLE journals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text,
  body text NOT NULL,
  mood text CHECK (mood IN ('joy', 'sadness', 'anxiety', 'serenity', 'gratitude', 'anger', 'neutral')),
  tags text[],
  audio_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE journals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own journals"
  ON journals FOR ALL
  USING (auth.uid() = user_id);

-- ============================================
-- EMOTIONS (emotion tracking)
-- ============================================
CREATE TABLE emotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  emotion text NOT NULL,
  intensity int CHECK (intensity >= 0 AND intensity <= 10),
  pattern text,
  note text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE emotions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own emotions"
  ON emotions FOR ALL
  USING (auth.uid() = user_id);

-- ============================================
-- TASKS (ADHD-friendly task management)
-- ============================================
CREATE TABLE tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  priority int DEFAULT 1 CHECK (priority >= 1 AND priority <= 3),
  status text DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
  scheduled_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own tasks"
  ON tasks FOR ALL
  USING (auth.uid() = user_id);

-- ============================================
-- FOCUS SESSIONS (Pomodoro tracking)
-- ============================================
CREATE TABLE focus_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  duration_minutes int NOT NULL,
  cycles int DEFAULT 1,
  dhikr_enabled boolean DEFAULT false,
  notes text,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own focus sessions"
  ON focus_sessions FOR ALL
  USING (auth.uid() = user_id);

-- ============================================
-- USER STREAKS (gamification)
-- ============================================
CREATE TABLE user_streaks (
  user_id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  journal_streak int DEFAULT 0,
  journal_best int DEFAULT 0,
  focus_streak int DEFAULT 0,
  focus_best int DEFAULT 0,
  dhikr_streak int DEFAULT 0,
  dhikr_best int DEFAULT 0,
  last_journal_date date,
  last_focus_date date,
  last_dhikr_date date,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own streaks"
  ON user_streaks FOR ALL
  USING (auth.uid() = user_id);

-- ============================================
-- Auto-create profile on signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'display_name'
  );
  
  INSERT INTO public.user_streaks (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- Update journal streak on new entry
-- ============================================
CREATE OR REPLACE FUNCTION update_journal_streak()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO user_streaks (user_id, journal_streak, journal_best, last_journal_date)
  VALUES (NEW.user_id, 1, 1, CURRENT_DATE)
  ON CONFLICT (user_id) DO UPDATE SET
    journal_streak = CASE
      WHEN user_streaks.last_journal_date = CURRENT_DATE - INTERVAL '1 day'
      THEN user_streaks.journal_streak + 1
      ELSE 1
    END,
    journal_best = GREATEST(user_streaks.journal_best, CASE
      WHEN user_streaks.last_journal_date = CURRENT_DATE - INTERVAL '1 day'
      THEN user_streaks.journal_streak + 1
      ELSE 1
    END),
    last_journal_date = CURRENT_DATE,
    updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER journal_streak_trigger
AFTER INSERT ON journals
FOR EACH ROW EXECUTE FUNCTION update_journal_streak();

-- ============================================
-- Updated_at triggers
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_journals_updated_at
BEFORE UPDATE ON journals
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
BEFORE UPDATE ON tasks
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

