// components/auth/ProtectedRoute.tsx
"use client";
import { ReactNode } from 'react';
import { useAuth } from './AuthProvider';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !user && pathname?.startsWith('/admin')) {
            router.push('/admin/login');
        }
    }, [user, loading, router, pathname]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return <>{children}</>;
};