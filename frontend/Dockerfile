# ─────────────────────────────────────────────
# Dockerfile frontend Sanctuaire Sante (non fourni)
# ─────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci --frozen-lockfile

COPY . .

RUN npm run build


FROM nginx:1.27-alpine AS production

# Suppression de la conf par défaut
RUN rm /etc/nginx/conf.d/default.conf

# Build Vite 
COPY --from=builder /app/dist /usr/share/nginx/html

# Config Nginx
COPY nginx.conf /etc/nginx/conf.d/app.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]