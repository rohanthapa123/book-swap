import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User } from "./types"

interface AuthState {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    isAdmin: boolean
    login: (user: User, token: string) => void
    logout: () => void
    updateUser: (user: Partial<User>) => void
    hydrateFromServer: (user: User) => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isAdmin: false,
            login: (user: User, token: string) => {
                localStorage.setItem("auth_token", token)
                set({
                    user,
                    token,
                    isAuthenticated: true,
                    isAdmin: user.role === "admin",
                })
            },
            logout: () => {
                localStorage.removeItem("auth_token")
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    isAdmin: false,
                })
            },
            updateUser: (userData: Partial<User>) => {
                const currentUser = get().user
                if (currentUser) {
                    const updatedUser = { ...currentUser, ...userData }
                    set({
                        user: updatedUser,
                        isAdmin: updatedUser.role === "admin",
                    })
                }
            },
            hydrateFromServer: (user: User) => {
                set({
                    user,
                    token: null,
                    isAuthenticated: true,
                    isAdmin: user.role === "admin",
                })
            }
        }),
        {
            name: "auth-storage",
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
                isAdmin: state.isAdmin,
            }),
        },
    ),
)

export const getAuthToken = (): string | null => {
    if (typeof window === "undefined") return null
    return localStorage.getItem("auth_token")
}

export const isAuthenticated = (): boolean => {
    return useAuthStore.getState().isAuthenticated
}

export const isAdmin = (): boolean => {
    return useAuthStore.getState().isAdmin
}

export const getCurrentUser = (): User | null => {
    return useAuthStore.getState().user
}
