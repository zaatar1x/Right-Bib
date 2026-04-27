<template>
  <div class="container">
    <div class="page-header">
      <h1 class="page-title">My Favorites</h1>
      <p class="page-subtitle">Books you've saved for later</p>
    </div>

    <Loader v-if="favoritesStore.loading" />

    <template v-else>
      <div v-if="favoritesStore.favorites.length" class="books-grid">
        <router-link 
          v-for="favorite in favoritesStore.favorites" 
          :key="favorite.id"
          :to="`/books/${favorite.book.id}`"
          class="book-link"
        >
          <BookCard :book="favorite.book" />
        </router-link>
      </div>

      <EmptyState 
        v-else
        title="No favorites yet"
        message="Start adding books to your favorites to see them here"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useFavoritesStore } from '@/stores/favorites'
import BookCard from '@/components/BookCard.vue'
import Loader from '@/components/Loader.vue'
import EmptyState from '@/components/EmptyState.vue'

const favoritesStore = useFavoritesStore()

onMounted(() => {
  favoritesStore.fetchFavorites()
})
</script>

<style scoped>
.page-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.page-subtitle {
  color: var(--text-secondary);
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.5rem;
}

.book-link {
  display: block;
}

@media (max-width: 768px) {
  .books-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 1rem;
  }
}
</style>
