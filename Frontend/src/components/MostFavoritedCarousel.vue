<template>
  <div v-if="books.length" class="most-favorited-section">
    <div class="section-header">
      <div class="header-content">
        <h2 class="section-title">
          <svg class="title-icon" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          Most Loved Books
        </h2>
        <p class="section-subtitle">Discover what our community loves most</p>
      </div>
    </div>

    <div class="carousel-container">
      <button 
        @click="scroll('left')" 
        class="carousel-btn prev"
        :disabled="scrollPosition <= 0"
      >
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div class="carousel-track" ref="trackRef" @scroll="handleScroll">
        <router-link
          v-for="book in books"
          :key="book.bookId"
          :to="`/books/${book.bookId}`"
          class="carousel-card"
        >
          <div class="card-image-wrapper">
            <img :src="book.image" :alt="book.title" class="card-image" @error="handleImageError">
            <div class="favorites-badge">
              <svg class="badge-icon" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <span>{{ book.count }}</span>
            </div>
          </div>
          <div class="card-content">
            <h3 class="card-title">{{ book.title }}</h3>
            <p class="card-author">{{ book.authorName }}</p>
          </div>
        </router-link>
      </div>

      <button 
        @click="scroll('right')" 
        class="carousel-btn next"
        :disabled="scrollPosition >= maxScroll"
      >
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { favoritesService } from '@/services/favorites.service'
import type { MostFavoritedBook } from '@/types'

const books = ref<MostFavoritedBook[]>([])
const trackRef = ref<HTMLElement | null>(null)
const scrollPosition = ref(0)
const maxScroll = ref(0)

onMounted(async () => {
  try {
    books.value = await favoritesService.getMostFavorited(10)
  } catch (error) {
    console.error('Failed to fetch most favorited books:', error)
  }
})

function scroll(direction: 'left' | 'right') {
  if (!trackRef.value) return
  
  const scrollAmount = 320
  const newPosition = direction === 'left' 
    ? trackRef.value.scrollLeft - scrollAmount
    : trackRef.value.scrollLeft + scrollAmount
  
  trackRef.value.scrollTo({
    left: newPosition,
    behavior: 'smooth'
  })
}

function handleScroll() {
  if (!trackRef.value) return
  scrollPosition.value = trackRef.value.scrollLeft
  maxScroll.value = trackRef.value.scrollWidth - trackRef.value.clientWidth
}

function handleImageError(e: Event) {
  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x400/EF4444/FFFFFF?text=No+Image'
}
</script>

<style scoped>
.most-favorited-section {
  margin-bottom: 4rem;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(239, 68, 68, 0.02) 100%);
  border-radius: 1.5rem;
  padding: 2.5rem;
  border: 2px solid rgba(239, 68, 68, 0.1);
}

.section-header {
  margin-bottom: 2rem;
}

.header-content {
  text-align: center;
}

.section-title {
  font-size: 2.25rem;
  font-weight: 900;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.title-icon {
  width: 36px;
  height: 36px;
  color: var(--error);
  animation: heartbeat 1.5s ease-in-out infinite;
}

@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  10%, 30% { transform: scale(1.1); }
  20%, 40% { transform: scale(1); }
}

.section-subtitle {
  color: var(--text-secondary);
  font-size: 1.125rem;
  font-weight: 500;
}

.carousel-container {
  position: relative;
}

.carousel-track {
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: 1rem 0.5rem;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.carousel-track::-webkit-scrollbar {
  display: none;
}

.carousel-card {
  flex: 0 0 280px;
  background: var(--card);
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  border: 2px solid var(--border);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.carousel-card:hover {
  transform: translateY(-12px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  border-color: var(--error);
}

.card-image-wrapper {
  position: relative;
  aspect-ratio: 3/4;
  overflow: hidden;
  background: linear-gradient(135deg, #E2E8F0 0%, #CBD5E1 100%);
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.carousel-card:hover .card-image {
  transform: scale(1.15);
}

.favorites-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(239, 68, 68, 0.95);
  backdrop-filter: blur(8px);
  color: white;
  padding: 0.5rem 0.875rem;
  border-radius: 2rem;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-weight: 700;
  font-size: 0.9375rem;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.badge-icon {
  width: 16px;
  height: 16px;
}

.card-content {
  padding: 1.25rem;
}

.card-title {
  font-size: 1.0625rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  min-height: 2.8em;
  margin-bottom: 0.5rem;
}

.card-author {
  font-size: 0.9375rem;
  color: var(--text-secondary);
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--card);
  border: 2px solid var(--border);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  z-index: 10;
  box-shadow: var(--shadow-lg);
}

.carousel-btn:hover:not(:disabled) {
  background: var(--error);
  color: white;
  border-color: var(--error);
  transform: translateY(-50%) scale(1.1);
}

.carousel-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.carousel-btn svg {
  width: 24px;
  height: 24px;
}

.carousel-btn.prev {
  left: -24px;
}

.carousel-btn.next {
  right: -24px;
}

@media (max-width: 1024px) {
  .carousel-btn.prev {
    left: 0;
  }

  .carousel-btn.next {
    right: 0;
  }
}

@media (max-width: 768px) {
  .most-favorited-section {
    padding: 1.5rem;
  }

  .section-title {
    font-size: 1.75rem;
  }

  .carousel-card {
    flex: 0 0 220px;
  }

  .carousel-btn {
    width: 40px;
    height: 40px;
  }
}
</style>
