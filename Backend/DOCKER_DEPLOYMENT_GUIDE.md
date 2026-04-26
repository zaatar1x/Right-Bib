# 🐳 Complete Docker Deployment Guide - NestJS Backend

## 📋 Overview

This guide provides a complete Docker setup for a NestJS backend application with MySQL database, including authentication, books management, and favorites system.

## 🏗️ Architecture

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

## 📁 Project Structure

```
project-root/
├── src/                    # NestJS source code
├── Dockerfile              # Multi-stage Docker build
├── docker-compose.yml      # Service orchestration
├── .dockerignore          # Docker build exclusions
├── .env                   # Environment variables
├── init-db/               # MySQL initialization scripts
│   └── 01-init.sql        # Database setup
├── package.json           # Node.js dependencies
└── DOCKER_DEPLOYMENT_GUIDE.md
```

## 🚀 Quick Start

### Prerequisites

- Docker (v20.10+)
- Docker Compose (v2.0+)

### 1. Clone and Setup

```bash
# Navigate to project directory
cd your-nestjs-project

# Verify Docker installation
docker --version
docker-compose --version
```

### 2. Environment Configuration

The `.env` file is already configured with:

```env
JWT_SECRET=your_super_secret_jwt_key_change_in_production_2024
DB_HOST=db
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=root
DB_NAME=isids26
PORT=3000
NODE_ENV=production
```

**⚠️ IMPORTANT:** Change the `JWT_SECRET` in production!

### 3. Build and Run

```bash
# Build and start all services
docker-compose up --build

# Or run in background (detached mode)
docker-compose up --build -d
```

### 4. Verify Deployment

```bash
# Check container status
docker-compose ps

# View logs
docker-compose logs

# View specific service logs
docker-compose logs backend
docker-compose logs db
```

Expected output:
```
NAME                IMAGE              STATUS         PORTS
isids26-backend     backend-backend    Up 2 minutes   0.0.0.0:3000->3000/tcp
isids26-mysql       mysql:8.0          Up 2 minutes   0.0.0.0:3308->3306/tcp
```

## 🧪 API Testing

### 1. Health Check

```bash
curl http://localhost:3000/books/all
```

Expected: `{"listeBooks": []}`

### 2. Create Admin User

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

Expected Response:
```json
{
  "id": 1,
  "email": "admin@example.com",
  "username": "admin",
  "role": "admin"
}
```

### 3. Sign In and Get JWT Token

```bash
curl -X POST http://localhost:3000/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "identifiant": "admin",
    "password": "admin123"
  }'
```

Expected Response:
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

### 4. Create Author

```bash
curl -X POST http://localhost:3000/author/add \
  -H "Content-Type: application/json" \
  -d '{
    "prenom": "Victor",
    "nom": "Hugo"
  }'
```

### 5. Create Book (Admin Required)

```bash
# Replace YOUR_JWT_TOKEN with the actual token from sign-in
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

### 6. Add to Favorites

```bash
curl -X POST http://localhost:3000/favoris/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 7. Get User's Favorites

```bash
curl http://localhost:3000/favoris \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 8. Get Statistics (Admin Only)

```bash
# Books per year
curl http://localhost:3000/books/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Total users
curl http://localhost:3000/auth/stats/total-users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Total favorites
curl http://localhost:3000/favoris/stats/total \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Most favorited books
curl "http://localhost:3000/favoris/stats/most-favourited?limit=5" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🔧 Management Commands

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
docker-compose restart db

# View running containers
docker-compose ps

# Scale backend service (if needed)
docker-compose up --scale backend=2
```

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

### Database Operations

```bash
# Access MySQL CLI
docker-compose exec db mysql -uroot -proot isids26

# Show tables
docker-compose exec db mysql -uroot -proot -e "USE isids26; SHOW TABLES;"

# Backup database
docker-compose exec db mysqldump -uroot -proot isids26 > backup.sql

# Restore database
docker-compose exec -T db mysql -uroot -proot isids26 < backup.sql

