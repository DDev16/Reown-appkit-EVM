'use client';

import { TestItem } from '@/types/types';
import { formatDate } from '@/utils/formatters';

interface TestCardProps {
    test: TestItem;
    onClick?: () => void;
}

export const TestCard: React.FC<TestCardProps> = ({ test, onClick }) => {
    // Determine difficulty badge color
    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'beginner':
                return 'bg-green-800 text-green-200';
            case 'intermediate':
                return 'bg-yellow-800 text-yellow-200';
            case 'advanced':
                return 'bg-red-800 text-red-200';
            default:
                return 'bg-gray-800 text-gray-200';
        }
    };

    const difficultyClass = getDifficultyColor(test.difficulty);

    // Format estimated time
    const formatTime = (minutes: number) => {
        if (minutes < 60) {
            return `${minutes} min`;
        }
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    };

    const handleStartTest = (e: React.MouseEvent) => {
        e.stopPropagation();
        // Handle test start logic - can be expanded later
        if (onClick) onClick();
    };

    return (
        <div
            className="bg-black/30 rounded-lg overflow-hidden border border-zinc-800 hover:border-red-900 transition-colors"
            onClick={onClick}
        >
            <div className="relative">
                {test.thumbnail && (
                    <div className="h-36 overflow-hidden">
                        <img
                            src={test.thumbnail || "/placeholder-thumbnail.jpg"}
                            alt={test.title}
                            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = "/placeholder-thumbnail.jpg";
                            }}
                        />
                    </div>
                )}

                {test.completed !== undefined && (
                    <div className="absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium bg-black/70 border border-zinc-700">
                        {test.completed ? (
                            <div className="flex items-center">
                                <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                                <span>Completed</span>
                                {test.score !== undefined && (
                                    <span className="ml-1">• {test.score}%</span>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center">
                                <span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span>
                                <span>Not Started</span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="p-4">
                <h3 className="font-semibold text-white text-lg">{test.title}</h3>
                <p className="text-gray-400 text-sm mt-1 line-clamp-2">{test.description}</p>

                <div className="flex flex-wrap gap-2 mt-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${difficultyClass}`}>
                        {test.difficulty.charAt(0).toUpperCase() + test.difficulty.slice(1)}
                    </span>

                    <span className="px-2 py-1 bg-zinc-800 text-zinc-300 rounded-full text-xs">
                        {test.questions} Questions
                    </span>

                    <span className="px-2 py-1 bg-zinc-800 text-zinc-300 rounded-full text-xs">
                        {formatTime(test.estimatedTime)}
                    </span>
                </div>

                <div className="flex justify-between items-center mt-4">
                    <span className="text-xs text-gray-500">{formatDate(test.date)}</span>

                    <button
                        className="px-3 py-1.5 bg-red-900 hover:bg-red-800 text-white text-sm rounded transition-colors"
                        onClick={handleStartTest}
                    >
                        {test.completed ? 'Retake Test' : 'Start Test'}
                    </button>
                </div>
            </div>
        </div>
    );
};