// Core entity types
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  fullName: string
  avatar?: string
  role: "user" | "admin"
  isActive: boolean
  booksCount: number
  swapsCount: number
  createdAt: string
  updatedAt: string
}

export interface Book {
  id: string
  title: string
  author: string
  description: string
  genre: BookGenre
  condition: BookCondition
  language: string
  publishedYear?: number
  pages?: number
  isbn?: string
  coverUrl?: string
  image?: string
  status: BookStatus
  ownerId: string
  owner: User
  createdAt: string
  updatedAt: string
}

export interface SwapRequest {
  id: string
  requesterId: string
  requester: User
  ownerId: string
  owner: User
  bookId: string
  book: Book
  offeredBookId?: string
  offeredBook?: Book
  message: string
  status: SwapStatus
  createdAt: string
  updatedAt: string
}

// Enums
export type BookGenre =
  | "fiction"
  | "non-fiction"
  | "mystery"
  | "sci-fi"
  | "fantasy"
  | "romance"
  | "biography"
  | "history"
  | "self-help"
  | "children"
  | "other"

export type BookCondition = "like-new" | "very-good" | "good" | "fair" | "poor"

export type BookStatus = "pending" | "approved" | "rejected"

export type SwapStatus = "pending" | "accepted" | "rejected" | "completed" | "cancelled"

// API Response types
export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Query parameters
export interface BookFilters {
  search?: string
  genre?: BookGenre
  condition?: BookCondition
  status?: BookStatus
  ownerId?: string
}

export interface UserFilters {
  search?: string
  role?: "user" | "admin"
  isActive?: boolean
}

export interface SwapFilters {
  status?: SwapStatus
  requesterId?: string
  ownerId?: string
  bookId?: string
}

// Form types
export interface CreateBookRequest {
  title: string
  author: string
  description: string
  genre: BookGenre
  condition: BookCondition
  language: string
  publishedYear?: number
  pages?: number
  isbn?: string
  coverImage?: File
}

export interface UpdateBookRequest extends Partial<CreateBookRequest> {
  id: string
  status?: BookStatus
}

export interface CreateSwapRequest {
  bookId: string
  offeredBookId?: string
  message: string
}

export interface UpdateSwapRequest {
  id: string
  status: SwapStatus
  message?: string
}

// Dashboard stats
export interface DashboardStats {
  totalBooks: number
  totalUsers: number
  totalSwaps: number
  pendingApprovals: number
  activeUsers: number
  completedSwaps: number
  booksAddedThisMonth: number
  usersJoinedThisMonth: number
}

// Recommendation types

export interface GenreSection {
  genre: BookGenre
  displayName: string
  books: Book[]
  totalCount: number
}
