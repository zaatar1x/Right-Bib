# 📚 Libra - Library Management System

> Application web de gestion de bibliothèque — livres, auteurs et favoris.

---

## ✦ Features

- 🔐 **Authentification** - Inscription / connexion avec JWT
- 📚 **Gestion des livres** - Ajout, modification, suppression (soft delete)
- ✍️ **Gestion des auteurs** - CRUD complet
- ♡ **Système de favoris** - Par utilisateur avec statistiques
- 📊 **Dashboard admin** - Total utilisateurs, favoris, livres les plus aimés
- 🛡️ **Sécurité** - Guards NestJS, bcrypt, role-based access control
- 🐳 **Docker Ready** - Containerisation complète avec Docker Compose

---

## 🛠️ Stack Technique

| Côté | Technologie |
|------|-------------|
| Frontend | Vue 3, Pinia, Vue Router, Axios |
| Backend | NestJS 10, TypeORM, Passport JWT, Bcrypt |
| Base de données | MySQL 8.0 |
| Containerisation | Docker, Docker Compose |
| Validation | class-validator, class-transformer |

---

## 🚀 Quick Start avec Docker (Recommandé)

### Prérequis

- Docker (v20.10+)
- Docker Compose (v2.0+)

### Démarrage en 3 commandes

```bash
# 1. Build les images
docker-compose build

# 2. Démarrer tous les services
docker-compose up -d

# 3. Tester l'API
curl http://localhost:3000
```

**✅ C'est tout! Le backend et MySQL sont maintenant en cours d'exécution.**

### Services disponibles

- **API Backend:** http://localhost:3000
- **MySQL Database:** localhost:3308
  - Username: `root`
  - Password: `root`
  - Database: `isids26`

### Documentation Docker complète

- 📖 **Guide rapide:** [DOCKER_QUICKSTART.md](DOCKER_QUICKSTART.md)
- 📚 **Documentation complète:** [DOCKER_SETUP.md](DOCKER_SETUP.md)
- 🧪 **Script de test:** `bash test-api.sh`

---

## 🔧 Installation Manuelle (Sans Docker)

### Prérequis

- Node.js >= 18
- npm >= 9
- MySQL 8.0 en cours d'exécution

### Backend (NestJS)

```bash
# Installer les dépendances
npm install

# Créer le fichier .env
cp .env.example .env
```

Configurer le fichier `.env` :

```env
# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key

# Database Configuration
DB_HOST=localhost
DB_PORT=3308
DB_USERNAME=root
DB_PASSWORD=
DB_NAME=isids26

# Node Environment
NODE_ENV=development
```

Créer la base de données MySQL :

```sql
CREATE DATABASE isids26;
```

Lancer le serveur :

```bash
# Mode développement
npm run start:dev

# Mode production
npm run build
npm run start:prod
```

> Le backend tourne sur **http://localhost:3000**

---

## 📖 Documentation

| Document | Description |
|----------|-------------|
| [BACKEND_DOCUMENTATION.md](BACKEND_DOCUMENTATION.md) | Documentation complète de l'API (40+ endpoints) |
| [DOCKER_QUICKSTART.md](DOCKER_QUICKSTART.md) | Guide rapide Docker (5 minutes) |
| [DOCKER_SETUP.md](DOCKER_SETUP.md) | Documentation Docker complète avec troubleshooting |

---

## 🧪 Test de l'API

### 1. Inscription

```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "username": "admin",
    "password": "Admin123!",
    "role": "admin"
  }'
```

### 2. Connexion

```bash
curl -X POST http://localhost:3000/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "identifiant": "admin",
    "password": "Admin123!"
  }'
```

**💡 Sauvegardez le `access_token` retourné!**

### 3. Ajouter un auteur

```bash
curl -X POST http://localhost:3000/author/add \
  -H "Content-Type: application/json" \
  -d '{
    "prenom": "Victor",
    "nom": "Hugo"
  }'
```

### 4. Ajouter un livre (Admin uniquement)

```bash
curl -X POST http://localhost:3000/books/new \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Les Misérables",
    "year": 1862,
    "editor": "A. Lacroix",
    "image": "https://example.com/cover.jpg",
    "category": "roman",
    "author": 1
  }'
```

### 5. Récupérer tous les livres

```bash
curl http://localhost:3000/books/all
```

**📚 Plus d'exemples dans [DOCKER_QUICKSTART.md](DOCKER_QUICKSTART.md)**

---

## 🐳 Commandes Docker Essentielles

```bash
# Démarrer les services
docker-compose up -d

# Arrêter les services
docker-compose down

# Voir les logs
docker-compose logs -f

# Redémarrer
docker-compose restart

# Rebuild complet
docker-compose up --build -d

# Accéder à MySQL
docker exec -it isids26-mysql mysql -u root -proot isids26

# Voir les tables
docker exec -it isids26-mysql mysql -u root -proot isids26 -e "SHOW TABLES;"
```

---

## 📊 Architecture de la Base de Données

### Entités

