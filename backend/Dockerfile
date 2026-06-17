# =============================================================================
# Dockerfile backend Sanctuaire Sante (etat initial fourni)
# =============================================================================
# Ce Dockerfile est volontairement minimaliste et non optimise.
# Il fonctionne, mais il presente plusieurs defauts qu'il vous appartient
# d'identifier et de corriger dans le cadre de l'epreuve.
# =============================================================================

FROM node:20

WORKDIR /app

# On copie tout le contexte avant d'installer les dependances.
COPY . .

# On installe l'ensemble des dependances (production + dev).
RUN npm install

EXPOSE 3000

CMD ["node", "src/index.js"]
