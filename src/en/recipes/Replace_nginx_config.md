---
source_hash: 129cf0e9c24570b5
---
# Replacing the internal nginx configuration {#замена-конфига-внутреннего-nginx}

In some situations (rootless startup mode), it may be necessary to change the default nginx configuration that is included inside our container.

## Built-in configuration {#встроенныи-конфиг}

Here is the content of the built-in configuration:

```nginx
worker_processes  1;
worker_rlimit_nofile 40960;

events {
    worker_connections 4096;
}

http {
   include       mime.types;
   sendfile        on;
   keepalive_timeout  65;
   log_format combined_xff '$remote_addr - $remote_user [$time_local] '
                            '"$request" $status $body_bytes_sent '
                            '"$http_referer" "$http_user_agent" "$http_x_forwarded_for"';

   # Лимиты и буферы
   large_client_header_buffers 4 16k;
   client_header_buffer_size 16k;
   proxy_buffer_size 16k;
   proxy_buffers 4 32k;
   proxy_busy_buffers_size 64k;

   client_max_body_size 100M;

   # TCP оптимизации
   tcp_nopush on;
   tcp_nodelay on;
   reset_timedout_connection on;
   client_body_timeout 10;
   send_timeout 2;

   # MIME и прочее
   types_hash_max_size 2048;
   default_type application/octet-stream;


    # OLD_FRONTEND (порт 8080)
    server {
        listen 8080;
        server_name localhost;
        gzip on;
        gzip_proxied any;
        gzip_static on;
        gzip_types text/plain text/css application/json application/x-javascript text/xml application/xml application/xml+rss text/javascript;
        gzip_vary on;
        gzip_comp_level 6;
        gzip_buffers 16 8k;
        gzip_http_version 1.1;


        location / {
            add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
            add_header Pragma public;
            add_header Cache-Control "no-cache";
            add_header X-Content-Type-Options nosniff;

            root /usr/share/nginx/old_frontend;
            index index.html;
            try_files $uri /index.html;
        }

        # ПРОКСИРОВАНИЕ API-ЗАПРОСОВ НА БЭКЕНД
        location /api/ {
            proxy_pass http://localhost:8082;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_hide_header 'Cache-Control';
            proxy_hide_header 'Pragma';
            add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
            add_header X-Content-Type-Options nosniff;
        }

        location /public-api/ {
            proxy_pass http://localhost:8082;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }

    # FRONTEND (порт 8081)
    server {
        listen 8081;
        server_name localhost;
        gzip on;
        gzip_proxied any;
        gzip_static on;
        gzip_types text/plain text/css application/json application/x-javascript text/xml application/xml application/xml+rss text/javascript;
        gzip_vary on;
        gzip_comp_level 6;
        gzip_buffers 16 8k;
        gzip_http_version 1.1;

        location / {
            add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
            add_header Pragma public;
            add_header Cache-Control "no-cache";
            add_header X-Content-Type-Options nosniff;
            root /usr/share/nginx/frontend;
            index index.html;
            try_files $uri /index.html;
        }

        # ПРОКСИРОВАНИЕ API-ЗАПРОСОВ НА БЭКЕНД
        location /api/ {
            proxy_pass http://localhost:8082;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_hide_header 'Cache-Control';
            proxy_hide_header 'Pragma';
            add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
            add_header X-Content-Type-Options nosniff;
        }

        location /public-api/ {
            proxy_pass http://localhost:8082;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

## How to override the configuration {#как-подложить-свои-конфиг}

Make sure your configuration exactly includes the configuration above (otherwise it may not work).

Mount the new configuration using the command:

```bash
docker run \
  -v /path/to/your/nginx.conf:/etc/nginx/nginx.conf:ro \
  -p 8080:8080 \
  your-storm-image
```

### Important points: {#важные-моменты}

-   **Make sure to keep both servers** (ports 8080 and 8081)
-   **Do not remove the proxying** `/api/` and `/public-api/` to `localhost:8082`
-   **Keep all security headers** (Strict-Transport-Security, X-Content-Type-Options)
-   **Verify the correctness of the paths** to the frontend static files
