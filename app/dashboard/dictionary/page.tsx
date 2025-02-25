"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dictionary from "@/data/dictionary.json";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Share2, Copy, Star, Search, Moon, Sun, Info, Filter } from "lucide-react";
import debounce from "lodash/debounce";

// Define types for our dictionary
type Dictionary = typeof dictionary;
type DictionaryTerm = keyof Dictionary;

// Get random term for "Term of the Day" feature
const getRandomTerm = (terms: DictionaryTerm[]): DictionaryTerm => {
    const randomIndex = Math.floor(Math.random() * terms.length);
    return terms[randomIndex];
};

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
        >
            <Card className="overflow-hidden border-0 bg-white dark:bg-black shadow-md hover:shadow-lg transition-all duration-200">
                <CardHeader className="pb-2 flex flex-row justify-between items-center border-b border-gray-100 dark:border-gray-800">
                    <div>
                        <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white">
                            {highlightText(term.toString(), searchTerm)}
                        </CardTitle>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onToggleFavorite(term)}
                        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                        className="hover:bg-red-50 dark:hover:bg-red-900 dark:hover:bg-opacity-20"
                    >
                        <Star className={`w-5 h-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-400 dark:text-gray-500"}`} />
                    </Button>
                </CardHeader>
                <CardContent className="pt-4">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {highlightText(definition, searchTerm)}
                    </p>
                </CardContent>
                <CardFooter className="flex justify-between border-t border-gray-100 dark:border-gray-800 pt-3 pb-3">
                    <div className="flex gap-1 text-sm text-gray-500 dark:text-gray-400">
                        <Info className="w-4 h-4" />
                        <span>Updated: Jan 2025</span>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex gap-1 items-center text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                            onClick={() => navigator.clipboard.writeText(`${term}: ${definition}`)}
                        >
                            <Copy className="w-4 h-4" />
                            <span className="text-sm">Copy</span>
                        </Button>
                    </div>
                </CardFooter>
            </Card>
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
                    <mark key={i} className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded px-1 py-0.5">
                        {part}
                    </mark>
                ) : (
                    <span key={i}>{part}</span>
                )
            )}
        </>
    );
};

const FeaturedTermCard: React.FC<{ term: DictionaryTerm, definition: string }> = ({ term, definition }) => {
    return (
        <Card className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950 dark:to-black border-0 shadow-md mb-6">
            <CardHeader>
                <div className="flex justify-between items-center mb-2">
                    <Badge className="bg-red-600 hover:bg-red-700 text-white">Term of the Day</Badge>
                </div>
                <CardTitle className="text-2xl font-bold text-red-800 dark:text-red-400">{term}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-gray-700 dark:text-gray-300">{definition.length > 150 ? `${definition.substring(0, 150)}...` : definition}</p>
            </CardContent>
            <CardFooter>
                <Button
                    variant="outline"
                    className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-950"
                >
                    Learn More
                </Button>
            </CardFooter>
        </Card>
    );
};

const DictionaryPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [inputValue, setInputValue] = useState<string>("");
    const [activeTab, setActiveTab] = useState<string>("all");
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
    const [alertMessage, setAlertMessage] = useState<string>("");
    const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem("darkMode") === "true";
        }
        return false;
    });
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        // Simulate loading time
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 600);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        localStorage.setItem("favorites", JSON.stringify(favorites));
    }, [favorites]);

    useEffect(() => {
        localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
    }, [recentSearches]);

    useEffect(() => {
        localStorage.setItem("darkMode", isDarkMode.toString());
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [isDarkMode]);

    const sortedTerms = useMemo(() =>
        Object.keys(dictionary).sort((a, b) => a.localeCompare(b)) as DictionaryTerm[],
        []
    );

    const featuredTerm = useMemo(() => getRandomTerm(sortedTerms), [sortedTerms]);

    const filteredTerms = useMemo(() => {
        let terms = sortedTerms;

        if (activeTab === "favorites") {
            terms = terms.filter(term => favorites.includes(term));
        }

        if (searchTerm) {
            terms = terms.filter(term =>
                term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                dictionary[term].toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return terms;
    }, [sortedTerms, searchTerm, activeTab, favorites]);

    const debouncedSearch = useMemo(() => debounce((value: string) => {
        setSearchTerm(value);
        if (value && !recentSearches.includes(value)) {
            setRecentSearches(prev => [value, ...prev].slice(0, 5));
        }
    }, 500), [recentSearches]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
        debouncedSearch(value);
    };

    const toggleFavorite = (term: DictionaryTerm) => {
        setFavorites(prev => {
            const isFavorite = prev.includes(term);
            const newFavorites = isFavorite
                ? prev.filter(t => t !== term)
                : [...prev, term];

            setAlertMessage(isFavorite ? "Removed from favorites" : "Added to favorites");
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 2000);

            return newFavorites;
        });
    };

    const toggleDarkMode = () => {
        setIsDarkMode(prev => !prev);
    };

    const handleClearSearch = () => {
        setInputValue("");
        setSearchTerm("");
    };

    return (
        <div className={`min-h-screen transition-colors duration-200 ${isDarkMode ? "dark bg-black text-white" : "bg-gray-50 text-gray-900"}`}>
            <AnimatePresence>
                {showAlert && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="fixed top-4 right-4 z-50"
                    >
                        <Alert className="bg-red-50 border-red-200 dark:bg-red-900 dark:border-red-800">
                            <AlertDescription className="text-red-800 dark:text-red-200">
                                {alertMessage}
                            </AlertDescription>
                        </Alert>
                    </motion.div>
                )}
            </AnimatePresence>

            <main className="max-w-7xl mx-auto px-4 pt-8 pb-16 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    <section className="mb-10">
                        <div className="mb-8 flex justify-between items-center">
                            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white flex items-center">
                                <span className="text-red-600 dark:text-red-500">Crypto</span>
                                <span>Dictionary</span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={toggleDarkMode}
                                    className="ml-4"
                                    aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                                >
                                    {isDarkMode ? (
                                        <Sun className="h-5 w-5 text-red-400" />
                                    ) : (
                                        <Moon className="h-5 w-5 text-red-600" />
                                    )}
                                </Button>
                            </h1>
                        </div>

                        <div className="relative">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                </div>
                                <Input
                                    type="text"
                                    placeholder="Search terms or definitions..."
                                    className="pl-10 py-6 text-lg shadow-sm border-gray-200 dark:border-gray-800 dark:bg-gray-900 dark:text-white w-full"
                                    onChange={handleSearchChange}
                                    value={inputValue}
                                    aria-label="Search terms"
                                />
                                {inputValue && (
                                    <button
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                        onClick={handleClearSearch}
                                        aria-label="Clear search"
                                    >
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>

                            {recentSearches.length > 0 && (
                                <div className="mt-2 flex items-center text-sm">
                                    <span className="text-gray-500 dark:text-gray-400 mr-2">Recent:</span>
                                    <div className="flex flex-wrap gap-2">
                                        {recentSearches.map(term => (
                                            <Badge
                                                key={term}
                                                variant="outline"
                                                className="cursor-pointer hover:bg-red-50 dark:hover:bg-red-900 dark:hover:bg-opacity-20 border-gray-200 dark:border-gray-800"
                                                onClick={() => setSearchTerm(term)}
                                            >
                                                {term}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    {isLoading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
                        </div>
                    ) : (
                        <>
                            {!searchTerm && activeTab !== "favorites" && (
                                <FeaturedTermCard term={featuredTerm} definition={dictionary[featuredTerm]} />
                            )}

                            <div className="mb-8">
                                <Tabs
                                    defaultValue="all"
                                    onValueChange={setActiveTab}
                                    className="border-b border-gray-200 dark:border-gray-800 mb-6"
                                >
                                    <TabsList className="bg-transparent border-b-0">
                                        <TabsTrigger
                                            value="all"
                                            className="data-[state=active]:text-red-600 data-[state=active]:border-red-600 dark:data-[state=active]:text-red-500 dark:data-[state=active]:border-red-500 rounded-none border-b-2 border-transparent data-[state=active]:shadow-none px-6 py-2 bg-transparent"
                                        >
                                            All Terms
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="favorites"
                                            className="data-[state=active]:text-red-600 data-[state=active]:border-red-600 dark:data-[state=active]:text-red-500 dark:data-[state=active]:border-red-500 rounded-none border-b-2 border-transparent data-[state=active]:shadow-none px-6 py-2 bg-transparent"
                                        >
                                            Favorites ({favorites.length})
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="all">
                                        {filteredTerms.length > 0 ? (
                                            <div className="grid grid-cols-1 gap-6">
                                                {filteredTerms.slice(0, 20).map((term) => (
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
                                            <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                                <p className="text-gray-500 dark:text-gray-400 text-lg">
                                                    No matching terms found. Try adjusting your search criteria.
                                                </p>
                                            </div>
                                        )}
                                    </TabsContent>

                                    <TabsContent value="favorites">
                                        {filteredTerms.length > 0 ? (
                                            <div className="grid grid-cols-1 gap-6">
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
                                            <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                                <p className="text-gray-500 dark:text-gray-400 text-lg">
                                                    {favorites.length === 0
                                                        ? "No favorite terms yet. Click the star icon to add terms to your favorites."
                                                        : "No matching favorite terms found."}
                                                </p>
                                            </div>
                                        )}
                                    </TabsContent>
                                </Tabs>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default DictionaryPage;