
CREATE TABLE mindstep.auth_otp (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    otp_code character varying(10) NOT NULL,
    otp_type character varying(20) NOT NULL,
    is_used boolean DEFAULT false,
    expired_at timestamp without time zone NOT NULL,
    used_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    deleted_at timestamp without time zone
);

--
-- Name: auth_otp_id_seq; Type: SEQUENCE; Schema: mindstep; Owner: neondb_owner
--

CREATE SEQUENCE mindstep.auth_otp_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: auth_otp_id_seq; Type: SEQUENCE OWNED BY; Schema: mindstep; Owner: neondb_owner
--

ALTER SEQUENCE mindstep.auth_otp_id_seq OWNED BY mindstep.auth_otp.id;

--
-- Name: core_values; Type: TABLE; Schema: mindstep; Owner: neondb_owner
--

CREATE TABLE mindstep.core_values (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    maslow_level_id integer,
    name character varying(100) NOT NULL,
    description text,
    priority_order integer,
    color character varying(7),
    icon character varying(50),
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT check_priority_order CHECK (((priority_order >= 1) AND (priority_order <= 7)))
);

--
-- Name: core_values_id_seq; Type: SEQUENCE; Schema: mindstep; Owner: neondb_owner
--

CREATE SEQUENCE mindstep.core_values_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: core_values_id_seq; Type: SEQUENCE OWNED BY; Schema: mindstep; Owner: neondb_owner
--

ALTER SEQUENCE mindstep.core_values_id_seq OWNED BY mindstep.core_values.id;

--
-- Name: data_retention_policies; Type: TABLE; Schema: mindstep; Owner: neondb_owner
--

