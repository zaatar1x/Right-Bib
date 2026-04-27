import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { favoritesService } from '@/services/favorites.service'
import type { Favorite } from '@/types'

export const useFavoritesStore = defineStore('favorites', () => {
  const favorites = ref<Favorite[]>([])
  const loading = ref(false)

  const favoriteBookIds = computed(() => 
    favorites.value.map(fav => fav.book.id)
  )

  const isFavorite = (bookId: number) => 
    favoriteBookIds.value.includes(bookId)

  async function fetchFavorites() {
    loading.value = true
    try {
      favorites.value = await favoritesService.getMyFavorites()
    } finally {
      loading.value = false
    }
  }

  async function addFavorite(bookId: number) {
    try {
      await favoritesService.add(bookId)
      await fetchFavorites()
    } catch (error: any) {
      if (error.response?.status !== 409) {
        throw error
      }
    }
  }

  async function removeFavorite(bookId: number) {
    await favoritesService.remove(bookId)
    favorites.value = favorites.value.filter(fav => fav.book.id !== bookId)
  }

  return {
    favorites,
    loading,
    favoriteBookIds,
    isFavorite,
    fetchFavorites,
    addFavorite,
    removeFavorite
  }
})
