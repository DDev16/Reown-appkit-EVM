'use client';

import React, { useState } from 'react';
import { Search, Book } from 'lucide-react';

// Mock dictionary data - replace with actual data or API call
const mockDictionary = {
    blockchain: "A digital ledger of transactions that is duplicated and distributed across a network of computer systems.",
    cryptocurrency: "A digital or virtual currency that is secured by cryptography, making it nearly impossible to counterfeit.",
    NFT: "Non-Fungible Token: A unique digital identifier that cannot be copied, substituted, or subdivided, recorded in a blockchain.",
    DeFi: "Decentralized Finance: Financial services using smart contracts on blockchains, primarily the Ethereum blockchain.",
    // Add more terms as needed
};

const DictionaryPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [definition, setDefinition] = useState('');

    const handleSearch = () => {
        const lowercaseTerm = searchTerm.toLowerCase();
        if (lowercaseTerm in mockDictionary) {
            setDefinition(mockDictionary[lowercaseTerm as keyof typeof mockDictionary]);
        } else {
            setDefinition('Term not found in the dictionary.');
        }
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

                {definition && (
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h2 className="text-xl font-semibold mb-2 text-white">{searchTerm}</h2>
                        <p className="text-gray-300">{definition}</p>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(mockDictionary).map(([term, def]) => (
                    <div key={term} className="bg-gray-800 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2 text-white flex items-center">
                            <Book className="w-5 h-5 mr-2 text-red-600" />
                            {term}
                        </h3>
                        <p className="text-gray-300">{def}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DictionaryPage;