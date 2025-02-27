'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TestItem } from '@/types/types';
import { TestCard } from '@/components/dashboard/tests/TestCard';

interface TestSectionProps {
    tests: TestItem[];
}

export const TestSection: React.FC<TestSectionProps> = ({ tests }) => {
    const router = useRouter();
    const [selectedTest, setSelectedTest] = useState<string | null>(null);

    // Handle test card click
    const handleTestClick = (testId: string) => {
        setSelectedTest(testId);
        // This can be expanded to navigate to the test page
        // router.push(`/dashboard/tier-1/tests/${testId}`);
        console.log(`Test selected: ${testId}`);
    };

    // If there are no tests available
    if (!tests || tests.length === 0) {
        return (
            <div className="text-center py-8 bg-black/20 rounded-lg">
                <p className="text-gray-400">No knowledge tests available yet.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tests.map((test) => (
                <TestCard
                    key={test.id}
                    test={test}
                    onClick={() => handleTestClick(test.id)}
                />
            ))}
        </div>
    );
};