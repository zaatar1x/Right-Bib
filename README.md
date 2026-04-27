# Vue.js Project

A full-stack application with NestJS backend and Vue.js frontend.

---

## 📚 Documentation

**Complete backend documentation is available in the [`docs/`](./docs/) folder:**

- **[Backend Architecture](./docs/BACKEND_ARCHITECTURE.md)** - Complete system overview, modules, and technical details
- **[API Endpoints Reference](./docs/API_ENDPOINTS_REFERENCE.md)** - All endpoints with request/response examples
- **[Database Schema](./docs/DATABASE_SCHEMA.md)** - Database structure, relationships, and queries
- **[Documentation Index](./docs/README.md)** - Quick start guide and overview

---

## 🚀 Quick Start

### Backend

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

#### Docker (Recommended)

Run with Docker Compose:
```bash
cd Backend
docker-compose up -d
```

**Access Points:**
- Backend API: http://localhost:3000
- phpMyAdmin: http://localhost:8080
- MySQL: localhost:3308

---

## 🧪 API Testing

Use the **Bruno collection** in `Backend/libratest/` for API testing.

Or refer to the [API Endpoints Reference](./docs/API_ENDPOINTS_REFERENCE.md) for cURL examples.

---

## 🛠 Technology Stack

| Component | Technology |
|-----------|------------|
| Backend Framework | NestJS 10.0 |
| Language | TypeScript 5.1 |
| Database | MySQL 8.0 |
| ORM | TypeORM 0.3 |
| Authentication | JWT + Bcrypt |
| Containerization | Docker |

---

## 📊 Project Statistics

- **27 API Endpoints** across 5 modules
- **4 Database Tables** with relationships
- **2 Security Guards** (JWT + Admin)
- **Docker-ready** with 3 services

---

For detailed information, see the [complete documentation](./docs/).