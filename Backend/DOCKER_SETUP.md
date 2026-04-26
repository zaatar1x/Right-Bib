# 🐳 Docker Setup Guide - NestJS Backend

Complete guide to containerize and run the NestJS backend with MySQL using Docker.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Structure](#project-structure)
3. [Configuration Files](#configuration-files)
4. [Step-by-Step Setup](#step-by-step-setup)
5. [Running the Application](#running-the-application)
6. [API Testing Guide](#api-testing-guide)
7. [Docker Commands Reference](#docker-commands-reference)
8. [Troubleshooting](#troubleshooting)
9. [Production Considerations](#production-considerations)

---

## 🔧 Prerequisites

Before starting, ensure you have installed:

- **Docker** (v20.10 or higher)
- **Docker Compose** (v2.0 or higher)
- **Git** (optional, for cloning)

### Verify Installation

```bash
docker --version
docker-compose --version
```

---

## 📁 Project Structure

```
isids25-26/
├── src/                          # NestJS source code
├── Dockerfile                    # Docker image definition
├── docker-compose.yml            # Multi-container orchestration
├── .dockerignore                 # Files to exclude from Docker build
├── .env                          # Environment variables
├── .env.example                  # Environment template
├── package.json                  # Node.js dependencies
└── DOCKER_SETUP.md              # This file
```

---

## ⚙️ Configuration Files

### 1. **Dockerfile** (Multi-stage Build)

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "dist/main"]
```

**Key Features:**
- ✅ Multi-stage build (smaller final image)
- ✅ Node.js 20 Alpine (lightweight)
- ✅ Production-only dependencies
- ✅ Port 3000 exposed

---

### 2. **docker-compose.yml**

```yaml
version: '3.8'

services:
  db:
    image: mysql:8.0
    container_name: isids26-mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: isids26
    ports:
      - "3308:3306"
    volumes:
      - mysql_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build: .
    container_name: isids26-backend
    restart: always
    ports:
      - "3000:3000"
    environment:
      DB_HOST: db
      DB_PORT: 3306
      DB_USERNAME: root
      DB_PASSWORD: root
      DB_NAME: isids26
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      db:
        condition: service_healthy

volumes:
  mysql_data:
```

**Key Features:**
- ✅ MySQL 8.0 with health checks
- ✅ Automatic database creation
- ✅ Data persistence with volumes
- ✅ Backend waits for DB to be ready
- ✅ Network isolation

---

### 3. **.env** (Environment Variables)

```env
# JWT Configuration
JWT_SECRET=secret123_change_this_in_production

# Database Configuration
DB_HOST=db
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=root
DB_NAME=isids26

# Node Environment
NODE_ENV=production
```

⚠️ **Important:** Never commit `.env` to version control!

---

### 4. **Updated NestJS Configuration**

The `src/app.module.ts` now uses environment variables:

```typescript
TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    type: 'mysql',
    host: configService.get<string>('DB_HOST', 'localhost'),
    port: configService.get<number>('DB_PORT', 3308),
    username: configService.get<string>('DB_USERNAME', 'root'),
    password: configService.get<string>('DB_PASSWORD', ''),
    database: configService.get<string>('DB_NAME', 'isids26'),
    autoLoadEntities: true,
    synchronize: true,
  }),
}),
```

---

## 🚀 Step-by-Step Setup

### Step 1: Clone or Navigate to Project

```bash
cd /path/to/isids25-26
```

### Step 2: Verify Files Exist

```bash
ls -la
# Should see: Dockerfile, docker-compose.yml, .env, package.json
```

### Step 3: Review Environment Variables

```bash
cat .env
# Verify JWT_SECRET and database credentials
```

### Step 4: Build Docker Images

```bash
docker-compose build
```

**Expected Output:**
```
[+] Building 45.2s (18/18) FINISHED
 => [backend internal] load build definition
 => [backend] building...
 => [backend] exporting to image
Successfully built
```

### Step 5: Start All Services

```bash
docker-compose up -d
```

**Expected Output:**
```
[+] Running 3/3
 ✔ Network isids-network       Created
 ✔ Container isids26-mysql      Started
 ✔ Container isids26-backend    Started
```

### Step 6: Verify Containers are Running

```bash
docker-compose ps
```

**Expected Output:**
```
NAME                IMAGE              STATUS         PORTS
isids26-mysql       mysql:8.0          Up (healthy)   0.0.0.0:3308->3306/tcp
isids26-backend     isids25-26-backend Up             0.0.0.0:3000->3000/tcp
```

### Step 7: Check Logs

```bash
# View all logs
docker-compose logs

# View backend logs only
docker-compose logs backend

# Follow logs in real-time
docker-compose logs -f backend
```

**Successful Startup Logs:**
```
isids26-backend  | Nest application successfully started
isids26-backend  | Application is running on: http://[::]:3000
```

---

## 🧪 API Testing Guide

### Base URL

```
http://localhost:3000
```

---

### 1. **Health Check**

```bash
curl http://localhost:3000
```

**Expected Response:**
```
Hello World!
```

---

### 2. **Authentication - Sign Up**

#### Request

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

#### Response

```json
{
  "id": 1,
  "email": "admin@example.com",
  "username": "admin",
  "role": "admin"
}
```

---

### 3. **Authentication - Sign In**

#### Request

```bash
curl -X POST http://localhost:3000/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "identifiant": "admin",
    "password": "Admin123!"
  }'
```

#### Response

```json
{
  "id": 1,
  "email": "admin@example.com",
  "username": "admin",
  "role": "admin",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**💡 Save the `access_token` for authenticated requests!**

---

### 4. **Add Author**

#### Request

```bash
curl -X POST http://localhost:3000/author/add \
  -H "Content-Type: application/json" \
  -d '{
    "prenom": "Victor",
    "nom": "Hugo"
  }'
```

#### Response

```json
{
  "id": 1,
  "prenom": "Victor",
  "nom": "Hugo",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updateAt": "2024-01-15T10:30:00.000Z"
}
```

---

### 5. **Get All Authors**

#### Request

```bash
curl http://localhost:3000/author/all
```

#### Response

```json
[
  {
    "id": 1,
    "prenom": "Victor",
    "nom": "Hugo",
    "listeLivres": [],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updateAt": "2024-01-15T10:30:00.000Z"
  }
]
```

---

### 6. **Add Book (Requires Admin JWT)**

#### Request

```bash
curl -X POST http://localhost:3000/books/new \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "title": "Les Misérables",
    "year": 1862,
    "editor": "A. Lacroix, Verboeckhoven & Cie",
    "image": "https://example.com/les-miserables.jpg",
    "category": "roman",
    "author": 1
  }'
```

#### Response

```json
{
  "data": {
    "id": 1,
    "title": "Les Misérables",
    "year": 1862,
    "editor": "A. Lacroix, Verboeckhoven & Cie",
    "image": "https://example.com/les-miserables.jpg",
    "category": "roman",
    "author": 1,
    "user": 1,
    "createdAt": "2024-01-15T10:35:00.000Z",
    "updateAt": "2024-01-15T10:35:00.000Z"
  }
}
```

---

### 7. **Get All Books**

#### Request

```bash
curl http://localhost:3000/books/all
```

#### Response

```json
{
  "listeBooks": [
    {
      "id": 1,
      "title": "Les Misérables",
      "year": 1862,
      "editor": "A. Lacroix, Verboeckhoven & Cie",
      "image": "https://example.com/les-miserables.jpg",
      "category": "roman",
      "author": 1,
      "user": 1,
      "createdAt": "2024-01-15T10:35:00.000Z",
      "updateAt": "2024-01-15T10:35:00.000Z",
      "deleteAt": null
    }
  ]
}
```

---

### 8. **Get Book By ID (Requires JWT)**

#### Request

```bash
curl http://localhost:3000/books/search/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

#### Response

```json
[
  {
    "id": 1,
    "title": "Les Misérables",
    "year": 1862,
    "editor": "A. Lacroix, Verboeckhoven & Cie",
    "image": "https://example.com/les-miserables.jpg",
    "category": "roman",
    "author": {
      "prenom": "Victor",
      "nom": "Hugo"
    }
  }
]
```

---

### 9. **Add Book to Favorites (Requires JWT)**

#### Request

```bash
curl -X POST http://localhost:3000/favoris/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

#### Response

```json
{
  "message": "Added to favorites"
}
```

---

### 10. **Get User's Favorites (Requires JWT)**

#### Request

```bash
curl http://localhost:3000/favoris \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

#### Response

```json
[
  {
    "id": 1,
    "createdAt": "2024-01-15T10:40:00.000Z",
    "book": {
      "id": 1,
      "title": "Les Misérables",
      "year": 1862,
      "editor": "A. Lacroix, Verboeckhoven & Cie",
      "image": "https://example.com/les-miserables.jpg",
      "category": "roman",
      "author": {
        "id": 1,
        "prenom": "Victor",
        "nom": "Hugo"
      }
    }
  }
]
```

---

### 11. **Get Tasks**

#### Request

```bash
curl http://localhost:3000/tasks/all
```

#### Response

```json
[
  {
    "id": "1",
    "title": "Project 0",
    "statut": "todo",
    "year": 2025,
    "createdAt": "2024-06-06T00:00:00.000Z"
  },
  {
    "id": "2",
    "title": "Project 1",
    "statut": "done",
    "year": 2025,
    "createdAt": "2024-03-03T00:00:00.000Z"
  }
]
```

---

### 12. **Admin Statistics - Total Users (Requires Admin JWT)**

#### Request

```bash
curl http://localhost:3000/auth/stats/total-users \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN_HERE"
```

#### Response

```json
{
  "total": 5
}
```

---

### 13. **Admin Statistics - Books Per Year (Requires Admin JWT)**

#### Request

```bash
curl http://localhost:3000/books/stats \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN_HERE"
```

#### Response

```json
[
  {
    "book_year": 1862,
    "NbBooks": "1"
  },
  {
    "book_year": 2024,
    "NbBooks": "3"
  }
]
```

---

## 📚 Docker Commands Reference

### Container Management

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Restart services
docker-compose restart

# Stop and remove containers + volumes
docker-compose down -v

# Rebuild and start
docker-compose up --build -d
```

### Logs and Debugging

```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs backend
docker-compose logs db

# Follow logs in real-time
docker-compose logs -f

# View last 100 lines
docker-compose logs --tail=100
```

### Container Access

```bash
# Access backend container shell
docker exec -it isids26-backend sh

# Access MySQL container
docker exec -it isids26-mysql mysql -u root -proot isids26

# Run MySQL commands
docker exec -it isids26-mysql mysql -u root -proot -e "SHOW DATABASES;"
```

### Database Operations

```bash
# Check database tables
docker exec -it isids26-mysql mysql -u root -proot isids26 -e "SHOW TABLES;"

# View users table
docker exec -it isids26-mysql mysql -u root -proot isids26 -e "SELECT * FROM user;"

# View books table
docker exec -it isids26-mysql mysql -u root -proot isids26 -e "SELECT * FROM livre;"

# Backup database
docker exec isids26-mysql mysqldump -u root -proot isids26 > backup.sql

# Restore database
docker exec -i isids26-mysql mysql -u root -proot isids26 < backup.sql
```

### System Cleanup

```bash
# Remove stopped containers
docker container prune

# Remove unused images
docker image prune

# Remove unused volumes
docker volume prune

# Remove everything (⚠️ CAUTION)
docker system prune -a --volumes
```

---

## 🔧 Troubleshooting

### Issue 1: Port Already in Use

**Error:**
```
Error starting userland proxy: listen tcp 0.0.0.0:3000: bind: address already in use
```

**Solution:**

```bash
# Find process using port 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill the process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows

# Or change port in docker-compose.yml
ports:
  - "3001:3000"  # Use 3001 instead
```

---

### Issue 2: Database Connection Failed

**Error:**
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

**Solution:**

```bash
# Check if MySQL is healthy
docker-compose ps

# View MySQL logs
docker-compose logs db

# Restart services
docker-compose restart

# If still failing, rebuild
docker-compose down -v
docker-compose up --build -d
```

---

### Issue 3: Backend Container Exits Immediately

**Error:**
```
isids26-backend exited with code 1
```

**Solution:**

```bash
# Check backend logs
docker-compose logs backend

# Common causes:
# 1. Missing environment variables
cat .env

# 2. Build errors
docker-compose build --no-cache

# 3. Database not ready
# Increase wait time in docker-compose.yml:
command: sh -c "sleep 15 && node dist/main"
```

---

### Issue 4: JWT Secret Not Found

**Error:**
```
Error: JWT secret is not defined
```

**Solution:**

```bash
# Verify .env file exists
cat .env

# Ensure JWT_SECRET is set
echo "JWT_SECRET=your_secret_key_here" >> .env

# Restart backend
docker-compose restart backend
```

---

### Issue 5: Cannot Access API from Host

**Error:**
```
curl: (7) Failed to connect to localhost port 3000
```

**Solution:**

```bash
# Check if container is running
docker-compose ps

# Check port mapping
docker port isids26-backend

# Verify firewall settings
# Try using 127.0.0.1 instead of localhost
curl http://127.0.0.1:3000

# Check container logs
docker-compose logs backend
```

---

### Issue 6: MySQL Data Persistence Issues

**Problem:** Data lost after restart

**Solution:**

```bash
# Verify volume exists
docker volume ls | grep mysql_data

# Check volume mount
docker inspect isids26-mysql | grep Mounts -A 10

# If volume is missing, recreate:
docker-compose down
docker volume create mysql_data
docker-compose up -d
```

---

### Issue 7: Build Cache Issues

**Problem:** Changes not reflected after rebuild

**Solution:**

```bash
# Clear build cache
docker-compose build --no-cache

# Remove old images
docker image prune -a

# Full rebuild
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

---

### Issue 8: TypeORM Synchronization Errors

**Error:**
```
QueryFailedError: Table 'isids26.user' doesn't exist
```

**Solution:**

```bash
# Drop and recreate database
docker exec -it isids26-mysql mysql -u root -proot -e "DROP DATABASE IF EXISTS isids26; CREATE DATABASE isids26;"

# Restart backend (will auto-create tables)
docker-compose restart backend

# Verify tables created
docker exec -it isids26-mysql mysql -u root -proot isids26 -e "SHOW TABLES;"
```

---

## 🔒 Production Considerations

### 1. **Environment Variables**

❌ **Don't:**
```env
JWT_SECRET=secret123
DB_PASSWORD=root
```

✅ **Do:**
```env
JWT_SECRET=8f3a9b2c7d1e6f4a5b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0
DB_PASSWORD=Str0ng_P@ssw0rd_H3r3!
```

### 2. **Database Synchronization**

❌ **Don't use in production:**
```typescript
synchronize: true  // Auto-creates/modifies tables
```

✅ **Use migrations instead:**
```typescript
synchronize: false
migrations: ['dist/migrations/*.js']
```

### 3. **CORS Configuration**

Update `src/main.ts`:

```typescript
app.enableCors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
});
```

### 4. **Logging**

Enable production logging:

```typescript
TypeOrmModule.forRootAsync({
  // ...
  logging: process.env.NODE_ENV === 'development',
  logger: 'advanced-console',
}),
```

### 5. **Health Checks**

Add health check endpoint:

```typescript
// src/app.controller.ts
@Get('health')
healthCheck() {
  return { status: 'ok', timestamp: new Date().toISOString() };
}
```

### 6. **Docker Compose Production**

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  db:
    image: mysql:8.0
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
      MYSQL_DATABASE: ${DB_NAME}
    volumes:
      - mysql_data:/var/lib/mysql
    networks:
      - backend-network
    # Don't expose port externally in production

  backend:
    build:
      context: .
      dockerfile: Dockerfile
    restart: always
    ports:
      - "3000:3000"
    environment:
      DB_HOST: db
      DB_PORT: 3306
      DB_USERNAME: ${DB_USERNAME}
      DB_PASSWORD: ${DB_PASSWORD}
      DB_NAME: ${DB_NAME}
      JWT_SECRET: ${JWT_SECRET}
      NODE_ENV: production
    depends_on:
      - db
    networks:
      - backend-network

volumes:
  mysql_data:

networks:
  backend-network:
    driver: bridge
```

### 7. **Security Headers**

Install helmet:

```bash
npm install helmet
```

Update `src/main.ts`:

```typescript
import helmet from 'helmet';

app.use(helmet());
```

### 8. **Rate Limiting**

Install throttler:

```bash
npm install @nestjs/throttler
```

Configure in `app.module.ts`:

```typescript
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    // ...
  ],
})
```

---

## 📊 Monitoring

### Container Stats

```bash
# Real-time resource usage
docker stats

# Specific container
docker stats isids26-backend
```

### Database Monitoring

```bash
# Check database size
docker exec -it isids26-mysql mysql -u root -proot -e "
  SELECT 
    table_schema AS 'Database',
    ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
  FROM information_schema.tables
  WHERE table_schema = 'isids26'
  GROUP BY table_schema;
"

# Check table sizes
docker exec -it isids26-mysql mysql -u root -proot -e "
  SELECT 
    table_name AS 'Table',
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
  FROM information_schema.tables
  WHERE table_schema = 'isids26'
  ORDER BY (data_length + index_length) DESC;
"
```

---

## 🎯 Quick Start Checklist

- [ ] Docker and Docker Compose installed
- [ ] `.env` file created with JWT_SECRET
- [ ] Run `docker-compose build`
- [ ] Run `docker-compose up -d`
- [ ] Verify containers: `docker-compose ps`
- [ ] Check logs: `docker-compose logs -f`
- [ ] Test API: `curl http://localhost:3000`
- [ ] Sign up admin user
- [ ] Sign in and get JWT token
- [ ] Test authenticated endpoints

---

## 📞 Support

For issues or questions:

1. Check logs: `docker-compose logs -f`
2. Review troubleshooting section
3. Verify environment variables
4. Rebuild containers: `docker-compose up --build -d`

---

**Last Updated:** April 26, 2026  
**Docker Version:** 20.10+  
**Docker Compose Version:** 2.0+
