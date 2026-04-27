import api from './api'
import type { AuthResponse } from '@/types'

export const authService = {
  async signup(email: string, username: string, password: string, role: 'user' | 'admin' = 'user') {
    const { data } = await api.post<AuthResponse>('/auth/signup', { email, username, password, role })
    return data
  },

  async signin(identifiant: string, password: string) {
    const { data } = await api.post<AuthResponse>('/auth/signin', { identifiant, password })
    return data
  },

  async getTotalUsers() {
    const { data } = await api.get<{ total: number }>('/auth/stats/total-users')
    return data
  }
}
