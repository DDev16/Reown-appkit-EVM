'use client';

import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

// Declare the window.fs type
declare global {
    interface Window {
        fs: {
            readFile: (path: string) => Promise<Uint8Array>;
        };
    }
}

// Define types for our data structure
type TableRow = (string | number | null)[];
type TableData = TableRow[];

const ComparisonTable: React.FC = () => {
    const [data, setData] = useState<TableData>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadExcelData = async () => {
            try {
                const response = await window.fs.readFile('data.xlsx');
                const workbook = XLSX.read(response, {
                    cellDates: true,
                    cellNF: true,
                    cellFormula: true,
                    sheetStubs: true
                });

                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const jsonData = XLSX.utils.sheet_to_json<TableRow>(worksheet, { header: 1 });
                setData(jsonData);
                setLoading(false);
            } catch (error) {
                console.error('Error loading Excel data:', error);
                setLoading(false);
            }
        };

        loadExcelData();
    }, []);

    const formatCellValue = (value: string | number | null, rowHeader: string): string => {
        if (!value) return '';

        if (rowHeader === "Costs p/m Without Kickback") {
            return typeof value === 'number' ?
                new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 2
                }).format(value) : value.toString();
        }

        if (rowHeader === "Max cashback in FLR") {
            return typeof value === 'number' ? `${(value * 100).toFixed(2)}%` : value.toString();
        }

        if (typeof value === 'number') {
            return value.toString().includes('.') ?
                `${(value * 100).toFixed(2)}%` :
                value.toLocaleString();
        }
        return value.toString();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64 bg-gray-900 text-red-500">
                <div className="text-lg">Loading comparison data...</div>
            </div>
        );
    }

    // Safely access the header row
    const headerRow = data[26] || [];

    return (
        <div className="w-full overflow-x-auto bg-gray-900 p-4 rounded-lg">
            <table className="min-w-full bg-gray-900 border border-gray-700">
                <thead>
                    <tr className="bg-black">
                        <th className="p-4 text-left text-sm font-semibold text-red-500 border-b border-gray-700">Features</th>
                        {headerRow.slice(1).map((tier, index) => (
                            <th key={index} className="p-4 text-center text-sm font-semibold text-red-500 border-b border-gray-700">
                                {String(tier)}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row: TableRow, rowIndex: number) => {
                        if (rowIndex === 0 || !row[0]) return null;
                        return (
                            <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900'}>
                                <td className="p-4 text-sm text-gray-300 border-b border-gray-700 font-medium">
                                    {String(row[0])}
                                </td>
                                {row.slice(1).map((cell, cellIndex) => (
                                    <td key={cellIndex} className="p-4 text-sm text-center text-gray-300 border-b border-gray-700">
                                        {formatCellValue(cell, String(row[0]))}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default ComparisonTable;