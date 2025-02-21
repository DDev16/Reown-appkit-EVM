'use client';

import React, { useState, useEffect } from 'react';
import { useAccount, useBalance, useChainId, useReadContract } from 'wagmi';
import { formatEther } from 'viem';
import { Wallet, ExternalLink, Copy, CheckCircle, XCircle } from 'lucide-react';

const CONTRACT_ADDRESS = '0xAf671476f32Fe0028F989c1225bf94ee8Bb4D4c0' as const;
const IPFS_GATEWAY = 'https://ipfs.io/ipfs';
const METADATA_CID = 'bafybeieud2medy2rjezh6ursckqfbmpxhzntd3uyqwszwhivfti3vnzn2y';

const ABI = [
    {
        inputs: [
            { internalType: 'address[]', name: 'accounts', type: 'address[]' },
            { internalType: 'uint256[]', name: 'ids', type: 'uint256[]' }
        ],
        name: 'balanceOfBatch',
        outputs: [{ internalType: 'uint256[]', name: '', type: 'uint256[]' }],
        stateMutability: 'view',
        type: 'function'
    }
] as const;

const TOTAL_TIERS = 9;

interface NFTMetadata {
    name: string;
    description: string;
    image: string;
}

const WalletPage: React.FC = () => {
    const { address, isConnected } = useAccount();
    const { data: balance } = useBalance({ address });
    const chainId = useChainId();
    const [isCopied, setIsCopied] = useState(false);
    const [ownedNFTs, setOwnedNFTs] = useState<number[]>([]);
    const [nftMetadata, setNftMetadata] = useState<Record<number, NFTMetadata>>({});

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
            const ownedIds = nftBalances
                .map((balance, index) => balance > BigInt(0) ? index : -1)
                .filter((id): id is number => id !== -1);
            setOwnedNFTs(ownedIds);
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

    const copyToClipboard = () => {
        if (address) {
            navigator.clipboard.writeText(address);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    const shortenAddress = (addr: string) => {
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };

    const getNetworkName = (chainId: number) => {
        return chainId === 16 ? 'Coston Testnet' : 'Unknown Network';
    };

    const getExplorerUrl = (chainId: number) => {
        return chainId === 16 ? 'https://coston-explorer.flare.network' : '';
    };

    if (!isConnected) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-4">Wallet Not Connected</h2>
                    <p className="text-gray-400">Please connect your wallet to view this page.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-red-600">Your Wallet</h1>

            <div className="bg-gray-800 rounded-lg p-6 mb-8">
                <div className="flex items-center mb-4">
                    <div>
                        <h2 className="text-2xl font-semibold text-white">
                            {address ? shortenAddress(address) : 'Address Not Available'}
                        </h2>
                    </div>
                </div>

                <div className="flex items-center mb-4">
                    <button
                        onClick={copyToClipboard}
                        className="flex items-center bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded transition-colors"
                    >
                        {isCopied ? <CheckCircle className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                        {isCopied ? 'Copied!' : 'Copy Address'}
                    </button>
                    {address && (
                        <a
                            href={`${getExplorerUrl(chainId)}/address/${address}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-4 text-red-400 hover:text-red-300 flex items-center"
                        >
                            View on Explorer
                            <ExternalLink className="w-4 h-4 ml-2" />
                        </a>
                    )}
                </div>

                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-white mb-2">Balance</h3>
                    <p className="text-2xl text-red-400">
                        {balance ? formatEther(balance.value) : '0'} {balance?.symbol || 'C-FLR'}
                    </p>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Network</h3>
                    <p className="text-gray-400">{getNetworkName(chainId)}</p>
                </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">Owned NFTs</h2>
                {ownedNFTs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {ownedNFTs.map((nftId) => (
                            <div key={nftId} className="bg-gray-700 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold text-white mb-2">{nftMetadata[nftId]?.name || `Tier ${nftId + 1}`}</h3>
                                {nftMetadata[nftId] && (
                                    <>
                                        <img src={nftMetadata[nftId].image} alt={nftMetadata[nftId].name} className="w-full h-48 object-cover rounded-lg mb-2" />
                                        <p className="text-gray-300 text-sm">{nftMetadata[nftId].description}</p>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400">No NFTs found for this address.</p>
                )}
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-white mb-4">Recent Transactions</h2>
                <p className="text-gray-400">Transaction history functionality to be implemented.</p>
            </div>
        </div>
    );
};

export default WalletPage;