# View database size
docker-compose exec db mysql -uroot -proot -e "
SELECT 
    table_schema AS 'Database',
    ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.tables 
WHERE table_schema = 'isids26'
GROUP BY table_schema;"
```

## 🐛 Troubleshooting

### Issue 1: Port Already in Use

**Error:**
```
Error: bind: address already in use
```

**Solutions:**

1. **Check what's using the port:**
```bash
# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :3308

# Linux/Mac
lsof -i :3000
lsof -i :3308
```

2. **Change ports in docker-compose.yml:**
```yaml
ports:
  - "3001:3000"  # Use port 3001 instead of 3000
  - "3309:3306"  # Use port 3309 instead of 3308
```

3. **Kill the process using the port:**
```bash
# Windows (replace PID with actual process ID)
taskkill /PID <PID> /F

# Linux/Mac
kill -9 <PID>
```

### Issue 2: Database Connection Failed

**Error:**
```
Error: connect ECONNREFUSED db:3306
```

**Solutions:**

1. **Check MySQL container status:**
```bash
docker-compose logs db
```

2. **Wait for MySQL to be ready:**
```bash
# Look for this message in logs:
# "ready for connections. Version: '8.0.x'"
```

3. **Restart backend after MySQL is ready:**
```bash
docker-compose restart backend
```

4. **Check environment variables:**
```bash
docker-compose exec backend env | grep DB_
```

### Issue 3: Authentication Error

**Error:**
```
ER_NOT_SUPPORTED_AUTH_MODE: Client does not support authentication protocol
```

**Solution:**
The docker-compose.yml already includes the fix:
```yaml
command: --default-authentication-plugin=mysql_native_password
```

If still having issues, manually fix in MySQL:
```bash
docker-compose exec db mysql -uroot -proot -e "
ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'root';
FLUSH PRIVILEGES;"
```

### Issue 4: Container Exits Immediately

**Check logs:**
```bash
docker-compose logs backend
```

**Common causes and solutions:**

1. **Missing dependencies:**
```bash
# Rebuild without cache
docker-compose build --no-cache backend
```

2. **Build errors:**
```bash
# Check build logs
docker-compose build backend
```

3. **Missing environment variables:**
```bash
# Verify .env file exists and has correct values
cat .env
```

### Issue 5: Changes Not Reflected

**Problem:** Code changes don't appear in container

**Solutions:**

1. **Rebuild the image:**
```bash
docker-compose up --build
```

2. **Force rebuild:**
```bash
docker-compose build --no-cache backend
docker-compose up
```

3. **Clear Docker cache:**
```bash
docker system prune -a
```

### Issue 6: Permission Denied (Linux/Mac)

**Error:**
```
EACCES: permission denied
```

**Solutions:**

1. **Fix file permissions:**
```bash
sudo chown -R $USER:$USER .
```

2. **Run with sudo (not recommended):**
```bash
sudo docker-compose up
```

3. **Add user to docker group:**
```bash
sudo usermod -aG docker $USER
# Logout and login again
```

### Issue 7: Out of Disk Space

**Error:**
```
no space left on device
```

**Solutions:**

1. **Clean Docker system:**
```bash
docker system prune -a --volumes
```

2. **Remove unused images:**
```bash
docker image prune -a
```

3. **Remove unused volumes:**
```bash
docker volume prune
```

## 📊 Monitoring and Health Checks

### Container Health Status

```bash
# Check health status
docker-compose ps

# View health check logs
docker inspect isids26-backend --format='{{json .State.Health}}'
docker inspect isids26-mysql --format='{{json .State.Health}}'
```

### Performance Monitoring

```bash
# View resource usage
docker stats

# View specific container stats
docker stats isids26-backend isids26-mysql

# View container processes
docker-compose top
```

### Database Monitoring

```bash
# Check database connections
docker-compose exec db mysql -uroot -proot -e "SHOW PROCESSLIST;"

