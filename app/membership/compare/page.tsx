"use client";
import React, { useState, useEffect } from 'react';

type ExcelRow = (string | number | null)[];

const ExcelDisplay: React.FC = () => {
    const [data, setData] = useState<ExcelRow[]>([]);
    const [headers, setHeaders] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/excel');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const jsonData = await response.json();

                if (jsonData.length > 0) {
                    const headerRow = jsonData[0].map((header: any) => String(header));
                    setHeaders(headerRow);
                    setData(jsonData.slice(1));
                }
                setLoading(false);
            } catch (err) {
                console.error('Error fetching Excel data:', err);
                setError(err instanceof Error ? err.message : 'An error occurred loading the data');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="w-full p-6 bg-black rounded-lg shadow-lg">
                <div className="flex items-center justify-center text-red-500">
                    <svg className="animate-spin h-8 w-8 mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Loading data...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full p-6 bg-black rounded-lg shadow-lg border border-red-800">
                <div className="text-red-500 flex items-center">
                    <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-black rounded-lg shadow-lg border border-red-800">
            <div className="p-6 border-b border-red-800">
                <h2 className="text-2xl font-bold text-red-500">Excel Data Display</h2>
            </div>
            <div className="overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                    <table className="min-w-full divide-y divide-red-800">
                        <thead>
                            <tr>
                                {headers.map((header, index) => (
                                    <th
                                        key={index}
                                        scope="col"
                                        className="px-6 py-4 text-left text-xs font-bold text-red-500 uppercase tracking-wider bg-black sticky top-0 border-b border-red-800"
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-red-800">
                            {data.map((row, rowIndex) => (
                                <tr
                                    key={rowIndex}
                                    className={`
                                        ${rowIndex % 2 === 0 ? 'bg-black' : 'bg-[#1A1A1A]'}
                                        hover:bg-red-900/30 transition-colors duration-150 ease-in-out
                                    `}
                                >
                                    {headers.map((_, colIndex) => (
                                        <td
                                            key={colIndex}
                                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 border-b border-red-800"
                                        >
                                            {row[colIndex]?.toString() ?? ''}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ExcelDisplay;