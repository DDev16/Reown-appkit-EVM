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
        };

        if (ownedNFTs.length > 0) {
            fetchMetadata();
        }
    }, [ownedNFTs]);

    if (isLoading) {
        return (
            <div className="bg-gray-900 rounded-xl p-8 mb-8 animate-pulse">
                <div className="flex items-center space-x-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-red-500 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h2 className="text-2xl font-bold text-white">Loading NFTs...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-900 rounded-xl p-8 mb-8 shadow-2xl">
            <div className="flex items-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-red-500 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-3xl font-bold text-white">Your NFT Collection</h2>
            </div>

            {ownedNFTs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ownedNFTs.map((nftId) => (
                        <div
                            key={nftId}
                            className="bg-gray-800 rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                        >
                            <div className="relative aspect-square w-full">
                                {nftMetadata[nftId]?.image ? (
                                    <img
                                        src={nftMetadata[nftId].image}
                                        alt={nftMetadata[nftId].name}
                                        className="absolute inset-0 w-full h-full object-contain bg-gray-700"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.onerror = null; // Prevent infinite loop
                                            target.src = '/placeholder-image.png'; // Fallback image
                                        }}
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-gray-700 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                )}
                                <div className="absolute top-4 right-4 bg-red-600/80 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                    Tier {nftId + 1}
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-white mb-2">
                                    {nftMetadata[nftId]?.name || `Tier ${nftId + 1} NFT`}
                                </h3>
                                <p className="text-gray-400 text-sm">
                                    {nftMetadata[nftId]?.description || 'No description available'}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-gray-800 rounded-xl p-8 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-400 text-lg">
                        No NFTs found for this address. Start collecting to see your collection grow!
                    </p>
                </div>
            )}
        </div>
    );
};

export default OwnedNFTs;