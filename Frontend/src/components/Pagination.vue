<template>
  <div v-if="totalPages > 1" class="pagination">
    <button 
      @click="emit('change', currentPage - 1)"
      :disabled="currentPage === 1"
      class="page-btn page-nav"
    >
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      <span>Previous</span>
    </button>

    <div class="page-numbers">
      <button
        v-for="page in visiblePages"
        :key="page"
        @click="emit('change', page)"
        class="page-btn page-number"
        :class="{ active: page === currentPage }"
      >
        {{ page }}
      </button>
    </div>

    <button 
      @click="emit('change', currentPage + 1)"
      :disabled="currentPage === totalPages"
      class="page-btn page-nav"
    >
      <span>Next</span>
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  currentPage: number
  totalPages: number
}>()

const emit = defineEmits<{
  change: [page: number]
}>()

const visiblePages = computed(() => {
  const pages: number[] = []
  const maxVisible = 5
  
  let start = Math.max(1, props.currentPage - Math.floor(maxVisible / 2))
  let end = Math.min(props.totalPages, start + maxVisible - 1)
  
  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})
</script>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 3rem;
}

.page-numbers {
  display: flex;
  gap: 0.5rem;
}

.page-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: 2px solid var(--border);
  border-radius: 0.75rem;
  background: var(--card);
  color: var(--text-primary);
  font-size: 0.9375rem;
  font-weight: 600;
  transition: all 0.3s;
  min-width: 44px;
  justify-content: center;
}

.page-btn svg {
  width: 18px;
  height: 18px;
}

.page-btn:hover:not(:disabled) {
  background: var(--hover);
  border-color: var(--primary);
  color: var(--primary);
  transform: translateY(-2px);
}

.page-btn.active {
  background: var(--gradient-primary);
  color: white;
  border-color: transparent;
  box-shadow: var(--shadow-md);
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-number {
  min-width: 44px;
}

@media (max-width: 768px) {
  .page-nav span {
    display: none;
  }
  
  .page-btn {
    padding: 0.625rem;
    min-width: 40px;
  }
}
</style>
