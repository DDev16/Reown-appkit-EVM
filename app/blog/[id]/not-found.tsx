// app/blog/[id]/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-red-500 mb-4">Blog Post Not Found</h1>
                <Link
                    href="/blog"
                    className="text-gray-400 hover:text-red-500 transition-colors duration-300"
                >
                    Return to Blog List
                </Link>
            </div>
        </div>
    );
}