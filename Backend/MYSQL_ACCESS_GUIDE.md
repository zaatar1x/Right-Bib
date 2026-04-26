# 🔐 MySQL Database Access Guide

## ✅ Your Services Are Running!

All containers are up and running:
- ✅ **MySQL Database** - Running on port 3308
- ✅ **NestJS Backend** - Running on port 3000
- ✅ **phpMyAdmin** - Running on port 8080

---

## 🌐 Method 1: phpMyAdmin (Web Interface) - EASIEST!

### 📍 Access URL:
```
http://localhost:8080
```

### 🔑 Login Credentials:
- **Server:** `db` (or leave empty)
- **Username:** `root`
- **Password:** `root`

### 📝 Steps:
1. Open your web browser
2. Go to: **http://localhost:8080**
3. You'll see the phpMyAdmin login page
4. Enter:
   - Username: `root`
   - Password: `root`
5. Click "Go" or "Login"
6. Select `isids26` database from the left sidebar

### 🎯 What You Can Do:
- ✅ View all tables (user, livre, auteur, favoris)
- ✅ Browse data
- ✅ Run SQL queries
- ✅ Export/Import data
- ✅ Create/modify tables
- ✅ View database structure

---

## 💻 Method 2: Command Line (Docker Exec)

### Quick Access:
```bash
docker-compose exec db mysql -uroot -proot isids26
```

### Useful SQL Commands:
```sql
-- Show all tables
SHOW TABLES;

-- View all users
SELECT * FROM user;

-- View all books
SELECT * FROM livre;

-- View all authors
SELECT * FROM auteur;

-- View all favorites
SELECT * FROM favoris;

-- Count records
SELECT COUNT(*) FROM user;
SELECT COUNT(*) FROM livre;

-- Exit MySQL CLI
EXIT;
```

---

## 🖥️ Method 3: MySQL Workbench (Desktop Application)

### Download:
- [MySQL Workbench Download](https://dev.mysql.com/downloads/workbench/)

### Connection Settings:
```
Connection Name: Docker ISIDS26
Hostname: localhost
Port: 3308
Username: root
Password: root
Default Schema: isids26
```

### Steps:
1. Open MySQL Workbench
2. Click "+" next to "MySQL Connections"
3. Fill in the connection details above
4. Click "Test Connection"
5. Click "OK" to save
6. Double-click the connection to connect

---

## 🔧 Method 4: HeidiSQL (Windows - Lightweight)

### Download:
- [HeidiSQL Download](https://www.heidisql.com/download.php)

### Connection Settings:
```
Network type: MySQL (TCP/IP)
Hostname: localhost
User: root
Password: root
Port: 3308
Database: isids26
```

---

## 🧪 Test Your Connection

### Test Backend API:
```bash
# Test if backend is running
curl http://localhost:3000/books/all
```

Expected response: `{"listeBooks":[]}`

### Test phpMyAdmin:
Open browser: http://localhost:8080

### Test MySQL Direct Connection:
```bash
docker-compose exec db mysqladmin -uroot -proot ping
```

Expected response: `mysqld is alive`

---

## 📊 Quick Database Overview

### Tables in isids26 database:
1. **user** - User accounts (id, email, username, password, salt, role)
2. **livre** - Books (id, title, year, editor, image, category, author_id, user_id)
3. **auteur** - Authors (id, prenom, nom)
4. **favoris** - User favorites (id, user_id, book_id, created_at)

---

## 🔍 Useful Docker Commands

### View Container Logs:
```bash
# All logs
docker-compose logs

# MySQL logs
docker-compose logs db

# Backend logs
docker-compose logs backend

# phpMyAdmin logs
docker-compose logs phpmyadmin

# Follow logs in real-time
docker-compose logs -f
```

### Container Management:
```bash
# Check status
docker-compose ps

# Restart a service
docker-compose restart db
docker-compose restart backend
docker-compose restart phpmyadmin

# Stop all services
docker-compose down

# Start all services
docker-compose up -d

# Stop and remove volumes (⚠️ deletes data)
docker-compose down -v
```

### Database Backup:
```bash
# Create backup
docker-compose exec db mysqldump -uroot -proot isids26 > backup_$(date +%Y%m%d).sql

# Restore backup
docker-compose exec -T db mysql -uroot -proot isids26 < backup_20240426.sql
```

---

## 🚀 Quick Start Workflow

### 1. Access phpMyAdmin:
```
http://localhost:8080
Login: root / root
```

### 2. Create a User via API:
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

### 3. Check in phpMyAdmin:
- Go to http://localhost:8080
- Select `isids26` database
- Click on `user` table
- You'll see your new user!

---

## 🔐 Connection Details Summary

| Service | URL/Host | Port | Username | Password | Database |
|---------|----------|------|----------|----------|----------|
| **phpMyAdmin** | http://localhost:8080 | 8080 | root | root | isids26 |
| **MySQL Direct** | localhost | 3308 | root | root | isids26 |
| **Backend API** | http://localhost:3000 | 3000 | - | - | - |

---

## ⚠️ Troubleshooting

### phpMyAdmin not loading?
```bash
# Check if container is running
docker-compose ps

# Check logs
docker-compose logs phpmyadmin

# Restart phpMyAdmin
docker-compose restart phpmyadmin
```

### Can't connect to MySQL?
```bash
# Check MySQL health
docker-compose exec db mysqladmin -uroot -proot ping

# Check MySQL logs
docker-compose logs db

# Restart MySQL
docker-compose restart db
```

### Port already in use?
```bash
# Check what's using port 8080
netstat -ano | findstr :8080

# Change port in docker-compose.yml
# Change "8080:80" to "8081:80"
```

---

## 🎉 You're All Set!

**Primary Access Method:**
👉 **Open your browser and go to: http://localhost:8080**

Login with:
- Username: `root`
- Password: `root`

Select the `isids26` database and start exploring!

---

**Last Updated:** April 26, 2026  
**Services Running:**
- MySQL 8.0 on port 3308
- phpMyAdmin on port 8080
- NestJS Backend on port 3000