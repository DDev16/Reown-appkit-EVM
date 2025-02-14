// data/products.ts
import { Product } from "@/types/shop";

export const products: Product[] = [
    {
        id: 1,
        name: "DBW Hoodie",
        price: 59.99,
        image: "/shop/hoodie.jpg",
        category: "Apparel",
        rating: 4.9,
        description: "Premium quality hoodie with embroidered DBW logo",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Black", "Gray", "Navy"],
        stock: 15
    },
    {
        id: 2,
        name: "Trading Journal",
        price: 29.99,
        image: "/shop/journal.webp",
        category: "Accessories",
        rating: 4.8,
        description: "Professional trading journal with custom templates",
        colors: ["Black", "Brown"],
        stock: 25
    },
    {
        id: 3,
        name: "DBW Cap",
        price: 24.99,
        image: "/shop/cap.png",
        category: "Apparel",
        rating: 4.7,
        description: "Adjustable cap with embroidered DBW logo",
        colors: ["Black", "White", "Red"],
        stock: 30
    },
    {
        id: 4,
        name: "Crypto Wallet",
        price: 79.99,
        image: "/shop/wallet.png",
        category: "Accessories",
        rating: 4.9,
        description: "Secure hardware wallet with DBW customization",
        colors: ["Black", "Silver"],
        stock: 10
    }
];