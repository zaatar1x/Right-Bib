# 🚀 Docker Quick Start Guide

Get your NestJS backend running in Docker in 5 minutes!

---

## ⚡ Quick Start (3 Commands)

```bash
# 1. Build the containers
docker-compose build

# 2. Start everything
docker-compose up -d

# 3. Test the API
curl http://localhost:3000
```

**Expected Response:** `Hello World!`

---

## 📋 Prerequisites

- Docker (v20.10+)
- Docker Compose (v2.0+)

**Verify Installation:**
```bash
docker --version
docker-compose --version
```

---

## 🎯 Step-by-Step Setup

### Step 1: Verify Files

Ensure these files exist in your project:
- ✅ `Dockerfile`
- ✅ `docker-compose.yml`
- ✅ `.env`
- ✅ `package.json`

### Step 2: Build Docker Images

```bash
docker-compose build
```

**What happens:**
- Downloads Node.js 20 Alpine image
- Installs npm dependencies
- Builds NestJS application
- Creates production-ready image

**Time:** ~2-3 minutes (first time)

### Step 3: Start Services

```bash
docker-compose up -d
```

**What starts:**
- MySQL 8.0 database (port 3308)
- NestJS backend (port 3000)

**Time:** ~10-15 seconds

### Step 4: Verify Everything Works

```bash
# Check container status
docker-compose ps

# Expected output:
# NAME                STATUS         PORTS
# isids26-mysql       Up (healthy)   0.0.0.0:3308->3306/tcp
# isids26-backend     Up             0.0.0.0:3000->3000/tcp
```

### Step 5: Test the API

```bash
curl http://localhost:3000
```

**Expected:** `Hello World!`

---

## 🧪 Complete API Test Flow

### 1. Sign Up (Create Admin User)

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

**Response:**
```json
{
  "id": 1,
  "email": "admin@example.com",
  "username": "admin",
  "role": "admin"
}
```

---

### 2. Sign In (Get JWT Token)

```bash
curl -X POST http://localhost:3000/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "identifiant": "admin",
    "password": "Admin123!"
  }'
```

**Response:**
```json
{
  "id": 1,
  "email": "admin@example.com",
  "username": "admin",
  "role": "admin",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**💡 Save the `access_token` - you'll need it for authenticated requests!**

---

### 3. Add an Author

```bash
curl -X POST http://localhost:3000/author/add \
  -H "Content-Type: application/json" \
  -d '{
    "prenom": "Victor",
    "nom": "Hugo"
  }'
```

**Response:**
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

### 4. Add a Book (Requires Admin Token)

```bash
# Replace YOUR_JWT_TOKEN with the token from step 2
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

**Response:**
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

### 5. Get All Books

```bash
curl http://localhost:3000/books/all
```

**Response:**
```json
{
  "listeBooks": [
    {
      "id": 1,
      "title": "Les Misérables",
      "year": 1862,
      "editor": "A. Lacroix",
      "image": "https://example.com/les-miserables.jpg",
      "category": "roman",
      "author": 1,
      "user": 1
    }
  ]
}
```

---

### 6. Add Book to Favorites (Requires Token)

```bash
curl -X POST http://localhost:3000/favoris/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "message": "Added to favorites"
}
```

---

### 7. Get Your Favorites (Requires Token)

```bash
curl http://localhost:3000/favoris \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
[
  {
    "id": 1,
    "createdAt": "2024-01-15T10:40:00.000Z",
    "book": {
      "id": 1,
      "title": "Les Misérables",
      "year": 1862,
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

## 🔧 Essential Docker Commands

### Container Management

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart services
docker-compose restart

# Rebuild and start
docker-compose up --build -d

# Stop and remove everything (including volumes)
docker-compose down -v
```

### Viewing Logs

```bash
# All logs
docker-compose logs

# Backend logs only
docker-compose logs backend

# MySQL logs only
docker-compose logs db

# Follow logs in real-time
docker-compose logs -f

# Last 50 lines
docker-compose logs --tail=50
```

### Container Status

```bash
# Check running containers
docker-compose ps

# Detailed container info
docker ps

# Resource usage
docker stats
```

### Database Access

```bash
# Access MySQL shell
docker exec -it isids26-mysql mysql -u root -proot isids26

# Show tables
docker exec -it isids26-mysql mysql -u root -proot isids26 -e "SHOW TABLES;"

# View users
docker exec -it isids26-mysql mysql -u root -proot isids26 -e "SELECT * FROM user;"

# View books
docker exec -it isids26-mysql mysql -u root -proot isids26 -e "SELECT * FROM livre;"
```

### Backend Container Access

```bash
# Access backend shell
docker exec -it isids26-backend sh

# View environment variables
docker exec -it isids26-backend env

# Check Node.js version
docker exec -it isids26-backend node --version
```

