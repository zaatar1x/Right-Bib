# NestJS Backend - Complete Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Database Architecture](#database-architecture)
4. [API Endpoints](#api-endpoints)
5. [Authentication & Authorization](#authentication--authorization)
6. [Modules Structure](#modules-structure)
7. [Middlewares](#middlewares)
8. [Guards](#guards)
9. [DTOs & Validation](#dtos--validation)
10. [Configuration](#configuration)

---

## Project Overview

**Project Name:** ISIDS25-26  
**Version:** 0.0.1  
**Framework:** NestJS 10.x  
**Port:** 3000  
**Database:** MySQL (Port 3308)  
**Database Name:** isids26

This is a library management system backend with features for managing books, authors, users, favorites, and tasks.

---

## Technology Stack

### Core Dependencies
- **NestJS** (v10.0.0) - Progressive Node.js framework
- **TypeORM** (v0.3.27) - ORM for database operations
- **MySQL** (v2.18.1) - Database
- **Passport JWT** (v4.0.1) - JWT authentication strategy
- **bcrypt** (v6.0.0) - Password hashing
- **class-validator** (v0.14.2) - DTO validation
- **class-transformer** (v0.5.1) - Object transformation

### Development Tools
- **TypeScript** (v5.1.3)
- **Jest** - Testing framework
- **ESLint** - Code linting
- **Prettier** - Code formatting

---

## Database Architecture

### Entity Relationship Diagram

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   UserEntity│         │  BookEntity │         │AuthorEntity │
│             │         │             │         │             │
│ - id (PK)   │         │ - id (PK)   │         │ - id (PK)   │
│ - email     │         │ - title     │         │ - prenom    │
│ - username  │         │ - year      │         │ - nom       │
│ - password  │         │ - editor    │         │ - listeLivres│
│ - salt      │         │ - image     │         └──────┬──────┘
│ - role      │         │ - category  │                │
└──────┬──────┘         │ - author_id │◄───────────────┘
       │                │ - user_id   │◄───────┐
       │                │ - createdAt │        │
       │                │ - updateAt  │        │
       │                │ - deleteAt  │        │
       │                └──────┬──────┘        │
       │                       │               │
       │                ┌──────▼──────┐        │
       │                │   Favoris   │        │
       │                │             │        │
       │                │ - id (PK)   │        │
       └───────────────►│ - user_id   │        │
                        │ - book_id   │────────┘
                        │ - createdAt │
                        └─────────────┘
```

### Database Tables

#### 1. **user** (UserEntity)
| Column   | Type         | Constraints           | Description              |
|----------|--------------|----------------------|--------------------------|
| id       | INT          | PRIMARY KEY, AUTO    | User identifier          |
| email    | VARCHAR      | UNIQUE, NOT NULL     | User email               |
| username | VARCHAR      | UNIQUE, NOT NULL     | Username                 |
| password | VARCHAR      | NOT NULL             | Hashed password          |
| salt     | VARCHAR      | NOT NULL             | Password salt            |
| role     | ENUM         | DEFAULT 'user'       | User role (user/admin)   |

**Roles:**
- `ROLE_USER` (default)
- `ROLE_ADMIN`

---

#### 2. **livre** (BookEntity)
| Column     | Type         | Constraints           | Description              |
|------------|--------------|----------------------|--------------------------|
| id         | INT          | PRIMARY KEY, AUTO    | Book identifier          |
| title      | VARCHAR(50)  | NOT NULL             | Book title               |
| year       | INT          | NOT NULL             | Publication year         |
| editor     | VARCHAR      | NOT NULL             | Publisher name           |
| image      | VARCHAR      | NOT NULL             | Book cover image URL     |
| category   | ENUM         | NULLABLE             | Book category            |
| author_id  | INT          | FOREIGN KEY          | Reference to author      |
| user_id    | INT          | FOREIGN KEY          | User who added the book  |
| createdAt  | TIMESTAMP    | AUTO                 | Creation timestamp       |
| updateAt   | TIMESTAMP    | AUTO                 | Last update timestamp    |
| deleteAt   | TIMESTAMP    | NULLABLE             | Soft delete timestamp    |

**Categories:**
- `roman` (Novel)
- `science` (Science)
- `histoire` (History)
- `informatique` (Computer Science)
- `art` (Art)
- `philosophie` (Philosophy)
- `autre` (Other)

---

#### 3. **auteur** (AuthorEntity)
| Column    | Type         | Constraints           | Description              |
|-----------|--------------|----------------------|--------------------------|
| id        | INT          | PRIMARY KEY, AUTO    | Author identifier        |
| prenom    | VARCHAR      | NOT NULL             | First name               |
| nom       | VARCHAR      | NOT NULL             | Last name                |
| createdAt | TIMESTAMP    | AUTO                 | Creation timestamp       |
| updateAt  | TIMESTAMP    | AUTO                 | Last update timestamp    |
| deleteAt  | TIMESTAMP    | NULLABLE             | Soft delete timestamp    |

**Relationships:**
- One-to-Many with BookEntity (eager loading enabled)

---

#### 4. **favoris** (Favoris)
| Column     | Type         | Constraints           | Description              |
|------------|--------------|----------------------|--------------------------|
| id         | INT          | PRIMARY KEY, AUTO    | Favorite identifier      |
| user_id    | INT          | FOREIGN KEY          | Reference to user        |
| book_id    | INT          | FOREIGN KEY          | Reference to book        |
| created_at | TIMESTAMP    | AUTO                 | When favorite was added  |

**Relationships:**
- Many-to-One with UserEntity
- Many-to-One with BookEntity

---

## API Endpoints

### Authentication Endpoints (`/auth`)

#### 1. Sign Up
```http
POST /auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "password": "password123",
  "role": "user" // optional, defaults to "user"
}
```

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "username",
  "role": "user"
}
```

---

#### 2. Sign In
```http
POST /auth/signin
Content-Type: application/json

{
  "identifiant": "username or email",
  "password": "password123"
}
```

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "username",
  "role": "user",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

#### 3. Total Users Statistics
```http
GET /auth/stats/total-users
Authorization: Bearer <JWT_TOKEN>
```

**Guards:** `JwtAuthGuard`, `IsAdminGuard`

**Response:**
```json
{
  "total": 42
}
```

---

### Books Endpoints (`/books`)

#### 1. Get All Books
```http
GET /books/all
```

**Response:**
```json
{
  "listeBooks": [
    {
      "id": 1,
      "title": "Book Title",
      "year": 2024,
      "editor": "Publisher",
      "image": "https://example.com/image.jpg",
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

#### 2. Add New Book
```http
POST /books/new
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "title": "New Book",
  "year": 2024,
  "editor": "Publisher Name",
  "image": "https://example.com/cover.jpg",
  "category": "informatique",
  "author": 1
}
```

**Guards:** `JwtAuthGuard`, `IsAdminGuard`

**Validation:**
- `title`: Required, string
- `year`: Required, number
- `editor`: Required, string
- `image`: Required, string
- `category`: Required, must be one of the BookCategory enum values
- `author`: Required, number (author ID)

**Response:**
```json
{
  "data": {
    "id": 1,
    "title": "New Book",
    "year": 2024,
    "editor": "Publisher Name",
    "image": "https://example.com/cover.jpg",
    "category": "informatique",
    "author": 1,
    "user": 1
  }
}
```

---

#### 3. Get Book By ID
```http
GET /books/search/:id
Authorization: Bearer <JWT_TOKEN>
```

**Guards:** `JwtAuthGuard`

**Response:**
```json
[
  {
    "id": 1,
    "title": "Book Title",
    "year": 2024,
    "editor": "Publisher",
    "image": "https://example.com/image.jpg",
    "category": "roman",
    "author": {
      "prenom": "John",
      "nom": "Doe"
    }
  }
]
```

---

#### 4. Update Book
```http
PUT /books/edit/:id
Content-Type: application/json

{
  "title": "Updated Title",
  "year": 2025,
  "editor": "New Publisher",
  "image": "https://example.com/new-cover.jpg",
  "category": "science",
  "author": 2
}
```

**Response:**
```json
{
  "message": "Livre mise à jour",
  "response": {
    "id": 1,
    "title": "Updated Title",
    ...
  }
}
```

---

#### 5. Remove Book (Hard Delete with Entity)
```http
DELETE /books/remove/:id
```

**Response:**
```json
{
  "message": "Le livre Book Title a été supprimé avec succès"
}
```

---

#### 6. Delete Book (Hard Delete by ID)
```http
DELETE /books/delete/:id
```

**Response:**
```json
{
  "raw": [],
  "affected": 1
}
```

---

#### 7. Soft Delete Book
```http
DELETE /books/softdelete/:id
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

#### 8. Restore Soft Deleted Book
```http
PATCH /books/restore/:id
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

#### 9. Recover Book
```http
PATCH /books/recover/:id
```

**Response:**
```json
{
  "message": "Le livre Book Title a été restauré avec succès"
}
```

---

#### 10. Books Statistics (Books Per Year)
```http
GET /books/stats
Authorization: Bearer <JWT_TOKEN>
```

**Guards:** `JwtAuthGuard`, `IsAdminGuard`

**Response:**
```json
[
  {
    "book_year": 2023,
    "NbBooks": "5"
  },
  {
    "book_year": 2024,
    "NbBooks": "12"
  }
]
```

---

### Authors Endpoints (`/author`)

#### 1. Get All Authors
```http
GET /author/all
```

**Response:**
```json
[
  {
    "id": 1,
    "prenom": "John",
    "nom": "Doe",
    "listeLivres": [
      {
        "id": 1,
        "title": "Book Title",
        "year": 2024,
        ...
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updateAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

#### 2. Add Author
```http
POST /author/add
Content-Type: application/json

{
  "prenom": "Jane",
  "nom": "Smith"
}
```

**Response:**
```json
{
  "id": 2,
  "prenom": "Jane",
  "nom": "Smith",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updateAt": "2024-01-01T00:00:00.000Z"
}
```

---

### Favorites Endpoints (`/favoris`)

All favorites endpoints require JWT authentication.

#### 1. Add Book to Favorites
```http
POST /favoris/:bookId
Authorization: Bearer <JWT_TOKEN>
```

**Response:**
```json
{
  "message": "Added to favorites"
}
```

**Error (if already exists):**
```json
{
  "statusCode": 409,
  "message": "Already in favorites"
}
```

---

#### 2. Remove Book from Favorites
```http
DELETE /favoris/:bookId
Authorization: Bearer <JWT_TOKEN>
```

**Response:** Empty (204 No Content)

---

#### 3. Get User's Favorites
```http
GET /favoris
Authorization: Bearer <JWT_TOKEN>
```

**Response:**
```json
[
  {
    "id": 1,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "book": {
      "id": 1,
      "title": "Book Title",
      "year": 2024,
      "editor": "Publisher",
      "image": "https://example.com/image.jpg",
      "category": "roman",
      "author": {
        "id": 1,
        "prenom": "John",
        "nom": "Doe"
      }
    }
  }
]
```

---

#### 4. Total Favorites Statistics
```http
GET /favoris/stats/total
Authorization: Bearer <JWT_TOKEN>
```

**Guards:** `JwtAuthGuard`, `IsAdminGuard`

**Response:**
```json
{
  "total": 156
}
```

---

#### 5. Most Favorited Books
```http
GET /favoris/stats/most-favourited?limit=10
Authorization: Bearer <JWT_TOKEN>
```

**Guards:** `JwtAuthGuard`, `IsAdminGuard`

**Query Parameters:**
- `limit` (optional): Number of results to return (default: 10)

**Response:**
```json
[
  {
    "bookId": 1,
    "title": "Popular Book",
    "image": "https://example.com/image.jpg",
    "authorName": "John Doe",
    "count": 45
  },
  {
    "bookId": 2,
    "title": "Another Popular Book",
    "image": "https://example.com/image2.jpg",
    "authorName": "Jane Smith",
    "count": 38
  }
]
```

---

### Tasks Endpoints (`/tasks`)

**Note:** Tasks module uses in-memory storage (not database-backed).

#### 1. Get All Tasks
```http
GET /tasks/all
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

#### 2. Get Task By ID
```http
GET /tasks/search/:id
```

**Response:**
```json
{
  "id": "1",
  "title": "Project 0",
  "statut": "todo",
  "year": 2025,
  "createdAt": "2024-06-06T00:00:00.000Z"
}
```

---

#### 3. Get Tasks Statistics (Filter by Year Range)
```http
GET /tasks/stats?startYear=2024&endYear=2026
```

**Query Parameters:**
- `startYear`: Start year (required, integer)
- `endYear`: End year (required, integer)

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

#### 4. Add New Task
```http
POST /tasks/add
Content-Type: application/json

{
  "title": "New Task",
  "year": 2024,
  "statut": "todo"
}
```

**Validation:**
- `title`: Length between 3-10 characters
- `year`: Integer between 2020-2030
- `statut`: Must be one of: 'todo', 'done', 'in progress'

**Response:**
```json
{
  "message": "Task added successfully",
  "generatedId": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

#### 5. Update Task
```http
PUT /tasks/edit/:id
Content-Type: application/json

{
  "title": "Updated Task",
  "year": 2025,
  "statut": "in progress"
}
```

**Response:**
```json
{
  "message": "Task updated successfully",
  "tab": [
    {
      "taskId": "1",
      "title": "Updated Task",
      "year": 2025,
      "statut": "in progress"
    }
  ]
}
```

---

#### 6. Delete Task
```http
DELETE /tasks/delete/:deleteId
```

**Response:**
```json
{
  "message": "Task deleted",
  "tab": [
    // remaining tasks
  ]
}
```

---

#### 7. Hello Endpoint (Test)
```http
GET /tasks/hello
```

**Response:**
```json
{
  "prenom": "Nidhal",
  "anneee": 2025
}
```

---

## Authentication & Authorization

### JWT Strategy

The application uses JWT (JSON Web Tokens) for authentication.

**Token Structure:**
```json
{
  "id": 1,
  "role": "admin",
  "iat": 1234567890,
  "exp": 1234567890
}
```

**Token Expiration:** 1 week

**Secret:** Stored in environment variable `JWT_SECRET`

---

### Password Security

- **Hashing Algorithm:** bcrypt
- **Salt:** Generated per user using `bcrypt.genSalt()`
- **Storage:** Password and salt stored separately in database

---

### Guards

#### 1. **JwtAuthGuard**
- **Location:** `src/guards/jwt-auth/jwt-auth.guard.ts`
- **Purpose:** Validates JWT token
- **Usage:** Applied to protected routes
- **Extends:** `AuthGuard('jwt')` from Passport

#### 2. **IsAdminGuard**
- **Location:** `src/guards/is-admin/is-admin.guard.ts`
- **Purpose:** Checks if user has admin role
- **Usage:** Applied to admin-only routes
- **Logic:** Verifies `req.user.userRole === Roles.ROLE_ADMIN`

---

### Protected Routes

| Endpoint                          | JWT Required | Admin Required |
|-----------------------------------|--------------|----------------|
| POST /books/new                   | ✓            | ✓              |
| GET /books/search/:id             | ✓            | ✗              |
| GET /books/stats                  | ✓            | ✓              |
| POST /favoris/:bookId             | ✓            | ✗              |
| DELETE /favoris/:bookId           | ✓            | ✗              |
| GET /favoris                      | ✓            | ✗              |
| GET /favoris/stats/total          | ✓            | ✓              |
| GET /favoris/stats/most-favourited| ✓            | ✓              |
| GET /auth/stats/total-users       | ✓            | ✓              |

---

## Modules Structure

### 1. **AppModule** (Root Module)
- **Location:** `src/app.module.ts`
- **Imports:**
  - TasksModule
  - BooksModule
  - FavorisModule
  - AuthModule
  - TypeOrmModule (MySQL configuration)
  - ConfigModule
- **Middlewares:**
  - FirstMiddleware (applied to GET /tasks/*)
  - SecondMiddleware (applied to all routes)

---

### 2. **AuthModule**
- **Location:** `src/auth/auth.module.ts`
- **Controllers:** AuthController
- **Providers:** AuthService, JwtStrategy
- **Imports:**
  - TypeOrmModule.forFeature([UserEntity])
  - JwtModule (with async configuration)
  - PassportModule
  - ConfigModule

---

### 3. **BooksModule**
- **Location:** `src/books/books.module.ts`
- **Controllers:** BooksController, AuthorController
- **Providers:** BooksService, AuthorService
- **Imports:**
  - TypeOrmModule.forFeature([BookEntity, AuthorEntity])

---

### 4. **FavorisModule**
- **Location:** `src/books/favoris.module.ts`
- **Controllers:** FavorisController
- **Providers:** FavorisService
- **Imports:**
  - TypeOrmModule.forFeature([Favoris, BookEntity, UserEntity])

---

### 5. **TasksModule**
- **Location:** `src/tasks/tasks.module.ts`
- **Controllers:** TasksController
- **Providers:** TasksService
- **Note:** Uses in-memory storage, not database-backed

---

## Middlewares

### 1. **FirstMiddleware**
- **Location:** `src/middlewares/first/first.middleware.ts`
- **Applied to:** GET /tasks/*
- **Purpose:** Logs "Je suis dans le FirstMiddleware" and adds `section: 'ISIDS'` to response object

```typescript
use(req: any, res: any, next: () => void) {
  console.log('Je suis dans le FirstMiddleware');
  res.section = 'ISIDS';
  next();
}
```

---

### 2. **SecondMiddleware**
- **Location:** `src/middlewares/second/second.middleware.ts`
- **Applied to:** All routes
- **Purpose:** Logs "Je suis le secondMiddleware"

```typescript
use(req: any, res: any, next: () => void) {
  console.log('Je suis le secondMiddleware');
  next();
}
```

---

## DTOs & Validation

### 1. **CreateBookDto**
- **Location:** `src/DTO/create-book.dto.ts`

```typescript
{
  title: string;      // @IsNotEmpty, @IsString
  year: number;       // @IsNotEmpty, @IsNumber
  editor: string;     // @IsNotEmpty, @IsString
  image: string;      // @IsNotEmpty, @IsString
  category: BookCategory; // @IsNotEmpty, @IsEnum
  author: number;     // @IsNotEmpty
}
```

---

### 2. **TaskDTO**
- **Location:** `src/tasks/DTO/task.dto.ts`

```typescript
{
  title: string;      // @Length(3, 10)
  year: number;       // @IsInt, @Min(2020), @Max(2030)
  statut: string;     // @IsIn(['todo', 'done', 'in progress'])
}
```

---

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
JWT_SECRET=your_secret_key_here
```

---

### Database Configuration

**Location:** `src/app.module.ts`

```typescript
TypeOrmModule.forRoot({
  type: 'mysql',
  host: 'localhost',
  port: 3308,
  username: 'root',
  password: '',
  database: 'isids26',
  autoLoadEntities: true,
  synchronize: true, // ⚠️ Set to false in production
})
```

---

### CORS Configuration

**Location:** `src/main.ts`

```typescript
app.enableCors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
});
```

---

### Global Validation Pipe

**Location:** `src/main.ts`

```typescript
app.useGlobalPipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
);
```

---

## Project Scripts

```bash
# Development
npm run start:dev        # Start in watch mode
npm run start:debug      # Start in debug mode

# Production
npm run build            # Build the project
npm run start:prod       # Start production server

# Testing
npm run test             # Run unit tests
npm run test:watch       # Run tests in watch mode
npm run test:cov         # Run tests with coverage
npm run test:e2e         # Run end-to-end tests

# Code Quality
npm run lint             # Run ESLint
npm run format           # Format code with Prettier
```

---

## API Testing Collections

The project includes Bruno API collections for testing:

### ISIDS-25 Collection
- Located in `/ISIDS-25/` directory
- Contains 21 API request files

### Libratest Collection
- Located in `/libratest/` directory
- Contains 11 API request files

---

## Key Features

### 1. **Soft Delete Support**
- Books and Authors support soft deletion
- Uses `@DeleteDateColumn()` from TypeORM
- Provides both soft delete and restore functionality

### 2. **Eager Loading**
- Authors automatically load their books (eager: true)
- Optimizes queries for author-book relationships

### 3. **Role-Based Access Control**
- Two roles: USER and ADMIN
- Admin-only endpoints for statistics and book management
- JWT-based authentication

### 4. **Validation**
- Global validation pipe enabled
- DTO validation using class-validator
- Automatic transformation and whitelist filtering

### 5. **Favorites System**
- Users can favorite books
- Prevents duplicate favorites
- Statistics for most favorited books
- Admin can view total favorites count

---

## Security Considerations

### ⚠️ Production Recommendations

1. **Database Synchronization**
   - Set `synchronize: false` in production
   - Use migrations instead

2. **Environment Variables**
   - Never commit `.env` file
   - Use strong JWT secret
   - Rotate secrets regularly

3. **Password Security**
   - Bcrypt with salt (✓ Implemented)
   - Consider increasing bcrypt rounds for production

4. **CORS**
   - Restrict origins in production
   - Currently allows only `http://localhost:5173`

5. **Rate Limiting**
   - Consider adding rate limiting middleware
   - Protect against brute force attacks

6. **Input Validation**
   - DTO validation enabled (✓)
   - Consider additional sanitization

---

## Error Handling

### Common HTTP Status Codes

| Code | Exception              | Usage                          |
|------|------------------------|--------------------------------|
| 404  | NotFoundException      | Resource not found             |
| 409  | ConflictException      | Duplicate entry, already exists|
| 401  | UnauthorizedException  | Invalid credentials            |
| 403  | ForbiddenException     | Insufficient permissions       |

---

## Database Relationships Summary

```
UserEntity (1) ──────── (N) BookEntity
UserEntity (1) ──────── (N) Favoris
AuthorEntity (1) ────── (N) BookEntity
BookEntity (1) ──────── (N) Favoris
```

---

## Timestamps

All entities (except Favoris) extend `TimeStampISIDS` class:

- `createdAt`: Automatically set on creation
- `updateAt`: Automatically updated on modification
- `deleteAt`: Set when soft deleted (nullable)

---

## Additional Notes

### Tasks Module
- **Not database-backed** - uses in-memory array
- Data is lost on server restart
- Suitable for demonstration/learning purposes
- Consider migrating to database for production

### Author Eager Loading
- Authors automatically include their books
- May cause performance issues with large datasets
- Consider lazy loading for production

### Book Categories
- Predefined enum values
- French language categories
- Extensible through enum modification

---

## Contact & Support

For questions or issues, refer to the project repository or contact the development team.

---

**Last Updated:** April 26, 2026  
**Documentation Version:** 1.0.0
