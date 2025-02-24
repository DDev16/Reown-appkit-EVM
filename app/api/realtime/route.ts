import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // CoinGecko API endpoint for Flare (FLR) price
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=flare-networks&vs_currencies=usd&include_24hr_change=true'
    );

    if (!response.ok) {
      throw new Error('Failed to fetch price data');
    }

    const data = await response.json();
    
    // Extract price and 24h change
    const priceInfo = {
      price: data['flare-networks']?.usd || null,
      priceChange24h: data['flare-networks']?.usd_24h_change || null,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(priceInfo, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Price fetch error:', error);
    return NextResponse.json(
      { error: 'Unable to fetch price data' }, 
      { status: 500 }
    );
  }
}

// Allows this route to be dynamically rendered on each request
export const dynamic = 'force-dynamic';