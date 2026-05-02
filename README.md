<div align="center">
  <img src="./Frontend/assets/images/LOGO_maktaba.png" alt="Maktabati Logo" width="200"/>
  
  # 📚 Maktabati
  
  ### *Your Modern Digital Library Platform*
  
  [![Vue.js](https://img.shields.io/badge/Vue.js-3.4-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)](https://vuejs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.1-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Pinia](https://img.shields.io/badge/Pinia-2.1-FFD859?style=for-the-badge&logo=pinia&logoColor=black)](https://pinia.vuejs.org/)
  [![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

  [Live Demo](#) • [Documentation](#) • [Report Bug](#) • [Request Feature](#)

</div>

---

## 🚀 Project Overview

**Maktabati** (Arabic: مكتبتي - "My Library") is a modern, full-stack digital library management platform that revolutionizes how users discover, organize, and interact with books. Built with cutting-edge web technologies, it provides an intuitive and responsive experience for both readers and administrators.

### 🎯 Key Value Proposition

- **Smart Discovery**: Advanced filtering and search capabilities help users find exactly what they're looking for
- **Personalized Experience**: Favorites system allows users to curate their personal reading lists
- **Performance First**: Client-side pagination ensures lightning-fast browsing even with large catalogs
- **Admin Control**: Comprehensive dashboard for managing books, authors, and user analytics
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices

---

## ✨ Features

### 📖 For Readers

- **📚 Book Browsing**: Explore an extensive catalog with beautiful card-based layouts
- **❤️ Favorites System**: Save and manage your favorite books for quick access
- **🔍 Smart Filtering**: Filter books by category, author, or search by title
- **📄 Pagination**: Smooth navigation through large collections (12 books per page)
- **📱 Responsive UI**: Optimized viewing experience on all devices
- **🎨 Modern Design**: Clean, intuitive interface with smooth animations

### 👨‍💼 For Administrators

- **📊 Analytics Dashboard**: Real-time statistics on users, books, and favorites
- **📚 Book Management**: Full CRUD operations for books and authors
- **👥 User Insights**: Track total users and engagement metrics
- **🏆 Popular Books**: View most favorited books with detailed statistics
- **🖼️ Image Upload**: Support for book cover images with preview

### 🎯 Core Capabilities

- **JWT Authentication**: Secure user authentication and authorization
- **Role-Based Access**: Separate interfaces for users and administrators
- **Real-time Updates**: Instant UI updates after data modifications
- **Error Handling**: Graceful error management with user-friendly messages
- **Loading States**: Skeleton screens and loaders for better UX

---

## 🏗️ Architecture

Maktabati follows a modern **Single Page Application (SPA)** architecture built on Vue.js 3 with the Composition API, ensuring maintainability, scalability, and optimal performance.

### 📐 High-Level Structure

```
┌─────────────────────────────────────────────────────────────┐
│                        Vue.js SPA                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │    Views     │  │  Components  │  │   Layouts    │    │
│  │              │  │              │  │              │    │
│  │ • BooksView  │  │ • BookCard   │  │ • MainLayout │    │
│  │ • Dashboard  │  │ • FilterPanel│  │ • AdminLayout│    │
│  │ • Favorites  │  │ • Pagination │  │              │    │
│  └──────┬───────┘  └──────┬───────┘  └──────────────┘    │
│         │                 │                                │
│         └─────────┬───────┘                                │
│                   │                                        │
│         ┌─────────▼─────────┐                             │
│         │   Vue Router      │                             │
│         │  (Navigation)     │                             │
│         └─────────┬─────────┘                             │
│                   │                                        │
│         ┌─────────▼─────────┐                             │
│         │   Pinia Stores    │                             │
│         │  (State Mgmt)     │                             │
│         │                   │                             │
│         │ • books           │                             │
│         │ • favorites       │                             │
│         │ • auth            │                             │
│         │ • admin           │                             │
│         └─────────┬─────────┘                             │
│                   │                                        │
│         ┌─────────▼─────────┐                             │
│         │    Services       │                             │
│         │  (API Layer)      │                             │
│         │                   │                             │
│         │ • booksService    │                             │
│         │ • authService     │                             │
│         │ • favoritesService│                             │
│         └─────────┬─────────┘                             │
│                   │                                        │
└───────────────────┼─────────────────────────────────────────┘
                    │
                    ▼
            ┌───────────────┐
            │  Backend API  │
            │   (NestJS)    │
            └───────────────┘
```

### 🧩 Component-Based Design

The application is built using **reusable, composable components**:

- **Views**: Page-level components that compose smaller components
- **Components**: Reusable UI elements (BookCard, FilterPanel, Pagination)
- **Layouts**: Wrapper components that define page structure
- **Services**: API communication layer with centralized error handling
- **Stores**: Centralized state management with Pinia

This architecture ensures:
- ✅ **Separation of Concerns**: Each layer has a single responsibility
- ✅ **Reusability**: Components can be used across different views
- ✅ **Testability**: Isolated units are easier to test
- ✅ **Maintainability**: Changes in one layer don't affect others

---

## 🔄 State Management with Pinia

Pinia serves as the **central nervous system** of the application, managing all shared state and business logic.

### 🎯 Why Pinia?

- **Type Safety**: Full TypeScript support with automatic type inference
- **Devtools Integration**: Time-travel debugging and state inspection
- **Modular**: Each store handles a specific domain
- **Lightweight**: Smaller bundle size compared to Vuex

### 📦 Store Architecture

```typescript
┌─────────────────────────────────────────────────────────┐
│                    Pinia Stores                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  📚 Books Store                                         │
│  ├─ State: books[], filters, pagination                │
│  ├─ Getters: filteredBooks, paginatedBooks, totalPages │
│  └─ Actions: fetchBooks(), setFilters(), setPage()     │
│                                                         │
│  ❤️ Favorites Store                                     │
│  ├─ State: favorites[], loading                        │
│  ├─ Getters: isFavorite(bookId)                        │
│  └─ Actions: fetchFavorites(), toggle()                │
│                                                         │
│  🔐 Auth Store                                          │
│  ├─ State: user, token, isAuthenticated                │
│  ├─ Getters: isAdmin, userName                         │
│  └─ Actions: login(), logout(), signup()               │
│                                                         │
│  📊 Admin Store                                         │
│  ├─ State: totalUsers, mostFavorited, stats            │
│  ├─ Getters: (computed statistics)                     │
│  └─ Actions: fetchStats()                              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 🔗 How State Flows

1. **Component** dispatches an action (e.g., `booksStore.fetchBooks()`)
2. **Action** calls the service layer to fetch data from API
3. **State** is updated with the response data
4. **Getters** compute derived state (filtering, sorting, pagination)
5. **Component** reactively updates the UI

**Example Flow:**
```
User clicks filter → Component calls setFilters() → 
Store updates filters state → Computed getters recalculate → 
UI automatically re-renders with filtered results
```

---

## 🔀 Routing & Navigation

Vue Router manages all navigation and page transitions in the application.

### 🗺️ Route Structure

```
/                          → Home (redirects to /books)
/books                     → Browse all books
/books/:id                 → Book details page
/favorites                 → User's favorite books
/login                     → Authentication
/signup                    → User registration
/profile                   → User profile

/admin                     → Admin dashboard
/admin/books               → Manage books
/admin/authors             → Manage authors
/admin/stats               → View statistics
```

### 🛡️ Navigation Guards

- **Authentication Guard**: Protects routes requiring login
- **Admin Guard**: Restricts admin routes to authorized users
- **Redirect Logic**: Automatically redirects based on auth state

### 🎨 Smooth Transitions

All route changes include smooth fade transitions for a polished user experience.

---

## 📄 Pagination Logic

Pagination is a **critical performance feature** that ensures smooth browsing even with thousands of books.

### 🎯 Why Client-Side Pagination?

**Maktabati uses client-side pagination** for optimal user experience:

✅ **Instant Page Changes**: No server round-trips = zero loading time  
✅ **Seamless Filtering**: Filters work instantly across all data  
✅ **Reduced Server Load**: API called once, not on every page change  
✅ **Better UX**: Smooth transitions without loading spinners  

### ⚙️ How It Works

```typescript
// 1. Fetch all books once
await booksStore.fetchBooks() // → books[] = [1000 books]

// 2. Apply filters (if any)
filteredBooks = books.filter(book => 
  matchesCategory && matchesAuthor && matchesSearch
)

// 3. Calculate pagination
const start = (currentPage - 1) * itemsPerPage  // e.g., (2-1) * 12 = 12
const end = start + itemsPerPage                 // e.g., 12 + 12 = 24

// 4. Slice the array
paginatedBooks = filteredBooks.slice(start, end) // → [book13...book24]

// 5. Calculate total pages
totalPages = Math.ceil(filteredBooks.length / itemsPerPage)
```

### 📊 Pagination Flow

```
┌─────────────────────────────────────────────────────────┐
│  All Books (1000)                                       │
│  ↓                                                      │
│  Apply Filters → Filtered Books (250)                  │
│  ↓                                                      │
│  Apply Sorting → Sorted Books (250)                    │
│  ↓                                                      │
│  Slice Array → Page 1: Books 1-12                      │
│              → Page 2: Books 13-24                      │
│              → Page 3: Books 25-36                      │
│              → ...                                      │
│              → Page 21: Books 241-250                   │
└─────────────────────────────────────────────────────────┘
```

### 🎮 User Interaction

1. User clicks **"Next Page"** button
2. `setPage(2)` updates `pagination.page` in store
3. Computed property `paginatedBooks` automatically recalculates
4. Vue reactivity updates the UI instantly
5. **No API call needed** ⚡

### 📈 Performance Benefits

| Metric | Client-Side | Server-Side |
|--------|-------------|-------------|
| Page Change Speed | **Instant** | 200-500ms |
| Filter + Paginate | **Instant** | 200-500ms |
| Server Requests | 1 (initial) | 1 per page |
| User Experience | Seamless | Loading states |

---

## 🔍 Filtering System

The filtering system provides **powerful search capabilities** while maintaining excellent performance.

### 🎯 Filter Types

1. **📂 Category Filter**
   - Dropdown selection
   - Options: Roman, Science, Histoire, Informatique, Art, Philosophie, Autre
   - Instant filtering on selection

2. **👤 Author Filter**
   - Dynamic dropdown populated from available books
   - Alphabetically sorted
   - Shows only authors with books in the catalog

3. **🔎 Search Filter** (if implemented)
   - Real-time search across book titles and authors
   - Case-insensitive matching

### ⚡ How Filters Work

```typescript
// Filters are applied in sequence using computed properties

// Step 1: Apply search filter
if (filters.search) {
  result = books.filter(book => 
    book.title.includes(search) || 
    book.author.name.includes(search)
  )
}

// Step 2: Apply category filter
if (filters.category) {
  result = result.filter(book => 
    book.category === filters.category
  )
}

// Step 3: Apply author filter
if (filters.author) {
  result = result.filter(book => 
    book.author.name === filters.author
  )
}

// Step 4: Paginate the filtered results
paginatedBooks = result.slice(start, end)
```

### 🎨 Filter UI Features

- **Active Filter Chips**: Visual indicators showing applied filters
- **Quick Reset**: One-click button to clear all filters
- **Responsive Design**: Adapts to mobile screens
- **Smooth Animations**: Filters slide in with elegant transitions

### 🔄 Filter + Pagination Integration

When filters change:
1. Filtered results are recalculated
2. **Pagination resets to page 1** (important UX detail!)
3. Total pages are recalculated based on filtered count
4. UI updates instantly

---

## 🧱 Tech Stack

### 🎨 Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Vue.js** | 3.4 | Progressive JavaScript framework |
| **TypeScript** | 5.1+ | Type-safe development |
| **Pinia** | 2.1 | State management |
| **Vue Router** | 4.3 | Client-side routing |
| **Axios** | 1.6 | HTTP client for API calls |
| **Vite** | 5.2 | Lightning-fast build tool |

### 🔧 Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **NestJS** | 10.0 | Node.js framework |
| **TypeORM** | 0.3 | Database ORM |
| **MySQL** | 8.4 | Relational database |
| **JWT** | - | Authentication tokens |
| **Bcrypt** | - | Password hashing |

### 🐳 DevOps

| Technology | Purpose |
|------------|---------|
| **Docker** | Containerization |
| **Docker Compose** | Multi-container orchestration |

---

## ⚙️ Installation & Setup

### 📋 Prerequisites

- **Node.js** 20.x or higher
- **npm** 10.x or higher
- **Docker** (optional, for containerized setup)

### 🚀 Quick Start (Local Development)

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/maktabati.git
cd maktabati
```

#### 2️⃣ Setup Frontend

```bash
cd Frontend
npm install
cp .env.example .env
```

Edit `.env` and configure:
```env
VITE_API_URL=http://localhost:3000
```

#### 3️⃣ Setup Backend

```bash
cd Backend
npm install
cp .env.example .env
```

Edit `.env` and configure:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_NAME=maktabati
JWT_SECRET=your_super_secret_key
```

#### 4️⃣ Start Development Servers

**Terminal 1 - Backend:**
```bash
cd Backend
npm run start:dev
```

**Terminal 2 - Frontend:**
```bash
cd Frontend
npm run dev
```

#### 5️⃣ Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

---

## 🐳 Docker Setup

For a **one-command setup** with all services:

### 🚀 Start Everything

```bash
docker-compose up -d --build
```

### 📍 Access Points

| Service | URL | Credentials |
|---------|-----|-------------|
| **Frontend** | http://localhost:5173 | - |
| **Backend API** | http://localhost:3000 | - |
| **phpMyAdmin** | http://localhost:8080 | root / root |
| **MySQL** | localhost:3308 | root / root |

### 🛑 Stop Services

```bash
docker-compose down
```

### 📊 View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f frontend
docker-compose logs -f backend
```

---

## 📸 Screenshots

### 🏠 Home Page
*Browse through the complete book catalog with beautiful card layouts*

### 📚 Book Catalog with Filters
*Smart filtering by category and author with instant results*

### ❤️ Favorites Collection
*Personalized reading list with quick access to saved books*

### 📊 Admin Dashboard
*Comprehensive analytics and management interface*

---

## 🌟 Why This Project?

### 💡 Learning Value

This project demonstrates mastery of:

- ✅ **Modern Vue.js 3**: Composition API, TypeScript, reactive programming
- ✅ **State Management**: Complex state with Pinia stores
- ✅ **Performance Optimization**: Client-side pagination, computed properties
- ✅ **API Integration**: RESTful API consumption with Axios
- ✅ **Authentication**: JWT-based auth with role-based access
- ✅ **Responsive Design**: Mobile-first, adaptive layouts
- ✅ **Component Architecture**: Reusable, maintainable components
- ✅ **Full-Stack Integration**: Frontend-backend communication

### 🎯 Real-World Relevance

Maktabati solves real problems:

- **Libraries & Bookstores**: Digital catalog management
- **Educational Institutions**: Student reading lists and resources
- **Personal Use**: Organize personal book collections
- **Book Clubs**: Shared reading lists and recommendations

### 🚀 Production-Ready Features

- Secure authentication and authorization
- Scalable architecture
- Error handling and validation
- Loading states and user feedback
- Responsive across all devices
- Docker containerization for easy deployment

---

## 📝 API Documentation

### 🔗 Base URL
```
http://localhost:3000
```

### 📚 Books Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/books/all` | Get all books |
| GET | `/books/search/:id` | Get book by ID |
| POST | `/books/new` | Create new book (Admin) |
| PUT | `/books/edit/:id` | Update book (Admin) |
| DELETE | `/books/remove/:id` | Delete book (Admin) |

### ❤️ Favorites Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/favoris` | Get user's favorites |
| POST | `/favoris/:bookId` | Add to favorites |
| DELETE | `/favoris/:bookId` | Remove from favorites |
| GET | `/favoris/stats/total` | Get total favorites count |
| GET | `/favoris/stats/most-favourited` | Get most favorited books |

### 🔐 Auth Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Register new user |
| POST | `/auth/signin` | Login user |
| GET | `/auth/stats/total-users` | Get total users (Admin) |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Your Name**

- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Name](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- Vue.js team for the amazing framework
- NestJS team for the robust backend framework
- All open-source contributors

---

<div align="center">
  
  ### ⭐ Star this repo if you find it helpful!
  
  Made with ❤️ and ☕
  
</div>
