-- ============================================================================
-- CONSCIOUSNESS LEVELS (David Hawkins)
-- ============================================================================

-- Consciousness levels configuration
CREATE TABLE consciousness_levels (
  id SERIAL PRIMARY KEY,
  level_name VARCHAR(50) NOT NULL,
  level_score INT NOT NULL UNIQUE,
  category VARCHAR(20) NOT NULL, -- 'negative', 'transition', 'positive'
  description TEXT,
  keywords TEXT[], -- Array of keywords for detection
  emotion_associations TEXT[],
  color VARCHAR(7),
  sort_order INT,
  created_at TIMESTAMP DEFAULT now()
);

-- Insert consciousness levels
INSERT INTO consciousness_levels (level_name, level_score, category, keywords, color, sort_order) VALUES
('Гэм буруу (Shame)', 20, 'negative', ARRAY['гэм буруутай', 'ичдэг', 'доромжилсон'], '#8B0000', 1),
('Гэм буруутгах (Guilt)', 30, 'negative', ARRAY['буруутай', 'гэмшдэг', 'хариуцлага'], '#A52A2A', 2),
('Хайхрамжгүй (Apathy)', 50, 'negative', ARRAY['хайхрамжгүй', 'сонирхолгүй', 'найдваргүй'], '#696969', 3),
('Гуниг (Grief)', 75, 'negative', ARRAY['гунигтай', 'уйтгартай', 'гуниглаж'], '#4682B4', 4),
('Айдас (Fear)', 100, 'negative', ARRAY['айдаг', 'санаа зовдог', 'эмээдэг'], '#FF6347', 5),
('Хүсэл (Desire)', 125, 'negative', ARRAY['хүсдэг', 'эрмэлздэг', 'хүлээдэг'], '#FF8C00', 6),
('Уур хилэн (Anger)', 150, 'negative', ARRAY['уурлаж', 'ууртай', 'бухимдаж'], '#DC143C', 7),
('Бардам (Pride)', 175, 'negative', ARRAY['бардам', 'бахархал', 'дээгүүр'], '#FFD700', 8),
('Эр зориг (Courage)', 200, 'transition', ARRAY['эр зориг', 'зориглосон', 'хичээнэ'], '#32CD32', 9),
('Төвийг сахих (Neutrality)', 250, 'positive', ARRAY['төвийг сахисан', 'тайван', 'тэнцвэртэй'], '#87CEEB', 10),
('Боломж (Willingness)', 310, 'positive', ARRAY['боломж', 'бэлэн', 'идэвхтэй'], '#98FB98', 11),
('Хүлээн зөвшөөрөх (Acceptance)', 350, 'positive', ARRAY['хүлээн зөвшөөрч', 'ойлгож', 'зөвшөөрч'], '#90EE90', 12),
('Оюун ухаан (Reason)', 400, 'positive', ARRAY['ухаалаг', 'логиктой', 'ойлгож'], '#4169E1', 13),
('Хайр (Love)', 500, 'positive', ARRAY['хайрлаж', 'энхрийлэж', 'халамжилж'], '#FF69B4', 14),
('Баяр (Joy)', 540, 'positive', ARRAY['баяртай', 'аз жаргалтай', 'баясаж'], '#FFD700', 15),
('Амар тайван (Peace)', 600, 'positive', ARRAY['амар тайван', 'тайвшралтай', 'гэгээрэлтэй'], '#E6E6FA', 16),
('Гэгээрэл (Enlightenment)', 700, 'positive', ARRAY['гэгээрсэн', 'учир утга', 'мэдрэмжтэй'], '#FFFFFF', 17);

-- User consciousness tracking
CREATE TABLE user_consciousness_tracking (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  measurement_date DATE NOT NULL DEFAULT CURRENT_DATE,
  consciousness_score INT NOT NULL CHECK (consciousness_score >= 1 AND consciousness_score <= 1000),
  primary_level_id INT REFERENCES consciousness_levels(id),
  detected_from VARCHAR(20), -- 'journal', 'mood', 'combined'
  source_id BIGINT,
  calculation_method VARCHAR(50),
  confidence_score DECIMAL(3,2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_consciousness_user_date ON user_consciousness_tracking(user_id, measurement_date DESC);