- **User** - Utilisateurs avec rôles (user/admin)
- **Book** - Livres avec soft delete
- **Author** - Auteurs
- **Favoris** - Table de liaison user-book

### Relations

```
User (1) ──────── (N) Book
User (1) ──────── (N) Favoris
Author (1) ────── (N) Book
Book (1) ──────── (N) Favoris
```

**📖 Schéma complet dans [BACKEND_DOCUMENTATION.md](BACKEND_DOCUMENTATION.md)**

---

## 🔐 Sécurité

- ✅ Mots de passe hashés avec bcrypt + salt
- ✅ JWT avec expiration (1 semaine)
- ✅ Guards pour routes protégées
- ✅ Validation des DTOs avec class-validator
- ✅ CORS configuré
- ✅ Role-based access control (USER/ADMIN)

---

## 📁 Structure du Projet

```
isids25-26/
├── src/
│   ├── auth/              # Module d'authentification
│   ├── books/             # Module livres & auteurs
│   ├── tasks/             # Module tâches (in-memory)
│   ├── guards/            # JWT & Admin guards
│   ├── middlewares/       # Middlewares custom
│   └── main.ts            # Point d'entrée
├── Dockerfile             # Image Docker
├── docker-compose.yml     # Orchestration
├── .env                   # Variables d'environnement
├── package.json           # Dépendances
└── README.md              # Ce fichier
```

---

## 🧪 Scripts NPM

```bash
# Développement
npm run start:dev          # Mode watch

# Production
npm run build              # Build
npm run start:prod         # Démarrer en prod

# Tests
npm run test               # Tests unitaires
npm run test:e2e           # Tests e2e
npm run test:cov           # Coverage

# Qualité du code
npm run lint               # ESLint
npm run format             # Prettier
```

---

## 🌐 Endpoints Principaux

### Authentification
- `POST /auth/signup` - Inscription
- `POST /auth/signin` - Connexion
- `GET /auth/stats/total-users` - Stats utilisateurs (Admin)

### Livres
- `GET /books/all` - Liste des livres
- `POST /books/new` - Ajouter un livre (Admin)
- `GET /books/search/:id` - Détails d'un livre
- `PUT /books/edit/:id` - Modifier un livre
- `DELETE /books/softdelete/:id` - Suppression soft
- `GET /books/stats` - Statistiques (Admin)

### Auteurs
- `GET /author/all` - Liste des auteurs
- `POST /author/add` - Ajouter un auteur

### Favoris
- `POST /favoris/:bookId` - Ajouter aux favoris
- `DELETE /favoris/:bookId` - Retirer des favoris
- `GET /favoris` - Mes favoris
- `GET /favoris/stats/total` - Total favoris (Admin)
- `GET /favoris/stats/most-favourited` - Top livres (Admin)

**📚 40+ endpoints documentés dans [BACKEND_DOCUMENTATION.md](BACKEND_DOCUMENTATION.md)**

---

## 🐛 Dépannage

### Port déjà utilisé

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Ou changer le port dans docker-compose.yml
```

### Base de données non accessible

```bash
# Vérifier le statut
docker-compose ps

# Voir les logs
docker-compose logs db

# Redémarrer
docker-compose restart
```

### Rebuild complet

```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

**📖 Plus de solutions dans [DOCKER_SETUP.md](DOCKER_SETUP.md#troubleshooting)**

---

## 🎯 Catégories de Livres

- `roman` - Roman
- `science` - Science
- `histoire` - Histoire
- `informatique` - Informatique
- `art` - Art
- `philosophie` - Philosophie
- `autre` - Autre

---

## 🔄 Workflow de Développement

1. **Développement local:** `npm run start:dev`
2. **Tests:** `npm run test`
3. **Build:** `npm run build`
4. **Docker:** `docker-compose up --build -d`
5. **Tests API:** `bash test-api.sh`
6. **Production:** Déployer avec Docker Compose

---

## 📦 Technologies Clés

- **NestJS 10** - Framework backend progressif
- **TypeORM 0.3** - ORM pour TypeScript
- **Passport JWT** - Stratégie d'authentification
- **class-validator** - Validation des DTOs
- **bcrypt** - Hachage des mots de passe
- **MySQL 8.0** - Base de données relationnelle
- **Docker** - Containerisation

---

## 🚀 Déploiement

### Avec Docker (Recommandé)

```bash
# Production
docker-compose -f docker-compose.yml up -d

# Avec variables d'environnement
JWT_SECRET=your_prod_secret docker-compose up -d
```

### Sans Docker

```bash
npm run build
NODE_ENV=production node dist/main
```

**⚠️ En production:**
- Changez `JWT_SECRET`
- Utilisez des mots de passe forts
- Désactivez `synchronize: true` dans TypeORM
- Configurez CORS correctement
- Utilisez HTTPS

---

## 📝 Frontend (Vue 3)

```bash
cd Vuejs
npm install
npm run dev
```

> Le frontend tourne sur **http://localhost:5173**

---

## 👥 Contributeurs

> Projet réalisé dans le cadre de la matiere nouvelles tech web
