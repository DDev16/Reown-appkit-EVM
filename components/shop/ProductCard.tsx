// components/shop/ProductCard.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingBag, Star, X } from "lucide-react";
import { ProductCardProps } from "@/types/shop";

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
    const [selectedSize, setSelectedSize] = useState<string | undefined>(product.sizes?.[0]);
    const [selectedColor, setSelectedColor] = useState<string>(product.colors[0]);
    const [isQuickView, setIsQuickView] = useState<boolean>(false);

    return (
        <>
            <div className="group h-full">
                <div className="relative h-full">
                    {/* Card border gradient */}
                    <div className="absolute -inset-[1px] bg-gradient-to-r from-[#BC1A1E] via-[#FF4B51] to-[#BC1A1E] rounded-xl opacity-50 group-hover:opacity-100 blur-[2px] transition-all duration-500" />

                    {/* Card content */}
                    <div className="relative h-full rounded-xl p-6 bg-[#0A0A0A] border border-[#BC1A1E]/20 backdrop-blur-sm flex flex-col">
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
                            <button
                                onClick={() => setIsQuickView(true)}
                                className="absolute bottom-2 right-2 bg-black/70 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            >
                                Quick View
                            </button>
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 flex flex-col space-y-3">
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

                            <p className="text-sm text-gray-400 line-clamp-2">{product.description}</p>

                            {/* Color Selection */}
                            <div className="flex gap-2">
                                {product.colors.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        className={`w-6 h-6 rounded-full border-2 ${selectedColor === color
                                                ? 'border-white'
                                                : 'border-transparent'
                                            }`}
                                        style={{
                                            backgroundColor: color.toLowerCase(),
                                            opacity: selectedColor === color ? 1 : 0.5
                                        }}
                                    />
                                ))}
                            </div>

                            {/* Size Selection */}
                            {product.sizes && (
                                <div className="flex gap-2">
                                    {product.sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`px-2 py-1 rounded ${selectedSize === size
                                                    ? 'bg-[#BC1A1E] text-white'
                                                    : 'bg-gray-800 text-gray-400'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div className="flex justify-between items-center pt-2 mt-auto">
                                <span className="text-xl font-bold text-white">
                                    ${product.price}
                                </span>
                                <button
                                    onClick={() => onAddToCart(product, selectedSize, selectedColor)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#BC1A1E] to-[#FF4B51] text-white font-medium hover:shadow-lg hover:shadow-[#BC1A1E]/20 transition-all duration-300"
                                >
                                    <ShoppingBag className="w-4 h-4" />
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick View Modal */}
            {isQuickView && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                    <div className="bg-[#0A0A0A] p-6 rounded-xl max-w-2xl w-full mx-4 relative border border-[#BC1A1E]/20">
                        <button
                            onClick={() => setIsQuickView(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="relative h-64 rounded-lg overflow-hidden bg-gradient-to-br from-[#BC1A1E]/10 to-[#FF4B51]/10">
                                <Image
                                    src="/api/placeholder/400/320"
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold text-white">{product.name}</h2>
                                <p className="text-gray-400">{product.description}</p>
                                <div className="flex items-center gap-2">
                                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                    <span className="text-white">{product.rating}</span>
                                </div>
                                <p className="text-green-500">In Stock: {product.stock} units</p>
                                <p className="text-2xl font-bold text-white">${product.price}</p>
                                <button
                                    onClick={() => {
                                        onAddToCart(product, selectedSize, selectedColor);
                                        setIsQuickView(false);
                                    }}
                                    className="w-full py-3 rounded-lg bg-gradient-to-r from-[#BC1A1E] to-[#FF4B51] text-white font-medium"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductCard;