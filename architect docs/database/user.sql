CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- For text search
CREATE EXTENSION IF NOT EXISTS "btree_gin"; -- For composite indexes

-- ============================================================================
-- CORE USER MANAGEMENT
-- ============================================================================

-- Users table
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  total_score INT DEFAULT 0,
  current_level INT DEFAULT 1,
  level_progress INT DEFAULT 0,
  profile_picture VARCHAR(255),
  timezone VARCHAR(50) DEFAULT 'UTC',
  language VARCHAR(5) DEFAULT 'mn',
  is_active BOOLEAN DEFAULT TRUE,
  is_email_verified BOOLEAN DEFAULT FALSE,
  email_verified_at TIMESTAMP,
  last_login TIMESTAMP,
  login_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  deleted_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_active ON users(is_active, deleted_at);

-- Roles table
CREATE TABLE roles (
  id BIGSERIAL PRIMARY KEY,
  level SMALLINT NOT NULL,
  code VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(50) NOT NULL,
  permissions JSONB DEFAULT '{}',
  created_by_id BIGINT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT now(),
  updated_by_id BIGINT REFERENCES users(id),
  updated_at TIMESTAMP DEFAULT now()
);

-- Role owners (User-Role mapping)
CREATE TABLE role_owners (
  id BIGSERIAL PRIMARY KEY,
  role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  owner_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(10) DEFAULT 'active',
  assigned_by_id BIGINT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT now(),
  revoked_at TIMESTAMP,
  UNIQUE(role_id, owner_id)
);

CREATE INDEX idx_role_owners_user ON role_owners(owner_id, status);

-- ============================================================================
-- AUTHENTICATION & SECURITY
-- ============================================================================

-- OTP for email verification and password reset
CREATE TABLE auth_otp (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  otp_code VARCHAR(10) NOT NULL,
  otp_type VARCHAR(20) NOT NULL, -- 'email_verification', 'password_reset', '2fa'
  is_used BOOLEAN DEFAULT FALSE,
  expired_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  deleted_at TIMESTAMP
);

CREATE INDEX idx_auth_otp_user_type ON auth_otp(user_id, otp_type, expired_at);

-- User sessions for JWT management
CREATE TABLE user_sessions (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL UNIQUE,
  device_info TEXT,
  ip_address INET,
  user_agent TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  last_activity TIMESTAMP DEFAULT now(),
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  revoked_at TIMESTAMP,
  revoke_reason VARCHAR(50)
);

CREATE INDEX idx_sessions_user_active ON user_sessions(user_id, is_active, expires_at);
CREATE INDEX idx_sessions_token ON user_sessions(token_hash) WHERE is_active = TRUE;

-- Revoked tokens blacklist
CREATE TABLE revoked_tokens (
  id BIGSERIAL PRIMARY KEY,
  token_hash VARCHAR(255) UNIQUE NOT NULL,
  user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  revoked_at TIMESTAMP DEFAULT now(),
  expires_at TIMESTAMP NOT NULL,
  reason VARCHAR(50)
);

CREATE INDEX idx_revoked_tokens_hash ON revoked_tokens(token_hash, expires_at);

-- Encryption keys for sensitive data
CREATE TABLE encryption_keys (
  id BIGSERIAL PRIMARY KEY,
  key_name VARCHAR(50) UNIQUE NOT NULL,
  key_version INT NOT NULL,
  encrypted_key TEXT NOT NULL,
  algorithm VARCHAR(20) DEFAULT 'AES-256',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT now(),
  rotated_at TIMESTAMP,
  expires_at TIMESTAMP
);

-- ============================================================================
-- GAMIFICATION SYSTEM
-- ============================================================================

-- User levels configuration
CREATE TABLE user_levels (
  id SERIAL PRIMARY KEY,
  level_number INT UNIQUE NOT NULL,
  level_name VARCHAR(100) NOT NULL,
  min_score INT NOT NULL,
  max_score INT,
  description TEXT,
  icon VARCHAR(50),
  color VARCHAR(7),
  badge_image VARCHAR(255),
  perks JSONB, -- {"daily_bonus": 10, "features": ["advanced_insights"]}
  created_at TIMESTAMP DEFAULT now()
);

-- User achievements/badges
CREATE TABLE user_achievements (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_type VARCHAR(50) NOT NULL,
  achievement_category VARCHAR(30), -- 'journal', 'meditation', 'learning', 'milestone'
  title VARCHAR(255) NOT NULL,
  description TEXT,
  badge_icon VARCHAR(50),
  badge_color VARCHAR(7),
  points_earned INT DEFAULT 0,
  unlocked_at TIMESTAMP DEFAULT now(),
  is_featured BOOLEAN DEFAULT FALSE,
  rarity VARCHAR(20) DEFAULT 'common' -- 'common', 'rare', 'epic', 'legendary'
);

CREATE INDEX idx_achievements_user ON user_achievements(user_id, unlocked_at DESC);
CREATE INDEX idx_achievements_type ON user_achievements(achievement_type, achievement_category);

-- User streaks tracking
CREATE TABLE user_streaks (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  streak_type VARCHAR(50) NOT NULL,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  last_activity_date DATE,
  streak_start_date DATE,
  total_activities INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE (user_id, streak_type)
);

CREATE INDEX idx_streaks_user_type ON user_streaks(user_id, streak_type);

-- Scoring history for transparency
CREATE TABLE scoring_history (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  source_type VARCHAR(30) NOT NULL, -- 'journal', 'mood', 'meditation', 'lesson', 'goal'
  source_id BIGINT,
  points_earned INT NOT NULL,
  points_type VARCHAR(50),
  multiplier DECIMAL(3,2) DEFAULT 1.0,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_scoring_user_created ON scoring_history(user_id, created_at DESC);
CREATE INDEX idx_scoring_source ON scoring_history(source_type, source_id);
