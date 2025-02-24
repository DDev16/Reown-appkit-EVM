// app/api/update-content/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { scrapeAndProcessWebsite } from '@/lib/ai-scraper';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { domain } = await request.json();
    
    if (!domain) {
      return NextResponse.json(
        { error: 'Domain is required' },
        { status: 400 }
      );
    }

    // Trigger the scraping and processing
    const content = await scrapeAndProcessWebsite(domain);

    return NextResponse.json({ 
      message: 'Content updated successfully',
      count: content.length,
      sampleUrls: content.slice(0, 3).map(item => item.url) // Show first 3 URLs processed
    });

  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json(
      { error: 'Failed to update content' },
      { status: 500 }
    );
  }
}

// Optional: Add a GET endpoint to check last update time
export async function GET() {
  try {
    // Get the first content item to check last update time
    const lastUpdate = await prisma.websiteContent.findFirst({
      orderBy: { updatedAt: 'desc' },
      select: { updatedAt: true }
    });

    return NextResponse.json({ 
      lastUpdate: lastUpdate?.updatedAt || null
    });

  } catch (error) {
    console.error('Error checking content status:', error);
    return NextResponse.json(
      { error: 'Failed to check content status' },
      { status: 500 }
    );
  }
}