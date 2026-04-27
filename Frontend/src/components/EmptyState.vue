<template>
  <div class="empty-state">
    <div class="empty-icon-wrapper">
      <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
    </div>
    <h3 class="empty-title">{{ title }}</h3>
    <p class="empty-message">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  message: string
}>()
</script>

<style scoped>
.empty-state {
  text-align: center;
  padding: 5rem 2rem;
}

.empty-icon-wrapper {
  width: 120px;
  height: 120px;
  margin: 0 auto 2rem;
  border-radius: 50%;
  background: var(--hover);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.empty-icon-wrapper::before {
  content: '';
  position: absolute;
  inset: -8px;
  border-radius: 50%;
  background: var(--gradient-primary);
  opacity: 0.1;
  animation: pulse 2s ease-in-out infinite;
}

.empty-icon {
  width: 56px;
  height: 56px;
  color: var(--text-secondary);
  position: relative;
  z-index: 1;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
}

.empty-message {
  font-size: 1rem;
  color: var(--text-secondary);
  font-weight: 500;
  max-width: 400px;
  margin: 0 auto;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.1; }
  50% { transform: scale(1.1); opacity: 0.2; }
}
</style>
