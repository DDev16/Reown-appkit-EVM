"use client";

import { ShoppingBag, Star, Clock, CreditCard, Package, Shield } from "lucide-react";
import { useEffect } from "react";
import Image from "next/image";
import AOS from "aos";
import "aos/dist/aos.css";

const products = [
    {
        id: 1,
        name: "DBW Hoodie",
        price: "$59.99",
        image: "/shop/hoodie.png",
        category: "Apparel",
        rating: 4.9,
        description: "Premium quality hoodie with embroidered DBW logo"
    },
    {
        id: 2,
        name: "Trading Journal",
        price: "$29.99",
        image: "/shop/journal.png",
        category: "Accessories",
        rating: 4.8,
        description: "Professional trading journal with custom templates"
    },
    {
        id: 3,
        name: "DBW Cap",
        price: "$24.99",
        image: "/shop/cap.png",
        category: "Apparel",
        rating: 4.7,
        description: "Adjustable cap with embroidered DBW logo"
    },
    {
        id: 4,
        name: "Crypto Wallet",
        price: "$79.99",
        image: "/shop/wallet.png",
        category: "Accessories",
        rating: 4.9,
        description: "Secure hardware wallet with DBW customization"
    }
];

const features = [
    {
        icon: <Clock className="w-6 h-6" />,
        title: "Fast Shipping",
        description: "Quick delivery worldwide"
    },
    {
        icon: <CreditCard className="w-6 h-6" />,
        title: "Secure Payment",
        description: "Multiple payment options"
    },
    {
        icon: <Package className="w-6 h-6" />,
        title: "Quality Products",
        description: "Premium materials only"
    },
    {
        icon: <Shield className="w-6 h-6" />,
        title: "Warranty",
        description: "30-day money back"
    }
];

export default function ShopPage() {
    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: false,
            mirror: false,
            offset: 50,
        });
    }, []);

    return (
        <main className="min-h-screen py-24 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0">
                <div
                    className="absolute inset-0 opacity-[0.15]"
                    style={{
                        backgroundImage: `
                            linear-gradient(to right, #BC1A1E 1px, transparent 1px),
                            linear-gradient(to bottom, #BC1A1E 1px, transparent 1px)
                        `,
                        backgroundSize: "40px 40px",
                        maskImage: "radial-gradient(circle at 50% 50%, black, transparent 80%)"
                    }}
                />
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-1/2 left-1/2 w-[1000px] h-[1000px] -translate-x-1/2 -translate-y-1/2">
                        <div className="absolute inset-0 bg-[#BC1A1E] rounded-full mix-blend-screen filter blur-[100px] animate-flow-1 opacity-20" />
                        <div className="absolute inset-0 bg-[#FF4B51] rounded-full mix-blend-screen filter blur-[100px] animate-flow-2 opacity-15" />
                    </div>
                </div>
            </div>

            <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16" data-aos="fade-down">
                    <div className="inline-block">
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-[#BC1A1E] to-[#FF4B51] rounded-lg blur opacity-30" />
                            <h1 className="relative text-4xl font-bold text-white mb-4 py-2">
                                DBW Shop
                                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#BC1A1E] to-transparent" />
                            </h1>
                        </div>
                    </div>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto mt-4">
                        Exclusive merchandise and accessories for the DBW community
                    </p>
                </div>

                {/* Features */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center p-4 rounded-lg bg-black/50 border border-[#BC1A1E]/20"
                            data-aos="fade-up"
                            data-aos-delay={index * 100}
                        >
                            <div className="p-2 rounded-full bg-gradient-to-r from-[#BC1A1E] to-[#FF4B51] mb-3">
                                {feature.icon}
                            </div>
                            <h3 className="text-white font-semibold">{feature.title}</h3>
                            <p className="text-gray-400 text-sm text-center">{feature.description}</p>
                        </div>
                    ))}
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((product, index) => (
                        <div
                            key={product.id}
                            className="group relative"
                            data-aos="fade-up"
                            data-aos-delay={index * 100}
                        >
                            <div className="absolute -inset-[1px] bg-gradient-to-r from-[#BC1A1E] via-[#FF4B51] to-[#BC1A1E] rounded-xl opacity-50 group-hover:opacity-100 blur-[2px] transition-all duration-500" />

                            <div className="relative rounded-xl p-6 bg-black/90 border border-[#BC1A1E]/20 backdrop-blur-sm">
                                {/* Product Image */}
                                <div className="relative h-48 w-full mb-4 overflow-hidden rounded-lg bg-gradient-to-br from-[#BC1A1E]/10 to-[#FF4B51]/10">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Image
                                            src="/api/placeholder/400/320"
                                            alt={product.name}
                                            width={200}
                                            height={200}
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </div>
                                </div>

                                {/* Product Info */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-semibold text-white">
                                                {product.name}
                                            </h3>
                                            <p className="text-sm text-gray-400">{product.category}</p>
                                        </div>
                                        <div className="flex items-center">
                                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                            <span className="ml-1 text-sm text-gray-400">
                                                {product.rating}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-400">{product.description}</p>
                                    <div className="flex justify-between items-center pt-4">
                                        <span className="text-xl font-bold text-white">
                                            {product.price}
                                        </span>
                                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#BC1A1E] to-[#FF4B51] text-white font-medium hover:shadow-lg hover:shadow-[#BC1A1E]/20 transition-all duration-300">
                                            <ShoppingBag className="w-4 h-4" />
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

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
        </main>
    );
}