

-- ============================================================================
-- MASLOW'S HIERARCHY & CORE VALUES
-- ============================================================================

-- Maslow's hierarchy levels (predefined)
CREATE TABLE maslow_levels (
  id SERIAL PRIMARY KEY,
  level_number INT UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  color VARCHAR(7),
  icon VARCHAR(50),
  sort_order INT,
  created_at TIMESTAMP DEFAULT now()
);

-- Insert Maslow's levels
INSERT INTO maslow_levels (level_number, name, description, color, icon, sort_order) VALUES
(1, 'Физиологийн хэрэгцээ', 'Хоол, ус, унтлага, эрүүл мэнд', '#E53935', 'heart', 1),
(2, 'Аюулгүй байдал', 'Орчин, санхүү, ажил, тогтвортой байдал', '#FB8C00', 'shield', 2),
(3, 'Хайр ба харьяалагдах', 'Найз нөхөд, гэр бүл, хамт олон', '#FDD835', 'users', 3),
(4, 'Хүндэтгэл', 'Өөртөө итгэх, амжилт, хүлээн зөвшөөрөгдөх', '#43A047', 'award', 4),
(5, 'Өөрийгөө хөгжүүлэх', 'Чадвараа бүрэн ашиглах, боломжоо хэрэгжүүлэх', '#1E88E5', 'target', 5);

-- User's core values
CREATE TABLE core_values (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  maslow_level_id INT REFERENCES maslow_levels(id),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  priority_order INT,
  color VARCHAR(7),
  icon VARCHAR(50),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  CONSTRAINT check_priority_order CHECK (priority_order >= 1 AND priority_order <= 7)
);

CREATE INDEX idx_core_values_user ON core_values(user_id, is_active, priority_order);

-- Value reflections (tracking how values show up in daily life)
CREATE TABLE value_reflections (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  value_id BIGINT NOT NULL REFERENCES core_values(id) ON DELETE CASCADE,
  source_type VARCHAR(20) NOT NULL, -- 'journal', 'mood', 'goal', 'manual'
  source_id BIGINT,
  reflection_date DATE NOT NULL DEFAULT CURRENT_DATE,
  alignment_score INT CHECK (alignment_score >= 1 AND alignment_score <= 10),
  notes TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_value_reflections_user_value ON value_reflections(user_id, value_id, reflection_date DESC);
