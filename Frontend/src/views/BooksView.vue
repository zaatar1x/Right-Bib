<template>
  <div>
    <HeroCarousel />

    <div class="container">
      <FeaturedCarousel />

      <div class="section-header">
        <h2 class="section-title">All Books</h2>
        <p class="section-subtitle">{{ booksStore.filteredBooks.length }} books available</p>
      </div>

      <FilterPanel 
        :filters="booksStore.filters"
        @update="booksStore.setFilters"
        @reset="booksStore.resetFilters"
      />

      <div v-if="booksStore.loading" class="books-grid">
        <SkeletonCard v-for="i in 12" :key="i" />
      </div>

      <template v-else>
        <div v-if="booksStore.paginatedBooks.length" class="books-grid">
          <router-link 
            v-for="book in booksStore.paginatedBooks" 
            :key="book.id"
            :to="`/books/${book.id}`"
            class="book-link"
          >
            <BookCard :book="book" />
          </router-link>
        </div>

        <EmptyState 
          v-else
          title="No books found"
          message="Try adjusting your filters or search query"
        />

        <Pagination 
          :current-page="booksStore.pagination.page"
          :total-pages="booksStore.totalPages"
          @change="booksStore.setPage"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useBooksStore } from '@/stores/books'
import { useFavoritesStore } from '@/stores/favorites'
import { useAuthStore } from '@/stores/auth'
import BookCard from '@/components/BookCard.vue'
import FilterPanel from '@/components/FilterPanel.vue'
import Pagination from '@/components/Pagination.vue'
import SkeletonCard from '@/components/SkeletonCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import FeaturedCarousel from '@/components/FeaturedCarousel.vue'
import HeroCarousel from '@/components/HeroCarousel.vue'

const booksStore = useBooksStore()
const favoritesStore = useFavoritesStore()
const authStore = useAuthStore()

onMounted(async () => {
  await booksStore.fetchBooks()
  if (authStore.isAuthenticated) {
    await favoritesStore.fetchFavorites()
  }
})
</script>

<style scoped>
.section-header {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.section-subtitle {
  color: var(--text-secondary);
  font-size: 1rem;
  font-weight: 500;
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.book-link {
  display: block;
  height: 100%;
}

@media (max-width: 1024px) {
  .books-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .books-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 1rem;
  }
}
</style>
