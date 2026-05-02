# Maktaba - Library Management System

A full-stack application with NestJS backend and Vue.js frontend, fully containerized with Docker.

---

## 🚀 Quick Start

### Docker (Recommended) 🐳

Run the entire stack (Frontend + Backend + Database) with one command:

```bash
docker-compose up -d --build
```

**Access Points:**
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **phpMyAdmin**: http://localhost:8080
- **MySQL**: localhost:3308

**Stop all services:**
```bash
docker-compose down
```

---

### Local Development (Without Docker)

#### Frontend

1. Navigate to the Frontend directory
   ```bash
   cd Frontend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Configure environment variables
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Start the development server
   ```bash
   npm run dev
   ```

The frontend will be available at http://localhost:5173

#### Backend

The backend is built with **NestJS** and includes:
- ✅ JWT Authentication system
- ✅ Books and Authors management
- ✅ Favorites system
- ✅ Tasks management
- ✅ Role-based access control (User/Admin)

#### Setup

1. Navigate to the Backend directory
   ```bash
   cd Backend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Configure environment variables
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Start the development server
   ```bash
   npm run start:dev
   ```

The backend will be available at http://localhost:3000

---

## 🧪 API Testing

Use the **Bruno collection** in `Backend/libratest/` for API testing.

---

## 🛠 Technology Stack

| Component | Technology |
|-----------|------------|
| Frontend Framework | Vue.js 3.4 |
| Backend Framework | NestJS 10.0 |
| Language | TypeScript 5.1+ |
| Database | MySQL 8.4 |
| ORM | TypeORM 0.3 |
| Authentication | JWT + Bcrypt |
| Containerization | Docker + Docker Compose |

---

## 📊 Project Statistics

- **27 API Endpoints** across 5 modules
- **4 Database Tables** with relationships
- **2 Security Guards** (JWT + Admin)
- **4 Docker Services** (Frontend, Backend, Database, phpMyAdmin)

---

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild and restart
docker-compose up -d --build

# Check status
docker-compose ps
```