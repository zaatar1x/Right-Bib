<template>
  <div class="filter-panel">
    <div class="filter-header">
      <div class="header-left">
        <svg class="filter-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        <h3 class="filter-title">Filters</h3>
      </div>
      <button @click="resetAll" class="reset-btn">
        <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Reset All
      </button>
    </div>

    <div class="filter-groups">
      <div class="filter-group">
        <label class="filter-label">
          <svg class="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          Category
        </label>
        <select v-model="localFilters.category" @change="applyFilters" class="filter-select">
          <option value="">All Categories</option>
          <option value="roman">Roman</option>
          <option value="science">Science</option>
          <option value="histoire">Histoire</option>
          <option value="informatique">Informatique</option>
          <option value="art">Art</option>
          <option value="philosophie">Philosophie</option>
          <option value="autre">Autre</option>
        </select>
      </div>

      <div class="filter-group">
        <label class="filter-label">
          <svg class="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Author
        </label>
        <select v-model="localFilters.author" @change="applyFilters" class="filter-select">
          <option value="">All Authors</option>
          <option v-for="author in authors" :key="author" :value="author">
            {{ author }}
          </option>
        </select>
      </div>
    </div>

    <div v-if="hasActiveFilters" class="active-filters">
      <span class="active-label">Active Filters:</span>
      <div class="filter-chips">
        <span v-if="localFilters.category" class="filter-chip">
          <svg class="chip-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          {{ localFilters.category }}
          <button @click="clearCategory" class="chip-close">×</button>
        </span>
        <span v-if="localFilters.author" class="filter-chip">
          <svg class="chip-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          {{ localFilters.author }}
          <button @click="clearAuthor" class="chip-close">×</button>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { BookFilters } from '@/types'

const props = defineProps<{
  filters: BookFilters
  authors: string[]
}>()

const emit = defineEmits<{
  update: [filters: Partial<BookFilters>]
  reset: []
}>()

const localFilters = ref<BookFilters>({ ...props.filters })

const hasActiveFilters = computed(() => 
  localFilters.value.category || localFilters.value.author
)

function applyFilters() {
  emit('update', localFilters.value)
}

function resetAll() {
  localFilters.value = { search: '', category: '', author: '' }
  emit('reset')
}

function clearCategory() {
  localFilters.value.category = ''
  applyFilters()
}

function clearAuthor() {
  localFilters.value.author = ''
  applyFilters()
}
</script>

<style scoped>
.filter-panel {
  background: var(--card);
  border-radius: 1.25rem;
  padding: 2rem;
  box-shadow: var(--shadow-lg);
  border: 2px solid var(--border);
  margin-bottom: 2.5rem;
  transition: all 0.3s;
}

.filter-panel:hover {
  box-shadow: var(--shadow-xl);
  border-color: var(--primary);
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid var(--border);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.filter-icon {
  width: 28px;
  height: 28px;
  color: var(--primary);
}

.filter-title {
  font-size: 1.375rem;
  font-weight: 800;
  color: var(--text-primary);
}

.reset-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: var(--hover);
  color: var(--text-secondary);
  border-radius: 0.75rem;
  font-size: 0.9375rem;
  font-weight: 700;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.reset-btn:hover {
  background: var(--error);
  color: white;
  border-color: var(--error);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.reset-btn .icon {
  width: 18px;
  height: 18px;
}

.filter-groups {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.filter-label {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.label-icon {
  width: 18px;
  height: 18px;
  color: var(--primary);
}

.filter-select,
.filter-input {
  padding: 1rem 1.25rem;
  border: 2px solid var(--border);
  border-radius: 0.875rem;
  font-size: 1rem;
  background: var(--bg);
  color: var(--text-primary);
  transition: all 0.3s;
  font-weight: 600;
  cursor: pointer;
}

.filter-select:hover,
.filter-input:hover {
  border-color: var(--primary);
  background: var(--card);
}

.filter-select:focus,
.filter-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
  background: var(--card);
}

.filter-input::placeholder {
  color: var(--text-secondary);
}

.active-filters {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid var(--border);
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.active-label {
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.filter-chips {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.filter-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.625rem 1.125rem;
  background: var(--gradient-primary);
  color: white;
  border-radius: 2rem;
  font-size: 0.9375rem;
  font-weight: 700;
  text-transform: capitalize;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.chip-icon {
  width: 16px;
  height: 16px;
}

.chip-close {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.25);
  color: white;
  font-size: 1.375rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  font-weight: 700;
}

.chip-close:hover {
  background: rgba(255, 255, 255, 0.4);
  transform: rotate(90deg) scale(1.1);
}

@media (max-width: 768px) {
  .filter-panel {
    padding: 1.5rem;
  }

  .filter-groups {
    grid-template-columns: 1fr;
  }
  
  .filter-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .header-left {
    justify-content: center;
  }

  .reset-btn {
    justify-content: center;
  }
}
</style>