---

## 🐛 Common Issues & Solutions

### Issue 1: Port 3000 Already in Use

**Error:**
```
Error: bind: address already in use
```

**Solution:**
```bash
# Find what's using port 3000
# Windows (PowerShell):
netstat -ano | findstr :3000

# Kill the process or change port in docker-compose.yml:
ports:
  - "3001:3000"  # Use 3001 instead
```

---

### Issue 2: Backend Can't Connect to Database

**Error in logs:**
```
Error: connect ECONNREFUSED
```

**Solution:**
```bash
# Check if MySQL is healthy
docker-compose ps

# Restart everything
docker-compose down
docker-compose up -d

# Check MySQL logs
docker-compose logs db
```

---

### Issue 3: Changes Not Reflected

**Problem:** Code changes don't appear after rebuild

**Solution:**
```bash
# Full rebuild without cache
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

---

### Issue 4: Database Tables Not Created

**Error:**
```
Table 'isids26.user' doesn't exist
```

**Solution:**
```bash
# Recreate database
docker exec -it isids26-mysql mysql -u root -proot -e "DROP DATABASE IF EXISTS isids26; CREATE DATABASE isids26;"

# Restart backend (will auto-create tables)
docker-compose restart backend

# Verify tables
docker exec -it isids26-mysql mysql -u root -proot isids26 -e "SHOW TABLES;"
```

---

### Issue 5: JWT Token Errors

**Error:**
```
Unauthorized
```

**Solution:**
```bash
# Verify .env has JWT_SECRET
cat .env | grep JWT_SECRET

# If missing, add it:
echo "JWT_SECRET=your_secret_key_here" >> .env

# Restart backend
docker-compose restart backend
```

---

## 📊 Verify Everything Works

### Health Check Checklist

```bash
# ✅ Containers running
docker-compose ps

# ✅ Backend responding
curl http://localhost:3000

# ✅ Database accessible
docker exec -it isids26-mysql mysql -u root -proot -e "SELECT 1;"

# ✅ Tables created
docker exec -it isids26-mysql mysql -u root -proot isids26 -e "SHOW TABLES;"

# ✅ No errors in logs
docker-compose logs --tail=50
```

---

## 🎯 What's Running?

| Service  | Container Name    | Port Mapping    | Purpose                |
|----------|-------------------|-----------------|------------------------|
| MySQL    | isids26-mysql     | 3308:3306       | Database               |
| Backend  | isids26-backend   | 3000:3000       | NestJS API             |

### Access Points

- **API:** http://localhost:3000
- **MySQL:** localhost:3308
  - Username: `root`
  - Password: `root`
  - Database: `isids26`

---

## 🔒 Environment Variables

The `.env` file contains:

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

**⚠️ Important:** Change `JWT_SECRET` in production!

---

## 📦 What Gets Created?

### Docker Images
- `isids25-26-backend` - Your NestJS application
- `mysql:8.0` - MySQL database

### Docker Volumes
- `mysql_data` - Persistent database storage

### Docker Networks
- `isids-network` - Internal network for containers

---

## 🧹 Cleanup

### Remove Everything

```bash
# Stop and remove containers
docker-compose down

# Remove containers + volumes (⚠️ deletes database data)
docker-compose down -v

# Remove images
docker rmi isids25-26-backend mysql:8.0

# Remove all unused Docker resources
docker system prune -a --volumes
```

---

## 📚 Additional Resources

- **Full Documentation:** [DOCKER_SETUP.md](DOCKER_SETUP.md)
- **Backend API Docs:** [BACKEND_DOCUMENTATION.md](BACKEND_DOCUMENTATION.md)
- **Test Script:** Run `bash test-api.sh` (Linux/Mac)

---

## 🎉 Success Indicators

You know everything is working when:

1. ✅ `docker-compose ps` shows both containers as "Up"
2. ✅ `curl http://localhost:3000` returns "Hello World!"
3. ✅ You can sign up and sign in
4. ✅ You can create authors and books
5. ✅ No errors in `docker-compose logs`

---

## 💡 Pro Tips

1. **Always check logs first:** `docker-compose logs -f`
2. **Use health checks:** Wait for MySQL to be healthy before testing
3. **Rebuild after changes:** `docker-compose up --build -d`
4. **Keep .env secure:** Never commit to Git
5. **Use volumes for data:** Database data persists across restarts

---

## 🆘 Need Help?

1. Check logs: `docker-compose logs -f`
2. Verify containers: `docker-compose ps`
3. Test database: `docker exec -it isids26-mysql mysql -u root -proot`
4. Restart everything: `docker-compose restart`
5. Full reset: `docker-compose down -v && docker-compose up --build -d`

---

**Ready to go? Start with:**

```bash
docker-compose up -d
```

**Happy coding! 🚀**
