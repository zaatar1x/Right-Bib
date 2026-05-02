<template>
  <div class="book-card">
    <div class="book-image-wrapper">
      <img :src="book.image" :alt="book.title" class="book-image" @error="handleImageError" loading="lazy">
      <div class="book-overlay">
        <button 
          v-if="authStore.isAuthenticated"
          @click.prevent="toggleFavorite" 
          class="favorite-btn"
          :class="{ active: isFavorite }"
        >
          <svg class="icon" :fill="isFavorite ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
    </div>
    
    <div class="book-content">
      <h3 class="book-title" :title="book.title">{{ book.title }}</h3>
      <p class="book-author">{{ authorName }}</p>
      <div class="book-meta">
        <span class="book-category">{{ book.category }}</span>
        <span class="book-year">{{ book.year }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useFavoritesStore } from '@/stores/favorites'
import type { Book } from '@/types'

const props = defineProps<{
  book: Book
}>()

const authStore = useAuthStore()
const favoritesStore = useFavoritesStore()

// Debug logging
console.log('BOOK DATA:', props.book)

const authorName = computed(() => {
  // Handle multiple possible author formats
  const author = props.book.author
  
  // CASE A: author is an object with prenom and nom
  if (typeof author === 'object' && author !== null) {
    if ('prenom' in author && 'nom' in author) {
      return `${author.prenom} ${author.nom}`
    }
    // CASE B: author object with name field
    if ('name' in author) {
      return author.name
    }
  }
  
  // CASE C: authorName field exists on book
  if ('authorName' in props.book && props.book.authorName) {
    return props.book.authorName
  }
  
  // CASE D: author is a string
  if (typeof author === 'string') {
    return author
  }
  
  // CASE E: author is just an ID (number) - this is the current issue
  if (typeof author === 'number') {
    return 'No Author'
  }
  
  return 'No Author'
})

const isFavorite = computed(() => 
  favoritesStore.isFavorite(props.book.id)
)

async function toggleFavorite() {
  if (isFavorite.value) {
    await favoritesStore.removeFavorite(props.book.id)
  } else {
    await favoritesStore.addFavorite(props.book.id)
  }
}

function handleImageError(e: Event) {
  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x400?text=No+Image'
}
</script>

<style scoped>
.book-card {
  background: var(--card);
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.book-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-xl);
  border-color: var(--primary);
}

.book-image-wrapper {
  position: relative;
  aspect-ratio: 3/4;
  overflow: hidden;
  background: linear-gradient(135deg, #E2E8F0 0%, #CBD5E1 100%);
}

.book-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.book-card:hover .book-image {
  transform: scale(1.1);
}

.book-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%);
  opacity: 0;
  transition: opacity 0.4s;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 1rem;
}

.book-card:hover .book-overlay {
  opacity: 1;
}

.favorite-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: var(--text-secondary);
  box-shadow: var(--shadow-lg);
  transform: scale(0.9);
}

.book-card:hover .favorite-btn {
  transform: scale(1);
}

.favorite-btn:hover {
  background: white;
  transform: scale(1.15);
}

.favorite-btn.active {
  color: var(--error);
  background: white;
}

.favorite-btn .icon {
  width: 22px;
  height: 22px;
  transition: transform 0.3s;
}

.favorite-btn:hover .icon {
  transform: scale(1.1);
}

.book-content {
  padding: 1.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.book-title {
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
}

.book-author {
  font-size: 0.9375rem;
  color: var(--text-secondary);
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.book-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 0.75rem;
  border-top: 1px solid var(--border);
}

.book-category {
  padding: 0.375rem 0.75rem;
  background: var(--hover);
  border-radius: 0.5rem;
  color: var(--primary);
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: capitalize;
}

.book-year {
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 600;
}
</style>
