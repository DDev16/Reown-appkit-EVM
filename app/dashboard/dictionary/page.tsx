'use client';

import React, { useState, useEffect } from 'react';
import { Search, Book, Tag, Link as LinkIcon, ExternalLink } from 'lucide-react';

// More comprehensive mock dictionary data
const mockDictionary = {
    blockchain: {
        definition: "A digital ledger of transactions that is duplicated and distributed across a network of computer systems.",
        category: "Technology",
        relatedTerms: ["Cryptocurrency", "Distributed Ledger", "Smart Contracts"],
        usage: "Blockchain technology is used to create secure and transparent systems for various applications beyond just cryptocurrencies.",
        externalLink: "https://en.wikipedia.org/wiki/Blockchain"
    },
    cryptocurrency: {
        definition: "A digital or virtual currency that is secured by cryptography, making it nearly impossible to counterfeit.",
        category: "Finance",
        relatedTerms: ["Bitcoin", "Ethereum", "Altcoin"],
        usage: "Cryptocurrencies are used as a medium of exchange for goods and services, as well as for investment purposes.",
        externalLink: "https://en.wikipedia.org/wiki/Cryptocurrency"
    },
    nft: {
        definition: "Non-Fungible Token: A unique digital identifier that cannot be copied, substituted, or subdivided, recorded in a blockchain.",
        category: "Digital Assets",
        relatedTerms: ["Digital Art", "Collectibles", "Tokenization"],
        usage: "NFTs are used to represent ownership of unique items such as digital art, collectibles, and even real estate in the digital world.",
        externalLink: "https://en.wikipedia.org/wiki/Non-fungible_token"
    },
    defi: {
        definition: "Decentralized Finance: Financial services using smart contracts on blockchains, primarily the Ethereum blockchain.",
        category: "Finance",
        relatedTerms: ["Yield Farming", "Liquidity Mining", "Smart Contracts"],
        usage: "DeFi platforms allow users to lend, borrow, and trade cryptocurrencies without traditional intermediaries like banks.",
        externalLink: "https://en.wikipedia.org/wiki/Decentralized_finance"
    },
};

const DictionaryPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<string[]>([]);
    const [selectedTerm, setSelectedTerm] = useState('');
    const [categories, setCategories] = useState<string[]>([]);

    useEffect(() => {
        // Extract unique categories
        const uniqueCategories = Array.from(new Set(Object.values(mockDictionary).map(item => item.category)));
        setCategories(uniqueCategories);
    }, []);

    const handleSearch = () => {
        const results = Object.keys(mockDictionary).filter(term =>
            term.toLowerCase().includes(searchTerm.toLowerCase()) ||
            mockDictionary[term as keyof typeof mockDictionary].definition.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(results);
        if (results.length > 0) {
            setSelectedTerm(results[0]);
        } else {
            setSelectedTerm('');
        }
    };

    const handleTermClick = (term: string) => {
        setSelectedTerm(term);
        setSearchTerm(term);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-red-600">Crypto Dictionary</h1>

            <div className="mb-8">
                <div className="flex items-center mb-4">
                    <input
                        type="text"
                        placeholder="Search for a term..."
                        className="flex-grow p-2 rounded-l-lg bg-gray-800 text-white border-2 border-red-600 focus:outline-none focus:border-red-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-red-600 text-white p-2 rounded-r-lg hover:bg-red-700 transition-colors"
                    >
                        <Search className="w-6 h-6" />
                    </button>
                </div>

                {searchResults.length > 0 && (
                    <div className="bg-gray-800 p-4 rounded-lg mb-4">
                        <h2 className="text-xl font-semibold mb-2 text-white">Search Results:</h2>
                        <ul>
                            {searchResults.map(term => (
                                <li
                                    key={term}
                                    className="cursor-pointer text-red-400 hover:text-red-300 mb-1"
                                    onClick={() => handleTermClick(term)}
                                >
                                    {term}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {selectedTerm && (
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h2 className="text-2xl font-semibold mb-2 text-white">{selectedTerm}</h2>
                        <p className="text-gray-300 mb-4">{mockDictionary[selectedTerm as keyof typeof mockDictionary].definition}</p>
                        <div className="flex items-center mb-2">
                            <Tag className="w-4 h-4 mr-2 text-red-600" />
                            <span className="text-red-400">{mockDictionary[selectedTerm as keyof typeof mockDictionary].category}</span>
                        </div>
                        <div className="mb-2">
                            <h3 className="text-lg font-semibold text-white mb-1">Related Terms:</h3>
                            <ul className="list-disc list-inside text-gray-300">
                                {mockDictionary[selectedTerm as keyof typeof mockDictionary].relatedTerms.map(term => (
                                    <li key={term}>{term}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="mb-2">
                            <h3 className="text-lg font-semibold text-white mb-1">Usage:</h3>
                            <p className="text-gray-300">{mockDictionary[selectedTerm as keyof typeof mockDictionary].usage}</p>
                        </div>
                        <a
                            href={mockDictionary[selectedTerm as keyof typeof mockDictionary].externalLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-red-400 hover:text-red-300 flex items-center"
                        >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Learn More
                        </a>
                    </div>
                )}
            </div>

            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-white">Browse by Category</h2>
                <div className="flex flex-wrap gap-2">
                    {categories.map(category => (
                        <button
                            key={category}
                            className="bg-red-600 text-white px-3 py-1 rounded-full hover:bg-red-700 transition-colors"
                            onClick={() => setSearchTerm(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(mockDictionary).map(([term, data]) => (
                    <div key={term} className="bg-gray-800 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2 text-white flex items-center">
                            <Book className="w-5 h-5 mr-2 text-red-600" />
                            {term}
                        </h3>
                        <p className="text-gray-300 mb-2">{data.definition}</p>
                        <div className="flex items-center">
                            <Tag className="w-4 h-4 mr-2 text-red-600" />
                            <span className="text-red-400">{data.category}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DictionaryPage;