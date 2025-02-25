'use client';

import React, { useState, useEffect, useCallback } from 'react';

type TableRow = (string | number | null)[];
type TableData = TableRow[];

const ComparisonTable: React.FC = () => {
    const [data, setData] = useState<TableData>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState<boolean>(false);

    // Check if screen is mobile size
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        // Initial check
        checkMobile();

        // Add event listener for resize
        window.addEventListener('resize', checkMobile);

        // Cleanup
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/excel');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const jsonData = await response.json();
                setData(jsonData);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err instanceof Error ? err.message : 'Failed to load data');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const formatCellValue = useCallback((value: string | number | null, rowHeader: string): React.ReactNode => {
        if (value === null || value === undefined) return '0';

        // Check for yes/no values first
        if (typeof value === 'string') {
            const normalizedValue = value.trim().toLowerCase();
            if (normalizedValue === 'yes') {
                return <span className="text-green-500">✔</span>;
            }
            if (normalizedValue === 'no') {
                return <span className="text-red-500">✖</span>;
            }
        }

        // Remove commas for specific rows
        if (rowHeader === "Free Draws" ||
            rowHeader.includes("Monthly Sweepstake") ||
            rowHeader === "DBW" ||
            rowHeader.trim() === "Free Draws") {
            return typeof value === 'string'
                ? value.replace(/,/g, '')
                : value.toString();
        }

        if (rowHeader === "Costs p/m Without Kickback" ||
            rowHeader === "Total price in USD"
        ) {
            return typeof value === 'number'
                ? new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 2
                }).format(value)
                : value.toString();
        }

        if (rowHeader === "Max cashback in FLR" ||
            rowHeader === "Minimum cashback in FLR" ||
            rowHeader === "50% of Company assets" ||
            rowHeader === "35% profit share pool") {
            if (value === 0) return '0.00%';
            return typeof value === 'number'
                ? `${(value * 100).toFixed(2)}%`
                : value.toString();
        }

        if (typeof value === 'number') {
            if (value === 0) return '0';
            return value.toString().includes('.')
                ? `${(value * 100).toFixed(2)}%`
                : value.toLocaleString();
        }

        return value.toString();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64 bg-black text-red-500">
                <div className="text-lg">Loading comparison data...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64 bg-black text-red-500">
                <div className="text-lg">Error: {error}</div>
            </div>
        );
    }

    const tierNames = data[0]?.slice(1) || [];
    const visibleRows = data.slice(1).filter(row => row[0]);

    // Mobile card-based layout
    if (isMobile) {
        return (
            <div className="w-full bg-black p-4 rounded-lg border border-red-800">
                <h2 className="text-xl font-bold text-green-500 mb-4 text-center uppercase">NFT Tiers Comparison</h2>

                {/* Tier selector buttons at the top */}
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {tierNames.map((tier, index) => (
                        <button
                            key={index}
                            className="px-3 py-2 bg-red-900/30 hover:bg-red-700/40 text-green-400 rounded-lg text-sm font-medium border border-red-800/50 transition-colors"
                            onClick={() => {
                                // Scroll to the corresponding tier section
                                document.getElementById(`tier-${index}`)?.scrollIntoView({
                                    behavior: 'smooth'
                                });
                            }}
                        >
                            {String(tier)}
                        </button>
                    ))}
                </div>

                {/* Display each tier as a section with cards */}
                {tierNames.map((tier, tierIndex) => (
                    <div
                        key={tierIndex}
                        id={`tier-${tierIndex}`}
                        className="mb-8 pb-6 border-b border-red-800/30 last:border-b-0"
                    >
                        <h3 className="text-lg font-bold text-green-500 mb-4 sticky top-0 bg-black py-2 uppercase">
                            {String(tier)}
                        </h3>

                        <div className="space-y-3">
                            {visibleRows.map((row, rowIndex) => {
                                const cellValue = row[tierIndex + 1];
                                const rowHeader = String(row[0]);
                                const formattedValue = formatCellValue(cellValue, rowHeader);

                                return (
                                    <div
                                        key={rowIndex}
                                        className={`
                                            p-3 rounded-lg 
                                            ${rowIndex % 2 === 0 ? 'bg-black border border-red-800/20' : 'bg-[#1A1A1A]'}
                                        `}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div className="text-sm text-green-400 font-medium">
                                                {rowHeader}
                                            </div>
                                            <div className="text-sm text-gray-300 font-bold">
                                                {formattedValue}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    // Desktop table layout
    return (
        <div className="w-full overflow-x-auto bg-black p-6 rounded-lg border border-red-800">
            <table className="min-w-full bg-black table-fixed">
                <thead className="sticky top-0">
                    <tr>
                        <th className="p-4 text-left text-sm font-bold text-green-500 border-b border-red-800/50 uppercase bg-black w-1/5">
                            <div className="truncate">NFT Tiers</div>
                        </th>
                        {tierNames.map((tier, index) => (
                            <th
                                key={index}
                                className="p-4 text-center text-sm font-bold text-green-500 border-b border-red-800/50 uppercase bg-black"
                                style={{ width: `${80 / tierNames.length}%` }}
                            >
                                <div className="truncate whitespace-nowrap px-1">{String(tier)}</div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {visibleRows.map((row: TableRow, visibleIndex: number) => (
                        <tr
                            key={visibleIndex}
                            className={`
                                ${visibleIndex % 2 === 0 ? 'bg-black' : 'bg-[#1A1A1A]'}
                                hover:bg-red-600/20 transition-colors duration-150 ease-in-out
                            `}
                        >
                            <td className="p-4 text-sm text-green-400 font-medium w-1/5">
                                <div className="truncate">{String(row[0])}</div>
                            </td>
                            {row.slice(1).map((cell, cellIndex) => (
                                <td
                                    key={cellIndex}
                                    className="p-4 text-sm text-center text-gray-300"
                                    style={{ width: `${80 / tierNames.length}%` }}
                                >
                                    {formatCellValue(cell, String(row[0]))}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ComparisonTable;