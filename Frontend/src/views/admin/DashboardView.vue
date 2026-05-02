<template>
  <div>
    <h1 class="page-title">Admin Dashboard</h1>

    <Loader v-if="adminStore.loading" />

    <div v-else class="dashboard-grid">
      <div class="stat-card">
        <div class="stat-icon" style="background: #3B82F6;">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ adminStore.totalUsers }}</div>
          <div class="stat-label">Total Users</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon" style="background: #6366F1;">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ booksStore.books.length }}</div>
          <div class="stat-label">Total Books</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon" style="background: #F59E0B;">
          <svg fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ adminStore.totalFavorites }}</div>
          <div class="stat-label">Total Favorites</div>
        </div>
      </div>

      <div class="card full-width">
        <h2 class="card-title">
          <svg class="title-icon" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          Most Favorited Books
        </h2>
        <div class="favorites-list">
          <div v-for="book in adminStore.mostFavorited" :key="book.bookId" class="favorite-item">
            <img :src="book.image" :alt="book.title" class="favorite-image">
            <div class="favorite-info">
              <div class="favorite-title">{{ book.title }}</div>
              <div class="favorite-author">{{ book.authorName }}</div>
            </div>
            <div class="favorite-count">
              <svg class="count-icon" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              {{ book.count }}
            </div>
          </div>
        </div>
      </div>

      <div class="card full-width">
        <h2 class="card-title">
          <svg class="title-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Books by Author
        </h2>
        <div class="stats-list">
          <div v-for="item in booksByAuthor" :key="item.author" class="stats-item">
            <span class="stats-label">{{ item.author }}</span>
            <div class="stats-bar">
              <div class="stats-fill author-fill" :style="{ width: getBarWidth(item.count, maxAuthorBooks) }"></div>
            </div>
            <span class="stats-count">{{ item.count }}</span>
          </div>
        </div>
      </div>

      <div class="card full-width">
        <h2 class="card-title">
          <svg class="title-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          Books by Category
        </h2>
        <div class="stats-list">
          <div v-for="item in booksByCategory" :key="item.category" class="stats-item">
            <span class="stats-label category-label">
              <span class="category-dot" :style="{ background: categoryColors[item.category] }"></span>
              {{ item.category }}
            </span>
            <div class="stats-bar">
              <div 
                class="stats-fill" 
                :style="{ 
                  width: getBarWidth(item.count, maxCategoryBooks),
                  background: categoryColors[item.category]
                }"
              ></div>
            </div>
            <span class="stats-count">{{ item.count }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAdminStore } from '@/stores/admin'
import { useBooksStore } from '@/stores/books'
import Loader from '@/components/Loader.vue'

const adminStore = useAdminStore()
const booksStore = useBooksStore()

// 📊 1. Books by Author
const booksByAuthor = computed(() => {
  const authorMap = new Map<string, number>()
  
  booksStore.books.forEach(book => {
    let authorName = 'Unknown'
    
    if (typeof book.author === 'object' && book.author !== null) {
      if ('prenom' in book.author && 'nom' in book.author) {
        authorName = `${book.author.prenom} ${book.author.nom}`
      } else if ('name' in book.author) {
        authorName = book.author.name
      }
    } else if (typeof book.author === 'string') {
      authorName = book.author
    }
    
    authorMap.set(authorName, (authorMap.get(authorName) || 0) + 1)
  })
  
  return Array.from(authorMap.entries())
    .map(([author, count]) => ({ author, count }))
    .sort((a, b) => b.count - a.count)
})

const maxAuthorBooks = computed(() => 
  Math.max(...booksByAuthor.value.map(item => item.count), 1)
)

// 📊 2. Books by Category
const booksByCategory = computed(() => {
  const categoryMap = new Map<string, number>()
  
  booksStore.books.forEach(book => {
    const category = book.category || 'autre'
    categoryMap.set(category, (categoryMap.get(category) || 0) + 1)
  })
  
  return Array.from(categoryMap.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)
})

const maxCategoryBooks = computed(() => 
  Math.max(...booksByCategory.value.map(item => item.count), 1)
)

// Category colors
const categoryColors: Record<string, string> = {
  roman: '#EF4444',
  science: '#3B82F6',
  histoire: '#F59E0B',
  informatique: '#10B981',
  art: '#8B5CF6',
  philosophie: '#EC4899',
  autre: '#6B7280'
}

function getBarWidth(count: number, max: number) {
  return `${(count / max) * 100}%`
}

onMounted(async () => {
  await Promise.all([
    adminStore.fetchStats(),
    booksStore.fetchBooks()
  ])
})
</script>

<style scoped>
.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 2rem;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: var(--card);
  border-radius: 0.75rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.stat-icon svg {
  width: 28px;
  height: 28px;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.card {
  background: var(--card);
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.full-width {
  grid-column: 1 / -1;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.title-icon {
  width: 24px;
  height: 24px;
  color: var(--primary);
}

.favorites-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.favorite-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg);
  border-radius: 0.5rem;
}

.favorite-image {
  width: 48px;
  height: 64px;
  object-fit: cover;
  border-radius: 0.375rem;
}

.favorite-info {
  flex: 1;
}

.favorite-title {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.favorite-author {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.favorite-count {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--error);
}

.count-icon {
  width: 20px;
  height: 20px;
}

.stats-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stats-item {
  display: grid;
  grid-template-columns: 180px 1fr 60px;
  align-items: center;
  gap: 1rem;
}

.stats-label {
  font-weight: 600;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-transform: capitalize;
}

.category-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.category-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.stats-bar {
  height: 32px;
  background: var(--bg);
  border-radius: 0.5rem;
  overflow: hidden;
}

.stats-fill {
  height: 100%;
  background: var(--primary);
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 0.5rem;
}

.author-fill {
  background: linear-gradient(90deg, #6366F1 0%, #8B5CF6 100%);
}

.stats-count {
  text-align: right;
  font-weight: 600;
  color: var(--text-primary);
}
</style>
