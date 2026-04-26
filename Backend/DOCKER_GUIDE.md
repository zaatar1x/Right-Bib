# 🐳 Docker Deployment Guide - NestJS Backend

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Project Structure](#project-structure)
3. [Configuration Files](#configuration-files)
4. [Build and Run](#build-and-run)
5. [API Testing](#api-testing)
6. [Troubleshooting](#troubleshooting)
7. [Useful Commands](#useful-commands)

---

## Prerequisites

Before starting, ensure you have installed:

- **Docker** (v20.10+): [Install Docker](https://docs.docker.com/get-docker/)
- **Docker Compose** (v2.0+): Usually included with Docker Desktop
- **Git** (optional): For cloning the repository

Verify installations:
```bash
docker --version
docker-compose --version
```

---

## Project Structure

```
project-root/
├── src/                    # NestJS source code
├── Dockerfile              # Docker image definition
├── docker-compose.yml      # Multi-container orchestration
├── .dockerignore          # Files to exclude from Docker build
├── .env                   # Environment variables
├── package.json           # Node.js dependencies
└── DOCKER_GUIDE.md        # This file
```

---

## Configuration Files

### 1. **Dockerfile** (Multi-stage Build)

```dockerfile
# Build stage - compiles TypeScript
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage - runs compiled JavaScript
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "dist/main"]
```

**Benefits:**
- ✅ Smaller final image size
- ✅ Only production dependencies included
- ✅ Faster deployment

---

### 2. **docker-compose.yml** (Service Orchestration)

Defines two services:

#### **Service 1: MySQL Database**
- Image: `mysql:8`
- Port: `3308:3306` (host:container)
- Auto-creates database: `isids26`
- Persistent storage via Docker volume

#### **Service 2: NestJS Backend**
- Built from Dockerfile
- Port: `3000:3000`
- Waits for MySQL to be healthy before starting
- Uses environment variables for configuration

---

### 3. **.env** (Environment Variables)

```env
JWT_SECRET=your_super_secret_jwt_key_change_in_production
DB_HOST=db
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=root
DB_NAME=isids26
PORT=3000
```

**⚠️ Security Note:** Never commit `.env` with real secrets to Git!

---

## Build and Run

### Step 1: Start the Application

```bash
# Build images and start containers
docker-compose up --build
```

**What happens:**
1. Downloads MySQL 8 image (if not cached)
2. Builds NestJS backend image
3. Creates network for service communication
4. Starts MySQL container
5. Waits for MySQL health check
6. Starts backend container
7. Backend connects to MySQL

**Expected Output:**
```
✓ Network isids25-26_app-network    Created
✓ Volume "isids25-26_mysql_data"    Created
✓ Container isids26-mysql           Started
✓ Container isids26-backend         Started
```

---

### Step 2: Run in Detached Mode (Background)

```bash
# Start containers in background
docker-compose up -d

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend
docker-compose logs -f db
```

---

### Step 3: Verify Services are Running

```bash
# Check container status
docker-compose ps
```

**Expected Output:**
```
NAME                IMAGE              STATUS         PORTS
isids26-backend     isids25-26-backend Up 2 minutes   0.0.0.0:3000->3000/tcp
isids26-mysql       mysql:8            Up 2 minutes   0.0.0.0:3308->3306/tcp
```

---

### Step 4: Test Backend Health

```bash
# Test if backend is responding
curl http://localhost:3000
```

---

## API Testing

### 1. **Sign Up (Create User)**

```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "username": "admin",
    "password": "admin123",
    "role": "admin"
  }'
```

**Expected Response:**
```json
{
  "id": 1,
  "email": "admin@example.com",
  "username": "admin",
  "role": "admin"
}
```

---

### 2. **Sign In (Get JWT Token)**

```bash
curl -X POST http://localhost:3000/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "identifiant": "admin",
    "password": "admin123"
  }'
```

**Expected Response:**
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

### 3. **Get All Books (Public)**

```bash
curl http://localhost:3000/books/all
```

**Expected Response:**
```json
{
  "listeBooks": []
}
```

---

### 4. **Add Author (Public)**

```bash
curl -X POST http://localhost:3000/author/add \
  -H "Content-Type: application/json" \
  -d '{
    "prenom": "Victor",
    "nom": "Hugo"
  }'
```

**Expected Response:**
```json
{
  "id": 1,
  "prenom": "Victor",
  "nom": "Hugo",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updateAt": "2024-01-01T00:00:00.000Z"
}
```

---

### 5. **Add Book (Requires Admin JWT)**

```bash
# Replace YOUR_JWT_TOKEN with actual token from sign-in
curl -X POST http://localhost:3000/books/new \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Les Misérables",
    "year": 1862,
    "editor": "A. Lacroix",
    "image": "https://example.com/les-miserables.jpg",
    "category": "roman",
    "author": 1
  }'
```

**Expected Response:**
```json
{
  "data": {
    "id": 1,
    "title": "Les Misérables",
    "year": 1862,
    "editor": "A. Lacroix",
    "image": "https://example.com/les-miserables.jpg",
    "category": "roman",
    "author": 1,
    "user": 1
  }
}
```

---

### 6. **Add to Favorites (Requires JWT)**

```bash
curl -X POST http://localhost:3000/favoris/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected Response:**
```json
{
  "message": "Added to favorites"
}
```

---

### 7. **Get User's Favorites (Requires JWT)**

```bash
curl http://localhost:3000/favoris \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### 8. **Get Books Statistics (Admin Only)**

```bash
curl http://localhost:3000/books/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### 9. **Get All Tasks**

```bash
curl http://localhost:3000/tasks/all
```

---

## Troubleshooting

### Issue 1: Port Already in Use

**Error:**
```
Error: bind: address already in use
```

**Solution:**
```bash
# Check what's using port 3000
netstat -ano | findstr :3000

# Stop the process or change port in docker-compose.yml
ports:
  - "3001:3000"  # Use port 3001 instead
```

---

### Issue 2: Database Connection Failed

**Error:**
```
Error: connect ECONNREFUSED db:3306
```

**Solutions:**

1. **Wait for MySQL to be ready:**
```bash
# Check MySQL logs
docker-compose logs db

# Wait for: "ready for connections"
```

2. **Restart backend after MySQL is ready:**
```bash
docker-compose restart backend
```

3. **Check environment variables:**
```bash
docker-compose exec backend env | grep DB_
```

---

### Issue 3: Container Exits Immediately

**Check logs:**
```bash
docker-compose logs backend
```

**Common causes:**
- Missing dependencies: `npm ci` failed
- Build errors: Check TypeScript compilation
- Missing environment variables

**Solution:**
```bash
# Rebuild from scratch
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

---

### Issue 4: MySQL Authentication Error

**Error:**
```
ER_NOT_SUPPORTED_AUTH_MODE: Client does not support authentication protocol
```

**Solution:**
Add to `docker-compose.yml` under `db` service:
```yaml
command: --default-authentication-plugin=mysql_native_password
```

---

### Issue 5: Changes Not Reflected

**Problem:** Code changes don't appear in container

**Solution:**
```bash
# Rebuild the image
docker-compose up --build

# Or force rebuild
docker-compose build --no-cache backend
docker-compose up
```

---

### Issue 6: Permission Denied (Linux/Mac)

**Error:**
```
EACCES: permission denied
```

**Solution:**
```bash
# Fix file permissions
sudo chown -R $USER:$USER .

# Or run with sudo
sudo docker-compose up
```

---

## Useful Commands

### Container Management

```bash
# Start services
docker-compose up

# Start in background
docker-compose up -d

# Stop services
docker-compose down

# Stop and remove volumes (⚠️ deletes database data)
docker-compose down -v

# Restart specific service
docker-compose restart backend

# View running containers
docker-compose ps

# View all containers (including stopped)
docker ps -a
```

---

### Logs and Debugging

```bash
# View all logs
docker-compose logs

# Follow logs in real-time
docker-compose logs -f

# View last 100 lines
docker-compose logs --tail=100

# Logs for specific service
docker-compose logs backend
docker-compose logs db

# Execute command in running container
docker-compose exec backend sh
docker-compose exec db mysql -uroot -proot isids26
```

---

### Database Operations

```bash
# Access MySQL CLI
docker-compose exec db mysql -uroot -proot isids26

# Backup database
docker-compose exec db mysqldump -uroot -proot isids26 > backup.sql

# Restore database
docker-compose exec -T db mysql -uroot -proot isids26 < backup.sql

# View database tables
docker-compose exec db mysql -uroot -proot -e "USE isids26; SHOW TABLES;"
```

---

### Image Management

```bash
# List images
docker images

# Remove unused images
docker image prune

# Remove specific image
docker rmi isids25-26-backend

# Rebuild without cache
docker-compose build --no-cache
```

---

### Network Inspection

```bash
# List networks
docker network ls

# Inspect network
docker network inspect isids25-26_app-network

# Test connectivity between containers
docker-compose exec backend ping db
```

---

### Volume Management

```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect isids25-26_mysql_data

# Remove unused volumes
docker volume prune

# Remove specific volume (⚠️ deletes data)
docker volume rm isids25-26_mysql_data
```

---

## Production Deployment Checklist

Before deploying to production:

- [ ] Change `JWT_SECRET` to a strong random value
- [ ] Set `synchronize: false` in TypeORM config
- [ ] Use database migrations instead of auto-sync
- [ ] Change MySQL root password
- [ ] Enable HTTPS/SSL
- [ ] Configure proper CORS origins
- [ ] Set up database backups
- [ ] Use Docker secrets for sensitive data
- [ ] Implement rate limiting
- [ ] Set up monitoring and logging
- [ ] Use environment-specific `.env` files
- [ ] Enable Docker health checks
- [ ] Configure restart policies

---

## Environment Variables Reference

| Variable      | Description                | Default     | Required |
|---------------|----------------------------|-------------|----------|
| DB_HOST       | Database host              | localhost   | Yes      |
| DB_PORT       | Database port              | 3308        | Yes      |
| DB_USERNAME   | Database username          | root        | Yes      |
| DB_PASSWORD   | Database password          | (empty)     | Yes      |
| DB_NAME       | Database name              | isids26     | Yes      |
| JWT_SECRET    | JWT signing secret         | -           | Yes      |
| PORT          | Application port           | 3000        | No       |
| NODE_ENV      | Node environment           | production  | No       |

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Docker Host                          │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │           Docker Network (app-network)           │  │
│  │                                                  │  │
│  │  ┌─────────────────┐      ┌─────────────────┐  │  │
│  │  │  NestJS Backend │      │  MySQL Database │  │  │
│  │  │  (Port 3000)    │◄────►│  (Port 3306)    │  │  │
│  │  │                 │      │                 │  │  │
│  │  │  - Auth API     │      │  - isids26 DB   │  │  │
│  │  │  - Books API    │      │  - Persistent   │  │  │
│  │  │  - Authors API  │      │    Volume       │  │  │
│  │  │  - Favoris API  │      │                 │  │  │
│  │  └────────┬────────┘      └─────────────────┘  │  │
│  │           │                                     │  │
│  └───────────┼─────────────────────────────────────┘  │
│              │                                         │
└──────────────┼─────────────────────────────────────────┘
               │
               ▼
        Host Port 3000
     (http://localhost:3000)
```

---

## Quick Start Summary

```bash
# 1. Clone repository (if needed)
git clone <repository-url>
cd <project-directory>

# 2. Create .env file (already created)
# Edit JWT_SECRET if needed

# 3. Build and start
docker-compose up --build

# 4. Test API
curl http://localhost:3000/books/all

# 5. Stop services
docker-compose down
```

---

## Support

For issues or questions:
1. Check logs: `docker-compose logs`
2. Review troubleshooting section
3. Verify environment variables
4. Ensure ports are not in use
5. Check Docker and Docker Compose versions

---

**Last Updated:** April 26, 2026  
**Docker Version:** 20.10+  
**Docker Compose Version:** 2.0+
