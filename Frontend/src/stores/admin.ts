import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authService } from '@/services/auth.service'
import { favoritesService } from '@/services/favorites.service'
import type { MostFavoritedBook } from '@/types'

export const useAdminStore = defineStore('admin', () => {
  const totalUsers = ref(0)
  const mostFavorited = ref<MostFavoritedBook[]>([])
  const totalFavorites = ref(0)
  const loading = ref(false)

  async function fetchStats() {
    loading.value = true
    try {
      const [users, favorites, favTotal] = await Promise.all([
        authService.getTotalUsers(),
        favoritesService.getMostFavorited(5),
        favoritesService.getTotalStats()
      ])
      
      totalUsers.value = users.total
      mostFavorited.value = favorites
      totalFavorites.value = favTotal.total
    } finally {
      loading.value = false
    }
  }

  return {
    totalUsers,
    mostFavorited,
    totalFavorites,
    loading,
    fetchStats
  }
})
