# =============================================================================
# Dockerfile frontend Sanctuaire Sante (non fourni)
# =============================================================================

FROM node:20

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 3000

CMD ["node", "src/index.js"]