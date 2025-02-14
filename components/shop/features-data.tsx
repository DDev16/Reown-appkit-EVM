// components/shop/features-data.tsx
"use client";

import { Clock, CreditCard, Package, Shield } from "lucide-react";
import { Feature } from "@/types/shop";

export const getFeatures = (): Feature[] => [
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