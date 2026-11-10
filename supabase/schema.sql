-- ==============================================================================
-- CARBONOVA LMS — DATABASE SCHEMA & ROW LEVEL SECURITY (RLS)
-- Target Database: PostgreSQL / Supabase
-- ==============================================================================

-- 1. ENUM TIPE ROLE PENGGUNA
CREATE TYPE public.user_role AS ENUM ('teacher', 'student');

-- 2. TABEL PROFIL PENGGUNA (PROFILES)
-- Terhubung langsung dengan tabel auth.users bawaan Supabase
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role public.user_role NOT NULL DEFAULT 'student',
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. TABEL SUBMISI & HASIL EVALUASI LATIHAN (QUIZ SUBMISSIONS)
CREATE TABLE IF NOT EXISTS public.quiz_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    quiz_id VARCHAR(100) NOT NULL,
    quiz_title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    total_questions INTEGER NOT NULL CHECK (total_questions > 0),
    correct_answers INTEGER NOT NULL CHECK (correct_answers >= 0),
    incorrect_answers INTEGER NOT NULL CHECK (incorrect_answers >= 0),
    answers_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. TABEL PROGRES BELAJAR MODUL (MODULE PROGRESS)
CREATE TABLE IF NOT EXISTS public.module_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    module_slug VARCHAR(100) NOT NULL,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, module_slug)
);

-- Indexing untuk performa kueri agregasi LMS
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON public.quiz_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_completed_at ON public.quiz_submissions(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_progress_user_id ON public.module_progress(user_id);

-- ==============================================================================
-- 5. FUNCTION HELPER: MENENTUKAN APAKAH PENGGUNA ADALAH GURU (SECURITY DEFINER)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.is_teacher()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'teacher'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- 6. PENEGAKAN ROW LEVEL SECURITY (RLS)
-- ==============================================================================

-- Aktifkan RLS pada seluruh tabel
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_progress ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- A. Kebijakan Keamanan Tabel Profiles
-- ------------------------------------------------------------------------------
-- Guru dapat melihat profil semua pengguna (guru dan siswa)
CREATE POLICY "Teacher can view all profiles"
    ON public.profiles
    FOR SELECT
    USING (public.is_teacher());

-- Siswa hanya dapat membaca profil akun miliknya sendiri
CREATE POLICY "Users can view own profile"
    ON public.profiles
    FOR SELECT
    USING (auth.uid() = id);

-- Pengguna hanya dapat memperbarui profil miliknya sendiri
CREATE POLICY "Users can update own profile"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id);

-- ------------------------------------------------------------------------------
-- B. Kebijakan Keamanan Tabel Quiz Submissions (Hasil Evaluasi)
-- ------------------------------------------------------------------------------
-- Guru dapat melihat semua hasil pengerjaan kuis siswa untuk pemantauan LMS
CREATE POLICY "Teacher can view all quiz submissions"
    ON public.quiz_submissions
    FOR SELECT
    USING (public.is_teacher());

-- Siswa HANYA dapat melihat hasil pengerjaannya sendiri (Mencegah siswa melihat hasil orang lain)
CREATE POLICY "Students can only view own quiz submissions"
    ON public.quiz_submissions
    FOR SELECT
    USING (auth.uid() = user_id);

-- Siswa hanya dapat memasukkan (insert) hasil kuis atas nama akunnya sendiri
CREATE POLICY "Students can insert own quiz submissions"
    ON public.quiz_submissions
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- C. Kebijakan Keamanan Tabel Module Progress (Progres Materi)
-- ------------------------------------------------------------------------------
-- Guru dapat melihat progres materi seluruh siswa
CREATE POLICY "Teacher can view all module progress"
    ON public.module_progress
    FOR SELECT
    USING (public.is_teacher());

-- Siswa hanya dapat melihat dan menandai progres materi miliknya
CREATE POLICY "Students can manage own module progress"
    ON public.module_progress
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ==============================================================================
-- 7. TRIGGER PEMBUATAN PROFIL OTOMATIS SAAT REGISTER SUPABASE AUTH
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Pengguna Carbonova'),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'student'::public.user_role)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==============================================================================
-- 8. SEED DATA AKUN DEMO RESMI
-- Email Guru : guru.demo@carbonova.test  | Password: GuruDemo123!
-- Email Siswa: siswa.demo@carbonova.test | Password: SiswaDemo123!
-- Catatan: Jika mengimpor ke Supabase, buat user melalui Supabase Auth Dashboard
-- atau Auth Admin API, profil di bawah akan otomatis terisi atau dapat disinkronkan.
-- ==============================================================================

