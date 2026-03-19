

--
-- Name: ai_journal_detailed_analysis; Type: TABLE; Schema: mindstep; Owner: neondb_owner
--

CREATE TABLE mindstep.ai_journal_detailed_analysis (
    id bigint NOT NULL,
    journal_id bigint NOT NULL,
    user_id bigint NOT NULL,
    overall_sentiment numeric(4,2),
    primary_emotions jsonb,
    emotion_intensity numeric(3,2),
    emotional_depth_score integer DEFAULT 0,
    self_reflection_score integer DEFAULT 0,
    goal_alignment_score integer DEFAULT 0,
    gratitude_score integer DEFAULT 0,
    problem_solving_score integer DEFAULT 0,
    mindfulness_score integer DEFAULT 0,
    stress_indicators text[],
    positive_patterns text[],
    concerning_patterns text[],
    growth_indicators text[],
    personalized_feedback text,
    suggested_actions text[],
    recommended_lesson_ids bigint[],
    total_weighted_score numeric(5,2),
    bonus_points integer DEFAULT 0,
    final_points integer,
    ai_confidence numeric(3,2),
    processing_version character varying(10) DEFAULT 'v1.0'::character varying,
    processing_duration integer,
    model_name character varying(50),
    created_at timestamp without time zone DEFAULT now()
);

--
-- Name: ai_journal_detailed_analysis_id_seq; Type: SEQUENCE; Schema: mindstep; Owner: neondb_owner
--

CREATE SEQUENCE mindstep.ai_journal_detailed_analysis_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: ai_journal_detailed_analysis_id_seq; Type: SEQUENCE OWNED BY; Schema: mindstep; Owner: neondb_owner
--

ALTER SEQUENCE mindstep.ai_journal_detailed_analysis_id_seq OWNED BY mindstep.ai_journal_detailed_analysis.id;

--
-- Name: ai_mood_analysis; Type: TABLE; Schema: mindstep; Owner: neondb_owner
--

CREATE TABLE mindstep.ai_mood_analysis (
    id bigint NOT NULL,
    mood_entry_id bigint NOT NULL,
    user_id bigint NOT NULL,
    mood_consistency_score integer DEFAULT 0,
    trigger_pattern_score integer DEFAULT 0,
    coping_effectiveness_score integer DEFAULT 0,
    emotional_intelligence_score integer DEFAULT 0,
    detected_patterns jsonb,
    trigger_analysis text,
    improvement_suggestions text[],
    warning_flags text[],
    points_earned integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now()
);

--
-- Name: ai_mood_analysis_id_seq; Type: SEQUENCE; Schema: mindstep; Owner: neondb_owner
--

CREATE SEQUENCE mindstep.ai_mood_analysis_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: ai_mood_analysis_id_seq; Type: SEQUENCE OWNED BY; Schema: mindstep; Owner: neondb_owner
--

ALTER SEQUENCE mindstep.ai_mood_analysis_id_seq OWNED BY mindstep.ai_mood_analysis.id;

--
-- Name: ai_progress_tracking; Type: TABLE; Schema: mindstep; Owner: neondb_owner
--

CREATE TABLE mindstep.ai_progress_tracking (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    analysis_period character varying(20),
    period_start date NOT NULL,
    period_end date NOT NULL,
    journal_consistency_score integer,
    mood_stability_trend numeric(4,2),
    goal_progress_rate numeric(5,2),
    meditation_regularity_score integer,
    overall_wellbeing_trend numeric(4,2),
    consciousness_level_change integer,
    key_improvements jsonb,
    areas_needing_attention jsonb,
    behavioral_changes_detected jsonb,
    recommended_focus_areas text[],
    period_total_points integer,
    improvement_bonus_points integer DEFAULT 0,
    consistency_bonus_points integer DEFAULT 0,
    generated_at timestamp without time zone DEFAULT now()
);

--
-- Name: ai_progress_tracking_id_seq; Type: SEQUENCE; Schema: mindstep; Owner: neondb_owner
--

CREATE SEQUENCE mindstep.ai_progress_tracking_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: ai_progress_tracking_id_seq; Type: SEQUENCE OWNED BY; Schema: mindstep; Owner: neondb_owner
--

ALTER SEQUENCE mindstep.ai_progress_tracking_id_seq OWNED BY mindstep.ai_progress_tracking.id;

--
-- Name: ai_scoring_criteria; Type: TABLE; Schema: mindstep; Owner: neondb_owner
--

CREATE TABLE mindstep.ai_scoring_criteria (
    id integer NOT NULL,
    criteria_name character varying(100) NOT NULL,
    criteria_category character varying(50),
    description text,
    max_points integer DEFAULT 10,
    weight numeric(3,2) DEFAULT 1.0,
    calculation_method text,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

--
-- Name: ai_scoring_criteria_id_seq; Type: SEQUENCE; Schema: mindstep; Owner: neondb_owner
--

CREATE SEQUENCE mindstep.ai_scoring_criteria_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: ai_scoring_criteria_id_seq; Type: SEQUENCE OWNED BY; Schema: mindstep; Owner: neondb_owner
--

ALTER SEQUENCE mindstep.ai_scoring_criteria_id_seq OWNED BY mindstep.ai_scoring_criteria.id;

--
-- Name: ai_weekly_mood_deep_analysis; Type: TABLE; Schema: mindstep; Owner: neondb_owner
--

CREATE TABLE mindstep.ai_weekly_mood_deep_analysis (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    analysis_week date NOT NULL,
    hidden_emotional_patterns jsonb,
    unconscious_triggers jsonb,
    emotional_cycles text[],
    unmet_needs text[],
    values_in_conflict jsonb,
    values_being_honored jsonb,
    deep_insights text,
    recommended_actions text[],
    suggested_lesson_ids bigint[],
    consciousness_shift_opportunities text[],
    created_at timestamp without time zone DEFAULT now()
);

--
-- Name: ai_weekly_mood_deep_analysis_id_seq; Type: SEQUENCE; Schema: mindstep; Owner: neondb_owner
--

CREATE SEQUENCE mindstep.ai_weekly_mood_deep_analysis_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: ai_weekly_mood_deep_analysis_id_seq; Type: SEQUENCE OWNED BY; Schema: mindstep; Owner: neondb_owner
--

ALTER SEQUENCE mindstep.ai_weekly_mood_deep_analysis_id_seq OWNED BY mindstep.ai_weekly_mood_deep_analysis.id;

