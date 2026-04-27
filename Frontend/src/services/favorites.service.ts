import api from './api'
import type { Favorite, MostFavoritedBook } from '@/types'

export const favoritesService = {
  async getMyFavorites() {
    const { data } = await api.get<Favorite[]>('/favoris')
    return data
  },

  async add(bookId: number) {
    await api.post(`/favoris/${bookId}`)
  },

  async remove(bookId: number) {
    await api.delete(`/favoris/${bookId}`)
  },

  async getTotalStats() {
    const { data } = await api.get<{ total: number }>('/favoris/stats/total')
    return data
  },

  async getMostFavorited(limit: number = 10) {
    const { data } = await api.get<MostFavoritedBook[]>(`/favoris/stats/most-favourited?limit=${limit}`)
    return data
  }
}
