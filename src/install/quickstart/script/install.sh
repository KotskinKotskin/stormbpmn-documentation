#!/bin/bash
# Тестовая установка Stormbpmn Enterprise одним скриптом: Docker, PostgreSQL (pgvector), SeaweedFS (S3),
# PlantUML, Gotenberg, Portainer и само приложение. Инструкция:
# https://enterprise.stormbpmn.com/install/quickstart/QUICKSTART_SCRIPT.html

if [[ $EUID -ne 0 ]]; then
  echo "This script needs sudo privileges. Re-running with sudo..."
  exec sudo "$0" "$@"
fi

set -e
set -o pipefail

### CONFIG
ENV_FILE="./install.env"
LOG_FILE="./install.log"
CREDENTIALS_FILE="./credentials.txt"
DOCKER_COMPOSE_FILE="./docker-compose.yml"
# Рядом с docker-compose.yml: docker compose читает его сам. Сюда вписывается LICENSE_KEY_V2.
APP_ENV_FILE="./.env"

REQUIRED_VARS=("TIMEZONE" "STORMBPMN_VERSION" "REGISTRY_USERNAME" "REGISTRY_PASSWORD")
REGISTRY_HOST="registry.stormbpmn.com"
SEAWEEDFS_IMAGE="chrislusf/seaweedfs:4.52"
S3_BUCKETS="storm-uploads,storm-users,storm-imports"
# Первый старт на пустой базе прогоняет все миграции: на слабой машине это до 10 минут
APP_START_TIMEOUT=900

### SETUP LOGGING
exec > >(tee -a "$LOG_FILE") 2>&1

log() { echo -e "[INFO] $1"; }
warn() { echo -e "[WARN] $1"; }
err() { echo -e "[ERROR] $1"; }
abort() { err "$1"; rollback; exit 1; }
# Ошибка до того, как скрипт что-либо создал: откатывать нечего
fail() { err "$1"; exit 1; }

### CLEANUP FUNCTION
rollback() {
  log "Error encountered. Rolling back installation..."
  if command -v docker >/dev/null 2>&1 && [[ -f "$DOCKER_COMPOSE_FILE" ]]; then
    docker compose -f "$DOCKER_COMPOSE_FILE" down -v --remove-orphans || true
  fi
  rm -f "$CREDENTIALS_FILE" "$DOCKER_COMPOSE_FILE" "$APP_ENV_FILE"
  log "Rollback complete."
}

### VALIDATE ENV FILE
log "Validating configuration..."
[[ -f "$ENV_FILE" ]] || fail "Missing config file: $ENV_FILE"
# shellcheck disable=SC1090
source "$ENV_FILE"

for VAR in "${REQUIRED_VARS[@]}"; do
  [[ -n "${!VAR}" ]] || fail "Missing required variable: $VAR in $ENV_FILE"
done

# Повторный запуск поверх рабочей установки: откат при ошибке удалил бы тома с данными
if [[ -f "$DOCKER_COMPOSE_FILE" ]]; then
  fail "$DOCKER_COMPOSE_FILE already exists: Stormbpmn is already installed in this directory. The script is for a fresh install only."
fi
if command -v docker >/dev/null 2>&1 && docker volume inspect postgres_data >/dev/null 2>&1; then
  fail "Docker volume postgres_data already exists (data of a previous installation). Remove it manually if you really want a clean install."
fi

# Адрес, по которому пользователи откроют Stormbpmn и файлы из S3. По умолчанию — первый IP сервера.
if [[ -z "$STORMBPMN_HOST" ]]; then
  STORMBPMN_HOST=$(hostname -I 2>/dev/null | awk '{print $1}')
  STORMBPMN_HOST=${STORMBPMN_HOST:-localhost}
fi
log "Stormbpmn will be available at http://$STORMBPMN_HOST:8081"

### SET TIMEZONE
log "Setting server timezone to $TIMEZONE..."
if command -v timedatectl >/dev/null 2>&1 && timedatectl set-timezone "$TIMEZONE"; then
  :
else
  warn "Could not set the server timezone; containers still get TZ=$TIMEZONE."
fi

### INSTALL PACKAGES
# shellcheck disable=SC1091
OS_ID=$(. /etc/os-release && echo "$ID")

