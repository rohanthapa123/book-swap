import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query"
import type { AxiosError } from "axios"
import { booksApi, usersApi, swapsApi, adminApi } from "./api"
import type {
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
  ApiResponse,
  PaginatedResponse,
} from "./types"

// Query Keys
export const queryKeys = {
  books: {
    all: ["books"] as const,
    lists: () => [...queryKeys.books.all, "list"] as const,
    list: (filters?: BookFilters) => [...queryKeys.books.lists(), filters] as const,
    details: () => [...queryKeys.books.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.books.details(), id] as const,
    recommendations: () => [...queryKeys.books.all, "recommendations"] as const,
    featured: () => [...queryKeys.books.all, "featured"] as const,
    byGenre: (genre: string) => [...queryKeys.books.all, "genre", genre] as const,
    genreSections: () => [...queryKeys.books.all, "genre-sections"] as const,
  },
  users: {
    all: ["users"] as const,
    lists: () => [...queryKeys.users.all, "list"] as const,
    list: (filters?: UserFilters) => [...queryKeys.users.lists(), filters] as const,
    details: () => [...queryKeys.users.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
    current: () => [...queryKeys.users.all, "current"] as const,
  },
  swaps: {
    all: ["swaps"] as const,
    lists: () => [...queryKeys.swaps.all, "list"] as const,
    list: (filters?: SwapFilters) => [...queryKeys.swaps.lists(), filters] as const,
    details: () => [...queryKeys.swaps.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.swaps.details(), id] as const,
    userSwaps: (userId: string) => [...queryKeys.swaps.all, "user", userId] as const,
  },
  admin: {
    all: ["admin"] as const,
    stats: () => [...queryKeys.admin.all, "stats"] as const,
    pendingBooks: () => [...queryKeys.admin.all, "pending-books"] as const,
  },
} as const

// Books Queries
export const useBooks = (
  filters?: BookFilters,
  page = 1,
  limit = 12,
  options?: UseQueryOptions<PaginatedResponse<Book>, AxiosError>,
) => {
  return useQuery({
    queryKey: queryKeys.books.list(filters),
    queryFn: async () => {
      const response = await booksApi.getAll(filters, page, limit)
      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  })
}

export const useBook = (id: string, options?: UseQueryOptions<Book, AxiosError>) => {
  return useQuery({
    queryKey: queryKeys.books.detail(id),
    queryFn: async () => {
      const response = await booksApi.getById(id)
      return response.data.data
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  })
}

export const useBookRecommendations = (limit = 8, options?: UseQueryOptions<Book[], AxiosError>) => {
  return useQuery({
    queryKey: queryKeys.books.recommendations(),
    queryFn: async () => {
      const response = await booksApi.getRecommendations(limit)
      return response.data.data
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
    ...options,
  })
}

export const useFeaturedBooks = (limit = 8, options?: UseQueryOptions<Book[], AxiosError>) => {
  return useQuery({
    queryKey: queryKeys.books.featured(),
    queryFn: async () => {
      const response = await booksApi.getFeatured(limit)
      return response.data.data
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    ...options,
  })
}

export const useBooksByGenre = (genre: string, limit = 8, options?: UseQueryOptions<Book[], AxiosError>) => {
  return useQuery({
    queryKey: queryKeys.books.byGenre(genre),
    queryFn: async () => {
      const response = await booksApi.getByGenre(genre, limit)
      return response.data.data
    },
    enabled: !!genre,
    staleTime: 15 * 60 * 1000, // 15 minutes
    ...options,
  })
}

export const useGenreSections = (options?: UseQueryOptions<GenreSection[], AxiosError>) => {
  return useQuery({
    queryKey: queryKeys.books.genreSections(),
    queryFn: async () => {
      const response = await booksApi.getGenreSections()
      return response.data.data
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    ...options,
  })
}

// Book Mutations
export const useCreateBook = (options?: UseMutationOptions<ApiResponse<Book>, AxiosError, CreateBookRequest>) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateBookRequest) => {
      const response = await booksApi.create(data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.books.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.pendingBooks() })
    },
    ...options,
  })
}

export const useUpdateBook = (options?: UseMutationOptions<ApiResponse<Book>, AxiosError, UpdateBookRequest>) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateBookRequest) => {
      const response = await booksApi.update(data)
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.books.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.books.detail(data.data.id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.pendingBooks() })
    },
    ...options,
  })
}

// Users Queries
export const useUsers = (
  filters?: UserFilters,
  page = 1,
  limit = 20,
  options?: UseQueryOptions<PaginatedResponse<User>, AxiosError>,
) => {
  return useQuery({
    queryKey: queryKeys.users.list(filters),
    queryFn: async () => {
      const response = await usersApi.getAll(filters, page, limit)
      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  })
}

export const useCurrentUser = (options?: UseQueryOptions<User, AxiosError>) => {
  return useQuery({
    queryKey: queryKeys.users.current(),
    queryFn: async () => {
      const response = await usersApi.getCurrentUser()
      return response.data.data
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: false,
    ...options,
  })
}

// Swaps Queries
export const useSwaps = (
  filters?: SwapFilters,
  page = 1,
  limit = 20,
  options?: UseQueryOptions<PaginatedResponse<SwapRequest>, AxiosError>,
) => {
  return useQuery({
    queryKey: queryKeys.swaps.list(filters),
    queryFn: async () => {
      const response = await swapsApi.getAll(filters, page, limit)
      return response.data
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options,
  })
}

export const useUserSwaps = (userId: string, options?: UseQueryOptions<SwapRequest[], AxiosError>) => {
  return useQuery({
    queryKey: queryKeys.swaps.userSwaps(userId),
    queryFn: async () => {
      const response = await swapsApi.getUserSwaps(userId)
      return response.data.data
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options,
  })
}

// Swap Mutations
export const useCreateSwapRequest = (
  options?: UseMutationOptions<ApiResponse<SwapRequest>, AxiosError, CreateSwapRequest>,
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateSwapRequest) => {
      const response = await swapsApi.create(data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.swaps.all })
    },
    ...options,
  })
}

export const useUpdateSwapRequest = (
  options?: UseMutationOptions<ApiResponse<SwapRequest>, AxiosError, UpdateSwapRequest>,
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateSwapRequest) => {
      const response = await swapsApi.update(data)
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.swaps.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.swaps.detail(data.data.id) })
    },
    ...options,
  })
}

// Admin Queries
export const useAdminStats = (options?: UseQueryOptions<DashboardStats, AxiosError>) => {
  return useQuery({
    queryKey: queryKeys.admin.stats(),
    queryFn: async () => {
      const response = await adminApi.getDashboardStats()
      return response.data.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  })
}

export const usePendingBooks = (
  page = 1,
  limit = 20,
  options?: UseQueryOptions<PaginatedResponse<Book>, AxiosError>,
) => {
  return useQuery({
    queryKey: queryKeys.admin.pendingBooks(),
    queryFn: async () => {
      const response = await adminApi.getPendingBooks(page, limit)
      return response.data
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    ...options,
  })
}

// Admin Mutations
export const useApproveBook = (options?: UseMutationOptions<ApiResponse<Book>, AxiosError, string>) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await adminApi.approveBook(id)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.books.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.pendingBooks() })
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.stats() })
    },
    ...options,
  })
}

export const useRejectBook = (
  options?: UseMutationOptions<ApiResponse<Book>, AxiosError, { id: string; reason?: string }>,
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) => {
      const response = await adminApi.rejectBook(id, reason)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.books.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.pendingBooks() })
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.stats() })
    },
    ...options,
  })
}
