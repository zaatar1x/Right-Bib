import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authService } from '@/services/auth.service'
import { booksService } from '@/services/books.service'
import { favoritesService } from '@/services/favorites.service'
import type { BookStats, MostFavoritedBook } from '@/types'

export const useAdminStore = defineStore('admin', () => {
  const totalUsers = ref(0)
  const bookStats = ref<BookStats[]>([])
  const mostFavorited = ref<MostFavoritedBook[]>([])
  const totalFavorites = ref(0)
  const loading = ref(false)

  async function fetchStats() {
    loading.value = true
    try {
      const [users, books, favorites, favTotal] = await Promise.all([
        authService.getTotalUsers(),
        booksService.getStats(),
        favoritesService.getMostFavorited(5),
        favoritesService.getTotalStats()
      ])
      
      totalUsers.value = users.total
      bookStats.value = books
      mostFavorited.value = favorites
      totalFavorites.value = favTotal.total
    } finally {
      loading.value = false
    }
  }

  return {
    totalUsers,
    bookStats,
    mostFavorited,
    totalFavorites,
    loading,
    fetchStats
  }
})
