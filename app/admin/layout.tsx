'use client';

// app/admin/layout.tsx
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { checkIsAdmin } from '@/lib/authHandler';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                // Not logged in, redirect to login
                if (pathname !== '/admin/login' && pathname !== '/admin/sign-up') {
                    router.push('/admin/login');
                }
                setLoading(false);
                return;
            }

            // Check if user is admin
            const isAdmin = await checkIsAdmin(user.uid);

            if (!isAdmin && pathname !== '/admin/login' && pathname !== '/admin/sign-up') {
                // User is logged in but not an admin
                router.push('/unauthorized');
                setLoading(false);
                return;
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, [pathname, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
            </div>
        );
    }

    return <section>{children}</section>;
}