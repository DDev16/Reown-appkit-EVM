"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dictionary from "@/data/dictionary.json";
import { Alert, AlertDescription } from "@/components/ui/alert";
import debounce from "lodash/debounce";

// Define types for our dictionary
type Dictionary = typeof dictionary;
type DictionaryTerm = keyof Dictionary;

interface TermCardProps {
    term: DictionaryTerm;
    definition: string;
    searchTerm: string;
    isFavorite: boolean;
    onToggleFavorite: (term: DictionaryTerm) => void;
}

const TermCard: React.FC<TermCardProps> = ({
    term,
    definition,
    searchTerm,
    isFavorite,
    onToggleFavorite
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white shadow-md rounded-lg p-6 mb-4 hover:shadow-lg transition-all duration-200"
        >
            <div className="flex justify-between items-start">
                <h2 className="text-2xl font-semibold text-gray-800">
                    {highlightText(term.toString(), searchTerm)}
                </h2>
                <button
                    onClick={() => onToggleFavorite(term)}
                    className="text-gray-400 hover:text-yellow-500 transition-colors"
                    aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                    <svg
                        className={`w-6 h-6 ${isFavorite ? "text-yellow-500 fill-current" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                        />
                    </svg>
                </button>
            </div>
            <p className="text-gray-700 mt-3 leading-relaxed">
                {highlightText(definition, searchTerm)}
            </p>
            <div className="mt-4 flex gap-2">
                <button
                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                    onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${term}: ${definition.substring(0, 100)}...`)}`, '_blank')}
                >
                    Share
                </button>
                <button
                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                    onClick={() => navigator.clipboard.writeText(`${term}: ${definition}`)}
                >
                    Copy
                </button>
            </div>
        </motion.div>
    );
};

const highlightText = (text: string, query: string): React.ReactNode => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);
    return (
        <>
            {parts.map((part, i) =>
                part.toLowerCase() === query.toLowerCase() ? (
                    <mark key={i} className="bg-yellow-200 rounded px-1">
                        {part}
                    </mark>
                ) : (
                    <span key={i}>{part}</span>
                )
            )}
        </>
    );
};

const DictionaryPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filter, setFilter] = useState<"all" | "favorites">("all");
    const [favorites, setFavorites] = useState<DictionaryTerm[]>(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem("favorites");
            return stored ? JSON.parse(stored) : [];
        }
        return [];
    });
    const [recentSearches, setRecentSearches] = useState<string[]>(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem("recentSearches");
            return stored ? JSON.parse(stored) : [];
        }
        return [];
    });
    const [showAlert, setShowAlert] = useState<boolean>(false);

    useEffect(() => {
        localStorage.setItem("favorites", JSON.stringify(favorites));
    }, [favorites]);

    useEffect(() => {
        localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
    }, [recentSearches]);

    const sortedTerms = useMemo(() =>
        Object.keys(dictionary).sort((a, b) => a.localeCompare(b)) as DictionaryTerm[],
        []
    );

    const filteredTerms = useMemo(() => {
        let terms = sortedTerms;

        if (filter === "favorites") {
            terms = terms.filter(term => favorites.includes(term));
        }

        if (searchTerm) {
            terms = terms.filter(term =>
                term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                dictionary[term].toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return terms;
    }, [sortedTerms, searchTerm, filter, favorites]);

    const debouncedSearch = debounce((value: string) => {
        setSearchTerm(value);
        if (value && !recentSearches.includes(value)) {
            setRecentSearches(prev => [value, ...prev].slice(0, 5));
        }
    }, 300);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };

    const toggleFavorite = (term: DictionaryTerm) => {
        setFavorites(prev => {
            const newFavorites = prev.includes(term)
                ? prev.filter(t => t !== term)
                : [...prev, term];
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 2000);
            return newFavorites;
        });
    };

    return (
        <main className="min-h-screen bg-gray-50 py-10 px-4">
            <AnimatePresence>
                {showAlert && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="fixed top-4 right-4 z-50"
                    >
                        <Alert>
                            <AlertDescription>
                                {favorites.includes(searchTerm as DictionaryTerm)
                                    ? "Added to favorites!"
                                    : "Removed from favorites"}
                            </AlertDescription>
                        </Alert>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-4xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">
                        Crypto Dictionary
                    </h1>
                    <p className="text-gray-600">
                        Browse and search through our comprehensive dictionary of crypto terms.
                    </p>
                </header>

                <div className="mb-8 space-y-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search terms or definitions..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                            aria-label="Search terms"
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg
                                className="w-5 h-5 text-gray-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1116.65 2a7.5 7.5 0 010 14.65z"
                                />
                            </svg>
                        </div>
                    </div>

                    {recentSearches.length > 0 && (
                        <div className="flex gap-2 text-sm">
                            <span className="text-gray-500">Recent:</span>
                            {recentSearches.map(term => (
                                <button
                                    key={term}
                                    onClick={() => setSearchTerm(term)}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    {term}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="flex gap-4">
                        <button
                            onClick={() => setFilter("all")}
                            className={`px-4 py-2 rounded-lg transition-colors ${filter === "all"
                                    ? "bg-blue-600 text-white"
                                    : "bg-white text-gray-700 hover:bg-gray-100"
                                }`}
                        >
                            All Terms
                        </button>
                        <button
                            onClick={() => setFilter("favorites")}
                            className={`px-4 py-2 rounded-lg transition-colors ${filter === "favorites"
                                    ? "bg-blue-600 text-white"
                                    : "bg-white text-gray-700 hover:bg-gray-100"
                                }`}
                        >
                            Favorites ({favorites.length})
                        </button>
                    </div>
                </div>

                <section>
                    {filteredTerms.length > 0 ? (
                        <div className="space-y-4">
                            {filteredTerms.map((term) => (
                                <TermCard
                                    key={term}
                                    term={term}
                                    definition={dictionary[term]}
                                    searchTerm={searchTerm}
                                    isFavorite={favorites.includes(term)}
                                    onToggleFavorite={toggleFavorite}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">
                                {filter === "favorites" && favorites.length === 0
                                    ? "No favorite terms yet. Click the star icon to add terms to your favorites."
                                    : "No matching terms found."}
                            </p>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
};

export default DictionaryPage;