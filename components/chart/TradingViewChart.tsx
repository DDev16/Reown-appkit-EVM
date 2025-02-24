"use client";

import React, { useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";

declare global {
    interface Window {
        TradingView: {
            widget: new (config: any) => any;
        };
    }
}

const TradingViewChart = () => {
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/tv.js';
        script.async = true;
        script.onload = () => {
            if (container.current) {
                new window.TradingView.widget({
                    container_id: "tradingview_chart",
                    symbol: "FLRUSD",
                    interval: "1",
                    timezone: "Etc/UTC",
                    theme: "dark",
                    style: "1",
                    locale: "en",
                    toolbar_bg: "#000000",
                    enable_publishing: false,
                    hide_top_toolbar: false,
                    hide_legend: false,
                    save_image: false,
                    backgroundColor: "rgba(0, 0, 0, 1)",
                    gridColor: "rgba(188, 26, 30, 0.1)",
                    width: "100%",
                    height: "500",
                    autosize: true,
                    allow_symbol_change: true,
                    studies: [
                        "RSI@tv-basicstudies",
                        "MASimple@tv-basicstudies"
                    ],
                    disabled_features: [
                        "use_localstorage_for_settings"
                    ],
                    enabled_features: [
                        "side_toolbar_in_fullscreen_mode"
                    ]
                });
            }
        };
        document.head.appendChild(script);

        return () => {
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
        };
    }, []);

    return (
        <Card className="md:col-span-2 group relative p-6 rounded-xl bg-black/90 border border-[#BC1A1E]/20 transition-all duration-500 backdrop-blur-sm" data-aos="fade-up">
            <div className="absolute -inset-[1px] bg-gradient-to-r from-[#BC1A1E] via-[#FF4B51] to-[#BC1A1E] rounded-xl opacity-50 blur-sm transition-all duration-500 group-hover:opacity-100" />
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white">Price Chart</h2>
                </div>
                <div className="h-[500px]" id="tradingview_chart" ref={container} />
            </div>
        </Card>
    );
};

export default TradingViewChart;