---
dir:
    order: 5
    link: true
    text: 4. Обслуживание
    collapsible: true
---

[[toc]]

# Администрирование системы

Руководство по мониторингу, резервному копированию, обновлению и устранению неисправностей StormBPMN Enterprise.

::: tip Основные задачи администратора

-   **Мониторинг** - отслеживание состояния системы и производительности
-   **Резервное копирование** - регулярное сохранение данных
-   **Обновления** - установка новых версий и исправлений
-   **Устранение неисправностей** - диагностика и решение проблем

:::

## Мониторинг системы

### Метрики Prometheus

StormBPMN предоставляет HTTP-endpoint с метриками в формате Micrometer для мониторинга через Prometheus.

**Конфигурация Prometheus:**

```yaml
- job_name: "stormbpmn-node-1"
  metrics_path: "/actuator/prometheus"
  scrape_interval: 15s
  static_configs:
      - targets: ["10.1.0.3:8080"]
```

::: tip Готовый дашборд Grafana
Используйте [Spring Boot Statistics Dashboard](https://grafana.com/grafana/dashboards/12835-spring-boot-statistics-6756-tomcat/) для визуализации метрик.
:::

### Настройка алертов

Рекомендуемые пороги для срабатывания алертов:

| Метрика                    | Условие срабатывания    | Описание                    |
| -------------------------- | ----------------------- | --------------------------- |
| **CPU Usage**              | > 90% в течение 5 минут | Высокая загрузка процессора |
| **Request Count /api/v1/** | > 100 запросов в минуту | Аномально высокая нагрузка  |
| **HEAP Memory Used**       | > 90% в течение 5 минут | Нехватка памяти JVM         |
| **No Data**                | > 5 минут без данных    | Недоступность сервиса       |

::: warning При срабатывании алертов
Переходите к разделу [Disaster Recovery](#disaster-recovery-при-базовой-эксплуатации)
:::

### Health Checks

StormBPMN предоставляет эндпоинты для проверки состояния:

```yaml
livenessProbe:
    httpGet:
        path: /api/health/liveness
        port: 8080
    initialDelaySeconds: 30
    periodSeconds: 5

readinessProbe:
    httpGet:
        path: /api/health/readiness
        port: 8080
    initialDelaySeconds: 30
    periodSeconds: 5
```

---

## Резервное копирование

### Что необходимо копировать

Вся критически важная информация (диаграммы, описания, пользователи) хранится в базе данных PostgreSQL.

::: tip Достаточно резервного копирования БД
S3-файлы (изображения, документы) можно восстановить, но рекомендуется включить их в backup стратегию.
:::

### Создание резервной копии

**Пример команды для PostgreSQL:**

```bash
pg_dump -h localhost -d storm_db -U storm_user -W -Ft -b > /backup/storm_$(date +%Y%m%d_%H%M%S).tar
```

**Рекомендуемый скрипт автоматизации:**

```bash
#!/bin/bash
BACKUP_DIR="/backup/stormbpmn"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/storm_backup_$DATE.tar"

# Создание резервной копии
pg_dump -h $DB_HOST -d $DB_NAME -U $DB_USER -W -Ft -b > $BACKUP_FILE

# Проверка успешности
if [ $? -eq 0 ]; then
    echo "Backup successful: $BACKUP_FILE"
    # Отправка уведомления об успехе
else
    echo "Backup failed!"
    # Отправка алерта администратору
fi

# Очистка старых копий (старше 30 дней)
find $BACKUP_DIR -name "storm_backup_*.tar" -mtime +30 -delete
```

### Требования к резервному копированию

-   [ ] **Ежедневное расписание** - автоматическое создание копий
-   [ ] **Мониторинг места** - контроль свободного пространства
-   [ ] **Уведомления** - информирование о статусе backup
-   [ ] **Тестирование** - регулярная проверка восстановления
-   [ ] **Удаленное хранение** - копии в другом дата-центре

---

## Восстановление из резервной копии

### Восстановление PostgreSQL

```bash
# Остановка приложения
docker stop stormbpmn

# Восстановление базы данных
pg_restore --format=t -c -N -O -h localhost -p 5432 -U storm_user -d storm_db /backup/storm_backup_20231201_120000.tar

# Запуск приложения
docker start stormbpmn
```

### Проверка восстановления

1. **Проверьте подключение** к базе данных
2. **Убедитесь в работе** health checks
3. **Протестируйте основные функции** (вход, создание диаграммы)
4. **Проверьте логи** на наличие ошибок

---

## Обновление версии

### Процедура обновления

| Шаг | Действие                      | Описание                                     |
| --- | ----------------------------- | -------------------------------------------- |
| 1   | **Определить текущую версию** | `docker images \| grep stormbpmn`            |
| 2   | **Изучить changelog**         | [Журнал изменений](CHANGELOG.md)             |
| 3   | **Выбрать целевую версию**    | Проверить совместимость                      |
| 4   | **Создать резервную копию**   | Обязательно перед любым обновлением          |
| 5   | **Сохранить текущий образ**   | `docker save stormbpmn:current > backup.tar` |
| 6   | **Скачать новую версию**      | `docker pull stormbpmn....`                  |
| 7   | **Обновить docker-compose**   | Изменить версию образа                       |
| 8   | **Перезапустить контейнеры**  | `docker-compose up -d`                       |
| 9   | **Проверить health checks**   | Дождаться успешных ответов                   |

### Критические обновления

::: danger Версия < 6.3.231 → новее
**Требуется миграция базы данных:**

```sql
UPDATE databasechangelog
SET filename = CONCAT('/db/changelog/changes/', SUBSTRING(filename, 35));
```

:::

::: warning Версия ≥ 6.6.441
**Требуются новые ENV переменные:**

| Переменная                     | Значение                | Описание                             |
| ------------------------------ | ----------------------- | ------------------------------------ |
| **STORM_ALLOWED_ORIGINS**      | `https://your.domain`   | CORS настройки (не используйте `*`!) |
| **STORM_DISABLE_SIMPLE_AUTH**  | `false`                 | Отключение базовой авторизации       |
| **STORM_DISABLE_ENV_IN_UI**    | `true`                  | Скрытие ENV в админке                |
| **STORM_DISABLE_ANON_SHARING** | `true`                  | Запрет анонимного доступа            |
| **STORM_SENTRY_ENABLE**        | `false`                 | Отключение Sentry                    |
| **STORM_ENABLE_SAAS_FEATURES** | `false`                 | Отключение SaaS функций              |
| **GOTENBERG_URL**              | `http://gotenberg:3001` | URL сервиса конвертации              |

:::

::: warning Версия ≥ 6.6.559
**Требуется расширение PostgreSQL:**

```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

:::

---

## Disaster Recovery

### При обновлении

Если обновление прошло неудачно:

1. **Сохранить логи контейнера**

    ```bash
    docker logs stormbpmn > /tmp/update_error_logs.txt
    ```

2. **Восстановить базу данных**

    ```bash
    pg_restore --format=t -c -N -O -h localhost -p 5432 -U storm_user -d storm_db /backup/latest_backup.tar
    ```

3. **Откатить версию контейнера**

    ```bash
    docker load < backup_image.tar
    docker-compose up -d
    ```

4. **Перезапустить контейнеры**

    ```bash
    docker-compose restart
    ```

5. **Обратиться в поддержку** с информацией:
    - Исходная версия
    - Целевая версия
    - Логи ошибок
    - Конфигурация системы

### При базовой эксплуатации

При проблемах в работе системы:

1. **Сохранить логи**

    ```bash
    docker logs stormbpmn > /tmp/error_logs.txt
    ```

2. **Перезапустить контейнеры**

    ```bash
    docker-compose restart
    ```

3. **Проверить состояние**

    - Health checks отвечают
    - Метрики в норме
    - Пользователи могут войти

4. **При сохранении проблем** - обращение в поддержку

---

## Связанная документация

-   **[Конфигурация](../configure/README.md)** - настройка системы
-   **[Production-Ready](../install/FULL_INSTALL.md)** - развертывание для продакшена
-   **[Безопасность](../configure/SECURE.md)** - настройки безопасности
