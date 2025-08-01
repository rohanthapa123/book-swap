"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { useState, type ReactNode } from "react"

interface QueryProviderProps {
    children: ReactNode
}

export default function QueryProvider({ children }: QueryProviderProps) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 5 * 60 * 1000, // 5 minutes
                        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
                        retry: (failureCount, error: any) => {
                            // Don't retry on 4xx errors except 408, 429
                            if (error?.response?.status >= 400 && error?.response?.status < 500) {
                                if (error?.response?.status === 408 || error?.response?.status === 429) {
                                    return failureCount < 2
                                }
                                return false
                            }
                            // Retry on network errors and 5xx errors
                            return failureCount < 3
                        },
                        refetchOnWindowFocus: false,
                    },
                    mutations: {
                        retry: (failureCount, error: any) => {
                            // Don't retry mutations on 4xx errors
                            if (error?.response?.status >= 400 && error?.response?.status < 500) {
                                return false
                            }
                            return failureCount < 2
                        },
                    },
                },
            }),
    )

    return (
        <QueryClientProvider client={queryClie  nt}>
            { children }
            < ReactQueryDevtools initialIsOpen = { false} />
    </QueryClientProvider >
  )
}
