// components/shop/SearchAndFilter.tsx
"use client";

import { Search, Filter } from "lucide-react";

interface SearchAndFilterProps {
    searchTerm: string;
    selectedCategory: string;
    onSearchChange: (value: string) => void;
    onCategoryChange: (value: string) => void;
}

const SearchAndFilter = ({
    searchTerm,
    selectedCategory,
    onSearchChange,
    onCategoryChange
}: SearchAndFilterProps) => {
    return (
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-black/50 border border-[#BC1A1E]/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#BC1A1E]"
                />
            </div>
            <div className="flex items-center gap-4">
                <Filter className="text-gray-400 w-5 h-5" />
                <select
                    value={selectedCategory}
                    onChange={(e) => onCategoryChange(e.target.value)}
                    className="bg-black/50 border border-[#BC1A1E]/20 rounded-lg text-white px-4 py-2 focus:outline-none focus:border-[#BC1A1E]"
                >
                    <option value="All">All Categories</option>
                    <option value="Apparel">Apparel</option>
                    <option value="Accessories">Accessories</option>
                </select>
            </div>
        </div>
    );
};

export default SearchAndFilter;