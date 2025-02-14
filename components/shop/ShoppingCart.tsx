// components/shop/ShoppingCart.tsx
"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { CartItem } from "@/types/shop";
import { Dispatch, SetStateAction } from "react";

interface ShoppingCartProps {
    cart: CartItem[];
    showCart: boolean;
    setShowCart: (show: boolean) => void;
    setCart: Dispatch<SetStateAction<CartItem[]>>;
}

const ShoppingCart = ({ cart, showCart, setShowCart, setCart }: ShoppingCartProps) => {
    if (!showCart) return null;

    return (
        <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-gray-900 shadow-xl z-50 p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Shopping Cart</h2>
                <button
                    onClick={() => setShowCart(false)}
                    className="text-gray-400 hover:text-white"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            {cart.length === 0 ? (
                <p className="text-gray-400 text-center">Your cart is empty</p>
            ) : (
                <div className="space-y-4">
                    {cart.map((item, index) => (
                        <div key={`${item.id}-${index}`} className="flex gap-4 border-b border-gray-800 pb-4">
                            <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                                <Image
                                    src="/api/placeholder/400/320"
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-white font-medium">{item.name}</h3>
                                <p className="text-sm text-gray-400">
                                    {item.selectedColor}
                                    {item.selectedSize && ` / ${item.selectedSize}`}
                                </p>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-white">${item.price}</span>
                                    <button
                                        onClick={() => {
                                            const newCart = [...cart];
                                            newCart.splice(index, 1);
                                            setCart(newCart);
                                        }}
                                        className="text-red-500 text-sm"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="pt-4">
                        <div className="flex justify-between mb-4">
                            <span className="text-gray-400">Subtotal</span>
                            <span className="text-white font-bold">
                                ${cart.reduce((total, item) => total + item.price, 0).toFixed(2)}
                            </span>
                        </div>
                        <button className="w-full py-3 rounded-lg bg-gradient-to-r from-[#BC1A1E] to-[#FF4B51] text-white font-medium">
                            Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShoppingCart;