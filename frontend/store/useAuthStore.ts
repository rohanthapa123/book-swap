import { create } from 'zustand';

export interface User {
    id: string;
    name: string;
    email: string;
    admin: boolean;
    isActive: boolean;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
    phone: string | null;
    gender: string | null;
    dateOfBirth: string | null;
    address: string | null;
    latitude: number | null;
    longitude: number | null;
    profileImage: string | null;
    preferences: string[];
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    login: (user: User) => void;
    logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    login: (user) =>
        set(() => ({
            user,
            isAuthenticated: true,
        })),
    logout: () =>
        set(() => ({
            user: null,
            isAuthenticated: false,
        })),
}));

export default useAuthStore;
