# Sanctuaire Santé — Portail patient

> Épreuve **RNCP39611 — BC02-FE06 — Industrialisation du déploiement**

---

## 1. Contexte

La clinique **Sanctuaire Santé** lance un portail web de prise de rendez-vous
en ligne à destination de ses patients. L'application a été développée en
interne par une équipe produit. Elle se compose de :

- un **backend** Node.js (Express) exposant une petite API REST,
- un **frontend** React (Vite) consommant cette API,
- une base **PostgreSQL** contenant les médecins et les rendez-vous.

Vous êtes recruté·e en tant qu'**ingénieur·e DevOps** pour industrialiser
le déploiement de cette application sur Azure. Le code applicatif est
**fourni en l'état** : il n'est pas l'objet de l'évaluation et vous n'avez
en principe pas à le modifier.

L'énoncé complet de l'épreuve (cahier des charges, livrables attendus,
barème) est fourni séparément par votre formateur sous forme de sujet PDF.
Ce dépôt est uniquement la base de travail : à vous de le transformer en
chaîne CI/CD complète conforme aux exigences du sujet.

---

## 2. Règlement de l'épreuve

| Élément | Valeur |
| --- | --- |
| Durée | **4 heures** |
| Documentation autorisée | Documentation officielle des outils, votre prise de notes personnelle |
| Documentation interdite | Modèles de réponse rédigés en amont, échanges avec un tiers |
| Assistants IA | **Strictement interdits** (voir section dédiée) |
| Livrables | Dépôt Git public ou accessible au correcteur + dossier technique PDF |
| URL de remise | _Communiquée par le formateur en début d'épreuve_ |

### Usage des assistants IA — interdit

L'utilisation d'assistants IA (ChatGPT, Claude, Gemini, GitHub Copilot,
Cursor, Codeium, Tabnine, ou tout autre outil équivalent) est
**strictement interdite pendant toute la durée de l'épreuve**, y compris
pour :

- générer du code Dockerfile, Terraform, YAML ou shell,
- rédiger des sections du dossier technique,
- traduire ou reformuler vos propres notes,
- expliquer un message d'erreur ou un comportement inattendu,
- suggérer une architecture ou un choix d'outil.

Les éditeurs avec auto-complétion par IA doivent être **désactivés** avant
le début de l'épreuve. Aucune extension Copilot, Cursor ou équivalent ne
doit rester active dans VS Code, JetBrains ou tout autre IDE utilisé.

À la fin de l'épreuve, le correcteur peut vous demander d'expliciter
oralement n'importe quel fichier que vous avez produit. **L'incapacité à
justifier une portion de code que vous avez livrée vaudra présomption
d'usage d'un assistant IA et entraînera la non-validation du bloc.**

---

## 3. Stack technique fournie

### Backend (`backend/`)

- Node.js 20 LTS
- Express 4
- `pg` (driver PostgreSQL)
- Jest + supertest pour les tests
- ESLint pour le lint

Endpoints exposés :

| Méthode | Chemin | Description |
| --- | --- | --- |
| `GET` | `/health` | Healthcheck (pas de dépendance DB) |
| `GET` | `/api/doctors` | Liste des médecins |
| `POST` | `/api/appointments` | Création d'un rendez-vous |

### Frontend (`frontend/`)

- React 18
- Vite 5
- `fetch` natif (pas de bibliothèque HTTP tierce)
- CSS classique (pas de framework UI)

### Base de données (`db/`)

- PostgreSQL 15
- Schéma minimal : `doctors`, `appointments`
- Script d'initialisation idempotent : `db/init.sql`

---

## 4. Lancement en local

### Prérequis

- Node.js 20 ou supérieur
- Docker (pour faire tourner PostgreSQL ; ou installation locale)
- `git`

### Étape 1 — PostgreSQL

Si vous n'avez pas de PostgreSQL local, vous pouvez en lancer un avec Docker :

```bash
docker run --name sanctuaire-pg \
  -e POSTGRES_USER=sanctuaire \
  -e POSTGRES_PASSWORD=sanctuaire \
  -e POSTGRES_DB=sanctuaire \
  -p 5432:5432 \
  -d postgres:15
```

Puis charger le schéma et le seed :

```bash
docker exec -i sanctuaire-pg \
  psql -U sanctuaire -d sanctuaire < db/init.sql
```

### Étape 2 — Backend

```bash
cd backend
cp .env.example .env
npm install
npm test
npm run dev
```

L'API écoute sur `http://localhost:3000`.

Vérification rapide :

```bash
curl http://localhost:3000/health
curl http://localhost:3000/api/doctors
```

