// app/api/flare-price/route.ts
import { NextResponse } from "next/server";
import { JsonRpcProvider, Contract, formatUnits } from "ethers";

// Use the Flare Mainnet RPC endpoint
const provider = new JsonRpcProvider("https://flare-api.flare.network/ext/C/rpc");

// Updated Ftso contract address
const ftsoContractAddress = "0xc524491f34687a15469d2b8158E94f6e2bCf9938";

// Minimal ABI including both methods for flexibility
const ftsoAbi = [
  // Returns (price, timestamp, decimals)
  "function getCurrentPriceWithDecimals() external view returns (uint256, uint256, uint256)",
  // Fallback: Returns (price, timestamp)
  "function getCurrentPrice() external view returns (uint256, uint256)"
];

export async function GET() {
  try {
    const contract = new Contract(ftsoContractAddress, ftsoAbi, provider);

    let formattedPrice: number;
    let timestamp: number;

    try {
      // Try using getCurrentPriceWithDecimals()
      const [price, ts, decimals] = await contract.getCurrentPriceWithDecimals();
      formattedPrice = Number(formatUnits(price, decimals));
      timestamp = Number(ts);
    } catch (innerError: any) {
      console.error("getCurrentPriceWithDecimals failed:", innerError);
      // Fallback to getCurrentPrice() if available
      const [price, ts] = await contract.getCurrentPrice();
      const fallbackDecimals = 5;
      formattedPrice = Number(formatUnits(price, fallbackDecimals));
      timestamp = Number(ts);
    }

    return NextResponse.json({ price: formattedPrice, timestamp });
  } catch (error: any) {
    console.error("FTSO fetch error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch FTSO price" },
      { status: 500 }
    );
  }
}
