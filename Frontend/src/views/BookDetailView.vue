<template>
  <div class="container">
    <button @click="router.back()" class="back-btn">
      <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Back
    </button>

    <Loader v-if="loading" />

    <div v-else-if="book" class="book-detail">
      <div class="book-image-container">
        <img :src="book.image" :alt="book.title" class="book-detail-image" @error="handleImageError">
      </div>

      <div class="book-info">
        <h1 class="book-detail-title">{{ book.title }}</h1>
        <p class="book-detail-author">by {{ authorName }}</p>

        <div class="book-meta-grid">
          <div class="meta-item">
            <span class="meta-label">Year</span>
            <span class="meta-value">{{ book.year }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Editor</span>
            <span class="meta-value">{{ book.editor }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Category</span>
            <span class="meta-value">{{ book.category }}</span>
          </div>
        </div>

        <button 
          @click="toggleFavorite" 
          class="btn"
          :class="isFavorite ? 'btn-secondary' : 'btn-primary'"
        >
          <svg class="icon" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          {{ isFavorite ? 'Remove from Favorites' : 'Add to Favorites' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { booksService } from '@/services/books.service'
import { useFavoritesStore } from '@/stores/favorites'
import Loader from '@/components/Loader.vue'
import type { Book } from '@/types'

const route = useRoute()
const router = useRouter()
const favoritesStore = useFavoritesStore()

const book = ref<Book | null>(null)
const loading = ref(true)

const authorName = computed(() => {
  if (book.value && typeof book.value.author === 'object') {
    return `${book.value.author.prenom} ${book.value.author.nom}`
  }
  return 'Unknown Author'
})

const isFavorite = computed(() => 
  book.value ? favoritesStore.isFavorite(book.value.id) : false
)

async function toggleFavorite() {
  if (!book.value) return
  
  if (isFavorite.value) {
    await favoritesStore.removeFavorite(book.value.id)
  } else {
    await favoritesStore.addFavorite(book.value.id)
  }
}

function handleImageError(e: Event) {
  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x600?text=No+Image'
}

onMounted(async () => {
  try {
    const id = Number(route.params.id)
    book.value = await booksService.getById(id)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  margin-bottom: 2rem;
  background: transparent;
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.2s;
}

.back-btn:hover {
  color: var(--text-primary);
}

.icon {
  width: 20px;
  height: 20px;
}

.book-detail {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 3rem;
  max-width: 1000px;
}

.book-image-container {
  aspect-ratio: 3/4;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.book-detail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.book-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.book-detail-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.2;
}

.book-detail-author {
  font-size: 1.25rem;
  color: var(--text-secondary);
}

.book-meta-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  padding: 1.5rem;
  background: var(--bg);
  border-radius: 0.75rem;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.meta-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--text-secondary);
  letter-spacing: 0.05em;
}

.meta-value {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  text-transform: capitalize;
}

@media (max-width: 768px) {
  .book-detail {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .book-image-container {
    max-width: 300px;
    margin: 0 auto;
  }

  .book-detail-title {
    font-size: 1.75rem;
  }

  .book-meta-grid {
    grid-template-columns: 1fr;
  }
}
</style>
