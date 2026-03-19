CREATE FUNCTION public.fn_user_hawkins_maslow_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    DELETE FROM mindstep.user_hawkins_maslow
    WHERE mood_entry_id = OLD.id;

    RETURN OLD;
END;
$$;

--
-- Name: fn_user_hawkins_maslow_insert(); Type: FUNCTION; Schema: public; Owner: neondb_owner
--

CREATE FUNCTION public.fn_user_hawkins_maslow_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_hawkins_id INT;
    v_maslow_id  INT;
    v_score      INT;
BEGIN
    SELECT hawkins_level_id
    INTO v_hawkins_id
    FROM mindstep.mood_unit
    WHERE id = NEW.mood_unit_id;

    SELECT maslow_level_id
    INTO v_maslow_id
    FROM mindstep.core_values
    WHERE id = NEW.core_value_id;

    IF v_hawkins_id IS NULL OR v_maslow_id IS NULL THEN
        RETURN NEW;
    END IF;

    SELECT COALESCE(score, 0)
    INTO v_score
    FROM mindstep.hawkins_maslow
    WHERE hawk_id = v_hawkins_id
      AND maslow_id = v_maslow_id;

    INSERT INTO mindstep.user_hawkins_maslow
        (user_id, mood_entry_id, hawkins_id, maslow_id, score)
    VALUES
        (NEW.user_id, NEW.id, v_hawkins_id, v_maslow_id, v_score);

    RETURN NEW;
END;
$$;

--
-- Name: fn_user_hawkins_maslow_update(); Type: FUNCTION; Schema: public; Owner: neondb_owner
--

CREATE FUNCTION public.fn_user_hawkins_maslow_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_hawkins_id INT;
    v_maslow_id  INT;
    v_score      INT;
BEGIN
    IF NEW.mood_unit_id = OLD.mood_unit_id
       AND NEW.core_value_id = OLD.core_value_id
       AND NEW.user_id = OLD.user_id THEN
        RETURN NEW;
    END IF;

    SELECT hawkins_level_id
    INTO v_hawkins_id
    FROM mindstep.mood_unit
    WHERE id = NEW.mood_unit_id;

    SELECT maslow_level_id
    INTO v_maslow_id
    FROM mindstep.core_values
    WHERE id = NEW.core_value_id;

    IF v_hawkins_id IS NULL OR v_maslow_id IS NULL THEN
        DELETE FROM mindstep.user_hawkins_maslow
        WHERE mood_entry_id = NEW.id;
        RETURN NEW;
    END IF;

    SELECT COALESCE(score, 0)
    INTO v_score
    FROM mindstep.hawkins_maslow
    WHERE hawk_id = v_hawkins_id
      AND maslow_id = v_maslow_id;

    UPDATE mindstep.user_hawkins_maslow
    SET
        user_id    = NEW.user_id,
        hawkins_id = v_hawkins_id,
        maslow_id  = v_maslow_id,
        score      = v_score
    WHERE mood_entry_id = NEW.id;

    RETURN NEW;
END;
$$;

--
-- Name: populate_user_hawkins_maslow(); Type: FUNCTION; Schema: public; Owner: neondb_owner
--

CREATE FUNCTION public.populate_user_hawkins_maslow() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_hawkins_id INT;
    v_maslow_id  INT;
    v_score      INT;
BEGIN
    -- DELETE case
    IF TG_OP = 'DELETE' THEN
        DELETE FROM mindstep.user_hawkins_maslow
        WHERE mood_entry_id = OLD.id;
        RETURN OLD;
    END IF;

    -- MoodUnit → Hawkins
    SELECT hawkins_level_id
    INTO v_hawkins_id
    FROM mindstep.mood_unit
    WHERE id = NEW.mood_unit_id;

    -- CoreValue → Maslow
    SELECT maslow_level_id
    INTO v_maslow_id
    FROM mindstep.core_values
    WHERE id = NEW.core_value_id;

    -- mapping score
    SELECT score
    INTO v_score
    FROM mindstep.hawkins_maslow
    WHERE hawk_id = v_hawkins_id
      AND maslow_id = v_maslow_id;

    -- UPSERT (INSERT or UPDATE)
    INSERT INTO mindstep.user_hawkins_maslow (
        user_id,
        mood_entry_id,
        hawkins_id,
        maslow_id,
        score
    )
    VALUES (
        NEW.user_id,
        NEW.id,
        v_hawkins_id,
        v_maslow_id,
        COALESCE(v_score, 0)
    )
    ON CONFLICT (mood_entry_id)
    DO UPDATE SET
        hawkins_id = EXCLUDED.hawkins_id,
        maslow_id  = EXCLUDED.maslow_id,
        score      = EXCLUDED.score;

    RETURN NEW;
END;
$$;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: neondb_owner
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

SET default_tablespace = '';

SET default_table_access_method = heap;