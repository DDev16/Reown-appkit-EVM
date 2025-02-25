"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowUpRight, ArrowDownRight, RefreshCw, AlertCircle, TrendingUp } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import TradingViewChart from "@/components/chart/TradingViewChart";

const fetcher = (url: string): Promise<any> => fetch(url).then((res) => res.json());

export default function FlareNetworkPriceDashboard() {
    const quantity = 1;

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: false,
            mirror: false,
            offset: 50,
        });
    }, []);

    const {
        data: ftsoData,
        error: ftsoError,
        isLoading: ftsoLoading,
        mutate: mutateFtso
    } = useSWR("/api/flare-price", fetcher, {
        refreshInterval: 60000,
    });

    const {
        data: geckoData,
        error: geckoError,
        isLoading: geckoLoading,
        mutate: mutateGecko
    } = useSWR("/api/coin-gecko-data", fetcher, {
        refreshInterval: 300000,
    });

    const [priceChange, setPriceChange] = useState<number>(0);
    const [previousPrice, setPreviousPrice] = useState<number | null>(null);

    useEffect(() => {
        if (ftsoData?.price && previousPrice) {
            setPriceChange(((ftsoData.price - previousPrice) / previousPrice) * 100);
        }
        if (ftsoData?.price) {
            setPreviousPrice(ftsoData.price);
        }
    }, [ftsoData?.price]);

    const handleRefresh = () => {
        mutateFtso();
        mutateGecko();
    };

    const formatLargeNumber = (num: number): string => {
        if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
        if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
        return `$${num.toLocaleString()}`;
    };

    if (ftsoError || geckoError) {
        return (
            <div className="relative min-h-screen bg-black py-12">
                <Alert variant="destructive" className="max-w-4xl mx-auto">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        {ftsoError ? "Unable to load price data." : "Unable to load market data."}
                        Please try again later.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <section className="relative min-h-screen  py-12 overflow-hidden">
            {/* Background Layers */}
            <div className="absolute inset-0">
                <div
                    className="absolute inset-0 opacity-[0.15]"
                    style={{
                        backgroundImage: `
                            linear-gradient(to right, #BC1A1E 1px, transparent 1px),
                            linear-gradient(to bottom, #BC1A1E 1px, transparent 1px)
                        `,
                        backgroundSize: "40px 40px",
                        maskImage: "radial-gradient(circle at 50% 50%, black, transparent 80%)",
                    }}
                />
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-1/2 left-1/2 w-[1000px] h-[1000px] -translate-x-1/2 -translate-y-1/2">
                        <div className="absolute inset-0 bg-[#BC1A1E] rounded-full mix-blend-screen filter blur-[100px] animate-flow-1 opacity-20" />
                        <div className="absolute inset-0 bg-[#FF4B51] rounded-full mix-blend-screen filter blur-[100px] animate-flow-2 opacity-15" />
                    </div>
                </div>
            </div>

            <div className="relative z-20 max-w-6xl mx-auto px-4">
                <div className="text-center mb-8" data-aos="fade-down">
                    <div className="inline-block">
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-[#BC1A1E] to-[#FF4B51] rounded-lg blur opacity-30" />
                            <h1 className="relative text-4xl font-bold text-white mb-4 py-2">
                                Flare Network Price Dashboard
                                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#BC1A1E] to-transparent" />
                            </h1>
                        </div>
                    </div>
                    <p className="text-gray-400">Real-time FLR/USD price tracking and analytics</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Main Price Card */}
                    <Card className="md:col-span-2 group relative p-6 rounded-xl bg-black/90 border border-[#BC1A1E]/20 transition-all duration-500 hover:-translate-y-1 backdrop-blur-sm" data-aos="fade-up">
                        <div className="absolute -inset-[1px] bg-gradient-to-r from-[#BC1A1E] via-[#FF4B51] to-[#BC1A1E] rounded-xl opacity-50 blur-sm transition-all duration-500 group-hover:opacity-100" />
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-white">Current Price</h2>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleRefresh}
                                    disabled={ftsoLoading}
                                    className="bg-black/50 text-white border-[#BC1A1E]/50 hover:bg-[#BC1A1E]/20"
                                >
                                    <RefreshCw className={`h-4 w-4 ${ftsoLoading ? 'animate-spin' : ''}`} />
                                    <span className="ml-2">Refresh</span>
                                </Button>
                            </div>

                            {ftsoLoading ? (
                                <div className="flex items-center justify-center h-32">
                                    <div className="flex items-center space-x-2 text-gray-400">
                                        <RefreshCw className="h-6 w-6 animate-spin" />
                                        <span className="font-medium">Loading price data...</span>
                                    </div>
                                </div>
                            ) : ftsoData?.price ? (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="text-4xl font-bold text-white">
                                                ${ftsoData.price.toFixed(4)}
                                            </div>
                                            {geckoData?.price_change_24h_percentage && (
                                                <div className={`flex items-center justify-center mt-2 ${geckoData.price_change_24h_percentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                    {geckoData.price_change_24h_percentage >= 0 ? (
                                                        <ArrowUpRight className="h-5 w-5" />
                                                    ) : (
                                                        <ArrowDownRight className="h-5 w-5" />
                                                    )}
                                                    <span className="font-semibold ml-1">
                                                        {Math.abs(geckoData.price_change_24h_percentage).toFixed(2)}%
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {quantity > 1 && (
                                        <div className="bg-black/50 backdrop-blur-sm rounded-xl p-4 border border-[#BC1A1E]/20">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <TrendingUp className="h-5 w-5 text-[#FF4B51]" />
                                                    <span className="font-medium text-white">Conversion</span>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-lg font-semibold text-white">
                                                        ${(ftsoData.price * quantity).toFixed(2)}
                                                    </div>
                                                    <div className="text-sm text-gray-400">
                                                        {quantity.toLocaleString()} FLR
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center text-gray-400">No price data available</div>
                            )}

                            {ftsoData?.timestamp && (
                                <div className="mt-6 pt-4 border-t border-[#BC1A1E]/20">
                                    <div className="flex items-center justify-between text-sm text-gray-400">
                                        <span>Last updated</span>
                                        <span>{new Date(ftsoData.timestamp * 1000).toLocaleString()}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Market Data Cards */}
                    <div className="grid grid-cols-1 gap-6">
                        {[
                            {
                                title: "24h Volume",
                                value: geckoData?.total_volume || 0,
                                description: "Global trading volume",
                                delay: 100
                            },
                            {
                                title: "Market Cap",
                                value: geckoData?.market_cap || 0,
                                description: "Fully diluted valuation",
                                delay: 200
                            }
                        ].map((card, index) => (
                            <div
                                key={index}
                                className="group relative p-6 rounded-xl bg-black/90 border border-[#BC1A1E]/20 transition-all duration-500 hover:-translate-y-1 backdrop-blur-sm"
                                data-aos="fade-up"
                                data-aos-delay={card.delay}
                            >
                                <div className="absolute -inset-[1px] bg-gradient-to-r from-[#BC1A1E] via-[#FF4B51] to-[#BC1A1E] rounded-xl opacity-50 blur-sm transition-all duration-500 group-hover:opacity-100" />
                                <div className="relative z-10">
                                    <h3 className="text-lg font-semibold text-white mb-2">{card.title}</h3>
                                    <div className="text-2xl font-semibold text-white">
                                        {geckoLoading ? (
                                            <span className="text-gray-400">Loading...</span>
                                        ) : (
                                            formatLargeNumber(card.value)
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-400 mt-1">{card.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-6 text-center text-sm text-gray-400" data-aos="fade-up" data-aos-delay="300">
                    <p>Price data from Flare Network FTSO. Market data provided by CoinGecko. Updates automatically.</p>
                </div>

                {/* TradingView Chart */}
                <div className="mt-10" data-aos="fade-up" data-aos-delay="400">
                    <TradingViewChart />
                </div>
            </div>

            {/* Custom Animations */}
            <style jsx>{`
                @keyframes flow-1 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(-50px, 50px) scale(1.1); }
                }
                @keyframes flow-2 {
                    0%, 100% { transform: translate(0, 0) scale(1.1); }
                    50% { transform: translate(50px, -50px) scale(1); }
                }
                .animate-flow-1 {
                    animation: flow-1 15s ease-in-out infinite;
                }
                .animate-flow-2 {
                    animation: flow-2 15s ease-in-out infinite;
                }
            `}</style>
        </section>
    );
}