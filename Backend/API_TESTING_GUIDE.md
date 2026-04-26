# 🧪 Complete API Testing Guide - All Endpoints

## 📋 Table of Contents
1. [Quick Start](#quick-start)
2. [Authentication Endpoints](#authentication-endpoints)
3. [Books Endpoints](#books-endpoints)
4. [Authors Endpoints](#authors-endpoints)
5. [Favorites Endpoints](#favorites-endpoints)
6. [Tasks Endpoints](#tasks-endpoints)
7. [Statistics Endpoints](#statistics-endpoints)
8. [Automated Testing Script](#automated-testing-script)
9. [Postman Collection](#postman-collection)

---

## 🚀 Quick Start

### Base URL
```
http://localhost:3000
```

### Prerequisites
- Docker containers running (`docker-compose ps` to verify)
- Backend accessible at http://localhost:3000

### Test Backend is Running
```bash
curl http://localhost:3000/books/all
```

Expected: `{"listeBooks":[]}`

---

## 🔐 Authentication Endpoints

### 1. Sign Up (Create User)

**Endpoint:** `POST /auth/signup`

**Request:**
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

**Response (Success):**
```json
{
  "id": 1,
  "email": "admin@example.com",
  "username": "admin",
  "role": "admin"
}
```

**Create Regular User:**
```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "user1",
    "password": "user123",
    "role": "user"
  }'
```

---

### 2. Sign In (Login)

**Endpoint:** `POST /auth/signin`

**Request:**
```bash
curl -X POST http://localhost:3000/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "identifiant": "admin",
    "password": "admin123"
  }'
```

**Response (Success):**
```json
{
  "id": 1,
  "email": "admin@example.com",
  "username": "admin",
  "role": "admin",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
}
```

**💡 IMPORTANT:** Save the `access_token` - you'll need it for authenticated requests!

**Login with Email:**
```bash
curl -X POST http://localhost:3000/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "identifiant": "admin@example.com",
    "password": "admin123"
  }'
```

---

### 3. Get Total Users (Admin Only)

**Endpoint:** `GET /auth/stats/total-users`

**Request:**
```bash
curl http://localhost:3000/auth/stats/total-users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "total": 2
}
```

---

## 📚 Books Endpoints

### 1. Get All Books (Public)

**Endpoint:** `GET /books/all`

**Request:**
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
      "user": 1,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updateAt": "2024-01-01T00:00:00.000Z",
      "deleteAt": null
    }
  ]
}
```

---

### 2. Get Book By ID (Requires JWT)

**Endpoint:** `GET /books/search/:id`

**Request:**
```bash
curl http://localhost:3000/books/search/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Les Misérables",
    "year": 1862,
    "editor": "A. Lacroix",
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

### 3. Add New Book (Admin Only)

**Endpoint:** `POST /books/new`

**Request:**
```bash
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

**Book Categories:**
- `roman` (Novel)
- `science` (Science)
- `histoire` (History)
- `informatique` (Computer Science)
- `art` (Art)
- `philosophie` (Philosophy)
- `autre` (Other)

**More Examples:**
```bash
# Science book
curl -X POST http://localhost:3000/books/new \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "A Brief History of Time",
    "year": 1988,
    "editor": "Bantam Books",
    "image": "https://example.com/brief-history.jpg",
    "category": "science",
    "author": 2
  }'

# Computer Science book
curl -X POST http://localhost:3000/books/new \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Clean Code",
    "year": 2008,
    "editor": "Prentice Hall",
    "image": "https://example.com/clean-code.jpg",
    "category": "informatique",
    "author": 3
  }'
```

---

### 4. Update Book

**Endpoint:** `PUT /books/edit/:id`

**Request:**
```bash
curl -X PUT http://localhost:3000/books/edit/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Les Misérables - Edition Complète",
    "year": 1862,
    "editor": "A. Lacroix",
    "image": "https://example.com/les-miserables-new.jpg",
    "category": "roman",
    "author": 1
  }'
```

---

### 5. Soft Delete Book

**Endpoint:** `DELETE /books/softdelete/:id`

**Request:**
```bash
curl -X DELETE http://localhost:3000/books/softdelete/1
```

**Response:**
```json
{
  "raw": [],
  "affected": 1,
  "generatedMaps": []
}
```

---

### 6. Restore Soft Deleted Book

**Endpoint:** `PATCH /books/restore/:id`

**Request:**
```bash
curl -X PATCH http://localhost:3000/books/restore/1
```

---

### 7. Recover Book

**Endpoint:** `PATCH /books/recover/:id`

**Request:**
```bash
curl -X PATCH http://localhost:3000/books/recover/1
```

---

### 8. Hard Delete Book (by ID)

**Endpoint:** `DELETE /books/delete/:id`

**Request:**
```bash
curl -X DELETE http://localhost:3000/books/delete/1
```

---

### 9. Remove Book (with Entity)

**Endpoint:** `DELETE /books/remove/:id`

**Request:**
```bash
curl -X DELETE http://localhost:3000/books/remove/1
```

---

### 10. Get Books Statistics (Admin Only)

**Endpoint:** `GET /books/stats`

**Request:**
```bash
curl http://localhost:3000/books/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
[
  {
    "book_year": 1862,
    "NbBooks": "1"
  },
  {
    "book_year": 1988,
    "NbBooks": "1"
  },
  {
    "book_year": 2008,
    "NbBooks": "1"
  }
]
```

---

## 👤 Authors Endpoints

### 1. Get All Authors

**Endpoint:** `GET /author/all`

**Request:**
```bash
curl http://localhost:3000/author/all
```

**Response:**
```json
[
  {
    "id": 1,
    "prenom": "Victor",
    "nom": "Hugo",
    "listeLivres": [
      {
        "id": 1,
        "title": "Les Misérables",
        "year": 1862,
        "editor": "A. Lacroix",
        "image": "https://example.com/les-miserables.jpg",
        "category": "roman"
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updateAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### 2. Add Author

**Endpoint:** `POST /author/add`

**Request:**
```bash
curl -X POST http://localhost:3000/author/add \
  -H "Content-Type: application/json" \
  -d '{
    "prenom": "Victor",
    "nom": "Hugo"
  }'
```

**More Examples:**
```bash
# Add Stephen Hawking
curl -X POST http://localhost:3000/author/add \
  -H "Content-Type: application/json" \
  -d '{
    "prenom": "Stephen",
    "nom": "Hawking"
  }'

# Add Robert C. Martin
curl -X POST http://localhost:3000/author/add \
  -H "Content-Type: application/json" \
  -d '{
    "prenom": "Robert",
    "nom": "Martin"
  }'

# Add Albert Camus
curl -X POST http://localhost:3000/author/add \
  -H "Content-Type: application/json" \
  -d '{
    "prenom": "Albert",
    "nom": "Camus"
  }'
```

---

## ⭐ Favorites Endpoints

### 1. Add Book to Favorites

**Endpoint:** `POST /favoris/:bookId`

**Request:**
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

**Error (Already in favorites):**
```json
{
  "statusCode": 409,
  "message": "Already in favorites"
}
```

---

### 2. Remove Book from Favorites

**Endpoint:** `DELETE /favoris/:bookId`

**Request:**
```bash
curl -X DELETE http://localhost:3000/favoris/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### 3. Get User's Favorites

**Endpoint:** `GET /favoris`

**Request:**
```bash
curl http://localhost:3000/favoris \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
[
  {
    "id": 1,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "book": {
      "id": 1,
      "title": "Les Misérables",
      "year": 1862,
      "editor": "A. Lacroix",
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

### 4. Get Total Favorites (Admin Only)

**Endpoint:** `GET /favoris/stats/total`

**Request:**
```bash
curl http://localhost:3000/favoris/stats/total \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "total": 5
}
```

---

### 5. Get Most Favorited Books (Admin Only)

**Endpoint:** `GET /favoris/stats/most-favourited?limit=10`

**Request:**
```bash
curl "http://localhost:3000/favoris/stats/most-favourited?limit=5" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
[
  {
    "bookId": 1,
    "title": "Les Misérables",
    "image": "https://example.com/les-miserables.jpg",
    "authorName": "Victor Hugo",
    "count": 3
  },
  {
    "bookId": 2,
    "title": "A Brief History of Time",
    "image": "https://example.com/brief-history.jpg",
    "authorName": "Stephen Hawking",
    "count": 2
  }
]
```

---

## 📝 Tasks Endpoints

**Note:** Tasks are stored in-memory (not in database)

### 1. Get All Tasks

**Endpoint:** `GET /tasks/all`

**Request:**
```bash
curl http://localhost:3000/tasks/all
```

**Response:**
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

### 2. Get Task By ID

**Endpoint:** `GET /tasks/search/:id`

**Request:**
```bash
curl http://localhost:3000/tasks/search/1
```

---

### 3. Get Tasks Statistics (Filter by Year)

**Endpoint:** `GET /tasks/stats?startYear=2024&endYear=2026`

**Request:**
```bash
curl "http://localhost:3000/tasks/stats?startYear=2024&endYear=2026"
```

**Response:**
```json
{
  "selectedTasks": [
    {
      "id": "1",
      "title": "Project 0",
      "statut": "todo",
      "year": 2025,
      "createdAt": "2024-06-06T00:00:00.000Z"
    }
  ]
}
```

---

### 4. Add New Task

**Endpoint:** `POST /tasks/add`

**Request:**
```bash
curl -X POST http://localhost:3000/tasks/add \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Task",
    "year": 2024,
    "statut": "todo"
  }'
```

**Validation Rules:**
- `title`: 3-10 characters
- `year`: 2020-2030
- `statut`: "todo", "done", or "in progress"

**Response:**
```json
{
  "message": "Task added successfully",
  "generatedId": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

### 5. Update Task

**Endpoint:** `PUT /tasks/edit/:id`

**Request:**
```bash
curl -X PUT http://localhost:3000/tasks/edit/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated",
    "year": 2025,
    "statut": "in progress"
  }'
```

---

### 6. Delete Task

**Endpoint:** `DELETE /tasks/delete/:deleteId`

**Request:**
```bash
curl -X DELETE http://localhost:3000/tasks/delete/1
```

---

### 7. Hello Test Endpoint

**Endpoint:** `GET /tasks/hello`

**Request:**
```bash
curl http://localhost:3000/tasks/hello
```

**Response:**
```json
{
  "prenom": "Nidhal",
  "anneee": 2025
}
```

---

## 📊 All Statistics Endpoints Summary

### Admin Statistics

```bash
# Total users
curl http://localhost:3000/auth/stats/total-users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Books per year
curl http://localhost:3000/books/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Total favorites
curl http://localhost:3000/favoris/stats/total \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Most favorited books (top 10)
curl "http://localhost:3000/favoris/stats/most-favourited?limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Tasks by year range
curl "http://localhost:3000/tasks/stats?startYear=2024&endYear=2026"
```

---

## 🤖 Automated Testing Script

Create a file `test-api.sh`:

```bash
#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:3000"
TOKEN=""

echo -e "${BLUE}=== API Testing Script ===${NC}\n"

# Test 1: Health Check
echo -e "${BLUE}1. Testing Health Check...${NC}"
RESPONSE=$(curl -s $BASE_URL/books/all)
if [[ $RESPONSE == *"listeBooks"* ]]; then
    echo -e "${GREEN}✓ Backend is running${NC}\n"
else
    echo -e "${RED}✗ Backend is not responding${NC}\n"
    exit 1
fi

# Test 2: Create Admin User
echo -e "${BLUE}2. Creating Admin User...${NC}"
RESPONSE=$(curl -s -X POST $BASE_URL/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "username": "admin",
    "password": "admin123",
    "role": "admin"
  }')
echo $RESPONSE | jq '.'
echo ""

# Test 3: Login
echo -e "${BLUE}3. Logging in...${NC}"
RESPONSE=$(curl -s -X POST $BASE_URL/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "identifiant": "admin",
    "password": "admin123"
  }')
TOKEN=$(echo $RESPONSE | jq -r '.access_token')
echo -e "${GREEN}✓ Token received: ${TOKEN:0:50}...${NC}\n"

# Test 4: Create Author
echo -e "${BLUE}4. Creating Author...${NC}"
RESPONSE=$(curl -s -X POST $BASE_URL/author/add \
  -H "Content-Type: application/json" \
  -d '{
    "prenom": "Victor",
    "nom": "Hugo"
  }')
echo $RESPONSE | jq '.'
echo ""

# Test 5: Get All Authors
echo -e "${BLUE}5. Getting All Authors...${NC}"
curl -s $BASE_URL/author/all | jq '.'
echo ""

# Test 6: Create Book
echo -e "${BLUE}6. Creating Book...${NC}"
RESPONSE=$(curl -s -X POST $BASE_URL/books/new \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Les Misérables",
    "year": 1862,
    "editor": "A. Lacroix",
    "image": "https://example.com/les-miserables.jpg",
    "category": "roman",
    "author": 1
  }')
echo $RESPONSE | jq '.'
echo ""

# Test 7: Get All Books
echo -e "${BLUE}7. Getting All Books...${NC}"
curl -s $BASE_URL/books/all | jq '.'
echo ""

# Test 8: Add to Favorites
echo -e "${BLUE}8. Adding Book to Favorites...${NC}"
RESPONSE=$(curl -s -X POST $BASE_URL/favoris/1 \
  -H "Authorization: Bearer $TOKEN")
echo $RESPONSE | jq '.'
echo ""

# Test 9: Get User Favorites
echo -e "${BLUE}9. Getting User Favorites...${NC}"
curl -s $BASE_URL/favoris \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

# Test 10: Get Statistics
echo -e "${BLUE}10. Getting Statistics...${NC}"
echo "Total Users:"
curl -s $BASE_URL/auth/stats/total-users \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""
echo "Books Stats:"
curl -s $BASE_URL/books/stats \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

echo -e "${GREEN}=== All Tests Completed ===${NC}"
```

### Run the script:
```bash
# Make executable
chmod +x test-api.sh

# Run
./test-api.sh
```

---

## 📮 Postman Collection

### Import to Postman:

1. Create a new Collection: "ISIDS26 API"
2. Add Environment Variables:
   - `base_url`: `http://localhost:3000`
   - `token`: (will be set automatically)

### Collection Structure:

```
ISIDS26 API/
├── Auth/
│   ├── Sign Up
│   ├── Sign In
│   └── Total Users Stats
├── Books/
│   ├── Get All Books
│   ├── Get Book By ID
│   ├── Add Book
│   ├── Update Book
│   ├── Soft Delete Book
│   ├── Restore Book
│   ├── Hard Delete Book
│   └── Books Statistics
├── Authors/
│   ├── Get All Authors
│   └── Add Author
├── Favorites/
│   ├── Add to Favorites
│   ├── Remove from Favorites
│   ├── Get My Favorites
│   ├── Total Favorites
│   └── Most Favorited Books
└── Tasks/
    ├── Get All Tasks
    ├── Get Task By ID
    ├── Add Task
    ├── Update Task
    ├── Delete Task
    └── Tasks Statistics
```

### Postman Pre-request Script (for Collection):

```javascript
// Auto-set token from Sign In response
if (pm.response.json().access_token) {
    pm.environment.set("token", pm.response.json().access_token);
}
```

---

## 🎯 Complete Testing Workflow

### Step-by-Step Testing:

```bash
# 1. Create Admin
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","username":"admin","password":"admin123","role":"admin"}'

# 2. Login and get token
TOKEN=$(curl -s -X POST http://localhost:3000/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"identifiant":"admin","password":"admin123"}' | jq -r '.access_token')

echo "Token: $TOKEN"

# 3. Create authors
curl -X POST http://localhost:3000/author/add \
  -H "Content-Type: application/json" \
  -d '{"prenom":"Victor","nom":"Hugo"}'

curl -X POST http://localhost:3000/author/add \
  -H "Content-Type: application/json" \
  -d '{"prenom":"Albert","nom":"Camus"}'

# 4. Create books
curl -X POST http://localhost:3000/books/new \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Les Misérables","year":1862,"editor":"A. Lacroix","image":"https://example.com/1.jpg","category":"roman","author":1}'

curl -X POST http://localhost:3000/books/new \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"L'\''Étranger","year":1942,"editor":"Gallimard","image":"https://example.com/2.jpg","category":"roman","author":2}'

# 5. Add to favorites
curl -X POST http://localhost:3000/favoris/1 \
  -H "Authorization: Bearer $TOKEN"

curl -X POST http://localhost:3000/favoris/2 \
  -H "Authorization: Bearer $TOKEN"

# 6. Get all data
echo "=== All Books ==="
curl -s http://localhost:3000/books/all | jq '.'

echo "=== My Favorites ==="
curl -s http://localhost:3000/favoris \
  -H "Authorization: Bearer $TOKEN" | jq '.'

echo "=== Statistics ==="
curl -s http://localhost:3000/books/stats \
  -H "Authorization: Bearer $TOKEN" | jq '.'
```

---

## 📝 Quick Reference

### All Endpoints Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/signup` | No | Create user |
| POST | `/auth/signin` | No | Login |
| GET | `/auth/stats/total-users` | Admin | Total users |
| GET | `/books/all` | No | Get all books |
| GET | `/books/search/:id` | JWT | Get book by ID |
| POST | `/books/new` | Admin | Add book |
| PUT | `/books/edit/:id` | No | Update book |
| DELETE | `/books/softdelete/:id` | No | Soft delete |
| PATCH | `/books/restore/:id` | No | Restore book |
| DELETE | `/books/delete/:id` | No | Hard delete |
| GET | `/books/stats` | Admin | Books stats |
| GET | `/author/all` | No | Get all authors |
| POST | `/author/add` | No | Add author |
| POST | `/favoris/:bookId` | JWT | Add favorite |
| DELETE | `/favoris/:bookId` | JWT | Remove favorite |
| GET | `/favoris` | JWT | Get my favorites |
| GET | `/favoris/stats/total` | Admin | Total favorites |
| GET | `/favoris/stats/most-favourited` | Admin | Top books |
| GET | `/tasks/all` | No | Get all tasks |
| GET | `/tasks/search/:id` | No | Get task by ID |
| GET | `/tasks/stats` | No | Tasks by year |
| POST | `/tasks/add` | No | Add task |
| PUT | `/tasks/edit/:id` | No | Update task |
| DELETE | `/tasks/delete/:id` | No | Delete task |

---

**Last Updated:** April 26, 2026  
**Base URL:** http://localhost:3000  
**Total Endpoints:** 27