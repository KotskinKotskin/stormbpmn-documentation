-- Пульс внедрения Storm Enterprise
-- PostgreSQL 12+. Сначала создайте представление, затем запускайте нужные запросы отдельно.
-- Перед запуском: /recipes/Adoption_pulse.html — схема, модули, фильтры и окна наблюдения.
-- В q8a/q8b замените дату рассылки на свою.

-- ==================== view ====================
CREATE OR REPLACE VIEW v_storm_user_actions AS
-- Присутствие
SELECT user_id, "timestamp" AS ts, 'login' AS kind, 'presence' AS family
  FROM sm_business_event WHERE user_id IS NOT NULL AND name IN ('login', 'first_login')
UNION ALL SELECT user_id, last_interacted_at, 'wiki_view', 'presence'
  FROM sm_wiki_page_user_activity
-- Вклад: модели
UNION ALL SELECT author, created_on, 'diagram_create', 'contribution'
  FROM sm_diagrams WHERE author IS NOT NULL
UNION ALL SELECT user_id, created_on, 'diagram_edit', 'contribution'
  FROM sm_diagram_versions WHERE user_id IS NOT NULL
-- Вклад: обсуждение и согласование
UNION ALL SELECT user_id, created_on, 'comment', 'contribution'
  FROM sm_comments WHERE user_id IS NOT NULL
UNION ALL SELECT author_user_id, created_on, 'comment', 'contribution'
  FROM sm_comment_messages WHERE author_user_id IS NOT NULL
UNION ALL SELECT created_by, created_on, 'approval_request', 'contribution'
  FROM sm_approvals WHERE created_by IS NOT NULL
UNION ALL SELECT approver, approval_time, 'approval_decision', 'contribution'
  FROM sm_approvals WHERE approver IS NOT NULL AND approval_time IS NOT NULL
-- Вклад: реестр процессов и справочники
UNION ALL SELECT created_by, created_on, 'process_create', 'contribution'
  FROM sm_processes WHERE created_by IS NOT NULL
UNION ALL SELECT created_by, created_on, 'process_attr', 'contribution'
  FROM sm_customfield_value_history WHERE created_by IS NOT NULL
UNION ALL SELECT changed_by, changed_on, 'process_attr', 'contribution'
  FROM sm_entity_change_history WHERE changed_by IS NOT NULL
UNION ALL SELECT author, created_on, 'reference', 'contribution'
  FROM sm_assignees WHERE author IS NOT NULL
UNION ALL SELECT author, created_on, 'reference', 'contribution'
  FROM sm_assets WHERE author IS NOT NULL
-- Вклад: вики, ИИ
UNION ALL SELECT created_by, created_on, 'wiki_edit', 'contribution'
  FROM sm_wiki_page_versions WHERE created_by IS NOT NULL
UNION ALL SELECT user_id, "timestamp", 'ai', 'contribution'
  FROM sm_business_event
 WHERE user_id IS NOT NULL
   AND name IN ('ai_chat_message_sent', 'ai.generate_bpmn', 'ai.complete_bpmn', 'ai.analyze_process')
UNION ALL SELECT user_id, "timestamp", 'mcp', 'contribution'
  FROM sm_business_event WHERE user_id IS NOT NULL AND name LIKE 'mcp::%';

