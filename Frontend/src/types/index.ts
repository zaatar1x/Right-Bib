export interface User {
  id: number
  email: string
  username: string
  role: 'user' | 'admin'
}

export interface AuthResponse {
  id: number
  email: string
  username: string
  role: 'user' | 'admin'
  access_token: string
}

export interface Author {
  id: number
  prenom: string
  nom: string
  createdAt: string
  updateAt: string
  deleteAt: string | null
}

export interface Book {
  id: number
  title: string
  year: number
  editor: string
  image: string
  category: BookCategory
  createdAt: string
  updateAt: string
  deleteAt: string | null
  author: number | Author
  user?: number
}

export type BookCategory = 'roman' | 'science' | 'histoire' | 'informatique' | 'art' | 'philosophie' | 'autre'

export interface Favorite {
  id: number
  createdAt: string
  book: {
    id: number
    title: string
    year: number
    editor: string
    image: string
    category: BookCategory
    author: {
      id: number
      prenom: string
      nom: string
    }
  }
}

export interface BookStats {
  year: string
  NbBooks: string
}

export interface MostFavoritedBook {
  bookId: number
  title: string
  image: string
  authorName: string
  count: number
}

export interface PaginationState {
  page: number
  limit: number
  total: number
}

export interface BookFilters {
  search: string
  category: BookCategory | ''
  author: string
}