apt_install() {
  command -v apt-get >/dev/null 2>&1 || fail "Package manager apt-get not found. Install manually: $*"
  apt-get update
  apt-get install -y "$@"
}

for TOOL in curl openssl jq; do
  command -v "$TOOL" >/dev/null 2>&1 || apt_install "$TOOL"
done

log "Installing Docker..."
if ! command -v docker >/dev/null 2>&1; then
  case "$OS_ID" in
    ubuntu|debian)
      apt_install ca-certificates gnupg
      install -m 0755 -d /etc/apt/keyrings
      curl -fsSL "https://download.docker.com/linux/$OS_ID/gpg" | gpg --dearmor --yes -o /etc/apt/keyrings/docker.gpg
      CODENAME=$(. /etc/os-release && echo "$VERSION_CODENAME")
      echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/$OS_ID $CODENAME stable" \
        > /etc/apt/sources.list.d/docker.list
      apt_install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
      ;;
    *)
      fail "Automatic Docker install supports Ubuntu and Debian only (found: $OS_ID). Install Docker Engine with the compose plugin and run the script again."
      ;;
  esac
else
  log "Docker already installed. Skipping."
fi
docker compose version >/dev/null 2>&1 || fail "Docker Compose plugin not found: install docker-compose-plugin and run the script again."
if ! docker info >/dev/null 2>&1; then
  systemctl enable --now docker >/dev/null 2>&1 || true
  docker info >/dev/null 2>&1 || fail "Docker daemon is not running: start it (sudo systemctl start docker) and run the script again."
fi

### GENERATE PASSWORDS
log "Generating credentials..."
rand() { openssl rand -base64 48 | tr -dc 'a-zA-Z0-9' | head -c"$1"; }
PORTAINER_SETUP_TOKEN=$(openssl rand -hex 24)
PORTAINER_PASSWORD=$(rand 16)
POSTGRES_PASSWORD=$(rand 16)
S3_ACCESS_KEY=stormbpmn
S3_SECRET_KEY=$(rand 32)
JWTSECRET=$(rand 64)

cat > "$CREDENTIALS_FILE" <<EOF
STORMBPMN_URL=http://$STORMBPMN_HOST:8081
PORTAINER_URL=http://$STORMBPMN_HOST:9080
PORTAINER_USERNAME=admin
PORTAINER_PASSWORD=$PORTAINER_PASSWORD
POSTGRES_USERNAME=postgres
POSTGRES_PASSWORD=$POSTGRES_PASSWORD
S3_ENDPOINT=http://$STORMBPMN_HOST:8333
S3_ACCESS_KEY=$S3_ACCESS_KEY
S3_SECRET_KEY=$S3_SECRET_KEY
JWTSECRET=$JWTSECRET
EOF
chmod 600 "$CREDENTIALS_FILE"

cat > "$APP_ENV_FILE" <<EOF
# Лицензионный ключ из портала Enterprise. После правки: sudo docker compose up -d stormbpmn
LICENSE_KEY_V2=
EOF
chmod 600 "$APP_ENV_FILE"

### WRITE DOCKER-COMPOSE FILE
log "Writing Docker Compose file..."
cat > "$DOCKER_COMPOSE_FILE" <<EOF
name: stormbpmn

volumes:
  postgres_data:
    name: postgres_data
  seaweedfs_data:
    name: seaweedfs_data
  portainer_data:
    name: portainer_data

networks:
  default:
    name: stormbpmn-network

