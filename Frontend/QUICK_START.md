# 🚀 Quick Start Guide

## Get Up and Running in 5 Minutes

### Prerequisites
- Node.js 16+ installed
- npm or yarn
- Backend API running on `http://localhost:3000`

---

## Step 1: Install Dependencies

```bash
cd Frontend
npm install
```

**Expected output:**
```
added 150 packages in 30s
```

---

## Step 2: Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:3000
```

---

## Step 3: Start Development Server

```bash
npm run dev
```

**Expected output:**
```
VITE v5.2.0  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

---

## Step 4: Open in Browser

Visit: **http://localhost:5173**

You should see the beautiful hero carousel! 🎉

---

## First Steps in the App

### 1. **Browse Books (No Login Required)**
- Homepage shows hero carousel
- Scroll down to see featured books
- Browse all books below
- Use search and filters

### 2. **Create an Account**
- Click "Sign Up" in navbar
- Fill in email, username, password
- Click "Sign Up"
- You're automatically logged in!

### 3. **Add Favorites**
- Click on any book card
- View book details
- Click "Add to Favorites" button
- Go to "Favorites" in navbar to see your collection

### 4. **Admin Features (If Admin)**
- Click "Admin" in navbar
- View dashboard with statistics
- Manage books (Create, Edit, Delete)
- Manage authors
- View analytics

---

## Testing the New Features

### Test Hero Carousel
1. Go to homepage
2. Watch it auto-rotate (6 seconds)
3. Try dragging left/right
4. Click navigation arrows
5. Click dot indicators
6. Use search bar in any slide

### Test Image Upload
1. Login as admin
2. Go to Admin → Books
3. Click "Add Book"
4. In image field:
   - **URL Tab:** Paste `https://via.placeholder.com/300x400`
   - **Upload Tab:** Drag an image file
5. See live preview
6. Submit form

### Test Author Management
1. Login as admin
2. Go to Admin → Authors
3. Click "Add Author"
4. Enter: First Name: "Jane", Last Name: "Austen"
5. Click "Create Author"
6. Click eye icon to view books (empty for now)
7. Go to Books, create a book with this author
8. Return to Authors, click eye icon again

---

## Common Commands

### Development
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Linting
```bash
npm run lint         # Check code quality
```

---

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5173
npx kill-port 5173

# Or use different port
npm run dev -- --port 3001
```

### API Connection Issues
1. Check backend is running on port 3000
2. Verify `.env` has correct API URL
3. Check browser console for CORS errors

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Images Not Loading
- Check image URLs are valid
- For uploaded images, ensure file size < 10MB
- Check browser console for errors

---

## Project Structure Overview

```
Frontend/
├── src/
│   ├── components/      # Reusable UI components
│   ├── views/          # Page components
│   ├── stores/         # Pinia state management
│   ├── services/       # API calls
│   ├── router/         # Vue Router config
│   ├── types/          # TypeScript types
│   └── assets/         # Images, styles
├── public/             # Static files
└── index.html          # Entry HTML
```

---

## Key Files to Know

### Configuration
- `vite.config.ts` - Vite configuration
- `tsconfig.json` - TypeScript configuration
- `.env` - Environment variables

### Entry Points
- `index.html` - HTML entry
- `src/main.ts` - JavaScript entry
- `src/App.vue` - Root component

### Routing
- `src/router/index.ts` - All routes defined here

### State
- `src/stores/auth.ts` - Authentication state
- `src/stores/books.ts` - Books state
- `src/stores/favorites.ts` - Favorites state
- `src/stores/admin.ts` - Admin statistics

### Styles
- `src/assets/styles/main.css` - Global styles & design system

---

## Development Tips

### Hot Module Replacement (HMR)
Changes are reflected instantly without page reload!

### Vue DevTools
Install Vue DevTools browser extension for debugging:
- Chrome: [Vue.js devtools](https://chrome.google.com/webstore)
- Firefox: [Vue.js devtools](https://addons.mozilla.org/firefox)

### TypeScript
- Hover over variables to see types
- Use `Ctrl+Space` for autocomplete
- Check `tsconfig.json` for strict mode settings

### Component Development
1. Create component in `src/components/`
2. Import in parent component
3. Use in template
4. See changes instantly with HMR

---

## Testing Checklist

Before deploying, test:

- [ ] Homepage loads with hero carousel
- [ ] Search works
- [ ] Filters work
- [ ] Pagination works
- [ ] Login/Signup works
- [ ] Add/remove favorites works
- [ ] Book details page works
- [ ] Admin dashboard loads (if admin)
- [ ] Create book with image upload works
- [ ] Create author works
- [ ] Responsive on mobile
- [ ] No console errors

---

## Production Build

### Build
```bash
npm run build
```

Output in `dist/` folder.

### Preview Build
```bash
npm run preview
```

### Deploy
Upload `dist/` folder to your hosting:
- Netlify
- Vercel
- AWS S3
- Any static host

---

## Getting Help

### Documentation
- `README.md` - Setup & overview
- `FEATURES.md` - Feature details
- `CHANGELOG.md` - Version history
- `VISUAL_GUIDE.md` - Design system
- `UPGRADE_SUMMARY.md` - What's new

### Resources
- [Vue 3 Docs](https://vuejs.org/)
- [Pinia Docs](https://pinia.vuejs.org/)
- [Vue Router Docs](https://router.vuejs.org/)
- [TypeScript Docs](https://www.typescriptlang.org/)
- [Vite Docs](https://vitejs.dev/)

---

## Next Steps

1. ✅ Get the app running
2. ✅ Explore the UI
3. ✅ Test new features
4. ✅ Read documentation
5. ✅ Customize for your needs
6. ✅ Deploy to production

---

**Happy Coding! 🎉**

If you encounter any issues, check the documentation files or the browser console for error messages.

---

**Last Updated:** April 27, 2026
