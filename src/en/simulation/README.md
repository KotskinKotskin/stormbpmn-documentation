---
dir:
  order: 5
  link: true
  text: 5. Simulations (DES)
  collapsible: true
index: true
order: 5
source_hash: 76e7fc7368659120
---

[[toc]]

# Simulation Module (DES) {#модуль-симуляции-des}

The Simulation Module allows you to **run business processes "in the digital" before changing them in reality**.
You take a BPMN diagram, set parameters (request flow, operation durations, resources and their
schedules, cost) — and get a simulation run of the process using the Discrete Event Simulation (DES) method: where the queue builds up, what the actual cycle time is,
how loaded the performers are, and what it costs to run one instance of the process.

What the module provides:

-   **Bottleneck identification** — which operations and resources slow down the process and create queues;
-   **Cycle time and SLA** — how long it actually takes to process a request, taking queues and schedules into account;
-   **Resource utilization** — who is overloaded and who is idle;
-   **Process economics** — the cost of an instance and cost items;
-   **"What-if" scenarios** — comparing process variants before implementing changes.

::: info Separate license
The Simulation Module **is not included in the standard delivery** of StormBPMN Enterprise and is licensed separately —
just like the AI module. To include the module in your license agreement, contact your account manager or write to us via the [form on the website](https://stormbpmn.com/contact-sales). You will receive the key with the module
afterwards in the [Enterprise portal](/en/install/portal.md#лицензионныи-ключ).
:::

::: tip AI analysis of results
Automatic analysis of the simulation report by a language model (conclusions and recommendations based on the run)
additionally requires the **AI module** license and a configured [AI assistant](/en/ai/). The simulations themselves
work without it.
:::

## How the module works {#как-устроен-модуль}

Simulations are processed by a **separate container `storm-des`** — a computational service running alongside the main application. It is intentionally decoupled from the main container: a simulation run is a resource-intensive task, and a separate service does not consume CPU or memory from application users, while also allowing independent scaling when needed.

Integration with the application occurs via two paths:

1.  **Database queue** — the main application enqueues simulation runs (a table in the same PostgreSQL database), and container `storm-des` retrieves tasks from the queue, processes them, and writes the results back. No separate message broker is required.
2.  **HTTP within the perimeter** — synchronous operations (configuration validation before launch, parameter preview, configuration schemas) are requested by the main application directly from `storm-des` over HTTP (port 8081). This port is required **only by the main application** — it should not be and does not need to be exposed externally.

This implies two properties important for operations:

-   `storm-des` connects **to the same PostgreSQL database** as the main application — no separate database is needed, and the service does not perform schema migrations (all tables are created by the main application);
-   if **multiple** `storm-des` containers are started, they will process the shared queue in parallel — this is how simulation throughput scales.

## Resource Requirements {#требования-к-ресурсам}

| Configuration | CPU | RAM | Disk | Parallel Simulations |
| --- | --- | --- | --- | --- |
| **Minimum** | 2 vCPU | 8 GB | 10 GB | 1 |
| **Recommended** | 4 vCPU | 16 GB | 20 GB | 2 |

Memory is the primary resource: running a large process with a long modeling horizon keeps all statistics in JVM memory. The number of parallel runs is set by the variable
`SIMULATION_MAX_CONCURRENT` (default is 2) — when increasing it, also increase the container memory
(estimate — 6 GB of JVM heap per parallel simulation plus 2 GB for the service itself). Disk space is required only for logs and debug files.

## Sections {#разделы}

1. **[Installation and Integration](./install.md)** — image, docker-compose, environment variables,
   integration with the main application, functionality verification.
2. **[Operations and Monitoring](./operation.md)** — service health, Prometheus metrics,
   limits and protection against "stuck" simulations, common issues and their diagnostics.