services:

  portainer:
    image: portainer/portainer-ce:2.39.5
    container_name: portainer
    restart: always
    environment:
      PORTAINER_SETUP_TOKEN: $PORTAINER_SETUP_TOKEN
      TZ: $TIMEZONE
    ports:
      - "9080:9000"
    volumes:
      - portainer_data:/data
      - /var/run/docker.sock:/var/run/docker.sock

  postgres:
    # pgvector/pgvector:pg17 = PostgreSQL 17 + contrib-модули (pg_trgm, pgcrypto, uuid-ossp, hstore) + pgvector.
    # Официальный postgres:17 pgvector не содержит. Если Docker Hub закрыт — наше подписанное зеркало
    # (тот же логин из портала, что и у основного образа):
    #   image: registry.stormbpmn.com/stormbpmn-enterprise/pgvector:pg17
    image: pgvector/pgvector:pg17
    container_name: postgres
    restart: always
    ports:
      - "127.0.0.1:5432:5432"
    environment:
      POSTGRES_PASSWORD: $POSTGRES_PASSWORD
      TZ: $TIMEZONE
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD", "pg_isready", "-U", "postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  seaweedfs:
    # S3-хранилище файлов. Образ по умолчанию запускает "weed mini": S3 на порту 8333,
    # ключ доступа и бакеты создаются из переменных окружения при первом старте.
    image: $SEAWEEDFS_IMAGE
    container_name: seaweedfs
    restart: always
    ports:
      - "8333:8333"
    environment:
      AWS_ACCESS_KEY_ID: $S3_ACCESS_KEY
      AWS_SECRET_ACCESS_KEY: $S3_SECRET_KEY
      S3_BUCKET: $S3_BUCKETS
      TZ: $TIMEZONE
    volumes:
      - seaweedfs_data:/data

  plantuml:
    image: plantuml/plantuml-server:jetty
    container_name: plantuml
    restart: always
    environment:
      TZ: $TIMEZONE

  gotenberg:
    # Если Docker Hub закрыт: registry.stormbpmn.com/stormbpmn-enterprise/gotenberg:8
    image: gotenberg/gotenberg:8
    container_name: gotenberg
    restart: always
    environment:
      TZ: $TIMEZONE

  stormbpmn:
    image: $REGISTRY_HOST/stormbpmn-enterprise/stormbpmn_fullstack_enterprise:$STORMBPMN_VERSION
    container_name: stormbpmn
    restart: always
    depends_on:
      postgres:
        condition: service_healthy
      seaweedfs:
        condition: service_started
    ports:
      - "8081:8081"
    environment:
      TZ: $TIMEZONE
      JDBC_URL: jdbc:postgresql://postgres:5432/stormbpmn
      JDBC_USERNAME: postgres
      JDBC_PASSWORD: $POSTGRES_PASSWORD
      JAVA_OPTS: -Xmx2g -Duser.timezone=$TIMEZONE
      SPRING_PROFILES_ACTIVE: prod
      JWTSECRET: $JWTSECRET
      LICENSE_KEY_V2: \${LICENSE_KEY_V2:-}
      S3_ENDPOINT: http://seaweedfs:8333
      S3_EXTERNAL_ENDPOINT: http://$STORMBPMN_HOST:8333
      S3_ACCESS_KEY: $S3_ACCESS_KEY
      S3_SECRET_KEY: $S3_SECRET_KEY
      S3_BUCKET_UPLOADS: storm-uploads
      S3_BUCKET_USERS: storm-users
      S3_BUCKET_IMPORTS: storm-imports
      S3_SINGLE_USERS_BUCKET: "true"
      PLANTUML_SERVER: http://plantuml:8080/
      GOTENBERG_URL: http://gotenberg:3000
      EMAIL_PROVIDER: nop
EOF

log "Logging into private registry $REGISTRY_HOST..."
printf '%s' "$REGISTRY_PASSWORD" | docker login "$REGISTRY_HOST" --username "$REGISTRY_USERNAME" --password-stdin \
  || abort "Failed to login to $REGISTRY_HOST: check REGISTRY_USERNAME and REGISTRY_PASSWORD (robot account from the Enterprise portal)"

### START INFRASTRUCTURE
log "Pulling images..."
docker compose -f "$DOCKER_COMPOSE_FILE" pull || abort "Failed to pull images"

log "Starting infrastructure..."
docker compose -f "$DOCKER_COMPOSE_FILE" up -d postgres seaweedfs plantuml gotenberg portainer || abort "Failed to start containers"

### CONFIGURE POSTGRES
log "Waiting for Postgres to be healthy..."
timeout 60 bash -c 'until docker exec postgres pg_isready -U postgres > /dev/null 2>&1; do sleep 2; done' || abort "Postgres did not start in time"

log "Creating 'stormbpmn' database in Postgres..."
docker exec -u postgres postgres psql -tc "SELECT 1 FROM pg_database WHERE datname = 'stormbpmn'" | grep -q 1 \
  || docker exec -u postgres postgres psql -c "CREATE DATABASE stormbpmn ENCODING 'UTF8'" \
  || abort "Failed to create database 'stormbpmn' in Postgres."

