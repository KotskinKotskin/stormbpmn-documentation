---
title: Operations and Monitoring
order: 2
source_hash: abe38d2a52a89b73
---

[[toc]]

# Operations and Monitoring of the Simulations Module {#эксплуатация-и-мониторинг-модуля-симуляции}

## Service Health {#здоровье-сервиса}

The `storm-des` container provides a standard health check:

```
GET http://storm-des:8081/actuator/health   →   {"status":"UP"}
```

In the compose file example from [installation](./install.md), a docker-healthcheck is already configured for this address.
We recommend additionally enabling automatic restart on unhealthy status — for example, using the
[autoheal](https://github.com/willfarrell/docker-autoheal) container:

```yaml
    autoheal:
        image: willfarrell/autoheal:latest
        restart: unless-stopped
        environment:
            - AUTOHEAL_CONTAINER_LABEL=autoheal
            - AUTOHEAL_INTERVAL=15
        volumes:
            - /var/run/docker.sock:/var/run/docker.sock
```

and the `autoheal=true` label on the `storm-des` service. This covers a rare but unpleasant scenario:
after a prolonged loss of connection to the database, the service may remain in a non-functional state, and without
a restart, the simulation queue will be stalled.

## Prometheus Metrics {#метрики-prometheus}

Metrics are available at `GET http://storm-des:8081/actuator/prometheus` — add this address to your Prometheus (see [“Monitoring and Backup”](/en/install/production/monitoring-backup.md)).
Key metrics:

| Metric | What it shows |
| --- | --- |
| `des_worker_up` | Node is alive and polling the queue (1/0) |
| `des_queue_tasks` | Queue size by statuses (label `status`) |
| `des_queue_oldest_wait_seconds` | How long the oldest task in the queue has been waiting |
| `des_tasks_in_progress` | How many simulations are currently running |
| `des_task_queue_wait_seconds` | Task wait time in the queue (histogram) |
| `des_task_duration_seconds` | Run duration (histogram) |
| `des_simulations_finished_total` | Completed runs by results |
| `des_poll_errors_total` | Queue polling errors — an increase indicates database issues |
| `des_throttler_available_permits` | Free slots for parallel simulations |

What to set alerts for first:

-   `des_worker_up == 0` or missing metrics — the service is not running;
-   `des_queue_oldest_wait_seconds` increases while the node is alive — the queue is not being processed
    (all slots are occupied or the database pool is faulty);
-   increase in `des_poll_errors_total` — database connection issues.

## Protection Against "Hung" Simulations {#защита-от-«зависших»-симуляции}

The system is protected against hangs at two levels; all thresholds are configurable via environment variables from the [«Installation»](./install.md) section.

**On the `storm-des` side** — limits for a single run:

-   `SIMULATION_TIMEOUT_MINUTES` (default 10) — hard limit on run duration;
-   protection against infinite loops: if the process model does not advance in time for a long period, the run is stopped with a clear error.

**On the main application side** — queue "sanitizer":

-   a task that has been waiting in the queue longer than `SIMULATION_JANITOR_STALE_QUEUED_MINUTES` (30 minutes) is marked with the error "was not processed within the allotted time" — meaning no node picked it up;
-   a run without a response from a node longer than `SIMULATION_JANITOR_STUCK_RUNNING_MINUTES` (20 minutes) is marked with the error "DES node did not respond".

In both cases, the user sees a simulation error and can restart it — no manual cleanup is required.

## Debug files {#фаилы-отладки}

To troubleshoot incidents with technical support, the service can save input data and logs of problematic runs:

```yaml
        environment:
            - SIMULATION_DEBUG_ENABLED=true
        volumes:
            - ./debug:/app/debug
```

By default, only problematic runs (errors and timeouts) are saved. The files contain data from your processes — mount the directory to a secure location and clean it up according to your retention policies.

## Common Issues {#типовые-проблемы}

| Symptom | Cause | Action |
| --- | --- | --- |
| Simulations hang in "Queued" state, then fail with "was not processed within the allotted time" | Container `storm-des` is not running, cannot see the database, or all slots are occupied | Check `docker ps` and `/actuator/health`; inspect container logs; if unhealthy — `docker restart storm-des` |
| Simulations fail with "DES node did not respond," although the service is alive | Mismatch of `TZ` between `storm-des` and the main application — the "sanitizer" falsely considers runs to be stuck | Set the same `TZ` in both containers and restart them |
| Error when creating or validating simulation configuration in the interface | The main application could not reach `storm-des` via `DES_BASE_URL` | Verify the address and network connectivity from the application container (step 4 of [installation](./install.md)) |
| Run terminates due to timeout | Simulation horizon is too large or there is an infinite loop in the process | Reduce horizon/number of instances; check diagram logic; if necessary, increase `SIMULATION_TIMEOUT_MINUTES` and memory |
| Container restarts with a memory error | Memory is less than required by the number of parallel runs | Increase container memory and `-Xmx`, or reduce `SIMULATION_MAX_CONCURRENT` |
| Queue is stuck after a database failure, service is "Up (unhealthy)" | Connection pool did not recover after the disconnection | `docker restart storm-des`; to make this happen automatically — configure autoheal (above) |
