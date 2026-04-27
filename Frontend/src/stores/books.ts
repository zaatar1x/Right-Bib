import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { booksService } from '@/services/books.service'
import type { Book, BookFilters, PaginationState } from '@/types'

export const useBooksStore = defineStore('books', () => {
  const books = ref<Book[]>([])
  const loading = ref(false)
  const pagination = ref<PaginationState>({
    page: 1,
    limit: 12,
    total: 0
  })
  const filters = ref<BookFilters>({
    search: '',
    category: '',
    year: null
  })

  const filteredBooks = computed(() => {
    let result = books.value

    if (filters.value.search) {
      const search = filters.value.search.toLowerCase()
      result = result.filter(book => 
        book.title.toLowerCase().includes(search) ||
        (typeof book.author === 'object' && 
          `${book.author.prenom} ${book.author.nom}`.toLowerCase().includes(search))
      )
    }

    if (filters.value.category) {
      result = result.filter(book => book.category === filters.value.category)
    }

    if (filters.value.year) {
      result = result.filter(book => book.year === filters.value.year)
    }

    return result
  })

  const paginatedBooks = computed(() => {
    const start = (pagination.value.page - 1) * pagination.value.limit
    const end = start + pagination.value.limit
    return filteredBooks.value.slice(start, end)
  })

  const totalPages = computed(() => 
    Math.ceil(filteredBooks.value.length / pagination.value.limit)
  )

  async function fetchBooks() {
    loading.value = true
    try {
      books.value = await booksService.getAll()
      pagination.value.total = books.value.length
    } finally {
      loading.value = false
    }
  }

  function setPage(page: number) {
    pagination.value.page = page
  }

  function setFilters(newFilters: Partial<BookFilters>) {
    filters.value = { ...filters.value, ...newFilters }
    pagination.value.page = 1
  }

  function resetFilters() {
    filters.value = { search: '', category: '', year: null }
    pagination.value.page = 1
  }

  return {
    books,
    loading,
    pagination,
    filters,
    filteredBooks,
    paginatedBooks,
    totalPages,
    fetchBooks,
    setPage,
    setFilters,
    resetFilters
  }
})
