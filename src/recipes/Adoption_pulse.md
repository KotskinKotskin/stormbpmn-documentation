---
title: Пульс внедрения Storm
description: SQL-рецепт для оценки внедрения Storm Enterprise — аудитория, удержание, активность, совместная работа и эффект рассылок.
---

# Пульс внедрения Storm

Как по данным своей Enterprise-установки понять, пользуются ли системой и становится ли использование регулярным. Рецепт предназначен для владельца внедрения, администратора и BI-аналитика: единый журнал действий, девять аналитических сценариев, SQL и рекомендации по чтению результатов.

- [Открыть примеры графиков и SQL](/recipes/adoption-pulse/examples.html) — самостоятельная HTML-страница, которую можно сохранить и открыть локально.
- [Скачать SQL-запросы](/recipes/adoption-pulse/queries.sql) — создание представления и 11 запросов для девяти сценариев; запускайте нужные блоки отдельно.

Графики используют **условные данные**, а не подключение к вашей базе. Для реальных показателей выполните SQL на данных своей установки и подключите результаты к BI-системе.

[[toc]]

## Как запустить

1. Подготовьте аналитическую копию базы Storm в PostgreSQL 12+ или хранилище с совместимым SQL и таблицами из рецепта. Для отчётов достаточно обновления раз в сутки.
2. Сверьте состав таблиц и колонок со своей версией. Для чтения нужны права SELECT; для создания представления — CREATE в выбранной аналитической схеме. Если этих прав нет, используйте CTE, как описано ниже.
3. Создайте представление `v_storm_user_actions` из раздела «Единый журнал действий». Проверьте `search_path` или укажите схему перед именами таблиц и представления.
4. Начните с запроса 1: он показывает недельную аудиторию и авторов за 28 дней. Затем добавьте сегменты (4а), удержание (2–3) и живую базу (5).
5. В запросах 8а и 8б замените пример `DATE '2026-09-15'` на дату своей рассылки. Сравнивайте результат после завершения 28-дневного окна.
6. Создайте карточки по таблице «Раскладка панели в BI-системе» и договоритесь с владельцем внедрения о регулярном разборе результатов.

### Что учесть перед сравнением

- **Версия и модули.** Если отсутствуют таблицы отключённых модулей, исключите соответствующие ветви `UNION ALL` и связанные показатели. Если нет `sm_users.deleted_on`, уберите проверку этой колонки в запросах 4а и 9. События симуляций в рецепт не включены.
- **Служебные пользователи.** Исключайте их последовательно из журнала и выборок пользователей. Запросы 6 и 7 также читают исходные таблицы напрямую — фильтр только в представлении на них не распространится.
- **Окно наблюдения.** Текущая неделя и месяц неполные. Запрос 3 исключает пользователей с историей меньше 28 дней, но крайняя неделя набора может содержать только часть новичков. Сравнивайте полностью наблюдаемые периоды и используйте один часовой пояс.
- **Неполная история.** Входы не отражают каждый визит, а `last_interacted_at` вики хранит последнее взаимодействие, не историю всех просмотров. Первая зафиксированная активность может отличаться от реального начала работы.
- **Пустые результаты.** В запросах с внутренним соединением периоды без активности могут отсутствовать. В BI отличайте отсутствие данных от нуля; для непрерывного ряда используйте календарь. В когортной таблице не превращайте ещё не наступившие месяцы в нули.
- **База моделей.** Запрос 5 применяет текущий признак удаления и не восстанавливает исторический состав базы на каждую неделю. «Живая модель» в нём означает наличие сохранённой версии за 90 дней, а не просмотр читателем.
- **Разные определения ядра.** В 4а это 10 и больше вкладов за 28 дней; в 4б — 3 и больше за 14 дней. Для общей панели согласуйте порог и окно.
- **Эффект рассылки.** Запрос 8б сравнивает всех активных участников двух календарных недель, включая прежних пользователей; окно возврата отсчитывается от недели рассылки, а не от первого действия каждого человека. Для новичков используйте также запрос 3. Такое сравнение само по себе не доказывает причинный эффект рассылки.

