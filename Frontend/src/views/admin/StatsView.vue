<template>
  <div>
    <h1 class="page-title">Statistics</h1>

    <Loader v-if="adminStore.loading" />

    <div v-else class="stats-container">
      <div class="card">
        <h2 class="card-title">Books Distribution by Year</h2>
        <div class="chart">
          <div v-for="stat in adminStore.bookStats" :key="stat.year" class="chart-bar">
            <div class="bar-fill" :style="{ height: getBarHeight(stat.NbBooks) }">
              <span class="bar-value">{{ stat.NbBooks }}</span>
            </div>
            <div class="bar-label">{{ stat.year }}</div>
          </div>
        </div>
      </div>

      <div class="card">
        <h2 class="card-title">Top Favorited Books</h2>
        <div class="ranking-list">
          <div v-for="(book, index) in adminStore.mostFavorited" :key="book.bookId" class="ranking-item">
            <div class="ranking-position">{{ index + 1 }}</div>
            <img :src="book.image" :alt="book.title" class="ranking-image">
            <div class="ranking-info">
              <div class="ranking-title">{{ book.title }}</div>
              <div class="ranking-author">{{ book.authorName }}</div>
            </div>
            <div class="ranking-count">
              <svg class="icon" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              {{ book.count }}
            </div>
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

const maxBooks = computed(() => 
  Math.max(...adminStore.bookStats.map(stat => Number(stat.NbBooks)))
)

function getBarHeight(count: string) {
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

.stats-container {
  display: grid;
  gap: 2rem;
}

.card {
  background: var(--card);
  border-radius: 0.75rem;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 2rem;
}

.chart {
  display: flex;
  align-items: flex-end;
  gap: 1.5rem;
  height: 300px;
  padding: 1rem;
  background: var(--bg);
  border-radius: 0.5rem;
}

.chart-bar {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.bar-fill {
  width: 100%;
  background: var(--primary);
  border-radius: 0.375rem 0.375rem 0 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 0.5rem;
  min-height: 40px;
  transition: height 0.3s;
}

.bar-value {
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
}

.bar-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}

.ranking-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg);
  border-radius: 0.5rem;
  transition: transform 0.2s;
}

.ranking-item:hover {
  transform: translateX(4px);
}

.ranking-position {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--primary);
  color: white;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ranking-image {
  width: 48px;
  height: 64px;
  object-fit: cover;
  border-radius: 0.375rem;
}

.ranking-info {
  flex: 1;
}

.ranking-title {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.ranking-author {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.ranking-count {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--error);
}

.icon {
  width: 20px;
  height: 20px;
}
</style>
