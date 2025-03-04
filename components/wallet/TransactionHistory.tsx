import React, { useState, useEffect } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { formatEther, keccak256, toHex } from 'viem';
import { ArrowUpRight, ArrowDownLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { getExplorerUrl } from '@/components/wallet/network-utils';
import { shortenAddress } from '@/components/wallet/address-utils';

// Import the ABI to get function signatures
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

const TransactionHistory: React.FC = () => {
    const { address } = useAccount();
    const chainId = useChainId();
    const [allTransactions, setAllTransactions] = useState<EnhancedTransaction[]>([]);
    const [displayedTransactions, setDisplayedTransactions] = useState<EnhancedTransaction[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

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

    return (
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
                                    <p className="text-white font-semibold">{tx.value} FLR</p>
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
    );
};

export default TransactionHistory;