import api from './api'
import type { Author } from '@/types'

export const authorsService = {
  async getAll() {
    const { data } = await api.get<Author[]>('/author/all')
    return data
  },

  async create(prenom: string, nom: string) {
    const { data } = await api.post<Author>('/author/add', { prenom, nom })
    return data
  }
}
