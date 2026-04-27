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
          <div class="stat-value">{{ totalBooks }}</div>
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
        <h2 class="card-title">Most Favorited Books</h2>
        <div class="favorites-list">
          <div v-for="book in adminStore.mostFavorited" :key="book.bookId" class="favorite-item">
            <img :src="book.image" :alt="book.title" class="favorite-image">
            <div class="favorite-info">
              <div class="favorite-title">{{ book.title }}</div>
              <div class="favorite-author">{{ book.authorName }}</div>
            </div>
            <div class="favorite-count">{{ book.count }} ❤️</div>
          </div>
        </div>
      </div>

      <div class="card full-width">
        <h2 class="card-title">Books by Year</h2>
        <div class="stats-list">
          <div v-for="stat in adminStore.bookStats" :key="stat.year" class="stats-item">
            <span class="stats-year">{{ stat.year }}</span>
            <div class="stats-bar">
              <div class="stats-fill" :style="{ width: getBarWidth(stat.NbBooks) }"></div>
            </div>
            <span class="stats-count">{{ stat.NbBooks }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAdminStore } from '@/stores/admin'
import Loader from '@/components/Loader.vue'

const adminStore = useAdminStore()

const totalBooks = computed(() => 
  adminStore.bookStats.reduce((sum, stat) => sum + Number(stat.NbBooks), 0)
)

const maxBooks = computed(() => 
  Math.max(...adminStore.bookStats.map(stat => Number(stat.NbBooks)))
)

function getBarWidth(count: string) {
  return `${(Number(count) / maxBooks.value) * 100}%`
}

onMounted(() => {
  adminStore.fetchStats()
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
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary);
}

.stats-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stats-item {
  display: grid;
  grid-template-columns: 80px 1fr 60px;
  align-items: center;
  gap: 1rem;
}

.stats-year {
  font-weight: 600;
  color: var(--text-primary);
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
  transition: width 0.3s;
}

.stats-count {
  text-align: right;
  font-weight: 600;
  color: var(--text-primary);
}
</style>
