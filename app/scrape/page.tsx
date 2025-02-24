// app/scrape/page.tsx
'use client';

import { useState } from 'react';

export default function ScrapePage() {
    const [isScraping, setIsScraping] = useState(false);
    const [results, setResults] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleScrape = async () => {
        setIsScraping(true);
        setError(null);

        try {
            const response = await fetch('/api/scrape', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || 'Scraping failed');
            }

            const data = await response.json();
            setResults(data.content);
        } catch (error) {
            console.error('Scraping error:', error);
            setError(error instanceof Error ? error.message : 'Unknown error occurred during scraping');
        } finally {
            setIsScraping(false);
        }
    };

    // Error state
    if (error) {
        return (
            <div className="container mx-auto p-6 bg-red-50 border-l-4 border-red-500">
                <h1 className="text-2xl font-bold text-red-800 mb-4">Scraping Error</h1>
                <p className="text-red-700 mb-4">{error}</p>
                <button
                    onClick={() => {
                        setError(null);
                        handleScrape();
                    }}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                    Retry Scraping
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Website Scraper</h1>

            <button
                onClick={handleScrape}
                disabled={isScraping}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
            >
                {isScraping ? 'Scraping...' : 'Start Scraping'}
            </button>

            {results.length > 0 && (
                <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-4">
                        Scraped Content
                        <span className="ml-2 text-sm text-gray-600">
                            ({results.length} pages)
                        </span>
                    </h2>
                    <div className="space-y-4">
                        {results.map((result, index) => (
                            <div
                                key={index}
                                className="bg-gray-100 p-4 rounded shadow"
                            >
                                <h3 className="font-bold text-lg">{result.title}</h3>
                                <p className="text-gray-700 mt-2">
                                    {result.content.slice(0, 300)}...
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}