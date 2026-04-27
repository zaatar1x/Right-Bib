# Maktaba - Library Management System Frontend

Production-ready Vue 3 frontend for the Library Management System with premium SaaS-style UI.

## 🌟 Key Features

### **For Users**
- 📚 Browse books with advanced search & filters
- ⭐ Save favorite books
- 🎠 Discover trending books in featured carousel
- 👤 Personal profile & reading history
- 🔍 Real-time search with debouncing

### **For Admins**
- 📊 Dashboard with statistics & analytics
- 📖 Full CRUD for books
- ✍️ Full CRUD for authors
- 📈 View most favorited books
- 📉 Books distribution by year
- 👥 User statistics

### **UI/UX Highlights**
- 🎨 Premium SaaS-style design
- 🎠 Auto-rotating hero carousel
- 🖼️ Drag & drop image upload
- ✨ Smooth animations & transitions
- 📱 Fully responsive (mobile-first)
- 🎯 Glass morphism effects
- 🌊 Floating 3D elements

## Tech Stack

- **Vue 3** (Composition API)
- **TypeScript**
- **Vue Router** (Navigation)
- **Pinia** (State Management)
- **Axios** (HTTP Client)
- **Vite** (Build Tool)

## Project Structure

```
Frontend/
├── src/
│   ├── assets/
│   │   ├── images/          # Logo and icons
│   │   └── styles/          # Global CSS with design system
│   ├── components/          # Reusable components
│   │   ├── BookCard.vue           # Enhanced with animations
│   │   ├── FilterPanel.vue        # With active chips
│   │   ├── Navbar.vue             # Glass morphism
│   │   ├── Pagination.vue         # Icon-based
│   │   ├── SearchBar.vue          # Pill design
│   │   ├── Sidebar.vue            # Admin navigation
│   │   ├── Loader.vue             # Premium spinner
│   │   ├── SkeletonCard.vue       # Loading state
│   │   ├── EmptyState.vue         # Animated
│   │   ├── FeaturedCarousel.vue   # Most favorited books
│   │   ├── HeroCarousel.vue       # Auto-slide hero
│   │   └── ImageUpload.vue        # Drag & drop upload
│   ├── layouts/             # Layout components
│   │   ├── MainLayout.vue
│   │   └── AdminLayout.vue
│   ├── views/               # Page components
│   │   ├── LoginView.vue          # Premium auth design
│   │   ├── SignupView.vue         # Premium auth design
│   │   ├── BooksView.vue          # With hero carousel
│   │   ├── BookDetailView.vue
│   │   ├── FavoritesView.vue
│   │   ├── ProfileView.vue
│   │   └── admin/
│   │       ├── DashboardView.vue  # Statistics overview
│   │       ├── BooksView.vue      # Books CRUD
│   │       ├── AuthorsView.vue    # Authors CRUD (NEW)
│   │       └── StatsView.vue      # Analytics
│   ├── stores/              # Pinia stores
│   │   ├── auth.ts
│   │   ├── books.ts
│   │   ├── favorites.ts
│   │   └── admin.ts
│   ├── services/            # API services
│   │   ├── api.ts
│   │   ├── auth.service.ts
│   │   ├── books.service.ts
│   │   ├── authors.service.ts
│   │   └── favorites.service.ts
│   ├── router/              # Vue Router
│   │   └── index.ts
│   ├── types/               # TypeScript types
│   │   └── index.ts
│   ├── App.vue
│   └── main.ts
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .env.example
├── README.md
├── FEATURES.md              # Detailed feature documentation
└── CHANGELOG.md             # Version history
```

## Features

### Public
- Browse books (no auth required)
- Search and filter books by category, year, title, author
- View book details (requires auth)
- Auto-rotating hero carousel with search
- Featured books carousel (most favorited)

### User
- Sign up / Sign in with JWT
- Add/remove favorites with optimistic updates
- View favorites collection
- User profile with statistics

