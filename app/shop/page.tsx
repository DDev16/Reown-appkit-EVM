"use client";

import React from 'react';

const ComingSoonPage = () => {
    return (
        <main className="min-h-screen py-24 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-purple-500/30 rounded-full blur-3xl animate-[pulse_15s_ease-in-out_infinite]" />
                <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-blue-500/30 rounded-full blur-3xl animate-[pulse_15s_ease-in-out_infinite]" />
            </div>

            <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold text-gray-900 mb-6">
                        Coming Soon
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        We&apos;re working on something special. Our new shop will be launching soon with exclusive products and amazing deals.
                    </p>
                </div>

                {/* Features Preview */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            title: "Exclusive Products",
                            description: "Carefully curated selection of unique items you won't find anywhere else."
                        },
                        {
                            title: "Special Offers",
                            description: "Early bird discounts and special promotions for our first customers."
                        },
                        {
                            title: "Premium Experience",
                            description: "Seamless shopping experience with premium customer service."
                        }
                    ].map((feature, index) => (
                        <div
                            key={index}
                            className="bg-white/80 backdrop-blur-sm rounded-lg p-8 shadow-lg text-center"
                        >
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default ComingSoonPage;