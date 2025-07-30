'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore, { User } from '@/store/useAuthStore';



interface Props {
    user?: User | null;
    children: ReactNode;
}

const AuthProvider = ({ user, children }: Props) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const login = useAuthStore((state) => state.login);
    const logout = useAuthStore((state) => state.logout);
    const router = useRouter();
    const [currentPath, setCurrentPath] = useState<string>("");

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setCurrentPath(window.location.pathname);
        }

        if (user && !isAuthenticated) {
            login(user);
        }
    }, [user, login, isAuthenticated]);

    return <>{children}</>;
};

export default AuthProvider;
