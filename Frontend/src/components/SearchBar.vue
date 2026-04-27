<template>
  <div class="search-bar">
    <svg class="search-icon-left" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
    <input
      v-model="query"
      type="text"
      placeholder="Search books, authors..."
      class="search-input"
      @input="handleInput"
      @focus="isFocused = true"
      @blur="isFocused = false"
    >
    <transition name="fade">
      <button v-if="query" @click="clearSearch" class="clear-btn">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  search: [query: string]
}>()

const query = ref('')
const isFocused = ref(false)
let timeout: ReturnType<typeof setTimeout>

function handleInput() {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    emit('search', query.value)
  }, 300)
}

function clearSearch() {
  query.value = ''
  emit('search', '')
}
</script>

<style scoped>
.search-bar {
  position: relative;
  flex: 1;
  max-width: 500px;
}

.search-input {
  width: 100%;
  padding: 0.875rem 3rem 0.875rem 3rem;
  border: 2px solid var(--border);
  border-radius: 3rem;
  font-size: 0.9375rem;
  transition: all 0.3s;
  background: var(--card);
}

.search-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.search-input::placeholder {
  color: var(--text-secondary);
}

.search-icon-left {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: var(--text-secondary);
  pointer-events: none;
  transition: color 0.3s;
}

.search-input:focus ~ .search-icon-left {
  color: var(--primary);
}

.clear-btn {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--hover);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.clear-btn:hover {
  background: var(--border);
  color: var(--text-primary);
}

.clear-btn svg {
  width: 16px;
  height: 16px;
}

@media (max-width: 768px) {
  .search-bar {
    max-width: 100%;
  }
}
</style>
