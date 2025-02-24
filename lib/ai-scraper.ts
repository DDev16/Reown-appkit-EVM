// app/lib/ai-scraper.ts
import * as cheerio from 'cheerio';
import { summarizeContent } from './openai';

export type ProcessedContent = {
  title: string;
  content: string;
  url: string;
};

export async function scrapeAndProcessWebsite(domain: string): Promise<ProcessedContent[]> {
  const visited = new Set<string>();
  const queue: string[] = ['/'];
  const results: ProcessedContent[] = [];

  try {
    while (queue.length > 0) {
      const path = queue.shift()!;
      
      // Avoid duplicate scraping and limit depth
      if (visited.has(path) || visited.size > 20) continue;
      visited.add(path);

      // Fetch the page
      const response = await fetch(`${domain}${path}`);
      const html = await response.text();
      const $ = cheerio.load(html);

      // Extract main content
      const mainContent: string[] = [];
      $('main, article, .content, #content, .text-container, .page-content').each((_, element) => {
        mainContent.push($(element).text());
      });

      // Get page title
      const title = $('h1').first().text() || 
                    $('title').text() || 
                    'Untitled Page';

      // Clean and concatenate content
      const rawContent = mainContent.join(' ')
        .replace(/\s+/g, ' ')
        .trim();

      // Only process content with meaningful length
      if (rawContent.length > 100) {
        // Use OpenAI to summarize the content
        const summarizedContent = await summarizeContent(rawContent);

        results.push({
          title,
          content: summarizedContent,
          url: `${domain}${path}`
        });
      }

      // Find additional links to crawl
      $('a').each((_, element) => {
        const href = $(element).attr('href');
        if (href) {
          // Normalize href
          const normalizedHref = href.startsWith('/') 
            ? href 
            : href.startsWith(domain) 
              ? new URL(href).pathname 
              : null;

          if (
            normalizedHref && 
            !visited.has(normalizedHref) && 
            !normalizedHref.match(/\.(pdf|jpg|jpeg|png|gif|css|js)$/i)
          ) {
            queue.push(normalizedHref);
          }
        }
      });
    }
  } catch (error) {
    console.error('Error scraping website:', error);
    throw error;
  }

  return results;
}