CREATE TABLE mindstep.data_retention_policies (
    id integer NOT NULL,
    table_name character varying(100) NOT NULL,
    retention_days integer NOT NULL,
    archive_after_days integer,
    auto_delete boolean DEFAULT false,
    deletion_method character varying(50),
    last_cleanup_at timestamp without time zone,
    next_cleanup_at timestamp without time zone,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

--
-- Name: data_retention_policies_id_seq; Type: SEQUENCE; Schema: mindstep; Owner: neondb_owner
--

CREATE SEQUENCE mindstep.data_retention_policies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: data_retention_policies_id_seq; Type: SEQUENCE OWNED BY; Schema: mindstep; Owner: neondb_owner
--

ALTER SEQUENCE mindstep.data_retention_policies_id_seq OWNED BY mindstep.data_retention_policies.id;

--
-- Name: deleted_data_log; Type: TABLE; Schema: mindstep; Owner: neondb_owner
--

CREATE TABLE mindstep.deleted_data_log (
    id bigint NOT NULL,
    user_id bigint,
    table_name character varying(100),
    record_id bigint,
    record_data jsonb,
    deleted_reason character varying(50),
    deletion_method character varying(50),
    deleted_at timestamp without time zone DEFAULT now(),
    deleted_by_id bigint,
    can_recover boolean DEFAULT false,
    recovery_expires_at timestamp without time zone
);

--
-- Name: deleted_data_log_id_seq; Type: SEQUENCE; Schema: mindstep; Owner: neondb_owner
--

CREATE SEQUENCE mindstep.deleted_data_log_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: deleted_data_log_id_seq; Type: SEQUENCE OWNED BY; Schema: mindstep; Owner: neondb_owner
--

ALTER SEQUENCE mindstep.deleted_data_log_id_seq OWNED BY mindstep.deleted_data_log.id;

--
-- Name: detected_patterns; Type: TABLE; Schema: mindstep; Owner: neondb_owner
--

CREATE TABLE mindstep.detected_patterns (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    pattern_type character varying(50) NOT NULL,
    pattern_category character varying(30),
    pattern_name character varying(255),
    description text,
    detected_from text[],
    frequency character varying(20),
    confidence_score numeric(3,2),
    first_detected date,
    last_detected date,
    occurrence_count integer DEFAULT 1,
    severity character varying(20),
    related_value_ids bigint[],
    emotional_impact_score integer,
    suggested_actions text[],
    recommended_lesson_ids bigint[],
    is_resolved boolean DEFAULT false,
    resolved_at timestamp without time zone,
    user_acknowledged boolean DEFAULT false,
    acknowledged_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

--
-- Name: detected_patterns_id_seq; Type: SEQUENCE; Schema: mindstep; Owner: neondb_owner
--

CREATE SEQUENCE mindstep.detected_patterns_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: detected_patterns_id_seq; Type: SEQUENCE OWNED BY; Schema: mindstep; Owner: neondb_owner
--

ALTER SEQUENCE mindstep.detected_patterns_id_seq OWNED BY mindstep.detected_patterns.id;

--
-- Name: encryption_keys; Type: TABLE; Schema: mindstep; Owner: neondb_owner
--

CREATE TABLE mindstep.encryption_keys (
    id bigint NOT NULL,
    key_name character varying(50) NOT NULL,
    key_version integer NOT NULL,
    encrypted_key text NOT NULL,
    algorithm character varying(20) DEFAULT 'AES-256'::character varying,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    rotated_at timestamp without time zone,
    expires_at timestamp without time zone
);

--
-- Name: encryption_keys_id_seq; Type: SEQUENCE; Schema: mindstep; Owner: neondb_owner
--

CREATE SEQUENCE mindstep.encryption_keys_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: encryption_keys_id_seq; Type: SEQUENCE OWNED BY; Schema: mindstep; Owner: neondb_owner
--

ALTER SEQUENCE mindstep.encryption_keys_id_seq OWNED BY mindstep.encryption_keys.id;

--
-- Name: error_logs; Type: TABLE; Schema: mindstep; Owner: neondb_owner
--

CREATE TABLE mindstep.error_logs (
    id bigint NOT NULL,
    user_id bigint,
    error_type character varying(50),
    error_message text,
    stack_trace text,
    request_url text,
    request_method character varying(10),
    request_body text,
    ip_address inet,
    user_agent text,
    is_resolved boolean DEFAULT false,
    resolved_at timestamp without time zone,
    resolved_by_id bigint,
    resolution_notes text,
    created_at timestamp without time zone DEFAULT now()
);

--
-- Name: error_logs_id_seq; Type: SEQUENCE; Schema: mindstep; Owner: neondb_owner
--

CREATE SEQUENCE mindstep.error_logs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: error_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: mindstep; Owner: neondb_owner
--

ALTER SEQUENCE mindstep.error_logs_id_seq OWNED BY mindstep.error_logs.id;

--
-- Name: goal_milestones; Type: TABLE; Schema: mindstep; Owner: neondb_owner
--

CREATE TABLE mindstep.goal_milestones (
    id bigint NOT NULL,
    goal_id bigint NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    target_date date,
    is_completed boolean DEFAULT false,
    completed_at timestamp without time zone,
    sort_order integer,
    created_at timestamp without time zone DEFAULT now()
);

--
-- Name: goal_milestones_id_seq; Type: SEQUENCE; Schema: mindstep; Owner: neondb_owner
--

CREATE SEQUENCE mindstep.goal_milestones_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: goal_milestones_id_seq; Type: SEQUENCE OWNED BY; Schema: mindstep; Owner: neondb_owner
--

ALTER SEQUENCE mindstep.goal_milestones_id_seq OWNED BY mindstep.goal_milestones.id;

--
-- Name: goals; Type: TABLE; Schema: mindstep; Owner: neondb_owner
--

CREATE TABLE mindstep.goals (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    value_id bigint,
    title character varying(255) NOT NULL,
    description text,
    goal_type character varying(20),
    target_date date,
    status character varying(20) DEFAULT 'active'::character varying,
    progress_percentage integer DEFAULT 0,
    is_public boolean DEFAULT false,
    priority character varying(20) DEFAULT 'medium'::character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    completed_at timestamp without time zone,
    deleted_at timestamp without time zone,
    CONSTRAINT goals_progress_percentage_check CHECK (((progress_percentage >= 0) AND (progress_percentage <= 100)))
);

--
-- Name: goals_id_seq; Type: SEQUENCE; Schema: mindstep; Owner: neondb_owner
--

CREATE SEQUENCE mindstep.goals_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: goals_id_seq; Type: SEQUENCE OWNED BY; Schema: mindstep; Owner: neondb_owner
--

ALTER SEQUENCE mindstep.goals_id_seq OWNED BY mindstep.goals.id;

--
-- Name: hawkins_levels; Type: TABLE; Schema: mindstep; Owner: neondb_owner
--

CREATE TABLE mindstep.hawkins_levels (
    id integer NOT NULL,
    level_score integer NOT NULL,
    name_mn character varying(100) NOT NULL,
    name_en character varying(100) NOT NULL,
    category character varying(20) NOT NULL,
    color character varying(20) NOT NULL,
    keywords text[],
    description text,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);

--
-- Name: hawkins_levels_id_seq; Type: SEQUENCE; Schema: mindstep; Owner: neondb_owner
--

CREATE SEQUENCE mindstep.hawkins_levels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: hawkins_levels_id_seq; Type: SEQUENCE OWNED BY; Schema: mindstep; Owner: neondb_owner
--

ALTER SEQUENCE mindstep.hawkins_levels_id_seq OWNED BY mindstep.hawkins_levels.id;

--
-- Name: hawkins_maslow; Type: TABLE; Schema: mindstep; Owner: neondb_owner
--

CREATE TABLE mindstep.hawkins_maslow (
    id integer NOT NULL,
    hawk_id integer NOT NULL,
    maslow_id integer NOT NULL,
    score integer NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT hawkins_maslow_score_check CHECK (((score >= 0) AND (score <= 3)))
);

--
-- Name: hawkins_maslow_id_seq; Type: SEQUENCE; Schema: mindstep; Owner: neondb_owner
--

CREATE SEQUENCE mindstep.hawkins_maslow_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: hawkins_maslow_id_seq; Type: SEQUENCE OWNED BY; Schema: mindstep; Owner: neondb_owner
--

ALTER SEQUENCE mindstep.hawkins_maslow_id_seq OWNED BY mindstep.hawkins_maslow.id;

--
-- Name: journals; Type: TABLE; Schema: mindstep; Owner: neondb_owner
--

CREATE TABLE mindstep.journals (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    title character varying(255),
    content text NOT NULL,
    content_encrypted text,
    encryption_key_id bigint,
    word_count integer,
    sentiment_score numeric(4,2),
    is_private boolean DEFAULT true,
    tags text,
    related_value_ids bigint,
    ai_detected_values bigint[],
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    deleted_at timestamp without time zone
);

--
-- Name: journals_id_seq; Type: SEQUENCE; Schema: mindstep; Owner: neondb_owner
--

CREATE SEQUENCE mindstep.journals_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: journals_id_seq; Type: SEQUENCE OWNED BY; Schema: mindstep; Owner: neondb_owner
--

ALTER SEQUENCE mindstep.journals_id_seq OWNED BY mindstep.journals.id;

--
-- Name: lesson_categories; Type: TABLE; Schema: mindstep; Owner: neondb_owner
--

CREATE TABLE mindstep.lesson_categories (
    id integer NOT NULL,
    parent_id integer,
    name_en character varying(100) NOT NULL,
    name_mn character varying(100) NOT NULL,
    description text,
    icon character varying(50),
    color character varying(7),
    sort_order integer,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    emoji character varying(10)
);

--
-- Name: lesson_categories_id_seq; Type: SEQUENCE; Schema: mindstep; Owner: neondb_owner
--

CREATE SEQUENCE mindstep.lesson_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: lesson_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: mindstep; Owner: neondb_owner
--

ALTER SEQUENCE mindstep.lesson_categories_id_seq OWNED BY mindstep.lesson_categories.id;

--
-- Name: lesson_comments; Type: TABLE; Schema: mindstep; Owner: neondb_owner
--

CREATE TABLE mindstep.lesson_comments (
    id bigint NOT NULL,
    lesson_id bigint NOT NULL,
    user_id bigint NOT NULL,
    parent_id bigint,
    content text NOT NULL,
    is_edited boolean DEFAULT false,
    is_deleted boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

--
-- Name: lesson_comments_id_seq; Type: SEQUENCE; Schema: mindstep; Owner: neondb_owner
--

CREATE SEQUENCE mindstep.lesson_comments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: lesson_comments_id_seq; Type: SEQUENCE OWNED BY; Schema: mindstep; Owner: neondb_owner
--

ALTER SEQUENCE mindstep.lesson_comments_id_seq OWNED BY mindstep.lesson_comments.id;

--
-- Name: lesson_reactions; Type: TABLE; Schema: mindstep; Owner: neondb_owner
--

CREATE TABLE mindstep.lesson_reactions (
    id bigint NOT NULL,
    lesson_id bigint NOT NULL,
    user_id bigint NOT NULL,
    reaction_type character varying(20),
    created_at timestamp without time zone DEFAULT now()
);

--
-- Name: lesson_reactions_id_seq; Type: SEQUENCE; Schema: mindstep; Owner: neondb_owner
--

CREATE SEQUENCE mindstep.lesson_reactions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: lesson_reactions_id_seq; Type: SEQUENCE OWNED BY; Schema: mindstep; Owner: neondb_owner
--

ALTER SEQUENCE mindstep.lesson_reactions_id_seq OWNED BY mindstep.lesson_reactions.id;

--
-- Name: lesson_recommendations; Type: TABLE; Schema: mindstep; Owner: neondb_owner
--

CREATE TABLE mindstep.lesson_recommendations (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    lesson_id bigint NOT NULL,
    recommendation_reason character varying(50),
    related_value_id bigint,
    related_pattern_id bigint,
    priority_score integer DEFAULT 0,
    is_dismissed boolean DEFAULT false,
    dismissed_at timestamp without time zone,
    viewed_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now()
);

--
-- Name: lesson_recommendations_id_seq; Type: SEQUENCE; Schema: mindstep; Owner: neondb_owner
--

CREATE SEQUENCE mindstep.lesson_recommendations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: lesson_recommendations_id_seq; Type: SEQUENCE OWNED BY; Schema: mindstep; Owner: neondb_owner
--

ALTER SEQUENCE mindstep.lesson_recommendations_id_seq OWNED BY mindstep.lesson_recommendations.id;

--
-- Name: lessons; Type: TABLE; Schema: mindstep; Owner: neondb_owner
--

CREATE TABLE mindstep.lessons (
    id bigint NOT NULL,
    category_id integer NOT NULL,
    parent_id bigint,
    title character varying(255) NOT NULL,
    slug character varying(255),
    description text,
    content text,
    lesson_type character varying(20),
    difficulty_level character varying(20),
    required_level integer DEFAULT 1,
    estimated_duration integer,
    points_reward integer DEFAULT 0,
    media_url character varying(500),
    thumbnail_url character varying(500),
    tags text[],
    related_value_keywords text[],
    related_emotion_keywords text[],
    is_premium boolean DEFAULT false,
    is_published boolean DEFAULT false,
    view_count integer DEFAULT 0,
    like_count integer DEFAULT 0,
    sort_order integer,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    published_at timestamp without time zone,
    deleted_at timestamp without time zone,
    sort_id integer GENERATED ALWAYS AS (((category_id * 1000) + id)) STORED
);

--
-- Name: lessons_id_seq; Type: SEQUENCE; Schema: mindstep; Owner: neondb_owner
--

CREATE SEQUENCE mindstep.lessons_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: lessons_id_seq; Type: SEQUENCE OWNED BY; Schema: mindstep; Owner: neondb_owner
--

ALTER SEQUENCE mindstep.lessons_id_seq OWNED BY mindstep.lessons.id;

--
-- Name: maslow_levels; Type: TABLE; Schema: mindstep; Owner: neondb_owner
--

CREATE TABLE mindstep.maslow_levels (
    id integer NOT NULL,
    level_number integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    color character varying(7),
    icon character varying(50),
    sort_order integer,
    created_at timestamp without time zone DEFAULT now()
);

--
-- Name: maslow_levels_id_seq; Type: SEQUENCE; Schema: mindstep; Owner: neondb_owner
--

CREATE SEQUENCE mindstep.maslow_levels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: maslow_levels_id_seq; Type: SEQUENCE OWNED BY; Schema: mindstep; Owner: neondb_owner
--

ALTER SEQUENCE mindstep.maslow_levels_id_seq OWNED BY mindstep.maslow_levels.id;

--
-- Name: meditation_sessions; Type: TABLE; Schema: mindstep; Owner: neondb_owner
--

CREATE TABLE mindstep.meditation_sessions (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    technique_id integer,
    session_date date DEFAULT CURRENT_DATE NOT NULL,
    start_time timestamp without time zone,
    end_time timestamp without time zone,
    duration_planned integer,
    duration_actual integer,
    quality_rating integer,
    mood_before character varying(50),
    mood_after character varying(50),
    focus_level integer,
    notes text,
    interruptions integer DEFAULT 0,
    environment character varying(100),
    tags text[],
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT meditation_sessions_focus_level_check CHECK (((focus_level >= 1) AND (focus_level <= 10))),
    CONSTRAINT meditation_sessions_quality_rating_check CHECK (((quality_rating >= 1) AND (quality_rating <= 5)))
);

--
-- Name: meditation_sessions_id_seq; Type: SEQUENCE; Schema: mindstep; Owner: neondb_owner
--

CREATE SEQUENCE mindstep.meditation_sessions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: meditation_sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: mindstep; Owner: neondb_owner
--

ALTER SEQUENCE mindstep.meditation_sessions_id_seq OWNED BY mindstep.meditation_sessions.id;

--
-- Name: meditation_techniques; Type: TABLE; Schema: mindstep; Owner: neondb_owner
--

CREATE TABLE mindstep.meditation_techniques (
    id integer NOT NULL,
    name_en character varying(100) NOT NULL,
    name_mn character varying(100) NOT NULL,
    description text,
    instructions text,
    difficulty_level character varying(20),
    recommended_duration integer,
    category character varying(50),
    benefits text[],
    audio_url character varying(500),
    video_url character varying(500),
    thumbnail_url character varying(500),
    is_guided boolean DEFAULT false,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now()
);

--
-- Name: meditation_techniques_id_seq; Type: SEQUENCE; Schema: mindstep; Owner: neondb_owner
--

CREATE SEQUENCE mindstep.meditation_techniques_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: meditation_techniques_id_seq; Type: SEQUENCE OWNED BY; Schema: mindstep; Owner: neondb_owner
--

ALTER SEQUENCE mindstep.meditation_techniques_id_seq OWNED BY mindstep.meditation_techniques.id;

--
-- Name: mood_categories; Type: TABLE; Schema: mindstep; Owner: neondb_owner
--

CREATE TABLE mindstep.mood_categories (
    id integer NOT NULL,
    name_en character varying(50) NOT NULL,
    name_mn character varying(50) NOT NULL,
    color character varying(7),
    emoji character varying(50),
    sort_order integer,
    created_at timestamp without time zone DEFAULT now()
);

--
-- Name: mood_categories_id_seq; Type: SEQUENCE; Schema: mindstep; Owner: neondb_owner
--

CREATE SEQUENCE mindstep.mood_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: mood_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: mindstep; Owner: neondb_owner
--

ALTER SEQUENCE mindstep.mood_categories_id_seq OWNED BY mindstep.mood_categories.id;

--
-- Name: mood_entries; Type: TABLE; Schema: mindstep; Owner: neondb_owner
--

CREATE TABLE mindstep.mood_entries (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    mood_unit_id bigint NOT NULL,
    entry_date date DEFAULT CURRENT_DATE NOT NULL,
    intensity integer,
    when_felt character varying(20),
    trigger_event text,
    coping_strategy text,
    notes text,
    location character varying(100),
    weather character varying(50),
    core_value_id bigint,
    ai_detected_values bigint[],
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT mood_entries_intensity_check CHECK (((intensity >= 1) AND (intensity <= 10)))
);

--
-- Name: mood_entries_id_seq; Type: SEQUENCE; Schema: mindstep; Owner: neondb_owner
--

CREATE SEQUENCE mindstep.mood_entries_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: mood_entries_id_seq; Type: SEQUENCE OWNED BY; Schema: mindstep; Owner: neondb_owner
--

ALTER SEQUENCE mindstep.mood_entries_id_seq OWNED BY mindstep.mood_entries.id;

--
-- Name: mood_unit; Type: TABLE; Schema: mindstep; Owner: neondb_owner
--

CREATE TABLE mindstep.mood_unit (
    id integer NOT NULL,
    category_id bigint NOT NULL,
    plutchik_id bigint,
    combination_id bigint,
    type character varying(20) NOT NULL,
    description text,
    display_name_mn character varying(100),
    display_name_en character varying(100),
    display_color character(7),
    display_emoji character varying(10),
    hawkins_level_id integer,
    CONSTRAINT mood_unit_type_check CHECK (((type)::text = ANY ((ARRAY['primary'::character varying, 'dyad'::character varying, 'triad'::character varying])::text[])))
);

--
-- Name: mood_unit_id_seq; Type: SEQUENCE; Schema: mindstep; Owner: neondb_owner
--

CREATE SEQUENCE mindstep.mood_unit_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: mood_unit_id_seq; Type: SEQUENCE OWNED BY; Schema: mindstep; Owner: neondb_owner
--

ALTER SEQUENCE mindstep.mood_unit_id_seq OWNED BY mindstep.mood_unit.id;

--
-- Name: notifications; Type: TABLE; Schema: mindstep; Owner: neondb_owner
--

CREATE TABLE mindstep.notifications (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    notification_type character varying(50),
    title character varying(255) NOT NULL,
    message text,
    action_url character varying(500),
    action_label character varying(50),
    is_read boolean DEFAULT false,
    read_at timestamp without time zone,
    scheduled_for timestamp without time zone,
    sent_at timestamp without time zone,
    metadata jsonb,
    priority character varying(20) DEFAULT 'normal'::character varying,
    created_at timestamp without time zone DEFAULT now()
);

--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: mindstep; Owner: neondb_owner
--

CREATE SEQUENCE mindstep.notifications_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: mindstep; Owner: neondb_owner
--

ALTER SEQUENCE mindstep.notifications_id_seq OWNED BY mindstep.notifications.id;

--
-- Name: plutchik_combinations; Type: TABLE; Schema: mindstep; Owner: neondb_owner
--

CREATE TABLE mindstep.plutchik_combinations (
    id integer NOT NULL,
    emotion1_id integer NOT NULL,
    emotion2_id integer NOT NULL,
    combined_name_en character varying(50),
    combined_name_mn character varying(50),
    combination_type character varying(20),
    description text,
    created_at timestamp without time zone DEFAULT now(),
    color character varying(7),
    emoji character varying(20)
);

--
-- Name: plutchik_combinations_id_seq; Type: SEQUENCE; Schema: mindstep; Owner: neondb_owner
--

CREATE SEQUENCE mindstep.plutchik_combinations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: plutchik_combinations_id_seq; Type: SEQUENCE OWNED BY; Schema: mindstep; Owner: neondb_owner
--

ALTER SEQUENCE mindstep.plutchik_combinations_id_seq OWNED BY mindstep.plutchik_combinations.id;

--
-- Name: plutchik_emotions; Type: TABLE; Schema: mindstep; Owner: neondb_owner
--

CREATE TABLE mindstep.plutchik_emotions (
    id integer NOT NULL,
    name_en character varying(50) NOT NULL,
    name_mn character varying(50) NOT NULL,
    opposite_emotion_id integer,
    intensity_level integer NOT NULL,
    base_emotion_id integer,
    color character varying(7),
    emoji character varying(10),
    created_at timestamp without time zone DEFAULT now(),
    category_id integer
);

--
-- Name: plutchik_emotions_id_seq; Type: SEQUENCE; Schema: mindstep; Owner: neondb_owner
--

CREATE SEQUENCE mindstep.plutchik_emotions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: plutchik_emotions_id_seq; Type: SEQUENCE OWNED BY; Schema: mindstep; Owner: neondb_owner
--

ALTER SEQUENCE mindstep.plutchik_emotions_id_seq OWNED BY mindstep.plutchik_emotions.id;

--
-- Name: progress_reports; Type: TABLE; Schema: mindstep; Owner: neondb_owner
--

CREATE TABLE mindstep.progress_reports (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    report_type character varying(20),
    period_start date NOT NULL,
    period_end date NOT NULL,
    overall_wellbeing_score integer,
    mood_summary jsonb,
    journal_insights jsonb,
    goal_progress jsonb,
    meditation_summary jsonb,
    consciousness_progression jsonb,
    key_achievements text[],
    areas_for_improvement text[],
    personalized_recommendations text[],
    chart_data jsonb,
    pdf_url character varying(500),
    is_exported boolean DEFAULT false,
    exported_at timestamp without time zone,
    generated_at timestamp without time zone DEFAULT now()
);

--
-- Name: progress_reports_id_seq; Type: SEQUENCE; Schema: mindstep; Owner: neondb_owner
--

CREATE SEQUENCE mindstep.progress_reports_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: progress_reports_id_seq; Type: SEQUENCE OWNED BY; Schema: mindstep; Owner: neondb_owner
--

ALTER SEQUENCE mindstep.progress_reports_id_seq OWNED BY mindstep.progress_reports.id;

--
-- Name: revoked_tokens; Type: TABLE; Schema: mindstep; Owner: neondb_owner
--

CREATE TABLE mindstep.revoked_tokens (
    id bigint NOT NULL,
    token_hash character varying(255) NOT NULL,
    user_id bigint,
    revoked_at timestamp without time zone DEFAULT now(),
    expires_at timestamp without time zone NOT NULL,
    reason character varying(50)
);

--
-- Name: revoked_tokens_id_seq; Type: SEQUENCE; Schema: mindstep; Owner: neondb_owner
--

CREATE SEQUENCE mindstep.revoked_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: revoked_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: mindstep; Owner: neondb_owner
--

ALTER SEQUENCE mindstep.revoked_tokens_id_seq OWNED BY mindstep.revoked_tokens.id;

--
-- Name: role_owners; Type: TABLE; Schema: mindstep; Owner: neondb_owner
--

CREATE TABLE mindstep.role_owners (
    id bigint NOT NULL,
    role_id bigint NOT NULL,
    owner_id bigint NOT NULL,
    status character varying(10) DEFAULT 'active'::character varying,
    assigned_by_id bigint,
    created_at timestamp without time zone DEFAULT now(),
    revoked_at timestamp without time zone
);

--
-- Name: role_owners_id_seq; Type: SEQUENCE; Schema: mindstep; Owner: neondb_owner
--

CREATE SEQUENCE mindstep.role_owners_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: role_owners_id_seq; Type: SEQUENCE OWNED BY; Schema: mindstep; Owner: neondb_owner
--

ALTER SEQUENCE mindstep.role_owners_id_seq OWNED BY mindstep.role_owners.id;

--
-- Name: roles; Type: TABLE; Schema: mindstep; Owner: neondb_owner
--

CREATE TABLE mindstep.roles (
    id bigint NOT NULL,
    level smallint NOT NULL,
    code character varying(20) NOT NULL,
    name character varying(50) NOT NULL,
    permissions jsonb DEFAULT '{}'::jsonb,
    created_by_id bigint,
    created_at timestamp without time zone DEFAULT now(),
    updated_by_id bigint,
    updated_at timestamp without time zone DEFAULT now()
);

--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: mindstep; Owner: neondb_owner
--

CREATE SEQUENCE mindstep.roles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: mindstep; Owner: neondb_owner
--

ALTER SEQUENCE mindstep.roles_id_seq OWNED BY mindstep.roles.id;

--
-- Name: scoring_history; Type: TABLE; Schema: mindstep; Owner: neondb_owner
--

CREATE TABLE mindstep.scoring_history (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    source_type character varying(30) NOT NULL,
    source_id bigint,
    points_earned integer NOT NULL,
    points_type character varying(50),
    multiplier numeric(3,2) DEFAULT 1.0,
    description text,
    metadata jsonb,
    created_at timestamp without time zone DEFAULT now()
);

--
-- Name: scoring_history_id_seq; Type: SEQUENCE; Schema: mindstep; Owner: neondb_owner
--

CREATE SEQUENCE mindstep.scoring_history_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: scoring_history_id_seq; Type: SEQUENCE OWNED BY; Schema: mindstep; Owner: neondb_owner
--

ALTER SEQUENCE mindstep.scoring_history_id_seq OWNED BY mindstep.scoring_history.id;

--
-- Name: system_audit_log; Type: TABLE; Schema: mindstep; Owner: neondb_owner
--

CREATE TABLE mindstep.system_audit_log (
    id bigint NOT NULL,
    user_id bigint,
    action_type character varying(50),
    entity_type character varying(50),
    entity_id bigint,
    old_value jsonb,
    new_value jsonb,
    ip_address inet,
    user_agent text,
    created_at timestamp without time zone DEFAULT now()
);

--
-- Name: system_audit_log_id_seq; Type: SEQUENCE; Schema: mindstep; Owner: neondb_owner
--

CREATE SEQUENCE mindstep.system_audit_log_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: system_audit_log_id_seq; Type: SEQUENCE OWNED BY; Schema: mindstep; Owner: neondb_owner
--

ALTER SEQUENCE mindstep.system_audit_log_id_seq OWNED BY mindstep.system_audit_log.id;

--
-- Name: system_settings; Type: TABLE; Schema: mindstep; Owner: neondb_owner
--

CREATE TABLE mindstep.system_settings (
    id integer NOT NULL,
    setting_key character varying(100) NOT NULL,
    setting_value text,
    setting_type character varying(20),
    description text,
    is_public boolean DEFAULT false,
    is_editable boolean DEFAULT true,
    updated_by_id bigint,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

--
-- Name: system_settings_id_seq; Type: SEQUENCE; Schema: mindstep; Owner: neondb_owner
--

CREATE SEQUENCE mindstep.system_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: system_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: mindstep; Owner: neondb_owner
--

ALTER SEQUENCE mindstep.system_settings_id_seq OWNED BY mindstep.system_settings.id;

--
-- Name: user_achievements; Type: TABLE; Schema: mindstep; Owner: neondb_owner
--

CREATE TABLE mindstep.user_achievements (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    achievement_type character varying(50) NOT NULL,
    achievement_category character varying(30),
    title character varying(255) NOT NULL,
    description text,
    badge_icon character varying(50),
    badge_color character varying(7),
    points_earned integer DEFAULT 0,
    unlocked_at timestamp without time zone DEFAULT now(),
    is_featured boolean DEFAULT false,
    rarity character varying(20) DEFAULT 'common'::character varying
);

--
-- Name: user_achievements_id_seq; Type: SEQUENCE; Schema: mindstep; Owner: neondb_owner
--

CREATE SEQUENCE mindstep.user_achievements_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: user_achievements_id_seq; Type: SEQUENCE OWNED BY; Schema: mindstep; Owner: neondb_owner
--

ALTER SEQUENCE mindstep.user_achievements_id_seq OWNED BY mindstep.user_achievements.id;

--
-- Name: user_data_access_log; Type: TABLE; Schema: mindstep; Owner: neondb_owner
--

CREATE TABLE mindstep.user_data_access_log (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    accessed_by_id bigint NOT NULL,
    access_type character varying(50),
    table_name character varying(100),
    record_id bigint,
    access_reason character varying(100),
    ip_address inet,
    user_agent text,
    session_id bigint,
    accessed_at timestamp without time zone DEFAULT now()
);

--
-- Name: user_data_access_log_id_seq; Type: SEQUENCE; Schema: mindstep; Owner: neondb_owner
--

CREATE SEQUENCE mindstep.user_data_access_log_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: user_data_access_log_id_seq; Type: SEQUENCE OWNED BY; Schema: mindstep; Owner: neondb_owner
--

ALTER SEQUENCE mindstep.user_data_access_log_id_seq OWNED BY mindstep.user_data_access_log.id;

--
-- Name: user_data_requests; Type: TABLE; Schema: mindstep; Owner: neondb_owner
--

CREATE TABLE mindstep.user_data_requests (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    request_type character varying(50) NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying,
    requested_tables text[],
    date_range_start date,
    date_range_end date,
    requested_at timestamp without time zone DEFAULT now(),
    processing_started_at timestamp without time zone,
    processed_at timestamp without time zone,
    processed_by_id bigint,
    export_format character varying(20),
    export_file_url character varying(500),
    export_expires_at timestamp without time zone,
    deletion_reason text,
    backup_created boolean DEFAULT false,
    backup_location character varying(500),
    notes text,
    error_message text,
    created_at timestamp without time zone DEFAULT now()
);

--
-- Name: user_data_requests_id_seq; Type: SEQUENCE; Schema: mindstep; Owner: neondb_owner
--

CREATE SEQUENCE mindstep.user_data_requests_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: user_data_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: mindstep; Owner: neondb_owner
--

ALTER SEQUENCE mindstep.user_data_requests_id_seq OWNED BY mindstep.user_data_requests.id;

--
-- Name: user_emotion_wheel; Type: TABLE; Schema: mindstep; Owner: neondb_owner
--

CREATE TABLE mindstep.user_emotion_wheel (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    mood_entry_id bigint,
    journal_id bigint,
    plutchik_emotion_id integer NOT NULL,
    intensity integer,
    detected_combination_id integer,
    is_ai_detected boolean DEFAULT false,
    recorded_at timestamp without time zone DEFAULT now(),
    CONSTRAINT user_emotion_wheel_intensity_check CHECK (((intensity >= 1) AND (intensity <= 10)))
);

--
-- Name: user_emotion_wheel_id_seq; Type: SEQUENCE; Schema: mindstep; Owner: neondb_owner
--

CREATE SEQUENCE mindstep.user_emotion_wheel_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: user_emotion_wheel_id_seq; Type: SEQUENCE OWNED BY; Schema: mindstep; Owner: neondb_owner
--

ALTER SEQUENCE mindstep.user_emotion_wheel_id_seq OWNED BY mindstep.user_emotion_wheel.id;

--
-- Name: user_gamification; Type: TABLE; Schema: mindstep; Owner: neondb_owner
--

CREATE TABLE mindstep.user_gamification (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    current_level_id integer NOT NULL,
    total_score integer DEFAULT 0,
    level_progress integer DEFAULT 0,
    current_streak integer DEFAULT 0,
    longest_streak integer DEFAULT 0,
    last_activity_at timestamp without time zone,
    updated_at timestamp without time zone DEFAULT now()
);

--
-- Name: user_gamification_id_seq; Type: SEQUENCE; Schema: mindstep; Owner: neondb_owner
--

CREATE SEQUENCE mindstep.user_gamification_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: user_gamification_id_seq; Type: SEQUENCE OWNED BY; Schema: mindstep; Owner: neondb_owner
--

ALTER SEQUENCE mindstep.user_gamification_id_seq OWNED BY mindstep.user_gamification.id;

--
-- Name: user_hawkins_maslow; Type: TABLE; Schema: mindstep; Owner: neondb_owner
--

CREATE TABLE mindstep.user_hawkins_maslow (
    id integer NOT NULL,
    user_id integer NOT NULL,
    mood_entry_id integer NOT NULL,
    hawkins_id integer NOT NULL,
    maslow_id integer NOT NULL,
    score integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);

--
-- Name: user_hawkins_maslow_id_seq; Type: SEQUENCE; Schema: mindstep; Owner: neondb_owner
--

CREATE SEQUENCE mindstep.user_hawkins_maslow_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: user_hawkins_maslow_id_seq; Type: SEQUENCE OWNED BY; Schema: mindstep; Owner: neondb_owner
--

ALTER SEQUENCE mindstep.user_hawkins_maslow_id_seq OWNED BY mindstep.user_hawkins_maslow.id;

--
-- Name: user_insights; Type: TABLE; Schema: mindstep; Owner: neondb_owner
--

CREATE TABLE mindstep.user_insights (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    insight_type character varying(50),
    insight_category character varying(30),
    title character varying(255),
    description text,
    data_points jsonb,
    period_start date,
    period_end date,
    is_read boolean DEFAULT false,
    read_at timestamp without time zone,
    is_dismissed boolean DEFAULT false,
    dismissed_at timestamp without time zone,
    priority character varying(20) DEFAULT 'normal'::character varying,
    expires_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now()
);

--
-- Name: user_insights_id_seq; Type: SEQUENCE; Schema: mindstep; Owner: neondb_owner
--

CREATE SEQUENCE mindstep.user_insights_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: user_insights_id_seq; Type: SEQUENCE OWNED BY; Schema: mindstep; Owner: neondb_owner
--

ALTER SEQUENCE mindstep.user_insights_id_seq OWNED BY mindstep.user_insights.id;

--
-- Name: user_lesson_progress; Type: TABLE; Schema: mindstep; Owner: neondb_owner
--

CREATE TABLE mindstep.user_lesson_progress (
    id bigint NOT NULL,
    lesson_id bigint NOT NULL,
    user_id bigint NOT NULL,
    progress_percentage integer DEFAULT 0,
    status character varying(20) DEFAULT 'not_started'::character varying,
    time_spent integer DEFAULT 0,
    last_accessed timestamp without time zone,
    completion_date timestamp without time zone,
    rating integer,
    review_text text,
    is_bookmarked boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT user_lesson_progress_progress_percentage_check CHECK (((progress_percentage >= 0) AND (progress_percentage <= 100))),
    CONSTRAINT user_lesson_progress_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);

--
-- Name: user_lesson_progress_id_seq; Type: SEQUENCE; Schema: mindstep; Owner: neondb_owner
--

CREATE SEQUENCE mindstep.user_lesson_progress_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: user_lesson_progress_id_seq; Type: SEQUENCE OWNED BY; Schema: mindstep; Owner: neondb_owner
--

ALTER SEQUENCE mindstep.user_lesson_progress_id_seq OWNED BY mindstep.user_lesson_progress.id;

--
-- Name: user_levels; Type: TABLE; Schema: mindstep; Owner: neondb_owner
--

CREATE TABLE mindstep.user_levels (
    id integer NOT NULL,
    level_number integer NOT NULL,
    level_name character varying(100) NOT NULL,
    min_score integer NOT NULL,
    max_score integer,
    description text,
    icon character varying(50),
    color character varying(7),
    badge_image character varying(255),
    perks jsonb,
    created_at timestamp without time zone DEFAULT now()
);

--
-- Name: user_levels_id_seq; Type: SEQUENCE; Schema: mindstep; Owner: neondb_owner
--

CREATE SEQUENCE mindstep.user_levels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: user_levels_id_seq; Type: SEQUENCE OWNED BY; Schema: mindstep; Owner: neondb_owner
--

ALTER SEQUENCE mindstep.user_levels_id_seq OWNED BY mindstep.user_levels.id;

--
-- Name: user_preferences; Type: TABLE; Schema: mindstep; Owner: neondb_owner
--

CREATE TABLE mindstep.user_preferences (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    reminder_journal boolean DEFAULT true,
    reminder_mood_check boolean DEFAULT true,
    reminder_meditation boolean DEFAULT true,
    reminder_goal_review boolean DEFAULT true,
    reminder_time character varying(5) DEFAULT '20:00'::character varying,
    notification_email boolean DEFAULT true,
    notification_push boolean DEFAULT true,
    notification_insights boolean DEFAULT true,
    notification_achievements boolean DEFAULT true,
    privacy_level character varying(20) DEFAULT 'private'::character varying,
    data_sharing boolean DEFAULT false,
    theme character varying(20) DEFAULT 'light'::character varying,
    language character varying(5) DEFAULT 'mn'::character varying,
    date_format character varying(20) DEFAULT 'YYYY-MM-DD'::character varying,
    ai_analysis_frequency character varying(20) DEFAULT 'weekly'::character varying,
    ai_suggestion_level character varying(20) DEFAULT 'moderate'::character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

--
-- Name: user_preferences_id_seq; Type: SEQUENCE; Schema: mindstep; Owner: neondb_owner
--

CREATE SEQUENCE mindstep.user_preferences_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: user_preferences_id_seq; Type: SEQUENCE OWNED BY; Schema: mindstep; Owner: neondb_owner
--

ALTER SEQUENCE mindstep.user_preferences_id_seq OWNED BY mindstep.user_preferences.id;

--
-- Name: user_sessions; Type: TABLE; Schema: mindstep; Owner: neondb_owner
--

CREATE TABLE mindstep.user_sessions (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    token_hash character varying(255) NOT NULL,
    device_info text,
    ip_address inet,
    user_agent text,
    is_active boolean DEFAULT true,
    last_activity timestamp without time zone DEFAULT now(),
    expires_at timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    revoked_at timestamp without time zone,
    revoke_reason character varying(50)
);

--
-- Name: user_sessions_id_seq; Type: SEQUENCE; Schema: mindstep; Owner: neondb_owner
--

CREATE SEQUENCE mindstep.user_sessions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: user_sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: mindstep; Owner: neondb_owner
--

ALTER SEQUENCE mindstep.user_sessions_id_seq OWNED BY mindstep.user_sessions.id;

--
-- Name: user_streaks; Type: TABLE; Schema: mindstep; Owner: neondb_owner
--

CREATE TABLE mindstep.user_streaks (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    streak_type character varying(50) NOT NULL,
    current_streak integer DEFAULT 0,
    longest_streak integer DEFAULT 0,
    last_activity_date date,
    streak_start_date date,
    total_activities integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

--
-- Name: user_streaks_id_seq; Type: SEQUENCE; Schema: mindstep; Owner: neondb_owner
--

CREATE SEQUENCE mindstep.user_streaks_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: user_streaks_id_seq; Type: SEQUENCE OWNED BY; Schema: mindstep; Owner: neondb_owner
--

ALTER SEQUENCE mindstep.user_streaks_id_seq OWNED BY mindstep.user_streaks.id;

--
-- Name: users; Type: TABLE; Schema: mindstep; Owner: neondb_owner
--

CREATE TABLE mindstep.users (
    id bigint NOT NULL,
    uuid uuid DEFAULT mindstep.uuid_generate_v4() NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    total_score integer DEFAULT 0,
    current_level integer DEFAULT 1,
    level_progress integer DEFAULT 0,
    profile_picture character varying(255),
    timezone character varying(50) DEFAULT 'UTC'::character varying,
    language character varying(5) DEFAULT 'mn'::character varying,
    is_active boolean DEFAULT true,
    is_email_verified boolean DEFAULT false,
    email_verified_at timestamp without time zone,
    last_login timestamp without time zone,
    login_count integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    deleted_at timestamp without time zone
);

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: mindstep; Owner: neondb_owner
--

CREATE SEQUENCE mindstep.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: mindstep; Owner: neondb_owner
--

ALTER SEQUENCE mindstep.users_id_seq OWNED BY mindstep.users.id;

--
-- Name: value_reflections; Type: TABLE; Schema: mindstep; Owner: neondb_owner
--

CREATE TABLE mindstep.value_reflections (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    value_id bigint NOT NULL,
    source_type character varying(20) NOT NULL,
    source_id bigint,
    reflection_date date DEFAULT CURRENT_DATE NOT NULL,
    alignment_score integer,
    notes text,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT value_reflections_alignment_score_check CHECK (((alignment_score >= 1) AND (alignment_score <= 10)))
);

--
-- Name: value_reflections_id_seq; Type: SEQUENCE; Schema: mindstep; Owner: neondb_owner
--

CREATE SEQUENCE mindstep.value_reflections_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: value_reflections_id_seq; Type: SEQUENCE OWNED BY; Schema: mindstep; Owner: neondb_owner
--

ALTER SEQUENCE mindstep.value_reflections_id_seq OWNED BY mindstep.value_reflections.id;

--
-- Name: weekly_activity_summary; Type: MATERIALIZED VIEW; Schema: mindstep; Owner: neondb_owner
--

CREATE MATERIALIZED VIEW mindstep.weekly_activity_summary AS
 SELECT user_id,
    (date_trunc('week'::text, created_at))::date AS week_start,
    source_type,
    count(*) AS activity_count,
    sum(points_earned) AS total_points
   FROM mindstep.scoring_history
  WHERE (created_at >= (CURRENT_DATE - '1 year'::interval))
  GROUP BY user_id, (date_trunc('week'::text, created_at)), source_type
  WITH NO DATA;

--
-- Name: ai_journal_detailed_analysis id; Type: DEFAULT; Schema: mindstep; Owner: neondb_owner
--

ALTER TABLE ONLY mindstep.ai_journal_detailed_analysis ALTER COLUMN id SET DEFAULT nextval('mindstep.ai_journal_detailed_analysis_id_seq'::regclass);

--
-- Name: ai_mood_analysis id; Type: DEFAULT; Schema: mindstep; Owner: neondb_owner
--

ALTER TABLE ONLY mindstep.ai_mood_analysis ALTER COLUMN id SET DEFAULT nextval('mindstep.ai_mood_analysis_id_seq'::regclass);

--
-- Name: ai_progress_tracking id; Type: DEFAULT; Schema: mindstep; Owner: neondb_owner
--

ALTER TABLE ONLY mindstep.ai_progress_tracking ALTER COLUMN id SET DEFAULT nextval('mindstep.ai_progress_tracking_id_seq'::regclass);

--
-- Name: ai_scoring_criteria id; Type: DEFAULT; Schema: mindstep; Owner: neondb_owner
--

ALTER TABLE ONLY mindstep.ai_scoring_criteria ALTER COLUMN id SET DEFAULT nextval('mindstep.ai_scoring_criteria_id_seq'::regclass);

--
-- Name: ai_weekly_mood_deep_analysis id; Type: DEFAULT; Schema: mindstep; Owner: neondb_owner
--

ALTER TABLE ONLY mindstep.ai_weekly_mood_deep_analysis ALTER COLUMN id SET DEFAULT nextval('mindstep.ai_weekly_mood_deep_analysis_id_seq'::regclass);

--
-- Name: auth_otp id; Type: DEFAULT; Schema: mindstep; Owner: neondb_owner
--

ALTER TABLE ONLY mindstep.auth_otp ALTER COLUMN id SET DEFAULT nextval('mindstep.auth_otp_id_seq'::regclass);

--
-- Name: core_values id; Type: DEFAULT; Schema: mindstep; Owner: neondb_owner
--

ALTER TABLE ONLY mindstep.core_values ALTER COLUMN id SET DEFAULT nextval('mindstep.core_values_id_seq'::regclass);

--
-- Name: data_retention_policies id; Type: DEFAULT; Schema: mindstep; Owner: neondb_owner
--

ALTER TABLE ONLY mindstep.data_retention_policies ALTER COLUMN id SET DEFAULT nextval('mindstep.data_retention_policies_id_seq'::regclass);

--
-- Name: deleted_data_log id; Type: DEFAULT; Schema: mindstep; Owner: neondb_owner
--

ALTER TABLE ONLY mindstep.deleted_data_log ALTER COLUMN id SET DEFAULT nextval('mindstep.deleted_data_log_id_seq'::regclass);

--
-- Name: detected_patterns id; Type: DEFAULT; Schema: mindstep; Owner: neondb_owner
--

ALTER TABLE ONLY mindstep.detected_patterns ALTER COLUMN id SET DEFAULT nextval('mindstep.detected_patterns_id_seq'::regclass);

--
-- Name: encryption_keys id; Type: DEFAULT; Schema: mindstep; Owner: neondb_owner
--

ALTER TABLE ONLY mindstep.encryption_keys ALTER COLUMN id SET DEFAULT nextval('mindstep.encryption_keys_id_seq'::regclass);

--
-- Name: error_logs id; Type: DEFAULT; Schema: mindstep; Owner: neondb_owner
--

ALTER TABLE ONLY mindstep.error_logs ALTER COLUMN id SET DEFAULT nextval('mindstep.error_logs_id_seq'::regclass);

--
-- Name: goal_milestones id; Type: DEFAULT; Schema: mindstep; Owner: neondb_owner
--

ALTER TABLE ONLY mindstep.goal_milestones ALTER COLUMN id SET DEFAULT nextval('mindstep.goal_milestones_id_seq'::regclass);

--
-- Name: goals id; Type: DEFAULT; Schema: mindstep; Owner: neondb_owner
--

ALTER TABLE ONLY mindstep.goals ALTER COLUMN id SET DEFAULT nextval('mindstep.goals_id_seq'::regclass);

--
-- Name: hawkins_levels id; Type: DEFAULT; Schema: mindstep; Owner: neondb_owner
--

ALTER TABLE ONLY mindstep.hawkins_levels ALTER COLUMN id SET DEFAULT nextval('mindstep.hawkins_levels_id_seq'::regclass);

--
-- Name: hawkins_maslow id; Type: DEFAULT; Schema: mindstep; Owner: neondb_owner
--

ALTER TABLE ONLY mindstep.hawkins_maslow ALTER COLUMN id SET DEFAULT nextval('mindstep.hawkins_maslow_id_seq'::regclass);

--
-- Name: journals id; Type: DEFAULT; Schema: mindstep; Owner: neondb_owner
--

ALTER TABLE ONLY mindstep.journals ALTER COLUMN id SET DEFAULT nextval('mindstep.journals_id_seq'::regclass);

--
-- Name: lesson_categories id; Type: DEFAULT; Schema: mindstep; Owner: neondb_owner
--

ALTER TABLE ONLY mindstep.lesson_categories ALTER COLUMN id SET DEFAULT nextval('mindstep.lesson_categories_id_seq'::regclass);

--
-- Name: lesson_comments id; Type: DEFAULT; Schema: mindstep; Owner: neondb_owner
--

ALTER TABLE ONLY mindstep.lesson_comments ALTER COLUMN id SET DEFAULT nextval('mindstep.lesson_comments_id_seq'::regclass);

--
-- Name: lesson_reactions id; Type: DEFAULT; Schema: mindstep; Owner: neondb_owner
--

ALTER TABLE ONLY mindstep.lesson_reactions ALTER COLUMN id SET DEFAULT nextval('mindstep.lesson_reactions_id_seq'::regclass);

--
-- Name: lesson_recommendations id; Type: DEFAULT; Schema: mindstep; Owner: neondb_owner
--

ALTER TABLE ONLY mindstep.lesson_recommendations ALTER COLUMN id SET DEFAULT nextval('mindstep.lesson_recommendations_id_seq'::regclass);

--
-- Name: lessons id; Type: DEFAULT; Schema: mindstep; Owner: neondb_owner
--

ALTER TABLE ONLY mindstep.lessons ALTER COLUMN id SET DEFAULT nextval('mindstep.lessons_id_seq'::regclass);

--
-- Name: maslow_levels id; Type: DEFAULT; Schema: mindstep; Owner: neondb_owner
--

ALTER TABLE ONLY mindstep.maslow_levels ALTER COLUMN id SET DEFAULT nextval('mindstep.maslow_levels_id_seq'::regclass);

--
-- Name: meditation_sessions id; Type: DEFAULT; Schema: mindstep; Owner: neondb_owner
--

ALTER TABLE ONLY mindstep.meditation_sessions ALTER COLUMN id SET DEFAULT nextval('mindstep.meditation_sessions_id_seq'::regclass);

--
-- Name: meditation_techniques id; Type: DEFAULT; Schema: mindstep; Owner: neondb_owner
--

ALTER TABLE ONLY mindstep.meditation_techniques ALTER COLUMN id SET DEFAULT nextval('mindstep.meditation_techniques_id_seq'::regclass);

--
-- Name: mood_categories id; Type: DEFAULT; Schema: mindstep; Owner: neondb_owner
--

ALTER TABLE ONLY mindstep.mood_categories ALTER COLUMN id SET DEFAULT nextval('mindstep.mood_categories_id_seq'::regclass);

--
-- Name: mood_entries id; Type: DEFAULT; Schema: mindstep; Owner: neondb_owner
--

ALTER TABLE ONLY mindstep.mood_entries ALTER COLUMN id SET DEFAULT nextval('mindstep.mood_entries_id_seq'::regclass);

--
-- Name: mood_unit id; Type: DEFAULT; Schema: mindstep; Owner: neondb_owner
--

ALTER TABLE ONLY mindstep.mood_unit ALTER COLUMN id SET DEFAULT nextval('mindstep.mood_unit_id_seq'::regclass);

--
-- Name: notifications id; Type: DEFAULT; Schema: mindstep; Owner: neondb_owner
--

ALTER TABLE ONLY mindstep.notifications ALTER COLUMN id SET DEFAULT nextval('mindstep.notifications_id_seq'::regclass);

--
-- Name: plutchik_combinations id; Type: DEFAULT; Schema: mindstep; Owner: neondb_owner
--

ALTER TABLE ONLY mindstep.plutchik_combinations ALTER COLUMN id SET DEFAULT nextval('mindstep.plutchik_combinations_id_seq'::regclass);

--
-- Name: plutchik_emotions id; Type: DEFAULT; Schema: mindstep; Owner: neondb_owner
--

ALTER TABLE ONLY mindstep.plutchik_emotions ALTER COLUMN id SET DEFAULT nextval('mindstep.plutchik_emotions_id_seq'::regclass);

--
-- Name: progress_reports id; Type: DEFAULT; Schema: mindstep; Owner: neondb_owner
--

ALTER TABLE ONLY mindstep.progress_reports ALTER COLUMN id SET DEFAULT nextval('mindstep.progress_reports_id_seq'::regclass);

--
-- Name: revoked_tokens id; Type: DEFAULT; Schema: mindstep; Owner: neondb_owner
--

ALTER TABLE ONLY mindstep.revoked_tokens ALTER COLUMN id SET DEFAULT nextval('mindstep.revoked_tokens_id_seq'::regclass);

--
-- Name: role_owners id; Type: DEFAULT; Schema: mindstep; Owner: neondb_owner
--

ALTER TABLE ONLY mindstep.role_owners ALTER COLUMN id SET DEFAULT nextval('mindstep.role_owners_id_seq'::regclass);

--
-- Name: roles id; Type: DEFAULT; Schema: mindstep; Owner: neondb_owner
--

ALTER TABLE ONLY mindstep.roles ALTER COLUMN id SET DEFAULT nextval('mindstep.roles_id_seq'::regclass);

--
-- Name: scoring_history id; Type: DEFAULT; Schema: mindstep; Owner: neondb_owner
--

ALTER TABLE ONLY mindstep.scoring_history ALTER COLUMN id SET DEFAULT nextval('mindstep.scoring_history_id_seq'::regclass);

--
-- Name: system_audit_log id; Type: DEFAULT; Schema: mindstep; Owner: neondb_owner
--

ALTER TABLE ONLY mindstep.system_audit_log ALTER COLUMN id SET DEFAULT nextval('mindstep.system_audit_log_id_seq'::regclass);

--
-- Name: system_settings id; Type: DEFAULT; Schema: mindstep; Owner: neondb_owner
--

ALTER TABLE ONLY mindstep.system_settings ALTER COLUMN id SET DEFAULT nextval('mindstep.system_settings_id_seq'::regclass);

--
-- Name: user_achievements id; Type: DEFAULT; Schema: mindstep; Owner: neondb_owner
--

ALTER TABLE ONLY mindstep.user_achievements ALTER COLUMN id SET DEFAULT nextval('mindstep.user_achievements_id_seq'::regclass);

--
-- Name: user_data_access_log id; Type: DEFAULT; Schema: mindstep; Owner: neondb_owner
--

ALTER TABLE ONLY mindstep.user_data_access_log ALTER COLUMN id SET DEFAULT nextval('mindstep.user_data_access_log_id_seq'::regclass);

--
-- Name: user_data_requests id; Type: DEFAULT; Schema: mindstep; Owner: neondb_owner
--

ALTER TABLE ONLY mindstep.user_data_requests ALTER COLUMN id SET DEFAULT nextval('mindstep.user_data_requests_id_seq'::regclass);

--
-- Name: user_emotion_wheel id; Type: DEFAULT; Schema: mindstep; Owner: neondb_owner
--

ALTER TABLE ONLY mindstep.user_emotion_wheel ALTER COLUMN id SET DEFAULT nextval('mindstep.user_emotion_wheel_id_seq'::regclass);

--
-- Name: user_gamification id; Type: DEFAULT; Schema: mindstep; Owner: neondb_owner
--

ALTER TABLE ONLY mindstep.user_gamification ALTER COLUMN id SET DEFAULT nextval('mindstep.user_gamification_id_seq'::regclass);

--
-- Name: user_hawkins_maslow id; Type: DEFAULT; Schema: mindstep; Owner: neondb_owner
--

ALTER TABLE ONLY mindstep.user_hawkins_maslow ALTER COLUMN id SET DEFAULT nextval('mindstep.user_hawkins_maslow_id_seq'::regclass);

--
-- Name: user_insights id; Type: DEFAULT; Schema: mindstep; Owner: neondb_owner
--

ALTER TABLE ONLY mindstep.user_insights ALTER COLUMN id SET DEFAULT nextval('mindstep.user_insights_id_seq'::regclass);

--
-- Name: user_lesson_progress id; Type: DEFAULT; Schema: mindstep; Owner: neondb_owner
--

ALTER TABLE ONLY mindstep.user_lesson_progress ALTER COLUMN id SET DEFAULT nextval('mindstep.user_lesson_progress_id_seq'::regclass);

--
-- Name: user_levels id; Type: DEFAULT; Schema: mindstep; Owner: neondb_owner
--

ALTER TABLE ONLY mindstep.user_levels ALTER COLUMN id SET DEFAULT nextval('mindstep.user_levels_id_seq'::regclass);

--
-- Name: user_preferences id; Type: DEFAULT; Schema: mindstep; Owner: neondb_owner
--

ALTER TABLE ONLY mindstep.user_preferences ALTER COLUMN id SET DEFAULT nextval('mindstep.user_preferences_id_seq'::regclass);

--
-- Name: user_sessions id; Type: DEFAULT; Schema: mindstep; Owner: neondb_owner
--

ALTER TABLE ONLY mindstep.user_sessions ALTER COLUMN id SET DEFAULT nextval('mindstep.user_sessions_id_seq'::regclass);

--
-- Name: user_streaks id; Type: DEFAULT; Schema: mindstep; Owner: neondb_owner
--

ALTER TABLE ONLY mindstep.user_streaks ALTER COLUMN id SET DEFAULT nextval('mindstep.user_streaks_id_seq'::regclass);

--
-- Name: users id; Type: DEFAULT; Schema: mindstep; Owner: neondb_owner
--

ALTER TABLE ONLY mindstep.users ALTER COLUMN id SET DEFAULT nextval('mindstep.users_id_seq'::regclass);

--
-- Name: value_reflections id; Type: DEFAULT; Schema: mindstep; Owner: neondb_owner
--

ALTER TABLE ONLY mindstep.value_reflections ALTER COLUMN id SET DEFAULT nextval('mindstep.value_reflections_id_seq'::regclass);

--
-- Data for Name: ai_journal_detailed_analysis; Type: TABLE DATA; Schema: mindstep; Owner: neondb_owner
--