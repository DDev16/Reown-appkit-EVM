import React, { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;
if (!CONTRACT_ADDRESS) throw new Error("Contract address not found in environment variables");
const IPFS_GATEWAY = 'https://ipfs.io/ipfs';
const METADATA_CID = 'bafybeieud2medy2rjezh6ursckqfbmpxhzntd3uyqwszwhivfti3vnzn2y';

// Import the ABI
import ABI from '@/lib/contract-abi.json';

const TOTAL_TIERS = 10;

interface NFTMetadata {
    name: string;
    description: string;
    image: string;
}

const OwnedNFTs: React.FC = () => {
    const { address } = useAccount();
    const [ownedNFTs, setOwnedNFTs] = useState<number[]>([]);
    const [nftMetadata, setNftMetadata] = useState<Record<number, NFTMetadata>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [selectedNFT, setSelectedNFT] = useState<number | null>(null);

    const { data: nftBalances } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: 'balanceOfBatch',
        args: address ? [
            Array(TOTAL_TIERS).fill(address),
            Array.from({ length: TOTAL_TIERS }, (_, i) => BigInt(i))
        ] : undefined,
    });

    useEffect(() => {
        if (nftBalances && address) {
            const ownedIds = (nftBalances as bigint[])
                .map((balance, index) => balance > BigInt(0) ? index : -1)
                .filter((id): id is number => id !== -1);
            setOwnedNFTs(ownedIds);
            setIsLoading(false);
        }
    }, [nftBalances, address]);

    useEffect(() => {
        const fetchMetadata = async () => {
            const metadata: Record<number, NFTMetadata> = {};
            for (const nftId of ownedNFTs) {
                try {
                    const response = await fetch(`${IPFS_GATEWAY}/${METADATA_CID}/${nftId + 1}.json`);
                    const data = await response.json();
                    metadata[nftId] = {
                        name: data.name,
                        description: data.description,
                        image: `${IPFS_GATEWAY}/${data.image.replace('ipfs://', '')}`
                    };
                } catch (error) {
                    console.error(`Error fetching metadata for NFT #${nftId}:`, error);
                }
            }
            setNftMetadata(metadata);

            // Auto-select the first NFT if available
            if (ownedNFTs.length > 0 && selectedNFT === null) {
                setSelectedNFT(ownedNFTs[0]);
            }
        };

        if (ownedNFTs.length > 0) {
            fetchMetadata();
        }
    }, [ownedNFTs, selectedNFT]);

    if (isLoading) {
        return (
            <div className="bg-black rounded-xl border border-red-900/20 p-6 mb-8">
                <div className="flex items-center space-x-4">
                    <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                    <h2 className="text-xl font-medium text-white">Loading NFT Collection...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-black rounded-xl border border-red-900/30 overflow-hidden mb-8">
            <div className="p-5 border-b border-gray-900 bg-gradient-to-r from-black to-gray-900">
                <div className="flex items-center">
                    <h2 className="text-xl font-medium text-white">Your NFT Collection</h2>
                    <div className="ml-2 px-2 py-1 bg-red-900/30 rounded-md text-xs text-red-400">
                        {ownedNFTs.length} {ownedNFTs.length === 1 ? 'NFT' : 'NFTs'}
                    </div>
                </div>
            </div>

            {ownedNFTs.length > 0 ? (
                <div className="p-5">
                    {/* NFT Thumbnails Row */}
                    <div className="flex space-x-3 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-red-900 scrollbar-track-gray-900">
                        {ownedNFTs.map((nftId) => (
                            <div
                                key={nftId}
                                className={`relative flex-shrink-0 cursor-pointer transition-all duration-200 ${selectedNFT === nftId
                                    ? 'ring-2 ring-red-500 scale-105'
                                    : 'ring-1 ring-gray-800 hover:ring-red-900'
                                    }`}
                                onClick={() => setSelectedNFT(nftId)}
                            >
                                <div className="w-20 h-20 rounded-md overflow-hidden bg-gray-900">
                                    {nftMetadata[nftId]?.image ? (
                                        <img
                                            src={nftMetadata[nftId].image}
                                            alt={nftMetadata[nftId].name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.onerror = null;
                                                target.src = '/placeholder-image.png';
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-800">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}
                                    <div className="absolute top-1 right-1 bg-black/70 text-red-400 px-1 rounded-sm text-xs font-medium">
                                        T{nftId + 1}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Selected NFT Display */}
                    {selectedNFT !== null && (
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-900/20 p-4 rounded-lg">
                            <div className="relative aspect-square rounded-lg overflow-hidden border border-gray-800 md:col-span-1">
                                {nftMetadata[selectedNFT]?.image ? (
                                    <img
                                        src={nftMetadata[selectedNFT].image}
                                        alt={nftMetadata[selectedNFT].name}
                                        className="absolute inset-0 w-full h-full object-contain bg-gray-800"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.onerror = null;
                                            target.src = '/placeholder-image.png';
                                        }}
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                )}
                                <div className="absolute top-3 right-3 bg-red-600/80 text-white px-3 py-1 rounded-full text-sm font-medium">
                                    Tier {selectedNFT + 1}
                                </div>
                            </div>

                            <div className="md:col-span-2 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">
                                        {nftMetadata[selectedNFT]?.name || `Tier ${selectedNFT + 1} NFT`}
                                    </h3>
                                    <div className="h-px w-full bg-gradient-to-r from-red-800 to-transparent mb-3"></div>
                                    <p className="text-gray-400">
                                        {nftMetadata[selectedNFT]?.description || 'No description available'}
                                    </p>
                                </div>

                                <div className="mt-4 grid grid-cols-2 gap-3">
                                    <div className="bg-black/50 border border-gray-800 rounded-md p-3">
                                        <div className="text-xs text-gray-500 mb-1">Collection</div>
                                        <div className="text-white">Defi Bull World</div>
                                    </div>
                                    <div className="bg-black/50 border border-gray-800 rounded-md p-3">
                                        <div className="text-xs text-gray-500 mb-1">Token ID</div>
                                        <div className="text-white">{selectedNFT}</div>
                                    </div>
                                    <div className="bg-black/50 border border-gray-800 rounded-md p-3 col-span-2">
                                        <div className="text-xs text-gray-500 mb-1">Contract Address</div>
                                        <div className="text-white font-mono text-sm truncate">{CONTRACT_ADDRESS}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="p-8 bg-black">
                    <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-8 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800/50 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-medium text-white mb-2">No NFTs Found</h3>
                        <p className="text-gray-400 max-w-md mx-auto">
                            You dont own any NFTs from this collection yet. Start collecting to see your NFTs displayed here.
                        </p>
                        <button className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors">
                            Browse Collection
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OwnedNFTs;