# Check database status
docker-compose exec db mysql -uroot -proot -e "SHOW STATUS LIKE 'Connections';"

# Check table sizes
docker-compose exec db mysql -uroot -proot -e "
SELECT 
    table_name AS 'Table',
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.TABLES 
WHERE table_schema = 'isids26'
ORDER BY (data_length + index_length) DESC;"
```

## 🔒 Security Best Practices

### Production Deployment Checklist

- [ ] **Change JWT_SECRET** to a strong random value (32+ characters)
- [ ] **Change MySQL root password** from default
- [ ] **Set synchronize: false** in TypeORM config
- [ ] **Use database migrations** instead of auto-sync
- [ ] **Enable HTTPS/SSL** with reverse proxy (nginx/traefik)
- [ ] **Configure proper CORS** origins
- [ ] **Set up database backups** (automated)
- [ ] **Use Docker secrets** for sensitive data
- [ ] **Implement rate limiting** middleware
- [ ] **Set up monitoring** and logging (ELK stack, Prometheus)
- [ ] **Use environment-specific** .env files
- [ ] **Enable Docker health checks** (already configured)
- [ ] **Configure restart policies** (already set to unless-stopped)
- [ ] **Run containers as non-root** user (already configured)
- [ ] **Scan images for vulnerabilities**

### Environment Variables for Production

```env
# Strong JWT secret (generate with: openssl rand -base64 32)
JWT_SECRET=your_very_strong_jwt_secret_here_32_chars_minimum

# Strong database password
DB_PASSWORD=your_strong_database_password_here

# Production database host (if using external DB)
DB_HOST=your-production-db-host.com

# Enable SSL for database connection
DB_SSL=true

# Production CORS origins
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

## 📈 Scaling and Performance

### Horizontal Scaling

```bash
# Scale backend service
docker-compose up --scale backend=3

# Use load balancer (nginx example)
# Add nginx service to docker-compose.yml
```

### Performance Optimization

1. **Database Connection Pooling** (already configured in TypeORM)
2. **Redis Caching** (add Redis service if needed)
3. **CDN for static assets**
4. **Database indexing** for frequently queried fields
5. **API response caching**

### Resource Limits

Add to docker-compose.yml:
```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
  
  db:
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 1G
        reservations:
          cpus: '1.0'
          memory: 512M
```

## 🔄 Backup and Recovery

### Automated Database Backup

Create a backup script:

```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
docker-compose exec -T db mysqldump -uroot -proot isids26 > "backup_${DATE}.sql"
echo "Backup created: backup_${DATE}.sql"
```

### Restore from Backup

```bash
# Restore specific backup
docker-compose exec -T db mysql -uroot -proot isids26 < backup_20240426_120000.sql
```

## 📞 Support and Maintenance

### Regular Maintenance Tasks

1. **Update Docker images** monthly
2. **Review and rotate secrets** quarterly
3. **Monitor disk usage** weekly
4. **Check security updates** weekly
5. **Test backup/restore** monthly

### Useful Commands Summary

```bash
# Quick health check
curl -f http://localhost:3000/books/all || echo "Backend is down"

# Quick database check
docker-compose exec db mysqladmin -uroot -proot ping

# View all container logs
docker-compose logs --tail=50 -f

# Emergency stop all services
docker-compose down

# Emergency cleanup (removes everything)
docker-compose down -v && docker system prune -a
```

---

## 🎯 Success Criteria

Your deployment is successful when:

✅ Both containers are running (`docker-compose ps` shows "Up")  
✅ Backend responds to health check (`curl http://localhost:3000/books/all`)  
✅ Database accepts connections (`docker-compose exec db mysqladmin ping`)  
✅ You can create users via API  
✅ JWT authentication works  
✅ CRUD operations work for books/authors/favorites  

---

**Last Updated:** April 26, 2026  
**Docker Version:** 20.10+  
**Docker Compose Version:** 2.0+  
**NestJS Version:** 10.x  
**MySQL Version:** 8.0