// components/shop/FeaturesGrid.tsx
"use client";

import { getFeatures } from "./features-data";

const FeaturesGrid = () => {
    const features = getFeatures();

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {features.map((feature, index) => (
                <div
                    key={index}
                    className="flex flex-col items-center p-4 rounded-lg bg-black/50 border border-[#BC1A1E]/20 transition-all duration-300 hover:scale-105"
                >
                    <div className="p-2 rounded-full bg-gradient-to-r from-[#BC1A1E] to-[#FF4B51] mb-3">
                        {feature.icon}
                    </div>
                    <h3 className="text-white font-semibold">{feature.title}</h3>
                    <p className="text-gray-400 text-sm text-center">{feature.description}</p>
                </div>
            ))}
        </div>
    );
};

export default FeaturesGrid;