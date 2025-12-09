#!/bin/bash

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

REQUIRED_VARS=("TIMEZONE" "STORMBPMN_VERSION" "SELECTEL_TOKEN")

### SETUP LOGGING
exec > >(tee -a "$LOG_FILE") 2>&1

log() { echo -e "[INFO] $1"; }
err() { echo -e "[ERROR] $1"; }
abort() { err "$1"; rollback; exit 1; }

### CLEANUP FUNCTION
rollback() {
  log "Error encountered. Rolling back installation..."
  if command -v docker >/dev/null 2>&1; then
    docker compose -f "$DOCKER_COMPOSE_FILE" down -v --remove-orphans || true
  fi
  rm -f "$CREDENTIALS_FILE"
  rm -f "$DOCKER_COMPOSE_FILE"
  log "Rollback complete."
}

### VALIDATE ENV FILE
log "Validating configuration..."
if [[ ! -f "$ENV_FILE" ]]; then
  abort "Missing config file: $ENV_FILE"
fi
source "$ENV_FILE"

for VAR in "${REQUIRED_VARS[@]}"; do
  if [[ -z "${!VAR}" ]]; then
    abort "Missing required variable: $VAR in $ENV_FILE"
  fi
done

### SET TIMEZONE
log "Setting server timezone to $TIMEZONE..."
timedatectl set-timezone "$TIMEZONE"

### INSTALL DOCKER
log "Installing Docker..."
if ! command -v docker &> /dev/null; then
  apt-get update
  apt-get install -y ca-certificates curl gnupg lsb-release
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
    https://download.docker.com/linux/ubuntu \
    $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list
  apt-get update
  apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
else
  log "Docker already installed. Skipping."
fi

### INSTALL JQ
log "Installing jq..."
apt-get install -y jq

### GENERATE PASSWORDS
log "Generating credentials..."
PORTAINER_PASSWORD=$(openssl rand -base64 12 | tr -dc 'a-zA-Z0-9' | head -c16)
POSTGRES_PASSWORD=$(openssl rand -base64 12 | tr -dc 'a-zA-Z0-9' | head -c16)
MINIO_ROOT_PASSWORD=$(openssl rand -base64 12 | tr -dc 'a-zA-Z0-9' | head -c16)
JWTSECRET=$(openssl rand -base64 32 | tr -dc 'a-zA-Z0-9' | head -c32)

# Save to file
cat > "$CREDENTIALS_FILE" <<EOF
PORTAINER_USERNAME=admin
PORTAINER_PASSWORD=$PORTAINER_PASSWORD
POSTGRES_USERNAME=postgres
POSTGRES_PASSWORD=$POSTGRES_PASSWORD
MINIO_ROOT_USER=stormbpmn
MINIO_ROOT_PASSWORD=$MINIO_ROOT_PASSWORD
JWTSECRET=$JWTSECRET
EOF

### WRITE DOCKER-COMPOSE FILE
log "Writing Docker Compose file..."
cat > "$DOCKER_COMPOSE_FILE" <<EOF

volumes:
  postgres_data:
  minio_data:
  portainer_data:

