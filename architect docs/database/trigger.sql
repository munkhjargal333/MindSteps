-- ============================================================================
-- TRIGGERS FOR AUTOMATION
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_journals_updated_at BEFORE UPDATE ON journals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_core_values_updated_at BEFORE UPDATE ON core_values
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON goals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update user total score
CREATE OR REPLACE FUNCTION update_user_total_score()
RETURNS TRIGGER AS $
BEGIN
  UPDATE users 
  SET total_score = total_score + NEW.points_earned
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$ LANGUAGE plpgsql;

CREATE TRIGGER update_score_on_insert AFTER INSERT ON scoring_history
  FOR EACH ROW EXECUTE FUNCTION update_user_total_score();
