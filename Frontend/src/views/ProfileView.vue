<template>
  <div class="container">
    <div class="profile-card">
      <div class="profile-header">
        <div class="profile-avatar">
          {{ authStore.user?.username.charAt(0).toUpperCase() }}
        </div>
        <div class="profile-info">
          <h1 class="profile-name">{{ authStore.user?.username }}</h1>
          <p class="profile-email">{{ authStore.user?.email }}</p>
          <span class="profile-role">{{ authStore.user?.role }}</span>
        </div>
      </div>

      <div class="profile-stats">
        <div class="stat-card">
          <div class="stat-value">{{ favoritesStore.favorites.length }}</div>
          <div class="stat-label">Favorites</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useFavoritesStore } from '@/stores/favorites'

const authStore = useAuthStore()
const favoritesStore = useFavoritesStore()

onMounted(() => {
  favoritesStore.fetchFavorites()
})
</script>

<style scoped>
.profile-card {
  max-width: 600px;
  margin: 0 auto;
  background: var(--card);
  border-radius: 1rem;
  padding: 2rem;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border);
}

.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--primary);
  color: white;
  font-size: 2rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.profile-email {
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.profile-role {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: var(--bg);
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--primary);
}

.profile-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.stat-card {
  text-align: center;
  padding: 1.5rem;
  background: var(--bg);
  border-radius: 0.75rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}
</style>
