'use client';

import React, { useState, useEffect } from 'react';
import { useAccount, useBalance, useChainId, useReadContract } from 'wagmi';
import { formatEther, keccak256, toHex } from 'viem';
import { Wallet, ExternalLink, Copy, CheckCircle, XCircle, ArrowUpRight, ArrowDownLeft, ChevronLeft, ChevronRight } from 'lucide-react';

const CONTRACT_ADDRESS = '0xAf671476f32Fe0028F989c1225bf94ee8Bb4D4c0' as const;
const IPFS_GATEWAY = 'https://ipfs.io/ipfs';
const METADATA_CID = 'bafybeieud2medy2rjezh6ursckqfbmpxhzntd3uyqwszwhivfti3vnzn2y';

// Import the ABI
import ABI from '@/lib/contract-abi.json';

const TRANSACTIONS_PER_PAGE = 5;


interface ABIFunction {
    type: string;
    name: string;
    inputs: { type: string }[];
}

// Generate function signatures
const KNOWN_FUNCTION_SIGNATURES: Record<string, string> = (ABI as ABIFunction[]).reduce((acc, item) => {
    if (item.type === 'function') {
        const signature = `${item.name}(${item.inputs.map(input => input.type).join(',')})`;
        const selector = keccak256(toHex(signature)).slice(0, 10);
        return { ...acc, [selector]: item.name };
    }
    return acc;
}, {});

const TOTAL_TIERS = 9;

interface NFTMetadata {
    name: string;
    description: string;
    image: string;
}

interface EnhancedTransaction {
    hash: string;
    from: string;
    to: string;
    value: string;
    timestamp: number;
    functionName: string;
}

interface ExplorerTransaction {
    hash: string;
    from: string;
    to: string;
    value: string;
    timeStamp: string;
    input: string;
}

const WalletPage: React.FC = () => {
    const { address, isConnected } = useAccount();
    const { data: balance } = useBalance({ address });
    const chainId = useChainId();
    const [isCopied, setIsCopied] = useState(false);
    const [ownedNFTs, setOwnedNFTs] = useState<number[]>([]);
    const [nftMetadata, setNftMetadata] = useState<Record<number, NFTMetadata>>({});
    const [recentTransactions, setRecentTransactions] = useState<EnhancedTransaction[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [allTransactions, setAllTransactions] = useState<EnhancedTransaction[]>([]);
    const [displayedTransactions, setDisplayedTransactions] = useState<EnhancedTransaction[]>([]);
    const [totalPages, setTotalPages] = useState(1);

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

    useEffect(() => {
        const fetchRecentTransactions = async () => {
            if (address) {
                try {
                    const response = await fetch(`https://coston-explorer.flare.network/api?module=account&action=txlist&address=${address}&sort=desc&limit=10`);
                    const data = await response.json();
                    if (data.status === '1' && Array.isArray(data.result)) {
                        const enhancedTransactions: EnhancedTransaction[] = (data.result as ExplorerTransaction[]).map((tx) => {
                            const functionSignature = tx.input.slice(0, 10);
                            return {
                                hash: tx.hash,
                                from: tx.from,
                                to: tx.to,
                                value: formatEther(BigInt(tx.value)),
                                timestamp: parseInt(tx.timeStamp),
                                functionName: KNOWN_FUNCTION_SIGNATURES[functionSignature] || 'Unknown Function'
                            };
                        });
                        setRecentTransactions(enhancedTransactions);
                    }
                } catch (error) {
                    console.error('Error fetching recent transactions:', error);
                }
            }
        };

        fetchRecentTransactions();
    }, [address]);

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

    const formatDate = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleString();
    };


    useEffect(() => {
        const fetchRecentTransactions = async () => {
            if (address) {
                try {
                    const response = await fetch(`https://coston-explorer.flare.network/api?module=account&action=txlist&address=${address}&sort=desc&limit=100`);
                    const data = await response.json();
                    if (data.status === '1' && Array.isArray(data.result)) {
                        const enhancedTransactions: EnhancedTransaction[] = (data.result as ExplorerTransaction[]).map((tx) => {
                            const functionSignature = tx.input.slice(0, 10);
                            return {
                                hash: tx.hash,
                                from: tx.from,
                                to: tx.to,
                                value: formatEther(BigInt(tx.value)),
                                timestamp: parseInt(tx.timeStamp),
                                functionName: KNOWN_FUNCTION_SIGNATURES[functionSignature] || 'Unknown Function'
                            };
                        });
                        setAllTransactions(enhancedTransactions);
                        setTotalPages(Math.ceil(enhancedTransactions.length / TRANSACTIONS_PER_PAGE));
                    }
                } catch (error) {
                    console.error('Error fetching recent transactions:', error);
                }
            }
        };

        fetchRecentTransactions();
    }, [address]);

    useEffect(() => {
        const startIndex = (currentPage - 1) * TRANSACTIONS_PER_PAGE;
        const endIndex = startIndex + TRANSACTIONS_PER_PAGE;
        setDisplayedTransactions(allTransactions.slice(startIndex, endIndex));
    }, [currentPage, allTransactions]);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const PaginationControls = () => (
        <div className="flex items-center justify-between mt-4 pb-2">
            <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`flex items-center px-3 py-2 rounded ${currentPage === 1
                    ? 'text-gray-500 cursor-not-allowed'
                    : 'text-red-400 hover:text-red-300'
                    }`}
            >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
            </button>
            <span className="text-gray-400">
                Page {currentPage} of {totalPages}
            </span>
            <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`flex items-center px-3 py-2 rounded ${currentPage === totalPages
                    ? 'text-gray-500 cursor-not-allowed'
                    : 'text-red-400 hover:text-red-300'
                    }`}
            >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
            </button>
        </div>
    );

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
                {allTransactions.length > 0 ? (
                    <>
                        <div className="space-y-4">
                            {displayedTransactions.map((tx) => (
                                <div key={tx.hash} className="bg-gray-700 p-4 rounded-lg flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-400">{formatDate(tx.timestamp)}</p>
                                        <p className="text-white">
                                            {tx.from.toLowerCase() === address?.toLowerCase() ? (
                                                <ArrowUpRight className="inline w-4 h-4 mr-2 text-red-400" />
                                            ) : (
                                                <ArrowDownLeft className="inline w-4 h-4 mr-2 text-green-400" />
                                            )}
                                            {tx.from.toLowerCase() === address?.toLowerCase() ? 'Sent' : 'Received'}
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            {tx.from.toLowerCase() === address?.toLowerCase() ?
                                                `To: ${shortenAddress(tx.to)}` :
                                                `From: ${shortenAddress(tx.from)}`}
                                        </p>
                                        <p className="text-sm text-yellow-400">Function: {tx.functionName}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-white font-semibold">{tx.value} C-FLR</p>
                                        <a
                                            href={`${getExplorerUrl(chainId)}/tx/${tx.hash}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-red-400 hover:text-red-300"
                                        >
                                            View Transaction
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <PaginationControls />
                    </>
                ) : (
                    <p className="text-gray-400">No recent transactions found.</p>
                )}
            </div>
        </div>
    );
};

export default WalletPage;