-- ==================== q1 ====================
WITH weeks AS (
  SELECT generate_series(date_trunc('week', NOW() - INTERVAL '26 weeks'),
                         date_trunc('week', NOW()), '1 week')::date AS week
)
SELECT w.week,
  COUNT(DISTINCT a.user_id) FILTER (WHERE a.ts >= w.week AND a.ts < w.week + 7)                                   AS users_week,
  COUNT(DISTINCT a.user_id) FILTER (WHERE a.family = 'contribution' AND a.ts >= w.week AND a.ts < w.week + 7)     AS contributors_week,
  COUNT(*)                  FILTER (WHERE a.family = 'contribution' AND a.ts >= w.week AND a.ts < w.week + 7)     AS contributions_week,
  COUNT(DISTINCT a.user_id) FILTER (WHERE a.ts >= w.week + 7 - 28 AND a.ts < w.week + 7)                          AS users_28d,
  COUNT(DISTINCT a.user_id) FILTER (WHERE a.family = 'contribution' AND a.ts >= w.week + 7 - 28 AND a.ts < w.week + 7) AS contributors_28d,
  ROUND(COUNT(DISTINCT a.user_id) FILTER (WHERE a.ts >= w.week AND a.ts < w.week + 7)::numeric
        / NULLIF(COUNT(DISTINCT a.user_id) FILTER (WHERE a.ts >= w.week + 7 - 28 AND a.ts < w.week + 7), 0), 2) AS stickiness
FROM weeks w
JOIN v_storm_user_actions a ON a.ts >= w.week + 7 - 28 AND a.ts < w.week + 7
GROUP BY 1 ORDER BY 1;

-- ==================== q2 ====================
WITH first_act AS (
  SELECT user_id, date_trunc('month', MIN(ts))::date AS cohort
  FROM v_storm_user_actions WHERE family = 'contribution' GROUP BY user_id
),
cohort_size AS (SELECT cohort, COUNT(*) AS users FROM first_act GROUP BY cohort),
monthly AS (
  SELECT DISTINCT user_id, date_trunc('month', ts)::date AS month
  FROM v_storm_user_actions WHERE family = 'contribution'
)
SELECT f.cohort, cs.users AS cohort_size,
       ((EXTRACT(YEAR FROM m.month) - EXTRACT(YEAR FROM f.cohort)) * 12
         + EXTRACT(MONTH FROM m.month) - EXTRACT(MONTH FROM f.cohort))::int AS month_n,
       COUNT(*) AS active,
       ROUND(100.0 * COUNT(*) / cs.users, 1) AS pct
FROM first_act f
JOIN cohort_size cs USING (cohort)
JOIN monthly m USING (user_id)
WHERE f.cohort >= date_trunc('month', NOW() - INTERVAL '12 months')
GROUP BY 1, 2, 3 ORDER BY 1, 3;

-- Вариант «когорта по первому заходу»: замените family = 'contribution'
-- на family = 'presence' в first_act и уберите условие в monthly.

-- ==================== q3 ====================
WITH first_seen AS (
  SELECT user_id, MIN(ts) AS first_ts FROM v_storm_user_actions GROUP BY user_id
),
newcomer AS (
  SELECT f.user_id, f.first_ts,
         BOOL_OR(a.family = 'contribution' AND a.ts < f.first_ts + INTERVAL '14 days')                  AS contributed_14d,
         BOOL_OR(a.ts >= f.first_ts + INTERVAL '7 days' AND a.ts < f.first_ts + INTERVAL '28 days')     AS returned_8_28d,
         BOOL_OR(a.family = 'contribution'
                 AND a.ts >= f.first_ts + INTERVAL '7 days' AND a.ts < f.first_ts + INTERVAL '28 days') AS contributed_8_28d
  FROM first_seen f
  JOIN v_storm_user_actions a ON a.user_id = f.user_id AND a.ts < f.first_ts + INTERVAL '28 days'
  WHERE f.first_ts >= NOW() - INTERVAL '26 weeks'
    AND f.first_ts <  NOW() - INTERVAL '28 days'      -- незавершённые недели не показываем
  GROUP BY 1, 2
)
SELECT date_trunc('week', first_ts)::date AS first_week,
       COUNT(*)                                     AS newcomers,
       COUNT(*) FILTER (WHERE contributed_14d)      AS contributed_14d,
       COUNT(*) FILTER (WHERE returned_8_28d)       AS returned_8_28d,
       COUNT(*) FILTER (WHERE contributed_8_28d)    AS contributed_8_28d,
       ROUND(100.0 * COUNT(*) FILTER (WHERE returned_8_28d) / COUNT(*), 1) AS returned_pct
FROM newcomer GROUP BY 1 ORDER BY 1;

