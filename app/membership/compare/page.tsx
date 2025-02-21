'use client';

import React, { useState, useEffect } from 'react';

type TableRow = (string | number | null)[];
type TableData = TableRow[];

const ComparisonTable: React.FC = () => {
    const [data, setData] = useState<TableData>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

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

    const formatCellValue = (value: string | number | null, rowHeader: string): string => {
        if (value === null || value === undefined) return '0';

        if (rowHeader === "Costs p/m Without Kickback") {
            return typeof value === 'number' ?
                new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 2
                }).format(value) : value.toString();
        }

        if (rowHeader === "Max cashback in FLR" ||
            rowHeader === "Minimum cashback in FLR" ||
            rowHeader === "50% of Company assets" ||
            rowHeader === "35% profit share pool") {
            if (value === 0) return '0.00%';
            return typeof value === 'number' ? `${(value * 100).toFixed(2)}%` : value.toString();
        }

        if (typeof value === 'number') {
            if (value === 0) return '0';
            return value.toString().includes('.') ?
                `${(value * 100).toFixed(2)}%` :
                value.toLocaleString();
        }
        return value.toString();
    };

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

    // Filter out empty rows and get visible row count
    const visibleRows = data.slice(1).filter(row => row[0]);

    return (
        <div className="w-full overflow-x-auto bg-black p-6 rounded-lg border border-red-800">
            <table className="min-w-full bg-black">
                <thead>
                    <tr>
                        <th className="p-4 text-left text-sm font-bold text-red-500 border-b border-red-800/50 uppercase bg-black">
                            NFT Tiers
                        </th>
                        {tierNames.map((tier, index) => (
                            <th key={index} className="p-4 text-center text-sm font-bold text-red-500 border-b border-red-800/50 uppercase bg-black">
                                {String(tier)}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {visibleRows.map((row: TableRow, visibleIndex: number) => (
                        <tr
                            key={visibleIndex}
                            className={`
                                ${visibleIndex % 2 === 0 ? 'bg-black' : 'bg-[#1A1A1A] '}
                                hover:bg-red-600/20 transition-colors duration-150 ease-in-out
                            `}
                        >
                            <td className="p-4 text-sm text-red-400 font-medium">
                                {String(row[0])}
                            </td>
                            {row.slice(1).map((cell, cellIndex) => (
                                <td key={cellIndex} className="p-4 text-sm text-center text-gray-300">
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