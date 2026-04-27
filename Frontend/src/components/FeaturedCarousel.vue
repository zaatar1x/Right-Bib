<template>
  <div class="featured-section">
    <div class="section-header">
      <h2 class="section-title">⭐ Most Favorited Books</h2>
      <div class="carousel-controls">
        <button @click="scrollLeft" class="carousel-btn" :disabled="!canScrollLeft">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button @click="scrollRight" class="carousel-btn" :disabled="!canScrollRight">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>

    <div v-if="loading" class="carousel-loading">
      <div v-for="i in 5" :key="i" class="skeleton-featured"></div>
    </div>

    <div v-else ref="carouselRef" class="carousel-container" @scroll="handleScroll">
      <router-link
        v-for="book in books"
        :key="book.bookId"
        :to="`/books/${book.bookId}`"
        class="featured-card"
      >
        <div class="featured-image-wrapper">
          <img :src="book.image" :alt="book.title" class="featured-image" loading="lazy">
          <div class="featured-badge">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span>{{ book.count }}</span>
          </div>
        </div>
        <div class="featured-content">
          <h3 class="featured-title">{{ book.title }}</h3>
          <p class="featured-author">{{ book.authorName }}</p>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { favoritesService } from '@/services/favorites.service'
import type { MostFavoritedBook } from '@/types'

const books = ref<MostFavoritedBook[]>([])
const loading = ref(true)
const carouselRef = ref<HTMLElement | null>(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(true)

async function fetchFeatured() {
  try {
    books.value = await favoritesService.getMostFavorited(10)
  } finally {
    loading.value = false
  }
}

function scrollLeft() {
  if (carouselRef.value) {
    carouselRef.value.scrollBy({ left: -400, behavior: 'smooth' })
  }
}

function scrollRight() {
  if (carouselRef.value) {
    carouselRef.value.scrollBy({ left: 400, behavior: 'smooth' })
  }
}

function handleScroll() {
  if (!carouselRef.value) return
  const { scrollLeft, scrollWidth, clientWidth } = carouselRef.value
  canScrollLeft.value = scrollLeft > 0
  canScrollRight.value = scrollLeft < scrollWidth - clientWidth - 10
}

onMounted(() => {
  fetchFeatured()
})
</script>

<style scoped>
.featured-section {
  margin-bottom: 3rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--text-primary);
}

.carousel-controls {
  display: flex;
  gap: 0.5rem;
}

.carousel-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--card);
  border: 2px solid var(--border);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.carousel-btn:hover:not(:disabled) {
  background: var(--primary);
  border-color: var(--primary);
  color: white;
  transform: scale(1.1);
}

.carousel-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.carousel-btn svg {
  width: 20px;
  height: 20px;
}

.carousel-loading {
  display: flex;
  gap: 1.5rem;
  overflow: hidden;
}

.skeleton-featured {
  min-width: 280px;
  height: 400px;
  background: linear-gradient(90deg, #E2E8F0 25%, #CBD5E1 50%, #E2E8F0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 1rem;
}

.carousel-container {
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding-bottom: 1rem;
}

.carousel-container::-webkit-scrollbar {
  display: none;
}

.featured-card {
  min-width: 280px;
  scroll-snap-align: start;
  background: var(--card);
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.featured-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: var(--shadow-xl);
  border-color: var(--primary);
}

.featured-image-wrapper {
  position: relative;
  aspect-ratio: 3/4;
  overflow: hidden;
}

.featured-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s;
}

.featured-card:hover .featured-image {
  transform: scale(1.1);
}

.featured-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.875rem;
  background: rgba(239, 68, 68, 0.95);
  backdrop-filter: blur(8px);
  border-radius: 2rem;
  color: white;
  font-weight: 700;
  font-size: 0.875rem;
  box-shadow: var(--shadow-lg);
}

.featured-badge svg {
  width: 16px;
  height: 16px;
}

.featured-content {
  padding: 1.25rem;
}

.featured-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  min-height: 3em;
}

.featured-author {
  font-size: 0.9375rem;
  color: var(--text-secondary);
  font-weight: 500;
}

@media (max-width: 768px) {
  .section-title {
    font-size: 1.375rem;
  }

  .featured-card {
    min-width: 220px;
  }
}
</style>
