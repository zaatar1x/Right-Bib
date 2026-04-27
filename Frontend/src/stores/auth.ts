import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/auth.service'
import type { User } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  function initAuth() {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    
    if (savedToken && savedUser) {
      token.value = savedToken
      user.value = JSON.parse(savedUser)
    }
  }

  async function signup(email: string, username: string, password: string) {
    const response = await authService.signup(email, username, password)
    setAuth(response)
  }

  async function signin(identifiant: string, password: string) {
    const response = await authService.signin(identifiant, password)
    setAuth(response)
  }

  function setAuth(response: { id: number; email: string; username: string; role: 'user' | 'admin'; access_token: string }) {
    token.value = response.access_token
    user.value = {
      id: response.id,
      email: response.email,
      username: response.username,
      role: response.role
    }
    localStorage.setItem('token', token.value)
    localStorage.setItem('user', JSON.stringify(user.value))
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    initAuth,
    signup,
    signin,
    logout
  }
})