## Почему сырые события выглядят как бардак

Если построить график по количеству событий в `sm_business_event` за день, получится пила без тренда. Это не поломка учёта, а четыре свойства данных.

- login **Вход пишется при аутентификации, а сессия живёт до 7 дней.** Человек, работающий каждый день, даёт одно событие `login` в неделю. Оно отвечает на вопрос «был ли в системе на этой неделе», а не «сколько раз заходил».

- version **Версия модели при автосохранении пишется не каждый раз.** Каждое 20-е автосохранение и при смене автора. Один сеанс редактирования — одна-три версии, а не сотня.

- cycle **Работа с процессами идёт волнами.** Аналитик неделю рисует, две недели согласует, месяц не трогает. Дневные и недельные абсолюты прыгают; тренд виден на скользящих 28 днях и на когортах.

- on-prem **В установке внутри контура нет событий просмотра страниц.** `page_view_*` пишутся только в облачной версии. Просмотр моделей читателями напрямую не виден — читатели видны через входы и просмотры вики-страниц.

Из этого три правила:

- считать людей, а не события

- смотреть неделю и 28 дней, а не день

- сравнивать когорты, а не абсолют

[Посмотреть пример графика](/recipes/adoption-pulse/examples.html#why) — условные данные, не показатели вашей установки.

## Единый журнал действий

Анализ опирается на одно представление — журнал действий пользователей. Оно склеивает события из `sm_business_event` и факты из прикладных таблиц: модели, версии, комментарии, согласования, реестр, вики, ИИ. Каждое действие относится к одному из двух семейств.

| Источник | Что считаем | Семейство |
| --- | --- | --- |
| sm_business_event · login | вход в систему (не чаще раза в неделю на человека) | presence |
| sm_wiki_page_user_activity | открыл вики-страницу | presence |
| sm_diagrams | создал модель | contribution |
| sm_diagram_versions | сохранил версию (ручную или автоматическую) | contribution |
| sm_comments, sm_comment_messages | написал комментарий | contribution |
| sm_approvals | запросил согласование / принял решение | contribution |
| sm_processes | завёл процесс в реестре | contribution |
| sm_customfield_value_history, sm_entity_change_history | изменил атрибут процесса | contribution |
| sm_assignees, sm_assets | завёл роль или ресурс в справочнике | contribution |
| sm_wiki_page_versions | написал в вики | contribution |
| sm_business_event · ai_*, mcp::* | обратился к ИИ-помощнику или через MCP | contribution |

**Присутствие** — человек был в системе, «пришёл». **Вклад** — человек что-то сделал, «работал». Разница между ними — главное, что нужно видеть: система может быть открыта у всех, а работать в ней будут десять человек.

```sql
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
```

**Замечания.**
Удалённые модели и версии не исключаются — действие было. Служебные учётные записи (администратор поставщика, интеграционные ключи) вычтите через `AND user_id NOT IN (…)`.
События модуля симуляций в этом рецепте не учитываются, поэтому `sm_simulations` в журнал не входит.
Если представление создать нельзя — вставьте его тело как `WITH v_storm_user_actions AS MATERIALIZED (…)` в начало каждого запроса. Если запрос уже начинается с `WITH`, добавьте журнал первым CTE и отделите следующий CTE запятой.
Если в вашей версии нет колонки `sm_users.deleted_on` (добавлена в августе 2026), уберите условие `AND u.deleted_on IS NULL` из запросов 4 и 9.

## 1 Сколько людей реально пользуются

Главный график. Аудитория за неделю и за скользящие 28 дней, отдельно «пришли» и «работали». Плюс **прилипаемость** — доля месячной аудитории, которая приходит каждую неделю.

```sql
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
```

**Как читать.** Растут ли авторы за 28 дней — а не количество действий за неделю, оно шумит. Диапазон 0,3–0,5 можно использовать как пример, а не универсальную норму; падение ниже собственной нормы значит, что люди заходят раз в месяц «посмотреть».

[Посмотреть пример графика](/recipes/adoption-pulse/examples.html#q1) — условные данные, не показатели вашей установки.

## 2 Удерживаем ли людей — когорты

Когорта — месяц первого вклада. Для каждой когорты — доля людей, сделавших хотя бы одно действие в месяц N после первого. Этот срез помогает отличить устойчивое внедрение от постоянного притока людей, которые быстро перестают пользоваться системой.

```sql
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
```

В BI-системе: сводная таблица, строки `cohort`, столбцы `month_n`, значение `pct`. Если учёт событий включили позже, чем люди начали работать, первую когорту отбросьте — в ней окажутся все «старожилы».

[Посмотреть пример графика](/recipes/adoption-pulse/examples.html#q2) — условные данные, не показатели вашей установки.

## 3 Приживаются ли новички

Для каждой недели первого появления: сколько пришло, сколько сделали вклад за первые 14 дней, сколько вернулись на 2–4-й неделе. Именно эту таблицу смотрят после рассылки: всплеск входов — не результат, результат — доля вернувшихся.

```sql
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
```

[Посмотреть пример графика](/recipes/adoption-pulse/examples.html#q3) — условные данные, не показатели вашей установки.

## 4 Глубина: ядро, активные, эпизодические, спящие

Снимок за 28 дней по всем включённым учётным записям. Пороги этого рецепта: ядро — 10 и больше вкладов за 28 дней, активные — 3–9, эпизодические — 1–2. Это настраиваемая сегментация; её нельзя напрямую сравнивать с показателями интерфейса без сверки окна и состава событий.

### 4а. Снимок по уровням

```sql
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
```

### 4б. Ядро по неделям

Авторы с тремя и больше вкладами за скользящие 14 дней на фоне всех авторов за тот же период.

```sql
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
```

[Посмотреть пример графика](/recipes/adoption-pulse/examples.html#q4) — условные данные, не показатели вашей установки.

## 5 Живая ли база процессов

Внедрение — не количество моделей, а доля моделей, которые кто-то трогал за последние 90 дней. Если база растёт, а доля живого падает — рисуют и забывают.

```sql
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
```

[Посмотреть пример графика](/recipes/adoption-pulse/examples.html#q5) — условные данные, не показатели вашей установки.

## 6 Совместная работа

Одиночное рисование не приживается; приживается, когда модели читают, комментируют и согласуют другие. Смотрим комментарии, согласования, модели с двумя и больше авторами, приглашения.

```sql
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
```

[Посмотреть пример графика](/recipes/adoption-pulse/examples.html#q6) — условные данные, не показатели вашей установки.

## 7 ИИ-модуль

Доля авторов, которые за неделю обращались к ИИ, число сообщений, оценки ответов, обращения через MCP — внешние агенты.

```sql
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
```

[Посмотреть пример графика](/recipes/adoption-pulse/examples.html#q7) — условные данные, не показатели вашей установки.

## 8 Что дала рассылка

Две таблицы. Первая — 28 дней до и 28 дней после даты рассылки: аудитория, авторы, новички и сколько новичков сделали вклад. Вторая — сравнение возвращаемости: люди, пришедшие в первую неделю после рассылки («волна»), против людей обычной недели за пять недель до неё. Сравниваем долю вернувшихся на 2–4-й неделе.

### 8а. До и после рассылки

```sql
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
```

### 8б. Волна рассылки и обычная неделя

```sql
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
```

**Как читать.** Если у волны доля вернувшихся не хуже, чем у обычной недели, — это положительный сигнал; проверьте также вклад новичков и другие события периода. Если сильно хуже — пришли посмотреть и ушли; тогда следующий шаг не ещё одна рассылка, а опрос тех, кто не вернулся (список — запрос 9).

[Посмотреть пример графика](/recipes/adoption-pulse/examples.html#q8) — условные данные, не показатели вашей установки.

## 9 С кем работать точечно

Список людей с последним зарегистрированным действием, последним вкладом и числом действий. Сортировка от давно пропавших: сверху — кандидаты на звонок или опрос, либо на освобождение лицензии.

```sql
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
```

Для участника нескольких команд запрос возвращает отдельную строку для каждого значения прав. Одинаковые права в нескольких командах не умножают число действий. Для отчёта по одной команде отфильтруйте `sm_members` до соединения с журналом.

## Как читать: что хорошо, что тревожно, что делать

| Вопрос | Смотрим | Хорошо | Тревожно | Что делать |
| --- | --- | --- | --- | --- |
| Пользуются ли | 1 · `contributors_28d` | растёт или держится квартал к кварталу | растёт `users_28d`, а авторы стоят | люди заходят, но не работают: обучение, шаблоны, задачи «в системе» |
| Есть ли привычка | 1 · `stickiness` | держится в своей норме | сползает | работа стала эпизодической: встроить Storm в регулярный процесс — согласование, аудит |
| Удерживаем ли | 2 · когорты | месяцы 1–3 у новых когорт не хуже старых | каждая новая когорта тает быстрее | проблема в первых неделях — см. запрос 3 |
| Приживаются ли новички | 3 · `contributed_14d`, `returned_8_28d` | половина и больше делают вклад за 14 дней | вклад за 14 дней у меньшинства | у новичка нет задачи: давать конкретную модель или процесс на старте |
| Есть ли ядро | 4 · `core_users`, `core_pct` | ядро растёт в абсолюте | ядро те же пять человек, растут только «заходили» | внедрение держится на энтузиастах — расширять через них, наставники по подразделениям |
| Живая ли база | 5 · `alive_90d_pct` | стабильна или растёт при росте базы | база растёт, доля живого падает | модели рисуют «в стол»: связать с реестром, согласованием, вики |
| Командная ли работа | 6 · `commenters`, `diagrams_multi_author_90d` | растут вместе с авторами | авторы есть, комментаторов нет | ввести согласование через Storm вместо почты |
| ИИ | 7 · `ai_share_of_contributors_pct`, оценки | доля растёт, оценок «вверх» больше | доля не растёт после анонса | показать сценарии на живых процессах команды |
| Эффект рассылки | 8 | у волны доля вернувшихся ≈ обычной неделе | волна вернулась вдвое хуже | опрос невернувшихся (запрос 9) вместо следующей рассылки |

Все «хорошо / тревожно» — относительно собственной истории. Сравнивать с чужими цифрами бесполезно: у команды из 30 аналитиков и у компании, где Storm открыт для 2 000 читателей, нормы разные.

## Раскладка панели в BI-системе

Любая BI-система над хранилищем: каждая карточка — один запрос из этого документа, вид подобран под то, что в нём главное.

| Карточка | Запрос | Вид |
| --- | --- | --- |
| Аудитория и авторы | 1 | линии: `users_28d`, `contributors_28d`, `users_week`, `contributors_week` |
| Прилипаемость | 1 | линия `stickiness` |
| Когорты | 2 | сводная: строки `cohort`, столбцы `month_n`, значение `pct` |
| Новички | 3 | столбцы: `newcomers`, `contributed_14d`, `returned_8_28d` |
| Структура аудитории (28 дн) | 4а | кольцо или столбцы по `tier` |
| Ядро | 4б | линии `core_users`, `core_pct` |
| База процессов | 5 | `diagrams_total` и `processes_total` столбцами, `alive_90d_pct` отдельной линией |
| Совместная работа | 6 | столбцы `comments`, `commenters`, `approvals_decided` |
| ИИ | 7 | `ai_users` столбцами, `ai_share_of_contributors_pct` линией, оценки отдельно |
| Рассылка | 8а, 8б | две таблицы, дату `d0` вынести в параметр панели |
| Люди | 9 | таблица с поиском |

В недельных запросах горизонт 26 недель — поменяйте `INTERVAL '26 weeks'` под себя. Для когорт используется 12 месяцев, для сегментов — 28 дней, для живых моделей — 90 дней. Неделя — ISO, с понедельника. Обновление копии раз в сутки достаточно: ни один срез не требует дневной точности.

## Связанные рецепты

- [План внедрения Enterprise](./Implementation_plan.md)
- [Роли и права участников команды](./Roles_and_privileges.md)