-- ==================== q4a ====================
WITH c AS (
  SELECT u.id AS user_id,
         COUNT(a.ts) FILTER (WHERE a.family = 'contribution') AS contributions,
         COUNT(a.ts) AS actions
  FROM sm_users u
  LEFT JOIN v_storm_user_actions a ON a.user_id = u.id AND a.ts >= NOW() - INTERVAL '28 days'
  WHERE u.enabled AND u.deleted_on IS NULL
  GROUP BY u.id
)
SELECT CASE WHEN contributions >= 10 THEN '1. ядро: 10+ действий'
            WHEN contributions >= 3  THEN '2. активные: 3–9'
            WHEN contributions >= 1  THEN '3. эпизодические: 1–2'
            WHEN actions > 0         THEN '4. только заходили'
            ELSE                          '5. не появлялись 28 дней' END AS tier,
       COUNT(*) AS users,
       ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 1) AS pct
FROM c GROUP BY 1 ORDER BY 1;

-- ==================== q4b ====================
WITH weeks AS (
  SELECT generate_series(date_trunc('week', NOW() - INTERVAL '26 weeks'),
                         date_trunc('week', NOW()), '1 week')::date AS week
),
per_user AS (
  SELECT w.week, a.user_id, COUNT(*) AS contributions
  FROM weeks w
  JOIN v_storm_user_actions a ON a.family = 'contribution'
                             AND a.ts >= w.week + 7 - 14 AND a.ts < w.week + 7
  GROUP BY 1, 2
)
SELECT week,
       COUNT(*) FILTER (WHERE contributions >= 3) AS core_users,
       COUNT(*) AS contributors_14d,
       ROUND(100.0 * COUNT(*) FILTER (WHERE contributions >= 3) / COUNT(*), 1) AS core_pct
FROM per_user GROUP BY 1 ORDER BY 1;

-- ==================== q5 ====================
WITH weeks AS (
  SELECT generate_series(date_trunc('week', NOW() - INTERVAL '26 weeks'),
                         date_trunc('week', NOW()), '1 week')::date AS week
)
SELECT w.week,
  (SELECT COUNT(*) FROM sm_diagrams d WHERE d.created_on >= w.week AND d.created_on < w.week + 7)       AS diagrams_created,
  (SELECT COUNT(*) FROM sm_diagrams d WHERE d.deleted = false AND d.created_on < w.week + 7)              AS diagrams_total,
  (SELECT COUNT(DISTINCT v.diagram_uuid) FROM sm_diagram_versions v
    WHERE v.created_on >= w.week AND v.created_on < w.week + 7)                                           AS diagrams_touched_week,
  ROUND(100.0 * (SELECT COUNT(DISTINCT v.diagram_uuid) FROM sm_diagram_versions v
                   JOIN sm_diagrams d ON d.id = v.diagram_uuid AND d.deleted = false
                  WHERE v.created_on >= w.week + 7 - 90 AND v.created_on < w.week + 7)
        / NULLIF((SELECT COUNT(*) FROM sm_diagrams d WHERE d.deleted = false AND d.created_on < w.week + 7), 0), 1) AS alive_90d_pct,
  (SELECT COUNT(*) FROM sm_processes p  WHERE p.deleted = false AND p.created_on < w.week + 7)            AS processes_total,
  (SELECT COUNT(*) FROM sm_wiki_pages p WHERE p.deleted_at IS NULL AND p.created_on < w.week + 7)         AS wiki_pages_total
FROM weeks w ORDER BY 1;

