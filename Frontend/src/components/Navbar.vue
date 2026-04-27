<template>
  <nav class="navbar" :class="{ scrolled: isScrolled }">
    <div class="container navbar-content">
      <router-link to="/books" class="logo">
        <img src="/assets/images/LOGO_maktaba.png" alt="Maktaba" class="logo-img">
        <span class="logo-text">Maktaba</span>
      </router-link>

      <SearchBar v-if="!isAuthPage" @search="handleSearch" class="navbar-search" />

      <div class="nav-actions">
        <template v-if="authStore.isAuthenticated">
          <router-link to="/books" class="nav-link">
            <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span>Books</span>
          </router-link>
          <router-link to="/favorites" class="nav-link">
            <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>Favorites</span>
          </router-link>
          <router-link v-if="authStore.isAdmin" to="/admin/dashboard" class="nav-link">
            <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>Admin</span>
          </router-link>
          
          <div class="user-menu">
            <button @click="toggleMenu" class="user-avatar">
              <span>{{ authStore.user?.username.charAt(0).toUpperCase() }}</span>
            </button>
            <transition name="dropdown-fade">
              <div v-if="showMenu" class="dropdown">
                <div class="dropdown-header">
                  <div class="dropdown-user-name">{{ authStore.user?.username }}</div>
                  <div class="dropdown-user-email">{{ authStore.user?.email }}</div>
                </div>
                <div class="dropdown-divider"></div>
                <router-link to="/profile" class="dropdown-item" @click="showMenu = false">
                  <svg class="dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile
                </router-link>
                <button @click="handleLogout" class="dropdown-item logout">
                  <svg class="dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </transition>
          </div>
        </template>
        <template v-else>
          <router-link to="/login" class="btn btn-outline btn-sm">Login</router-link>
          <router-link to="/signup" class="btn btn-primary btn-sm">Sign Up</router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useBooksStore } from '@/stores/books'
import SearchBar from './SearchBar.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const booksStore = useBooksStore()
const showMenu = ref(false)
const isScrolled = ref(false)

const isAuthPage = computed(() => 
  route.path === '/login' || route.path === '/signup'
)

function toggleMenu() {
  showMenu.value = !showMenu.value
}

function handleSearch(query: string) {
  booksStore.setFilters({ search: query })
  if (route.path !== '/books') {
    router.push('/books')
  }
}

function handleLogout() {
  authStore.logout()
  showMenu.value = false
  router.replace('/login')
}

function handleScroll() {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.navbar {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid transparent;
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.navbar.scrolled {
  background: rgba(255, 255, 255, 0.95);
  border-bottom-color: var(--border);
  box-shadow: var(--shadow-md);
}

.navbar-content {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: transform 0.3s;
}

.logo:hover {
  transform: scale(1.05);
}

.logo-img {
  height: 42px;
  width: auto;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 700;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.navbar-search {
  flex: 1;
  max-width: 500px;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border-radius: 0.75rem;
  color: var(--text-secondary);
  font-size: 0.9375rem;
  font-weight: 600;
  transition: all 0.3s;
  position: relative;
}

.nav-link::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%) scaleX(0);
  width: 80%;
  height: 2px;
  background: var(--primary);
  transition: transform 0.3s;
}

.nav-link:hover {
  color: var(--primary);
  background: var(--hover);
}

.nav-link.router-link-active {
  color: var(--primary);
}

.nav-link.router-link-active::before {
  transform: translateX(-50%) scaleX(1);
}

.nav-icon {
  width: 20px;
  height: 20px;
}

.btn-sm {
  padding: 0.5rem 1.25rem;
  font-size: 0.875rem;
}

.user-menu {
  position: relative;
}

.user-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: var(--gradient-primary);
  color: white;
  font-weight: 700;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  box-shadow: var(--shadow-md);
}

.user-avatar:hover {
  transform: scale(1.1);
  box-shadow: var(--shadow-lg);
}

.dropdown {
  position: absolute;
  top: calc(100% + 0.75rem);
  right: 0;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 1rem;
  box-shadow: var(--shadow-xl);
  min-width: 220px;
  overflow: hidden;
}

.dropdown-header {
  padding: 1rem;
  background: var(--hover);
  border-bottom: 1px solid var(--border);
}

.dropdown-user-name {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.dropdown-user-email {
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.dropdown-divider {
  height: 1px;
  background: var(--border);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.875rem 1rem;
  text-align: left;
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--text-primary);
  background: transparent;
  transition: all 0.2s;
}

.dropdown-item:hover {
  background: var(--hover);
  color: var(--primary);
}

.dropdown-item.logout {
  color: var(--error);
}

.dropdown-item.logout:hover {
  background: rgba(239, 68, 68, 0.1);
}

.dropdown-icon {
  width: 18px;
  height: 18px;
}

.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 768px) {
  .navbar-content {
    gap: 1rem;
  }

  .logo-text {
    display: none;
  }

  .nav-link span {
    display: none;
  }

  .nav-link {
    padding: 0.5rem;
  }

  .navbar-search {
    display: none;
  }

  .nav-actions {
    gap: 0.5rem;
  }
}
</style>