services:

  portainer:
    image: portainer/portainer-ce:lts
    container_name: portainer
    restart: always
    ports:
      - "9080:9000"
    volumes:
      - portainer_data:/data
      - /var/run/docker.sock:/var/run/docker.sock
      - /etc/timezone:/etc/timezone:ro
      - /etc/localtime:/etc/localtime:ro

  postgres:
    image: postgres:17
    container_name: postgres
    restart: always
    ports:
      - "5432:5432"
    environment:
      POSTGRES_PASSWORD: $POSTGRES_PASSWORD
      TZ: $TIMEZONE
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - /etc/timezone:/etc/timezone:ro
      - /etc/localtime:/etc/localtime:ro
    healthcheck:
      test: ["CMD", "pg_isready", "-U", "postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  minio:
    image: quay.io/minio/minio
    container_name: minio
    restart: always
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      MINIO_ROOT_USER: stormbpmn
      MINIO_ROOT_PASSWORD: $MINIO_ROOT_PASSWORD
    command: server /data --console-address ":9001"
    volumes:
      - minio_data:/data
      - /etc/timezone:/etc/timezone:ro
      - /etc/localtime:/etc/localtime:ro

  plantuml:
    image: plantuml/plantuml-server:jetty
    container_name: plantuml
    restart: always
    volumes:
      - /etc/timezone:/etc/timezone:ro
      - /etc/localtime:/etc/localtime:ro

  gotenberg:
    image: gotenberg/gotenberg:8
    container_name: gotenberg
    restart: always
    volumes:
      - /etc/timezone:/etc/timezone:ro
      - /etc/localtime:/etc/localtime:ro

  stormbpmn:
    image: cr.selcloud.ru/stormbpmn-enterprise/stormbpmn_fullstack_enterprise:$STORMBPMN_VERSION
    container_name: stormbpmn
    restart: always
    depends_on:
      postgres:
        condition: service_healthy
    ports:
      - "8080:8080"
      - "8081:8081"
    environment:
      JDBC_URL: jdbc:postgresql://postgres:5432/stormbpmn
      JDBC_USERNAME: postgres
      JDBC_PASSWORD: $POSTGRES_PASSWORD
      JAVA_OPTS: -Xmx2g -Duser.timezone=$TIMEZONE
      SPRING_PROFILES_ACTIVE: prod
      JWTSECRET: $JWTSECRET
      MINIO_ENDPOINT: http://minio:9000
      MINIO_ACCESSKEY: stormbpmn
      MINIO_SECRETKEY: $MINIO_ROOT_PASSWORD
      MINIO_DEFAULTBUCKET: storm-uploads
      PLANTUML_SERVER: http://plantuml:8080/
      GOTENBERG_URL: http://gotenberg:3000
      EMAIL_PROVIDER: nop
    volumes:
      - /etc/timezone:/etc/timezone:ro
      - /etc/localtime:/etc/localtime:ro

EOF

log "Logging into private registry cr.selcloud.ru..."
echo "$SELECTEL_TOKEN" | docker login cr.selcloud.ru --username token --password-stdin || abort "Failed to login to cr.selcloud.ru registry"

### START SERVICES
log "Starting services..."
docker compose -f "$DOCKER_COMPOSE_FILE" up -d || abort "Failed to start containers"

### CONFIGURE PORTAINER
log "Waiting for Portainer to be ready..."
timeout 30 bash -c 'until curl -sk http://localhost:9080/api/status > /dev/null 2>&1; do sleep 2; done' || abort "Portainer failed to start."

log "Initializing Portainer admin..."
curl -sSfk -X POST http://localhost:9080/api/users/admin/init \
  -H 'Content-Type: application/json' \
  -d "{\"Username\": \"admin\", \"Password\": \"$PORTAINER_PASSWORD\"}" \
  && echo || abort "Failed to initialize Portainer admin"

log "Retrieving Portainer admin JWT..."
PORTAINER_TOKEN=$(curl -sSfk -X POST http://localhost:9080/api/auth \
  -H 'Content-Type: application/json' \
  -d "{\"Username\":\"admin\",\"Password\":\"$PORTAINER_PASSWORD\"}" \
  | jq -r .jwt) || abort "Failed to retrieve Portainer admin JWT"

log "Adding Selectel to Portainer registries..."
curl -sSfk -X POST http://localhost:9080/api/registries \
  -H "Authorization: Bearer $PORTAINER_TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
        "Name": "Selectel",
        "URL": "cr.selcloud.ru",
        "Type": 3,
        "Authentication": true,
        "Username": "'"token"'",
        "Password": "'"$SELECTEL_TOKEN"'"
      }' && echo || abort "Failed to add Selectel to Portainer registries"

### CONFIGURE POSTGRES
log "Waiting for Postgres to be healthy..."
timeout 30 bash -c 'until docker exec postgres pg_isready -U postgres > /dev/null 2>&1; do sleep 2; done' || abort "Postgres did not start in time"

log "Creating 'stormbpmn' database in Postgres..."
docker exec -u postgres postgres psql -tc "SELECT 1 FROM pg_database WHERE datname = 'stormbpmn'" | grep -q 1 \
  || docker exec -u postgres postgres psql -c "CREATE DATABASE stormbpmn" \
  || abort "Failed to create database 'stormbpmn' in Postgres."

### CONFIGURE MINIO
log "Waiting for MinIO to be ready..."
timeout 30 bash -c 'until curl -s http://localhost:9000/minio/health/live > /dev/null 2>&1; do sleep 2; done' || abort "MinIO did not start in time"

log "Setting up MinIO client and creating bucket 'storm-uploads'..."
curl -fO https://dl.min.io/client/mc/release/linux-amd64/mc || abort "Failed to download mc client"
chmod +x mc
mv mc /usr/local/bin/
mc alias set minio http://localhost:9000 stormbpmn "$MINIO_ROOT_PASSWORD" || abort "Failed to configure mc alias"
mc mb minio/storm-uploads || abort "Failed to create bucket storm-uploads"

### CONFIGURE STORMBPMN
log "Waiting for Stormbpmn to start..."
timeout 60 bash -c 'until curl -s http://localhost:8080 > /dev/null 2>&1; do sleep 2; done' || abort "Stormbpmn did not start in time"

echo
log "@@@"
log "Installation completed successfully!"
log "Stormbpmn is up and runnning on http://localhost:8081"
log "All generated credentials have been saved to the file: $CREDENTIALS_FILE"
log "Please make sure to back up this file and keep it in a safe place."
log "@@@"