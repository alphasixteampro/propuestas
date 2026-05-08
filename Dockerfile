# ── Etapa 1: Build ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar dependencias primero (caching layer)
COPY package.json package-lock.json* ./
RUN npm ci --frozen-lockfile 2>/dev/null || npm install

# Copiar fuentes y construir
COPY . .
RUN npm run build

# ── Etapa 2: Serve con nginx ─────────────────────────────────────────────────
FROM nginx:alpine AS runner

# apache2-utils provee htpasswd para generar .htpasswd en el entrypoint
RUN apk add --no-cache apache2-utils

# Remover config por defecto
RUN rm -rf /usr/share/nginx/html/* && rm /etc/nginx/conf.d/default.conf

# Copiar build, config y entrypoint
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/entrypoint.sh"]
