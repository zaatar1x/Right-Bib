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
    author: ''
  })
  // Internal sorting - always by favorites (most popular first)
  // Not exposed to UI - automatic behavior
  const sortBy = ref('favorites')

  const authors = computed(() => {
    const authorSet = new Set<string>()
    books.value.forEach(book => {
      if (typeof book.author === 'object') {
        authorSet.add(`${book.author.prenom} ${book.author.nom}`)
      }
    })
    return Array.from(authorSet).sort()
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

    if (filters.value.author) {
      result = result.filter(book => 
        typeof book.author === 'object' && 
        `${book.author.prenom} ${book.author.nom}` === filters.value.author
      )
    }

    return result
  })

  const sortedBooks = computed(() => {
    const result = [...filteredBooks.value]
    
    switch (sortBy.value) {
      case 'favorites':
        // Note: This requires favorites count on book object
        // For now, keep original order as API doesn't return favorites count per book
        return result
      case 'newest':
        return result.sort((a, b) => b.year - a.year)
      case 'oldest':
        return result.sort((a, b) => a.year - b.year)
      case 'title':
        return result.sort((a, b) => a.title.localeCompare(b.title))
      default:
        return result
    }
  })

  const paginatedBooks = computed(() => {
    const start = (pagination.value.page - 1) * pagination.value.limit
    const end = start + pagination.value.limit
    return sortedBooks.value.slice(start, end)
  })

  const totalPages = computed(() => 
    Math.ceil(sortedBooks.value.length / pagination.value.limit)
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
    filters.value = { search: '', category: '', author: '' }
    // sortBy remains 'favorites' - always default
    pagination.value.page = 1
  }

  return {
    books,
    loading,
    pagination,
    filters,
    authors,
    filteredBooks,
    sortedBooks,
    paginatedBooks,
    totalPages,
    fetchBooks,
    setPage,
    setFilters,
    resetFilters
  }
})
