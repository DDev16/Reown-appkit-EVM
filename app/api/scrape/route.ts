// app/api/scrape/route.ts
import { NextResponse } from 'next/server';
import { scrapeAndProcessWebsite } from '@/lib/ai-scraper';
import { updateWebsiteContent } from '@/lib/db';

export async function GET() {
  try {
    const domain = 'http://localhost:3000';
    const scrapedContent = await scrapeAndProcessWebsite(domain);
    
    // Update database with scraped content
    const dbResult = await updateWebsiteContent(scrapedContent);

    return NextResponse.json({
      message: 'Scraping completed',
      pagesScrapped: scrapedContent.length,
      dbUpdateResult: dbResult,
      content: scrapedContent
    });
  } catch (error) {
    console.error('Scraping error:', error);
    return NextResponse.json(
      { 
        error: 'Scraping failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}