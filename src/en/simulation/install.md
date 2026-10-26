---
title: Installation and Integration
order: 1
source_hash: 417d3515742ff842
---

[[toc]]

# Installing and Connecting the Simulations Module {#установка-и-подключение-модуля-симуляции}

This page covers deploying the container `storm-des` and connecting it to the main application.
It is assumed that the base StormBPMN installation has already been completed according to the
["Installation"](/en/install/README.md) section.

Procedure:

1.  Obtain the `storm-des` image;
2.  Run the container alongside the main application (shared database, shared docker network);
3.  Specify the service address (`DES_BASE_URL`) in the main application and restart it;
4.  Verify functionality.

::: info License
The Simulations module is licensed separately — ensure it is included in your license (see
[module overview](./README.md)). Access to the image is provided along with the module.
:::

## Step 1. Obtaining the image {#шаг-1-получение-образа}

The image `storm-des` is located in the same private registry as the main StormBPMN image and is accessible using the same credentials:

```bash
docker pull cr.selcloud.ru/stormbpmn-enterprise/storm-des:<версия>
```

::: warning Versions must match
Use `storm-des` **of the same version as the main image** StormBPMN — they are built from the same codebase, and compatibility is guaranteed only for identical versions. The current version is specified in the [Changelog](/en/Changelog/README.md) section.
:::

Transferring the image to the corporate registry and verifying the Cosign signature are performed using the same steps as for the main image — see [“Manual installation”](/en/install/quickstart/QUICKSTART_MANUAL.md) and
[Changelog → “Image signature verification”](/en/Changelog/README.md).

## Step 2. Starting the container {#шаг-2-запуск-контеинера}

Example `docker-compose.yml` (or add the service to the existing compose file of the main application —
then the containers will automatically be in the same docker network):

```yaml
services:
    storm-des:
        image: cr.selcloud.ru/stormbpmn-enterprise/storm-des:<версия>
        container_name: storm-des
        restart: unless-stopped
        environment:
            # Та же база PostgreSQL, что у основного приложения
            - SPRING_DATASOURCE_URL=jdbc:postgresql://<хост-БД>:5432/<база>
            - SPRING_DATASOURCE_USERNAME=<пользователь>
            - SPRING_DATASOURCE_PASSWORD=<пароль>
            # ОБЯЗАТЕЛЬНО: тот же часовой пояс, что у контейнера основного приложения
            - TZ=Europe/Moscow
            # Память JVM — под рекомендуемую конфигурацию (16 GB на контейнер)
            - JAVA_OPTS=-Xms4g -Xmx12g -XX:+UseG1GC -XX:+ExitOnOutOfMemoryError
        deploy:
            resources:
                limits:
                    memory: 14G
        healthcheck:
            test: ["CMD-SHELL", "wget --no-verbose --tries=1 --spider http://localhost:8081/actuator/health || exit 1"]
            interval: 30s
            timeout: 10s
            retries: 3
            start_period: 90s
        logging:
            driver: "json-file"
            options:
                max-size: "10m"
                max-file: "3"
```

::: danger Time zone: TZ must match the main application
Timestamps for the start and end of simulations are written to the database in the JVM time zone. If the `TZ`
of the `storm-des` container does not match the `TZ` of the main application, the application's protection mechanism
considers running simulations as "hung" and forcibly terminates them with an error. Symptom — simulations
fail with the message "DES node did not respond," although the service is alive.
:::

::: tip Do not publish the port externally
Port **8081** is needed only by the main application. If both containers are in the same docker network, the
`ports` section is not needed at all — the application will connect by service name (`http://storm-des:8081`). If
the containers are on different hosts — open the port only for the application host using firewall tools.
:::

### Environment variables `storm-des` {#переменные-окружения-storm-des}

| Variable | Default | Description |
| --- | --- | --- |
| `SPRING_DATASOURCE_URL` | — | JDBC address of the application database. **Required** |
| `SPRING_DATASOURCE_USERNAME` | — | Database user. **Required** |
| `SPRING_DATASOURCE_PASSWORD` | — | Database password. **Required** |
| `TZ` | — | Time zone. **Required**, must match the main application |
| `JAVA_OPTS` | automatically based on container memory | JVM parameters; for predictability, we recommend setting `-Xmx` explicitly |
| `SIMULATION_MAX_CONCURRENT` | `2` | Number of simulations run in parallel; the rest wait in the queue |
| `SIMULATION_TIMEOUT_MINUTES` | `10` | Hard limit for a single run — beyond this, the simulation is forcibly stopped |
| `DES_NODE_ID` | container host name | Node name in reports and metrics; change only when multiple nodes run on the same host |
| `HIKARI_MAX_POOL_SIZE` | `5` | Database connection pool size |
| `SIMULATION_DEBUG_ENABLED` | `false` | Save debug files for runs (see [Operations](./operation.md)) |

## Step 3. Connecting the main application {#шаг-3-подключение-основного-приложения}

Add the following environment variables to the **main application** container and restart it:

| Variable | Default | Description |
| --- | --- | --- |
| `DES_BASE_URL` | `http://localhost:8081` | Address of the simulations service, for example `http://storm-des:8081`. The application uses this address to check simulation configurations and build previews |
| `SIMULATION_JANITOR_STALE_QUEUED_MINUTES` | `30` | How many minutes of waiting in the queue before a simulation is marked as an error (protection against a non-functional `storm-des`) |
| `SIMULATION_JANITOR_STUCK_RUNNING_MINUTES` | `20` | How many minutes without a response from a node before an ongoing simulation is marked as an error |

The actual **run** of the simulation via `DES_BASE_URL` does not occur directly — it is passed through a queue in the database. Therefore, brief unavailability of `storm-des` does not fail tasks started from the queue: they will wait until the service returns (within the limit of `SIMULATION_JANITOR_STALE_QUEUED_MINUTES`).

## Step 4. Operational Check {#шаг-4-проверка-работоспособности}

1.  **Service health** — from the host where `storm-des` is running:

    ```bash
    curl -s http://localhost:8081/actuator/health
    # {"status":"UP"}
    ```

2.  **Connectivity to the application** — the address from
    `DES_BASE_URL` must respond from the main application container:

    ```bash
    docker exec <контейнер-приложения> wget -qO- http://storm-des:8081/actuator/health
    ```

3.  **End-to-end check** — in the application** — open the **«Simulations»** section, create a simulation on
    any diagram, and run it. The run must transition from «Queued» to «Running» and
    complete with a report.

If any step fails — see [«Common issues»](./operation.md#типовые-проблемы).

## Scaling {#масштабирование}

Multiple containers `storm-des` (on the same or different hosts) process a shared queue in parallel — a task is assigned to exactly one node. To increase throughput:

-   start additional containers with the same database settings (if running multiple nodes on a single host, assign a unique `DES_NODE_ID` to each);
-   or increase the `SIMULATION_MAX_CONCURRENT` and memory of a single node.

A load balancer is not required: the database queue distributes tasks on its own. `DES_BASE_URL` should point to any live node (or to a load balancer if you require high availability and synchronous operations).
