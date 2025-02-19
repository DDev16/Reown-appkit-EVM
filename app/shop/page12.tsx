"use client";

import { useState } from "react";
import { Product, CartItem } from "@/types/shop";
import { products } from "@/data/products";
import Background from "@/components/shop/Background";
import Header from "@/components/shop/Header";
import SearchAndFilter from "@/components/shop/SearchAndFilter";
import FeaturesGrid from "@/components/shop/FeaturesGrid";
import ProductsGrid from "@/components/shop/ProductsGrid";
import ShoppingCart from "@/components/shop/ShoppingCart";

export default function ShopPage() {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [cart, setCart] = useState<CartItem[]>([]);
    const [showCart, setShowCart] = useState<boolean>(false);

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleAddToCart = (product: Product, size: string | undefined, color: string) => {
        const cartItem: CartItem = {
            ...product,
            selectedSize: size,
            selectedColor: color,
            quantity: 1
        };
        setCart([...cart, cartItem]);
        setShowCart(true);
    };

    return (
        <main className="min-h-screen py-24 relative overflow-hidden">
            <Background />

            <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Header />

                <SearchAndFilter
                    searchTerm={searchTerm}
                    selectedCategory={selectedCategory}
                    onSearchChange={setSearchTerm}
                    onCategoryChange={setSelectedCategory}
                />

                <FeaturesGrid />

                <ProductsGrid
                    products={filteredProducts}
                    onAddToCart={handleAddToCart}
                />
            </div>

            <ShoppingCart
                cart={cart}
                showCart={showCart}
                setShowCart={setShowCart}
                setCart={setCart}
            />

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