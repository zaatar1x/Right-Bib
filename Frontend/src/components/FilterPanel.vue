<template>
  <div class="filter-panel">
    <div class="filter-header">
      <h3 class="filter-title">Filters</h3>
      <button @click="resetFilters" class="reset-btn">
        <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Reset
      </button>
    </div>

    <div class="filter-groups">
      <div class="filter-group">
        <label class="filter-label">Category</label>
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
        <label class="filter-label">Year</label>
        <input 
          v-model.number="localFilters.year" 
          type="number" 
          placeholder="Any year"
          class="filter-input"
          @input="applyFilters"
        >
      </div>
    </div>

    <div v-if="hasActiveFilters" class="active-filters">
      <span class="active-label">Active:</span>
      <div class="filter-chips">
        <span v-if="localFilters.category" class="filter-chip">
          {{ localFilters.category }}
          <button @click="clearCategory" class="chip-close">×</button>
        </span>
        <span v-if="localFilters.year" class="filter-chip">
          {{ localFilters.year }}
          <button @click="clearYear" class="chip-close">×</button>
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
}>()

const emit = defineEmits<{
  update: [filters: Partial<BookFilters>]
  reset: []
}>()

const localFilters = ref<BookFilters>({ ...props.filters })

const hasActiveFilters = computed(() => 
  localFilters.value.category || localFilters.value.year
)

function applyFilters() {
  emit('update', localFilters.value)
}

function resetFilters() {
  localFilters.value = { search: '', category: '', year: null }
  emit('reset')
}

function clearCategory() {
  localFilters.value.category = ''
  applyFilters()
}

function clearYear() {
  localFilters.value.year = null
  applyFilters()
}
</script>

<style scoped>
.filter-panel {
  background: var(--card);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border);
  margin-bottom: 2rem;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.filter-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
}

.reset-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--hover);
  color: var(--text-secondary);
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.3s;
}

.reset-btn:hover {
  background: var(--border);
  color: var(--text-primary);
}

.reset-btn .icon {
  width: 16px;
  height: 16px;
}

.filter-groups {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.25rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.filter-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.filter-select,
.filter-input {
  padding: 0.875rem 1rem;
  border: 2px solid var(--border);
  border-radius: 0.75rem;
  font-size: 0.9375rem;
  background: var(--card);
  color: var(--text-primary);
  transition: all 0.3s;
  font-weight: 500;
}

.filter-select:focus,
.filter-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.filter-input::placeholder {
  color: var(--text-secondary);
}

.active-filters {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.active-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.filter-chips {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.filter-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.875rem;
  background: var(--gradient-primary);
  color: white;
  border-radius: 2rem;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: capitalize;
}

.chip-close {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 1.25rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;
}

.chip-close:hover {
  background: rgba(255, 255, 255, 0.3);
}

@media (max-width: 768px) {
  .filter-groups {
    grid-template-columns: 1fr;
  }
  
  .filter-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
}
</style>
