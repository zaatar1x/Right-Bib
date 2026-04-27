import api from './api'
import type { Book, BookStats } from '@/types'

export const booksService = {
  async getAll() {
    const { data } = await api.get<{ listeBooks: Book[] }>('/books/all')
    return data.listeBooks.filter(book => !book.deleteAt)
  },

  async getById(id: number) {
    const { data } = await api.get<Book[]>(`/books/search/${id}`)
    return data[0]
  },

  async create(book: Omit<Book, 'id' | 'createdAt' | 'updateAt' | 'deleteAt' | 'user'>) {
    const { data } = await api.post<{ data: Book }>('/books/new', book)
    return data.data
  },

  async update(id: number, book: Partial<Book>) {
    const { data } = await api.put<{ response: Book }>(`/books/edit/${id}`, book)
    return data.response
  },

  async remove(id: number) {
    await api.delete(`/books/remove/${id}`)
  },

  async getStats() {
    const { data } = await api.get<BookStats[]>('/books/stats')
    return data
  }
}