-- ==================== q6 ====================
WITH weeks AS (
  SELECT generate_series(date_trunc('week', NOW() - INTERVAL '26 weeks'),
                         date_trunc('week', NOW()), '1 week')::date AS week
)
SELECT w.week,
  (SELECT COUNT(*) FROM sm_comments c WHERE c.created_on >= w.week AND c.created_on < w.week + 7)
  + (SELECT COUNT(*) FROM sm_comment_messages m WHERE m.created_on >= w.week AND m.created_on < w.week + 7) AS comments,
  (SELECT COUNT(DISTINCT uid) FROM (
      SELECT user_id AS uid FROM sm_comments WHERE created_on >= w.week AND created_on < w.week + 7
      UNION SELECT author_user_id FROM sm_comment_messages WHERE created_on >= w.week AND created_on < w.week + 7) t) AS commenters,
  (SELECT COUNT(*) FROM sm_approvals a WHERE a.created_on >= w.week AND a.created_on < w.week + 7)          AS approvals_requested,
  (SELECT COUNT(*) FROM sm_approvals a WHERE a.approval_time >= w.week AND a.approval_time < w.week + 7)    AS approvals_decided,
  (SELECT COUNT(*) FROM (SELECT v.diagram_uuid FROM sm_diagram_versions v
                          WHERE v.created_on >= w.week + 7 - 90 AND v.created_on < w.week + 7
                          GROUP BY v.diagram_uuid HAVING COUNT(DISTINCT v.user_id) >= 2) t)                AS diagrams_multi_author_90d,
  (SELECT COUNT(*) FROM sm_business_event e
    WHERE e.name IN ('diagram.invite_sent', 'team.invite_sent')
      AND e."timestamp" >= w.week AND e."timestamp" < w.week + 7)                                          AS invites
FROM weeks w ORDER BY 1;

-- ==================== q7 ====================
WITH weeks AS (
  SELECT generate_series(date_trunc('week', NOW() - INTERVAL '26 weeks'),
                         date_trunc('week', NOW()), '1 week')::date AS week
),
ev AS (
  SELECT date_trunc('week', "timestamp")::date AS week,
         COUNT(DISTINCT user_id) FILTER (WHERE name = 'ai_chat_message_sent') AS ai_users,
         COUNT(*)                FILTER (WHERE name = 'ai_chat_message_sent') AS ai_messages,
         COUNT(DISTINCT user_id) FILTER (WHERE name LIKE 'mcp::%')            AS mcp_users,
         COUNT(*)                FILTER (WHERE name LIKE 'mcp::%')            AS mcp_calls
  FROM sm_business_event WHERE "timestamp" >= NOW() - INTERVAL '26 weeks' GROUP BY 1
),
fb AS (
  SELECT date_trunc('week', created_at)::date AS week,
         COUNT(*) FILTER (WHERE feedback = 'UP')   AS thumbs_up,
         COUNT(*) FILTER (WHERE feedback = 'DOWN') AS thumbs_down
  FROM sm_ai_chat_messages WHERE created_at >= NOW() - INTERVAL '26 weeks' GROUP BY 1
),
act AS (
  SELECT date_trunc('week', ts)::date AS week, COUNT(DISTINCT user_id) AS contributors
  FROM v_storm_user_actions WHERE family = 'contribution' AND ts >= NOW() - INTERVAL '26 weeks' GROUP BY 1
)
SELECT w.week,
       COALESCE(ev.ai_users, 0)    AS ai_users,
       COALESCE(ev.ai_messages, 0) AS ai_messages,
       ROUND(100.0 * COALESCE(ev.ai_users, 0) / NULLIF(act.contributors, 0), 1) AS ai_share_of_contributors_pct,
       COALESCE(fb.thumbs_up, 0)   AS thumbs_up,
       COALESCE(fb.thumbs_down, 0) AS thumbs_down,
       COALESCE(ev.mcp_users, 0)   AS mcp_users,
       COALESCE(ev.mcp_calls, 0)   AS mcp_calls
FROM weeks w
LEFT JOIN ev  USING (week)
LEFT JOIN fb  USING (week)
LEFT JOIN act USING (week)
ORDER BY 1;