### Admin
- Dashboard with real-time statistics
- Manage books (Create, Read, Update, Delete)
- Manage authors (Create, Read, View books)
- View analytics (books by year, most favorited)
- User statistics
- Drag & drop image upload for book covers

## Setup

1. **Install dependencies:**
```bash
cd Frontend
npm install
```

2. **Configure environment:**
```bash
cp .env.example .env
```

Edit `.env`:
```
VITE_API_URL=http://localhost:3000
```

3. **Run development server:**
```bash
npm run dev
```

4. **Build for production:**
```bash
npm run build
```

5. **Preview production build:**
```bash
npm run preview
```

## Authentication

JWT-based authentication with automatic token management:
- Token stored in localStorage + Pinia
- Auto-attached to API requests
- 401 responses trigger logout
- Route guards protect authenticated pages

## State Management

### Auth Store
- User data
- JWT token
- Authentication status
- Role-based access

### Books Store
- Books list
- Pagination
- Filters (search, category, year)
- Cached data

### Favorites Store
- User favorites
- Add/remove logic
- Optimistic updates

### Admin Store
- Statistics
- Analytics data
- Admin-only data

## Routing

### Public Routes
- `/login` - Login page
- `/signup` - Registration page
- `/books` - Browse books

### Protected Routes (Auth Required)
- `/books/:id` - Book details
- `/favorites` - User favorites
- `/profile` - User profile

### Admin Routes (Admin Role Required)
- `/admin/dashboard` - Admin dashboard with statistics
- `/admin/books` - Manage books (CRUD with image upload)
- `/admin/authors` - Manage authors (CRUD)
- `/admin/stats` - Statistics and analytics

## API Integration

All backend endpoints are integrated:
- Authentication (signup, signin)
- Books (CRUD, stats)
- Authors (list, create)
- Favorites (add, remove, list)
- Admin statistics

## Performance Optimizations

- Lazy-loaded routes (code splitting)
- Lazy loading images (`loading="lazy"`)
- Debounced search (300ms)
- Cached API responses in Pinia
- CSS-only animations (no JS libraries)
- Optimized re-renders with computed properties
- Skeleton loading states
- Optimistic UI updates for favorites
- No heavy UI libraries

## Design System

### Colors
- Primary: `#2563EB` (strong blue)
- Secondary: `#4F46E5` (indigo modern)
- Accent: `#F59E0B` (warm highlight)
- Background: `#F8FAFC` (soft white)
- Card: `#FFFFFF`
- Hover: `#F1F5F9`

### Typography
- Font: Inter (Google Fonts)
- Titles: 24-32px, bold
- Body: 14-16px, regular
- Clear hierarchy

### Components
- Modern card-based design
- Smooth transitions (cubic-bezier)
- Responsive layout
- Mobile-first approach
- Glass morphism effects
- Gradient backgrounds
- Floating animations

## New Components

### HeroCarousel
Auto-rotating hero section with:
- 3 slides with different messages
- Drag/swipe support
- Auto-play (6s interval)
- Navigation arrows & indicators
- Integrated search bar
- Floating 3D book animations

### ImageUpload
Advanced image upload with:
- **URL Input:** Paste image links from web
- **Drag & Drop:** Upload local files
- Live preview
- File validation (10MB max)
- Base64 encoding
- Remove uploaded image
- Tab-based interface

### FeaturedCarousel
Horizontal carousel showing:
- Most favorited books
- Smooth snap scrolling
- Navigation arrows
- Favorite count badges
- Lazy loading

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

### Code Style
- TypeScript strict mode
- Composition API
- Script setup syntax
- Scoped styles

### Best Practices
- Minimal, clean code
- Reusable components
- Type safety
- Error handling
- Loading states
- Empty states

## Production Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist` folder to your hosting service

3. Configure environment variables on your hosting platform

4. Ensure backend API is accessible from frontend domain

## License

MIT