### Étape 3 — Frontend

Dans un autre terminal :

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

L'application est accessible sur `http://localhost:5173`. Le proxy Vite
redirige automatiquement `/api/*` et `/health` vers `http://localhost:3000`.

---

## 5. Structure du dépôt

```
.
├── backend/
│   ├── src/
│   │   ├── index.js              # Point d'entrée
│   │   ├── server.js             # Construction de l'app Express
│   │   ├── db.js                 # Pool PostgreSQL (singleton)
│   │   ├── routes/               # Healthcheck, doctors, appointments
│   │   └── validation/           # Validation des payloads
│   ├── tests/                    # Tests Jest (3 fichiers, tous verts)
│   ├── Dockerfile                # Fourni — à optimiser
│   ├── .eslintrc.json
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx               # Layout principal
│   │   ├── components/           # DoctorList, AppointmentForm
│   │   └── api/client.js         # Wrapper fetch
│   ├── index.html
│   ├── vite.config.js
│   ├── .eslintrc.cjs
│   ├── .env.example
│   └── package.json
├── db/
│   └── init.sql                  # Schéma + seed
├── .gitignore
└── README.md
```

---

## 6. Ce que l'on vous fournit / ce que vous devez produire

### Fourni dans ce dépôt

- Code applicatif fonctionnel (backend + frontend + schéma SQL).
- Tests unitaires backend (3 fichiers Jest, tous verts par défaut).
- Configuration ESLint backend et frontend.
- **Un Dockerfile backend** : il fonctionne, mais il est volontairement
  non optimisé. Il vous appartient de l'améliorer (image de base, ordre
  des couches, multi-stage, utilisateur non-root, etc.).

### À produire pendant l'épreuve

- `Dockerfile` frontend (production-ready, multi-stage).
- Optimisation du `Dockerfile` backend fourni.
- `docker-compose.yml` orchestrant front + back + PostgreSQL en local.
- Code Terraform provisionnant Resource Group + ACR + Service Principal
  sur Azure, structuré et commenté.
- Workflows GitHub Actions dans `.github/workflows/` couvrant lint,
  tests, build, scan de sécurité, push vers ACR.
- Déploiement effectif d'au moins un conteneur sur Azure (URL publique).
- Dossier technique PDF couvrant architecture cible, stratégie Git,
  procédure CD complète, matrice des risques de sécurité, plan de
  monitoring et KPIs CI/CD.
- Captures de validation : pipeline CI vert, image poussée sur ACR,
  conteneur accessible publiquement.

### Volontairement non fourni

Les éléments suivants **ne sont pas** dans le dépôt initial. Leur absence
est volontaire — leur création fait partie de l'évaluation.

- `docker-compose.yml`
- `.github/workflows/`
- Code Terraform
- `Dockerfile` du frontend
- Mécanisme de gestion des secrets

---

## 7. Tests fournis

```bash
cd backend
npm test
```

Trois fichiers de tests sont livrés :

- `tests/health.test.js` — vérifie l'endpoint `/health`.
- `tests/doctors.test.js` — vérifie le listing des médecins (pool mocké).
- `tests/appointments.test.js` — vérifie la validation et la création
  d'un rendez-vous (pool mocké).

Aucun de ces tests n'a besoin d'une vraie base PostgreSQL : le pool `pg`
est mocké via `jest.fn()`. Vous pouvez donc les exécuter dans votre
pipeline CI sans démarrer de service base de données.

Les tests sont **tous verts par défaut**. Vous n'avez pas à en écrire de
nouveaux pour valider l'épreuve, mais vous devez les **exécuter dans
votre pipeline CI** comme prévu par le cahier des charges.

---

## 8. Conseil de méthode

L'épreuve dure 4 heures. Le code applicatif est volontairement simple
pour vous laisser concentrer le temps sur l'industrialisation. Évitez de
vous perdre dans la lecture du code Express ou React : il est là pour
servir de support, pas d'objet d'évaluation.

Une suggestion de découpage temporel :

| Phase | Durée indicative |
| --- | --- |
| Lecture du sujet, prise de notes, schéma cible | 30 min |
| Conteneurisation locale (Dockerfiles + compose) | 60 min |
| Terraform (RG + ACR + SP) | 45 min |
| Pipeline GitHub Actions | 60 min |
| Déploiement effectif sur Azure | 30 min |
| Rédaction du dossier technique | 45 min |
| Captures, vérification, soumission | 10 min |

Ce découpage est indicatif. Faites-vous le vôtre en début d'épreuve.

---

