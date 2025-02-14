// app/unauthorized/page.tsx
export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-red-600 mb-4">
                    Unauthorized Access
                </h1>
                <p className="text-gray-600 mb-4">
                    You do not have permission to access the admin area. This area is restricted to administrators only.
                </p>
                <a
                    href="/"
                    className="block text-center bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                    Return to Home
                </a>
            </div>
        </div>
    );
}