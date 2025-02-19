// app/api/excel/route.ts
import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';
import * as XLSX from 'xlsx';

export async function GET() {
    try {
        // Adjust the path to point to your Excel file location
        const filePath = path.join(process.cwd(), 'data', 'data.xlsx');
        const fileBuffer = fs.readFileSync(filePath);
        
        const workbook = XLSX.read(fileBuffer);
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        return NextResponse.json(jsonData);
    } catch (error) {
        console.error('Error reading Excel file:', error);
        return NextResponse.json(
            { error: 'Failed to read Excel file' },
            { status: 500 }
        );
    }
}