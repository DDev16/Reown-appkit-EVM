// app/api/coin-gecko-data/route.ts
import { NextResponse } from "next/server";

const COINGECKO_API = "https://api.coingecko.com/api/v3";
const FLARE_ID = "flare-networks";

export async function GET() {
  try {
    const response = await fetch(
      `${COINGECKO_API}/coins/${FLARE_ID}?localization=false&tickers=true&market_data=true&community_data=false&developer_data=false&sparkline=false`
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({
      market_cap: data.market_data.market_cap.usd,
      total_volume: data.market_data.total_volume.usd,
      price_change_24h_percentage: data.market_data.price_change_percentage_24h,
      last_updated: data.market_data.last_updated
    });
  } catch (error: any) {
    console.error("CoinGecko fetch error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch CoinGecko data" },
      { status: 500 }
    );
  }
}