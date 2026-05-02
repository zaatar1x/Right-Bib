<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">Manage Books</h1>
      <button @click="showModal = true" class="btn btn-primary">
        <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Book
      </button>
    </div>

    <Loader v-if="loading" />

    <div v-else class="books-table">
      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Author</th>
            <th>Year</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in books" :key="book.id">
            <td>
              <img :src="book.image" :alt="book.title" class="table-image">
            </td>
            <td class="font-semibold">{{ book.title }}</td>
            <td>{{ getAuthorName(book.author) }}</td>
            <td>{{ book.year }}</td>
            <td><span class="category-badge">{{ book.category }}</span></td>
            <td>
              <div class="actions">
                <button @click="editBook(book)" class="action-btn edit">Edit</button>
                <button @click="deleteBook(book.id)" class="action-btn delete">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <h2 class="modal-title">{{ editingBook ? 'Edit Book' : 'Add New Book' }}</h2>
        
        <form @submit.prevent="handleSubmit" class="modal-form">
          <div class="form-group">
            <label class="form-label">Title</label>
            <input v-model="form.title" type="text" class="input" required>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Year</label>
              <input v-model.number="form.year" type="number" class="input" required>
            </div>
            <div class="form-group">
              <label class="form-label">Author</label>
              <select v-model.number="form.author" class="input" required>
                <option value="">Select Author</option>
                <option v-for="author in authors" :key="author.id" :value="author.id">
                  {{ author.prenom }} {{ author.nom }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Editor</label>
            <input v-model="form.editor" type="text" class="input" required>
          </div>

          <div class="form-group">
            <label class="form-label">Category</label>
            <select v-model="form.category" class="input" required>
              <option value="">Select Category</option>
              <option value="roman">Roman</option>
              <option value="science">Science</option>
              <option value="histoire">Histoire</option>
              <option value="informatique">Informatique</option>
              <option value="art">Art</option>
              <option value="philosophie">Philosophie</option>
              <option value="autre">Autre</option>
            </select>
          </div>

          <div class="form-group">
            <ImageUpload v-model="form.image" label="Book Cover Image" />
            <p v-if="form.image" class="image-status">
              ✓ Image {{ form.image.startsWith('data:') ? 'uploaded' : 'URL set' }}
            </p>
          </div>

          <div class="modal-actions">
            <button type="button" @click="closeModal" class="btn btn-outline">Cancel</button>
            <button type="submit" class="btn btn-primary">
              {{ editingBook ? 'Update' : 'Create' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { booksService } from '@/services/books.service'
import { authorsService } from '@/services/authors.service'
import Loader from '@/components/Loader.vue'
import ImageUpload from '@/components/ImageUpload.vue'
import type { Book, Author } from '@/types'

const books = ref<Book[]>([])
const authors = ref<Author[]>([])
const loading = ref(true)
const showModal = ref(false)
const editingBook = ref<Book | null>(null)

const form = ref({
  title: '',
  year: new Date().getFullYear(),
  editor: '',
  category: '',
  image: '',
  author: 0
})

function getAuthorName(author: number | Author) {
  if (typeof author === 'object') {
    return `${author.prenom} ${author.nom}`
  }
  const foundAuthor = authors.value.find(a => a.id === author)
  return foundAuthor ? `${foundAuthor.prenom} ${foundAuthor.nom}` : 'Unknown'
}

function editBook(book: Book) {
  editingBook.value = book
  form.value = {
    title: book.title,
    year: book.year,
    editor: book.editor,
    category: book.category,
    image: book.image,
    author: typeof book.author === 'object' ? book.author.id : book.author
  }
  showModal.value = true
}

async function deleteBook(id: number) {
  if (confirm('Are you sure you want to delete this book?')) {
    await booksService.remove(id)
    await loadBooks()
  }
}

async function handleSubmit() {
  if (editingBook.value) {
    await booksService.update(editingBook.value.id, form.value)
  } else {
    // Check if image is a base64 file upload
    if (form.value.image && form.value.image.startsWith('data:')) {
      // Convert base64 to FormData with file blob
      const formData = new FormData()
      formData.append('title', form.value.title)
      formData.append('year', form.value.year.toString())
      formData.append('editor', form.value.editor)
      formData.append('category', form.value.category)
      formData.append('author', form.value.author.toString())
      
      // Convert base64 to blob
      const base64Data = form.value.image.split(',')[1]
      const mimeType = form.value.image.split(',')[0].match(/:(.*?);/)?.[1] || 'image/jpeg'
      const byteCharacters = atob(base64Data)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: mimeType })
      const extension = mimeType.split('/')[1]
      formData.append('file', blob, `upload.${extension}`)
      
      await booksService.create(formData)
    } else {
      // URL or no image - send as JSON
      await booksService.create(form.value)
    }
  }
  closeModal()
  await loadBooks()
}

function closeModal() {
  showModal.value = false
  editingBook.value = null
  form.value = {
    title: '',
    year: new Date().getFullYear(),
    editor: '',
    category: '',
    image: '',
    author: 0
  }
}

async function loadBooks() {
  loading.value = true
  try {
    books.value = await booksService.getAll()
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  authors.value = await authorsService.getAll()
  await loadBooks()
})
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
}

.icon {
  width: 20px;
  height: 20px;
}

.books-table {
  background: var(--card);
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  text-align: left;
  padding: 1rem;
  background: var(--bg);
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

td {
  padding: 1rem;
  border-top: 1px solid var(--border);
  font-size: 0.875rem;
}

.table-image {
  width: 48px;
  height: 64px;
  object-fit: cover;
  border-radius: 0.375rem;
}

.font-semibold {
  font-weight: 600;
  color: var(--text-primary);
}

.category-badge {
  display: inline-block;
  padding: 0.25rem 0.625rem;
  background: var(--bg);
  border-radius: 0.25rem;
  font-size: 0.75rem;
  text-transform: capitalize;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
  transition: all 0.2s;
}

.action-btn.edit {
  background: var(--primary);
  color: white;
}

.action-btn.edit:hover {
  background: #2563EB;
}

.action-btn.delete {
  background: var(--error);
  color: white;
}

.action-btn.delete:hover {
  background: #DC2626;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal {
  background: var(--card);
  border-radius: 1rem;
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

.image-status {
  font-size: 0.875rem;
  color: var(--success);
  font-weight: 600;
  margin-top: 0.5rem;
}
</style>
