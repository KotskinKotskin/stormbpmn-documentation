---
order: 1
dir:
  link: true
index: true
source_hash: 2ec5bb74d7020aaf
---

# Installation via script {#установка-скриптом}

The script sets up a test Stormbpmn installation on a single server in 10–20 minutes: the application, PostgreSQL, S3 file storage, PlantUML, Gotenberg, and Portainer. Next, you activate the license and complete the initial setup wizard.

## Prerequisites {#что-нужно-заранее}

| Item | Requirement |
| --- | --- |
| Server | Ubuntu 22.04/24.04 or Debian 12, 64-bit; at least 4 vCPU, 8 GB RAM, 50 GB disk |
| Permissions | `sudo` |
| Internet access | `registry.stormbpmn.com`, Docker Hub, `download.docker.com` (if Docker is not yet installed) |
| Ports | `8081` — Stormbpmn, `8333` — S3 (browser opens files via this port), `9080` — Portainer |
| Image access | Robot account login and secret from the [Enterprise portal](/en/install/portal.md#доступ-к-образам) |

::: info Other distributions
The script installs Docker automatically only on Ubuntu and Debian. On Astra Linux, ALT Linux, RED OS, and other
systems, first install Docker Engine with the `docker compose` plugin, then run the script:
it will detect the existing Docker installation and skip the installation step. You also need `curl`, `openssl`, and `jq`.
:::

## Installation {#установка}

1. Register on the [Enterprise portal](/en/install/portal.md) if you have not already done so, and obtain the robot account login and secret for `registry.stormbpmn.com` in the **"Image Access"** section.

2. Download the configuration file and fill it in:

   ```bash
   curl -O https://raw.githubusercontent.com/KotskinKotskin/stormbpmn-documentation/main/src/install/quickstart/script/install.env
   ```

   | Key | Description | Example |
   | --- | --- | --- |
   | `TIMEZONE` | Time zone for the server and all containers | `Europe/Moscow` |
   | `STORMBPMN_VERSION` | Application version; the latest version is listed in the [changelog](/en/Changelog/README.md) | `9.13.172` |
   | `REGISTRY_USERNAME` | Robot account login from the portal, **in single quotes**: it contains `$` | `'robot$stormbpmn-enterprise+company'` |
   | `REGISTRY_PASSWORD` | Robot account secret, in single quotes | `'<секрет из портала>'` |
   | `STORMBPMN_HOST` | Optional. The IP address or DNS name of the server that users will use to access Stormbpmn. If not specified, the server's first IP address is used | `10.0.0.15` |

3. Download the script to the same location as `install.env` and run it:

   ```bash
   curl -O https://raw.githubusercontent.com/KotskinKotskin/stormbpmn-documentation/main/src/install/quickstart/script/install.sh
   chmod +x install.sh
   sudo ./install.sh
   ```

   The first application run performs database migrations, so the script may wait for up to 15 minutes. At the end, it outputs the Stormbpmn address and the **activation code** — a 64-character string.

The following files will appear in the current directory:

| File | Contents |
| --- | --- |
| `docker-compose.yml` | Configuration for all containers |
| `.env` | `LICENSE_KEY_V2` license key (empty after installation) |
| `credentials.txt` | Addresses and passwords: Portainer, PostgreSQL, S3 keys, `JWTSECRET` |
| `install.log` | Installation log |

::: important
Store `credentials.txt` in a secure location. The passwords contained in it will not be displayed anywhere else.
:::

What is running:

| Container | Server Port | Purpose |
| --- | --- | --- |
| `stormbpmn` | `8081` | Application |
| `postgres` | `127.0.0.1:5432` (accessible only from the server itself) | PostgreSQL 17 with pgvector; the `stormbpmn` database and extensions are already created |
| `seaweedfs` | `8333` | S3 storage [SeaweedFS](/en/install/production/components.md#s3-хранилище-для-фаилов); buckets `storm-uploads`, `storm-users`, `storm-imports` |
| `plantuml`, `gotenberg` | — | PlantUML diagrams and PDF export; accessible only to the application |
| `portainer` | `9080` | Web interface for container management |

## License Activation {#активация-лицензии}

1. Copy the activation code from the script output. The same code is displayed on the
   `http://<адрес сервера>:8081/admin-onboarding` page in the **"Your activation code"** block — copy
   **the entire code, without abbreviation**.
2. In the [Enterprise portal](/en/install/portal.md#лицензионныи-ключ), create an installation (section
   **"Installations"**), then in the **"License keys"** section, select it, paste the code, and
   obtain the key.
3. Enter the key in the file `.env` next to `docker-compose.yml`:

   ```bash
   LICENSE_KEY_V2=<ключ из портала>
   ```

4. Restart the application and wait for it to start (1–2 minutes):

   ```bash
   sudo docker compose up -d stormbpmn
   ```

5. Refresh the `/admin-onboarding` page: instead of the key warning, license data
   and the **"Start configuration"** button will appear.

A separate key is required for each test environment, DR site, and clone. AI and DES rights are
included in the key from the license agreement. For details, see the ["How licenses work"](/en/operation/License.md#активация-инсталляции) section.

::: warning Do not open the installation to users before activation
Until the key is available, the wizard will not allow creating an administrator, and there will be no one to log into the system.
:::

## Initial Setup Wizard {#мастер-первичнои-настроики}

Click **«Start Setup»** on `/admin-onboarding`. The wizard consists of seven steps:

1. **Administrator.** Specify the email and password for the first administrator. The wizard will create the account and the «Enterprise Admin» administrative team with full permissions, then immediately log in. Record the login and password: you cannot create the first administrator a second time.
2. **Settings.** Find the setting `baseUrl` and specify the address where users open Stormbpmn, for example `http://10.0.0.15:8081`. Without it, links in emails and PDF export will not work.
3. **Branding.** Logo and colors. This step can be skipped.
4. **System Check.** The wizard checks the database, license, application address, email, S3, Gotenberg, and PlantUML. For details on each check, see the [«System Check»](/en/operation/system-check.md) section.
5. **Backups.** Specify the date of the last recovery check from a backup.
6. **Support.** Specify the responsible administrator and confirm the support terms.
7. **Users.** Invitation template for employees. Click **«Finish Setup»**.

::: warning Email on a test installation
The script does not configure email sending (`EMAIL_PROVIDER=nop`), so the **«Email (SMTP)»** check will be red, and the wizard will not complete with a red check. Choose one of the following:

- connect SMTP: add the variables `EMAIL_PROVIDER: smtp`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_FROM` (and `SMTP_USERNAME`,
  `SMTP_PASSWORD`, if the server requires authorization) to the service `stormbpmn` in `docker-compose.yml`, run
  `sudo docker compose up -d stormbpmn`, and click «Check Again»;
- or complete the setup by bypassing: open `/admin-onboarding?skipChecks=1` and specify the reason,
  for example «test installation, we will connect email later». The bypass is recorded — see
  [«Bypassing Checks»](/en/operation/system-check.md#обход-проверок-skipchecks-1).
:::

After the wizard, create a working team for employees: the administrative team is only for system configuration. How to do this is described in the
[«Creating a Working Team for Employees»](./QUICKSTART_MANUAL.md#создание-рабочеи-команды-для-сотрудников) section.

## If something went wrong {#если-что-то-пошло-не-так}

- **The script finished with an error.** It rolls back its changes: stops the containers,
  deletes their volumes, `docker-compose.yml`, `.env` and `credentials.txt`. Fix the cause from
  `install.log` and run the script again. If the cause is unclear, send `install.log` to
  support.
- **The script refuses to run: "already installed".** There is already a
  `docker-compose.yml` in the folder or a `postgres_data` volume on the server from a previous installation. The script does
  not touch existing data. For a clean installation, delete them manually:
  `sudo docker compose down -v` in the previous installation folder.
- **Docker Hub is blocked.** The PostgreSQL and Gotenberg images are available in our registry under the same login:
  `registry.stormbpmn.com/stormbpmn-enterprise/pgvector:pg17` and
  `registry.stormbpmn.com/stormbpmn-enterprise/gotenberg:8`. Replace them in
  `docker-compose.yml` (the lines with the hint are already there).
- **The application does not start.** Check the log: `sudo docker logs --tail 200 stormbpmn`.
- **Attachments and images do not open.** The user's browser must be able to open
  `http://<STORMBPMN_HOST>:8333`. If the server is available to users under a different address, correct
  `S3_EXTERNAL_ENDPOINT` in `docker-compose.yml` and restart `stormbpmn`.

::: tip Version Update
Change the image tag `stormbpmn` in `docker-compose.yml` to the new version and run
`sudo docker compose up -d stormbpmn`. Before updating, make a backup of the database.
:::

## Important: the following steps {#важно-следующие-шаги}

:::danger This installation is for testing only!
The installation described above is intended **only for verifying functionality** and familiarizing yourself with the system. **Do not use it for working with real users.**

Why this installation is not suitable for production:

-   **No SSL/HTTPS** — data is transmitted in plaintext
-   **No backup** of the database and files
-   **No monitoring** — issues and load are not visible
-   **Simplified authentication** — no integration with corporate systems
-   **No email** — users will not receive emails
:::

### Next Steps for Production {#следующие-шаги-для-продакшена}

1. **[Production Ready](/en/install/production/)** — configuration for industrial use
2. **[Security](/en/configure/security/)** — HTTPS, authentication, and auditing
3. **[System Administration](/en/operation/README.md)** — performance, availability, and data loss protection

:::info Tip
Switch to the production configuration **before** connecting real users: it is harder to migrate a working system than to configure it correctly from the start.
:::
