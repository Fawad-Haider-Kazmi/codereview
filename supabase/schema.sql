CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS profiles (
    id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name   TEXT NOT NULL,
    email       TEXT NOT NULL UNIQUE,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, full_name, email)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'full_name',
        NEW.email
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

CREATE TABLE IF NOT EXISTS reviews (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title           TEXT NOT NULL,
    language        TEXT NOT NULL,
    code_snippet    TEXT NOT NULL,
    ai_summary      TEXT,
    total_issues    INTEGER DEFAULT 0,
    critical_count  INTEGER DEFAULT 0,
    warning_count   INTEGER DEFAULT 0,
    info_count      INTEGER DEFAULT 0,
    score           INTEGER DEFAULT 0,
    status          TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS issues (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    review_id    UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
    severity     TEXT NOT NULL CHECK (severity IN ('critical', 'warning', 'info')),
    category     TEXT NOT NULL,
    line_number  INTEGER,
    title        TEXT NOT NULL,
    description  TEXT NOT NULL,
    suggestion   TEXT,
    created_at   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews  ENABLE ROW LEVEL SECURITY;
ALTER TABLE issues   ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"   ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can view own reviews"   ON reviews FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reviews" ON reviews FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own issues"
    ON issues FOR SELECT
    USING (EXISTS (SELECT 1 FROM reviews WHERE reviews.id = issues.review_id AND reviews.user_id = auth.uid()));

CREATE POLICY "Users can insert own issues"
    ON issues FOR INSERT
    WITH CHECK (EXISTS (SELECT 1 FROM reviews WHERE reviews.id = issues.review_id AND reviews.user_id = auth.uid()));

CREATE INDEX idx_reviews_user_id  ON reviews(user_id);
CREATE INDEX idx_reviews_created  ON reviews(created_at DESC);
CREATE INDEX idx_issues_review_id ON issues(review_id);
CREATE INDEX idx_issues_severity  ON issues(severity);