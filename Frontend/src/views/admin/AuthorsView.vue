<template>
  <div>
    <div class="page-header">
      <div>
        <h1 class="page-title">Manage Authors</h1>
        <p class="page-subtitle">Create and manage book authors</p>
      </div>
      <button @click="showModal = true" class="btn btn-primary">
        <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Author
      </button>
    </div>

    <Loader v-if="loading" />

    <div v-else class="authors-grid">
      <div v-for="author in authors" :key="author.id" class="author-card">
        <div class="author-avatar">
          {{ author.prenom.charAt(0) }}{{ author.nom.charAt(0) }}
        </div>
        <div class="author-info">
          <h3 class="author-name">{{ author.prenom }} {{ author.nom }}</h3>
          <p class="author-books">{{ author.listeLivres?.length || 0 }} books</p>
        </div>
        <div class="author-actions">
          <button @click="viewBooks(author)" class="action-btn view" title="View Books">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <transition name="modal-fade">
      <div v-if="showModal" class="modal-overlay" @click="closeModal">
        <div class="modal" @click.stop>
          <div class="modal-header">
            <h2 class="modal-title">Add New Author</h2>
            <button @click="closeModal" class="modal-close">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form @submit.prevent="handleSubmit" class="modal-form">
            <div class="form-group">
              <label class="form-label">First Name</label>
              <input v-model="form.prenom" type="text" class="input" placeholder="Enter first name" required>
            </div>

            <div class="form-group">
              <label class="form-label">Last Name</label>
              <input v-model="form.nom" type="text" class="input" placeholder="Enter last name" required>
            </div>

            <div class="modal-actions">
              <button type="button" @click="closeModal" class="btn btn-outline">Cancel</button>
              <button type="submit" class="btn btn-primary" :disabled="submitting">
                {{ submitting ? 'Creating...' : 'Create Author' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <transition name="modal-fade">
      <div v-if="selectedAuthor" class="modal-overlay" @click="selectedAuthor = null">
        <div class="modal modal-large" @click.stop>
          <div class="modal-header">
            <h2 class="modal-title">{{ selectedAuthor.prenom }} {{ selectedAuthor.nom }}'s Books</h2>
            <button @click="selectedAuthor = null" class="modal-close">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="books-list">
            <div v-if="selectedAuthor.listeLivres?.length" class="books-grid-modal">
              <div v-for="book in selectedAuthor.listeLivres" :key="book.id" class="book-item">
                <img :src="book.image" :alt="book.title" class="book-thumb">
                <div class="book-details">
                  <h4>{{ book.title }}</h4>
                  <p>{{ book.year }} • {{ book.category }}</p>
                </div>
              </div>
            </div>
            <div v-else class="empty-books">
              <p>No books yet for this author</p>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { authorsService } from '@/services/authors.service'
import Loader from '@/components/Loader.vue'
import type { Author } from '@/types'

const authors = ref<Author[]>([])
const loading = ref(true)
const showModal = ref(false)
const submitting = ref(false)
const selectedAuthor = ref<Author | null>(null)

const form = ref({
  prenom: '',
  nom: ''
})

async function loadAuthors() {
  loading.value = true
  try {
    authors.value = await authorsService.getAll()
  } finally {
    loading.value = false
  }
}

async function handleSubmit() {
  submitting.value = true
  try {
    await authorsService.create(form.value.prenom, form.value.nom)
    closeModal()
    await loadAuthors()
  } finally {
    submitting.value = false
  }
}

function closeModal() {
  showModal.value = false
  form.value = { prenom: '', nom: '' }
}

function viewBooks(author: Author) {
  selectedAuthor.value = author
}

onMounted(() => {
  loadAuthors()
})
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2.5rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.page-subtitle {
  color: var(--text-secondary);
  font-size: 1rem;
  font-weight: 500;
}

.icon {
  width: 20px;
  height: 20px;
}

.authors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.author-card {
  background: var(--card);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 1.25rem;
  transition: all 0.3s;
}

.author-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--primary);
}

.author-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--gradient-primary);
  color: white;
  font-size: 1.25rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: var(--shadow-md);
}

.author-info {
  flex: 1;
  min-width: 0;
}

.author-name {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.author-books {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.author-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  width: 40px;
  height: 40px;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.action-btn svg {
  width: 20px;
  height: 20px;
}

.action-btn.view {
  background: var(--hover);
  color: var(--primary);
}

.action-btn.view:hover {
  background: var(--primary);
  color: white;
  transform: scale(1.1);
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal {
  background: var(--card);
  border-radius: 1.5rem;
  padding: 0;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: var(--shadow-xl);
  display: flex;
  flex-direction: column;
}

.modal-large {
  max-width: 800px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  border-bottom: 1px solid var(--border);
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-primary);
}

.modal-close {
  width: 36px;
  height: 36px;
  border-radius: 0.5rem;
  background: var(--hover);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.modal-close:hover {
  background: var(--border);
  color: var(--text-primary);
  transform: rotate(90deg);
}

.modal-close svg {
  width: 20px;
  height: 20px;
}

.modal-form {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

.books-list {
  padding: 2rem;
  overflow-y: auto;
}

.books-grid-modal {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}

.book-item {
  background: var(--hover);
  border-radius: 0.75rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: all 0.3s;
}

.book-item:hover {
  background: var(--border);
  transform: translateY(-2px);
}

.book-thumb {
  width: 100%;
  aspect-ratio: 3/4;
  object-fit: cover;
  border-radius: 0.5rem;
}

.book-details h4 {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.book-details p {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  text-transform: capitalize;
}

.empty-books {
  text-align: center;
  padding: 3rem;
  color: var(--text-secondary);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .modal,
.modal-fade-leave-to .modal {
  transform: scale(0.95) translateY(20px);
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 1rem;
  }

  .authors-grid {
    grid-template-columns: 1fr;
  }

  .books-grid-modal {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
}
</style>
