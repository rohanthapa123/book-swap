import axios, { type AxiosResponse } from "axios"
import type {
  ApiResponse,
  PaginatedResponse,
  Book,
  User,
  SwapRequest,
  CreateBookRequest,
  UpdateBookRequest,
  CreateSwapRequest,
  UpdateSwapRequest,
  BookFilters,
  UserFilters,
  SwapFilters,
  DashboardStats,
  GenreSection,
} from "./types"
import { checkAuth } from "@/api/auth"

// Create axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_HOST || "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})


// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = "/auth/login"
    }
    return Promise.reject(error)
  },
)

// Books API
export const booksApi = {
  getAll: (filters?: BookFilters, page = 1, limit = 12): Promise<AxiosResponse<PaginatedResponse<Book>>> =>
    api.get("/books", { params: { ...filters, page, limit } }),

  getById: (id: string): Promise<AxiosResponse<ApiResponse<Book>>> => api.get(`/books/${id}`),

  create: (data: CreateBookRequest): Promise<AxiosResponse<ApiResponse<Book>>> => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === "coverImage" && value instanceof File) {
          formData.append(key, value)
        } else {
          formData.append(key, String(value))
        }
      }
    })
    return api.post("/books", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  },

  update: (data: UpdateBookRequest): Promise<AxiosResponse<ApiResponse<Book>>> => api.put(`/books/${data.id}`, data),

  delete: (id: string): Promise<AxiosResponse<ApiResponse<void>>> => api.delete(`/books/${id}`),

  getRecommendations: (limit = 8): Promise<AxiosResponse<ApiResponse<Book[]>>> =>
    api.get("/recommendation/content", { params: { limit } }),

  getByGenre: (genre: string, limit = 8): Promise<AxiosResponse<ApiResponse<Book[]>>> =>
    api.get(`/books/genre/${genre}`, { params: { limit } }),

  getFeatured: (limit = 8): Promise<AxiosResponse<ApiResponse<Book[]>>> =>
    api.get("/books/featured", { params: { limit } }),

  getGenreSections: (): Promise<AxiosResponse<ApiResponse<GenreSection[]>>> => api.get("/books/genre-sections"),
}

// Users API
export const usersApi = {
  getAll: (filters?: UserFilters, page = 1, limit = 20): Promise<AxiosResponse<PaginatedResponse<User>>> =>
    api.get("/users", { params: { ...filters, page, limit } }),

  getById: (id: string): Promise<AxiosResponse<ApiResponse<User>>> => api.get(`/users/${id}`),

  getCurrentUser: (): Promise<AxiosResponse<ApiResponse<User>>> => api.get("/users/me"),

  update: (id: string, data: Partial<User>): Promise<AxiosResponse<ApiResponse<User>>> => api.put(`/users/${id}`, data),

  updateUserPreferences: (id: string, preferences: string[]) => api.put(`/user/${id}`, { preferences }),

  delete: (id: string): Promise<AxiosResponse<ApiResponse<void>>> => api.delete(`/users/${id}`),
}

// Swap Requests API
export const swapsApi = {
  getAll: (filters?: SwapFilters, page = 1, limit = 20): Promise<AxiosResponse<PaginatedResponse<SwapRequest>>> =>
    api.get("/swap-requests", { params: { ...filters, page, limit } }),

  getById: (id: string): Promise<AxiosResponse<ApiResponse<SwapRequest>>> => api.get(`/swap-requests/${id}`),

  create: (data: CreateSwapRequest): Promise<AxiosResponse<ApiResponse<SwapRequest>>> => api.post("/swap-requests", data),

  update: (data: UpdateSwapRequest): Promise<AxiosResponse<ApiResponse<SwapRequest>>> =>
    api.put(`/swap-requests/${data.id}`, data),

  delete: (id: string): Promise<AxiosResponse<ApiResponse<void>>> => api.delete(`/swap-requests/${id}`),

  getUserSwaps: (userId: string): Promise<AxiosResponse<ApiResponse<SwapRequest[]>>> =>
    api.get(`/swap-requests/user/${userId}`),
}

// Admin API
export const adminApi = {
  getDashboardStats: (): Promise<AxiosResponse<ApiResponse<DashboardStats>>> => api.get("/admin/stats"),

  getPendingBooks: (page = 1, limit = 20): Promise<AxiosResponse<PaginatedResponse<Book>>> =>
    api.get("/admin/books/pending", { params: { page, limit } }),

  approveBook: (id: string): Promise<AxiosResponse<ApiResponse<Book>>> => api.post(`/admin/books/${id}/approve`),

  rejectBook: (id: string, reason?: string): Promise<AxiosResponse<ApiResponse<Book>>> =>
    api.post(`/admin/books/${id}/reject`, { reason }),
}

// Auth API
export const authApi = {
  login: (email: string, password: string): Promise<AxiosResponse<ApiResponse<{ user: User; token: string }>>> =>
    api.post("/auth/login", { email, password }),

  register: (data: {
    email: string
    password: string
    firstName: string
    lastName: string
  }): Promise<AxiosResponse<ApiResponse<{ user: User; token: string }>>> => api.post("/auth/register", data),

  logout: (): Promise<AxiosResponse<ApiResponse<void>>> => api.post("/auth/logout"),

  checkAuth: (): Promise<AxiosResponse<ApiResponse<User>>> => api.get("/auth/get-me"),

  refreshToken: (): Promise<AxiosResponse<ApiResponse<{ token: string }>>> => api.post("/auth/refresh"),
}

export default api