-- ==================== q8a ====================
WITH p AS (SELECT DATE '2026-09-15' AS d0),                   -- дата рассылки
periods AS (
  SELECT 'до (28 дн)'    AS period, d0 - 28 AS from_d, d0      AS to_d FROM p
  UNION ALL
  SELECT 'после (28 дн)',           d0,               d0 + 28 FROM p
),
first_seen AS (SELECT user_id, MIN(ts) AS first_ts FROM v_storm_user_actions GROUP BY user_id)
SELECT pr.period,
  COUNT(DISTINCT a.user_id)                                                                       AS users,
  COUNT(DISTINCT a.user_id) FILTER (WHERE a.family = 'contribution')                              AS contributors,
  COUNT(*)                  FILTER (WHERE a.family = 'contribution')                              AS contributions,
  COUNT(DISTINCT a.user_id) FILTER (WHERE f.first_ts >= pr.from_d AND f.first_ts < pr.to_d)       AS newcomers,
  COUNT(DISTINCT a.user_id) FILTER (WHERE a.family = 'contribution'
                                      AND f.first_ts >= pr.from_d AND f.first_ts < pr.to_d)       AS newcomers_contributed
FROM periods pr
JOIN v_storm_user_actions a ON a.ts >= pr.from_d AND a.ts < pr.to_d
JOIN first_seen f ON f.user_id = a.user_id
GROUP BY 1 ORDER BY 1;

-- ==================== q8b ====================
WITH p AS (SELECT DATE '2026-09-15' AS d0),                   -- дата рассылки
groups AS (
  SELECT 'волна рассылки' AS grp,          d0      AS from_d, d0 + 7  AS to_d, d0 + 7  AS ret_from, d0 + 28 AS ret_to FROM p
  UNION ALL
  SELECT 'обычная неделя (−5 нед)',        d0 - 35,           d0 - 28,          d0 - 28,             d0 - 7  FROM p
),
members AS (
  SELECT DISTINCT g.grp, a.user_id
  FROM groups g JOIN v_storm_user_actions a ON a.ts >= g.from_d AND a.ts < g.to_d
),
ret AS (
  SELECT m.grp, m.user_id,
         COALESCE(BOOL_OR(a.ts IS NOT NULL), false)          AS returned,
         COALESCE(BOOL_OR(a.family = 'contribution'), false) AS contributed
  FROM members m
  JOIN groups g USING (grp)
  LEFT JOIN v_storm_user_actions a ON a.user_id = m.user_id AND a.ts >= g.ret_from AND a.ts < g.ret_to
  GROUP BY 1, 2
)
SELECT grp, COUNT(*) AS users,
       COUNT(*) FILTER (WHERE returned)    AS returned_w2_4,
       COUNT(*) FILTER (WHERE contributed) AS contributed_w2_4,
       ROUND(100.0 * COUNT(*) FILTER (WHERE returned) / COUNT(*), 1) AS returned_pct
FROM ret GROUP BY 1 ORDER BY 1 DESC;

-- ==================== q9 ====================
SELECT u.id, u.email, u.fullname,
       CASE WHEN m.rights = 'VIEW' THEN 'просмотр' ELSE 'редактор' END AS role,
       u.create_on::date AS registered,
       MAX(a.ts)::date AS last_action,
       MAX(a.ts) FILTER (WHERE a.family = 'contribution')::date AS last_contribution,
       COUNT(a.ts) FILTER (WHERE a.family = 'contribution' AND a.ts >= NOW() - INTERVAL '28 days') AS contributions_28d,
       COUNT(a.ts) FILTER (WHERE a.family = 'contribution' AND a.ts >= NOW() - INTERVAL '90 days') AS contributions_90d,
       COUNT(a.ts) FILTER (WHERE a.kind = 'ai' AND a.ts >= NOW() - INTERVAL '90 days')            AS ai_90d
FROM sm_users u
LEFT JOIN (SELECT DISTINCT user_id, rights FROM sm_members) m ON m.user_id = u.id
LEFT JOIN v_storm_user_actions a ON a.user_id = u.id
WHERE u.enabled AND u.deleted_on IS NULL
GROUP BY u.id, u.email, u.fullname, m.rights, u.create_on
ORDER BY last_action NULLS FIRST;
