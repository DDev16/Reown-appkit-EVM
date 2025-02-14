// types/shop.ts

import { ReactNode } from 'react';

export interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
    category: "Apparel" | "Accessories";
    rating: number;
    description: string;
    sizes?: string[];
    colors: string[];
    stock: number;
}

export interface CartItem extends Product {
    selectedSize?: string;
    selectedColor: string;
    quantity: number;
}

export interface Feature {
    icon: ReactNode;
    title: string;
    description: string;
}

export interface ProductCardProps {
    product: Product;
    onAddToCart: (product: Product, size: string | undefined, color: string) => void;
}