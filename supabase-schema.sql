-- ============================================================
-- Slate App — Supabase Schema
-- Paste this entire file into: Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- SHOTS
CREATE TABLE IF NOT EXISTS shots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  timestamp timestamptz NOT NULL,
  dose numeric NOT NULL,
  site text NOT NULL,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE shots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "shots_own" ON shots FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- WEIGHTS
CREATE TABLE IF NOT EXISTS weights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  timestamp timestamptz NOT NULL,
  weight_lbs numeric NOT NULL,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE weights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "weights_own" ON weights FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- FOODS
CREATE TABLE IF NOT EXISTS foods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  timestamp timestamptz NOT NULL,
  meal_type text NOT NULL,
  description text NOT NULL,
  calories integer DEFAULT 0,
  protein_g numeric DEFAULT 0,
  carbs_g numeric DEFAULT 0,
  fat_g numeric DEFAULT 0,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE foods ENABLE ROW LEVEL SECURITY;
CREATE POLICY "foods_own" ON foods FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- SYMPTOMS
CREATE TABLE IF NOT EXISTS symptoms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  timestamp timestamptz NOT NULL,
  symptoms text[] NOT NULL DEFAULT '{}',
  severity integer NOT NULL DEFAULT 3,
  linked_shot_id uuid,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE symptoms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "symptoms_own" ON symptoms FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- BILLS
CREATE TABLE IF NOT EXISTS bills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  category text NOT NULL DEFAULT 'other',
  frequency text NOT NULL DEFAULT 'monthly',
  due_day_of_month integer NOT NULL DEFAULT 1,
  autopay boolean DEFAULT false,
  notes text DEFAULT '',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "bills_own" ON bills FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- BILL PAYMENTS
CREATE TABLE IF NOT EXISTS bill_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  bill_id uuid REFERENCES bills(id) ON DELETE CASCADE NOT NULL,
  paid_date timestamptz NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  period_label text NOT NULL DEFAULT '',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE bill_payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "bill_payments_own" ON bill_payments FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- EXERCISES
CREATE TABLE IF NOT EXISTS exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  timestamp timestamptz NOT NULL,
  type text NOT NULL,
  duration_minutes integer NOT NULL DEFAULT 0,
  intensity text NOT NULL DEFAULT 'moderate',
  calories_burned integer,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "exercises_own" ON exercises FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- WORK NOTES
CREATE TABLE IF NOT EXISTS work_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  timestamp timestamptz NOT NULL,
  title text NOT NULL DEFAULT '',
  body text DEFAULT '',
  tags text[] DEFAULT '{}',
  pinned boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE work_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "work_notes_own" ON work_notes FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- PHOTOS (metadata only — blobs in Supabase Storage)
CREATE TABLE IF NOT EXISTS photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  timestamp timestamptz NOT NULL,
  caption text DEFAULT '',
  weight_at_time numeric,
  storage_path text NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "photos_own" ON photos FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- SETTINGS (one row per user, upserted)
CREATE TABLE IF NOT EXISTS settings (
  user_id uuid PRIMARY KEY REFERENCES auth.users NOT NULL,
  weight_unit text DEFAULT 'lbs',
  accent_color text DEFAULT '#2B9FD9',
  reminder_enabled boolean DEFAULT false,
  reminder_day_of_week integer DEFAULT 0,
  reminder_hour integer DEFAULT 9,
  reminder_minute integer DEFAULT 0,
  current_dose numeric DEFAULT 5,
  start_date date DEFAULT '2025-12-31',
  goal_weight_lbs numeric DEFAULT 0,
  height_inches numeric,
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings_own" ON settings FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- Storage bucket for progress photos
-- Run separately in Storage section OR uncomment below:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('photos', 'photos', false);
-- CREATE POLICY "photos_storage_own" ON storage.objects FOR ALL USING (auth.uid()::text = (storage.foldername(name))[1]);
-- ============================================================
