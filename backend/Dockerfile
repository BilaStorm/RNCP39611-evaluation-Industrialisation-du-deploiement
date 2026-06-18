# =============================================================================
# Dockerfile backend — Sanctuaire Santé
# Multi-stage : deps → production
# =============================================================================

# ── Stage 1 : installation des dépendances ───────────────────────────────────
FROM node:20-alpine AS deps          # FIX : "AS deps" manquait → COPY --from=deps crashait

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci --omit=dev --frozen-lockfile

# ── Stage 2 : image de production ────────────────────────────────────────────
FROM node:20-alpine AS production

ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /app

# Utilisateur non-root (bonne pratique sécu)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copie des node_modules depuis le stage deps
COPY --from=deps /app/node_modules ./node_modules

COPY src/ ./src/
COPY package.json ./

RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["node", "src/index.js"]