# vector/uuid-ossp/hstore/pgcrypto приложение создаёт само, pg_trgm — нет (без него не работает
# поиск пользователей по части имени). Заводим все заранее.
log "Enabling required PostgreSQL extensions in 'stormbpmn' database..."
docker exec -u postgres postgres psql -d stormbpmn -c "
  CREATE EXTENSION IF NOT EXISTS vector;
  CREATE EXTENSION IF NOT EXISTS pg_trgm;
  CREATE EXTENSION IF NOT EXISTS pgcrypto;
  CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";
  CREATE EXTENSION IF NOT EXISTS hstore;" \
  || abort "Failed to enable PostgreSQL extensions in 'stormbpmn'."

### CHECK S3
log "Waiting for SeaweedFS S3 to be ready..."
# Без подписи S3 отвечает 403 — значит, сервер поднялся и проверяет ключи
timeout 120 bash -c 'until [[ $(curl -s -o /dev/null -w "%{http_code}" http://localhost:8333/) =~ ^(200|403)$ ]]; do sleep 2; done' \
  || abort "SeaweedFS did not start in time"

### CONFIGURE PORTAINER
log "Waiting for Portainer to be ready..."
timeout 60 bash -c 'until curl -sk http://localhost:9080/api/status > /dev/null 2>&1; do sleep 2; done' || abort "Portainer failed to start."

log "Initializing Portainer admin..."
curl -sSfk -X POST http://localhost:9080/api/users/admin/init \
  -H 'Content-Type: application/json' \
  -H "X-Setup-Token: $PORTAINER_SETUP_TOKEN" \
  -d "$(jq -n --arg pass "$PORTAINER_PASSWORD" '{Username: "admin", Password: $pass}')" \
  > /dev/null || abort "Failed to initialize Portainer admin"

PORTAINER_TOKEN=$(curl -sSfk -X POST http://localhost:9080/api/auth \
  -H 'Content-Type: application/json' \
  -d "$(jq -n --arg pass "$PORTAINER_PASSWORD" '{Username: "admin", Password: $pass}')" \
  | jq -r .jwt) || abort "Failed to retrieve Portainer admin JWT"

log "Adding Stormbpmn registry to Portainer registries..."
curl -sSfk -X POST http://localhost:9080/api/registries \
  -H "Authorization: Bearer $PORTAINER_TOKEN" \
  -H 'Content-Type: application/json' \
  -d "$(jq -n --arg url "$REGISTRY_HOST" --arg user "$REGISTRY_USERNAME" --arg pass "$REGISTRY_PASSWORD" \
        '{Name: "Stormbpmn", URL: $url, Type: 3, Authentication: true, Username: $user, Password: $pass}')" \
  > /dev/null || abort "Failed to add Stormbpmn registry to Portainer registries"

### START STORMBPMN
log "Starting Stormbpmn..."
docker compose -f "$DOCKER_COMPOSE_FILE" up -d stormbpmn || abort "Failed to start Stormbpmn"

# nginx в контейнере отвечает раньше бэкенда, поэтому ждём ответа самого API: код активации
log "Waiting for Stormbpmn backend (first start runs database migrations, up to $((APP_START_TIMEOUT / 60)) min)..."
SECONDS=0
until ACTIVATION_CODE=$(curl -sf http://localhost:8081/api/v1/license-signature) && [[ -n "$ACTIVATION_CODE" ]]; do
  if (( SECONDS > APP_START_TIMEOUT )); then
    docker logs --tail 100 stormbpmn || true
    abort "Stormbpmn did not start in time"
  fi
  if [[ "$(docker inspect -f '{{.State.Restarting}}' stormbpmn 2>/dev/null)" == "true" ]]; then
    docker logs --tail 100 stormbpmn || true
    abort "Stormbpmn container keeps restarting"
  fi
  sleep 5
done

echo
log "@@@"
log "Installation completed successfully!"
log "Stormbpmn: http://$STORMBPMN_HOST:8081"
log "Activation code (paste it in the Enterprise portal, section «Лицензионные ключи»):"
log "$ACTIVATION_CODE"
log "Then put the key into $APP_ENV_FILE (LICENSE_KEY_V2=...) and run: sudo docker compose up -d stormbpmn"
log "All generated credentials have been saved to the file: $CREDENTIALS_FILE"
log "Please make sure to back up this file and keep it in a safe place."
log "@@@"
