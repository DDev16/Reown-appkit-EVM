// components/shop/ProductsGrid.tsx
"use client";

import { Product } from "@/types/shop";
import ProductCard from "./ProductCard";

interface ProductsGridProps {
    products: Product[];
    onAddToCart: (product: Product, size: string | undefined, color: string) => void;
}

const ProductsGrid = ({ products, onAddToCart }: ProductsGridProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={onAddToCart}
                />
            ))}
        </div>
    );
};

export default ProductsGrid;