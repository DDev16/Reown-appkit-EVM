// LoadingState.tsx
'use client';

export const LoadingState = () => {
    return (
        <div className="flex items-center justify-center h-64">
            <div className="text-center">
                <div className="w-8 h-8 border-t-2 border-red-600 rounded-full animate-spin mx-auto"></div>
                <p className="mt-2 text-gray-400">Loading content...</p>
            </div>
        </div>
    );
};
