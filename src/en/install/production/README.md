---
title: Production installation
order: 1
dir:
  order: 2
  link: true
  text: Production installation
  collapsible: true
index: true
redirectFrom:
  - /en/install/FULL_INSTALL.html
source_hash: f9e418aaf56db22b
---

[[toc]]

# Production-Ready Installation {#production-ready-установка}

For full-scale industrial use, you must configure additional components and ensure a high level of security, performance, and fault tolerance.

::: warning Mandatory Components for Production
The minimal installation from [Quick Start](/en/install/quickstart/README.md) is **not suitable** for use with real users. You must configure all components described in this document.
:::

---

## Production-ready installation checklist {#чек-лист-production-ready-установки}

### Mandatory components {#обязательные-компоненты}

-   [ ] **SSL/HTTPS** - load balancer with SSL termination
-   [ ] **S3 storage** - for files and documents
-   [ ] **Monitoring** - Prometheus + Grafana or alternative (Glaber, Zabbix, etc.)
-   [ ] **Backup** - automatic database backups
-   [ ] **Security** - configuration hardening
-   [ ] **Mail service** - for notifications

-   [ ] **License v2** - key bound to the installation (see [Licensing](/en/operation/License.md))

-   [ ] **Yandex SmartCaptcha** - **SMARTCAPTCHA_SECRET** key for login form protection (see [Configuration](/en/configure/README.md))

### Additional components {#дополнительные-компоненты}

-   [ ] **Redis** - for collaborative diagram editing (required for multi-instance)
-   [ ] **PlantUML server** - UML diagram generation
-   [ ] **Gotenberg** - PDF conversion
-   [ ] **Audit logging** - collection of user actions
-   [ ] **Load balancing** - for high availability
-   [ ] **Scaling** - multiple application instances

::: tip MCP server signing keys
The MCP (Model Context Protocol) signing key is generated automatically on the first start and stored in the database in encrypted form — it persists across restarts and is common to all nodes, so no separate configuration is required. If you want to keep the key in an external secret store, set the **MCP_OAUTH_JWK_PRIVATE** / **MCP_OAUTH_JWK_PUBLIC** pair.
:::

---

---

## Installation specifics in k8s {#особенности-установки-в-k8s}

In certain situations, for example when there is an explicit requirement for 1 process in a container (PID 1), it may be necessary to separate containers by their roles.
Pass the ENV variable CONTAINER_ROLE (possible values: FRONT, BACK, FULLSTACK).

-   FRONT: nginx with static content will start.
-   BACK: java will start as an API server.
-   FULLSTACK: supervisord will start, which will launch nginx and java

::: tip "What's New" feed
In the on-prem version, the "What's New" feed is baked into the image at build time. It displays static content without links to the blog and with the build date; access to the CMS is not required.
:::

---

## Configuring the Load Balancer and SSL {#настроика-балансировщика-и-ssl}

### Recommended Solution: Nginx {#рекомендуемое-решение-nginx}

StormBPMN nodes are stateless, which allows the system to be easily scaled through a load balancer.

::: warning When using multiple instances
If multiple StormBPMN nodes are deployed, **Redis** is required for collaborative diagram editing — it provides session synchronization and pub/sub between nodes. See the [Redis](components.md#redis-совместное-редактирование-диаграмм) section.
:::

#### Key Load Balancer Tasks: {#основные-задачи-балансировщика}

-   **SSL termination** - decryption of HTTPS traffic
-   **WebSocket proxy** - proxying WebSocket connections for collaborative editing
-   **Fault tolerance** - failover between nodes
-   **Scaling** - load distribution
-   **Caching** - of static resources

#### Nginx Configuration {#конфигурация-nginx}

**Configuration for high availability:**

```nginx

upstream stormbpmn {
    server 10.0.0.3:8081 weight=5 max_conns=500;
    server 10.0.0.4:8081 weight=5 max_conns=500;
}

server {
    listen 443 ssl http2;
    server_name stormbpmn.company.com;

    ssl_certificate /etc/ssl/certs/stormbpmn.crt;
    ssl_certificate_key /etc/ssl/private/stormbpmn.key;

    # Максимальный размер тела запроса — 50 MB
    client_max_body_size 50M;

    # Максимальный размер заголовков (и буфера для заголовков)
    large_client_header_buffers 8 32k;

    location / {
        proxy_pass http://stormbpmn;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket proxy для совместного редактирования (STOMP over WebSocket)
    location /ws {
        proxy_pass http://stormbpmn;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
    }
}

```

Pay attention to the body size, header size, and **WebSocket proxy** for `/ws`.

The configuration above is illustrative and may require refinement in a specific infrastructure by those who understand how that specific infrastructure is structured.

::: tip Additional Information
A detailed guide to configuring SSL in Nginx: [Securing HTTP Traffic to Upstream Servers](https://docs.nginx.com/nginx/admin-guide/security-controls/securing-http-traffic-upstream/).
:::

---

---

## Sections {#разделы}

Deployment of external services and post-configuration have been moved to separate pages:

- **[External services](./components.md)** — S3 storage, Redis, PlantUML, document conversion, email notifications.
- **[Monitoring, hardening, backup](./monitoring-backup.md)** — metrics, security, backup, business parameters.

---

## Support and Assistance {#поддержка-и-помощь}

::: tip Need help?
If you run into any issues, email **help@stormbpmn.com** or contact your account manager. We are happy to assist with configuration!
:::

### When to contact support: {#когда-обращаться-за-поддержкои}

-   Issues with corporate system integration
-   Questions about security configuration
-   Performance issues
-   Scaling planning
-   Configuration of complex email scenarios

### What to prepare before contacting support: {#что-подготовить-перед-обращением}

-   Application and infrastructure logs
-   System configuration description
-   Error screenshots
-   Versions of the components in use
