import React, { useState, useEffect } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { formatEther, keccak256, toHex } from 'viem';
import { ArrowUpRight, ExternalLink, Clock } from 'lucide-react';
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
    const [isLoading, setIsLoading] = useState(true);

    const getTimeAgo = (timestamp: number) => {
        const now = Math.floor(Date.now() / 1000);
        const seconds = now - timestamp;

        if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)} hr ago`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
        return `${Math.floor(seconds / 604800)} weeks ago`;
    };

    useEffect(() => {
        const fetchRecentTransactions = async () => {
            if (address) {
                setIsLoading(true);
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
                } finally {
                    setIsLoading(false);
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

    return (
        <div className="bg-black rounded-lg overflow-hidden">
            <div className="flex justify-between items-center p-6">
                <h2 className="text-xl font-medium text-white">Transaction History</h2>
                <span className="text-xs text-gray-400">
                    {allTransactions.length} Transactions
                </span>
            </div>

            {/* Pagination Controls */}
            {allTransactions.length > TRANSACTIONS_PER_PAGE && (
                <div className="flex justify-between items-center p-4 border-t border-gray-800">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className={`text-sm ${currentPage === 1 ? 'text-gray-600 cursor-not-allowed' : 'text-red-500 hover:text-red-400'}`}
                    >
                        Previous
                    </button>

                    <div className="text-xs text-gray-500">
                        Page {currentPage} of {totalPages}
                    </div>

                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className={`text-sm ${currentPage === totalPages ? 'text-gray-600 cursor-not-allowed' : 'text-red-500 hover:text-red-400'}`}
                    >
                        Next
                    </button>
                </div>
            )}

            {isLoading ? (
                <div className="flex justify-center items-center p-6">
                    <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin mr-3"></div>
                    <p className="text-gray-400">Loading transactions...</p>
                </div>
            ) : allTransactions.length > 0 ? (
                <div>
                    {displayedTransactions.map((tx, index) => (
                        <div
                            key={tx.hash}
                            className={`border-t border-gray-800 p-4 md:p-6 ${index % 2 === 0 ? 'bg-black' : 'bg-gray-900/20'}`}
                        >
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                                <div className="flex items-start">
                                    <div className="w-6 h-6 rounded-full bg-red-900/40 flex items-center justify-center mr-3 mt-1">
                                        <ArrowUpRight className="w-3 h-3 text-red-500" />
                                    </div>
                                    <div>
                                        <div className="flex items-center">
                                            <span className="text-white font-medium">Sent</span>
                                            <span className="text-gray-500 text-xs ml-3 flex items-center">
                                                <Clock className="w-3 h-3 mr-1 text-gray-600" />
                                                {getTimeAgo(tx.timestamp)}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-10 mt-4">
                                            <div>
                                                <p className="text-gray-500 text-xs mb-1">To:</p>
                                                <p className="text-gray-400 text-sm font-mono">
                                                    {shortenAddress(tx.to)}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 text-xs mb-1">Function:</p>
                                                <p className="text-yellow-400 text-sm">
                                                    {tx.functionName}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="sm:text-right mt-3 sm:mt-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-800">
                                    <p className="text-red-500 font-medium sm:text-right">
                                        -{parseFloat(tx.value).toFixed(tx.value.includes('.') ? 0 : 2)} FLR
                                    </p>
                                    <a
                                        href={`${getExplorerUrl(chainId)}/tx/${tx.hash}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-red-500 hover:text-red-400 flex items-center sm:justify-end mt-1"
                                    >
                                        Explorer <ExternalLink className="w-3 h-3 ml-1" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="p-6 text-center">
                    <p className="text-gray-400">No transaction history found.</p>
                </div>
            )}
            {/* Pagination Controls */}
            {allTransactions.length > TRANSACTIONS_PER_PAGE && (
                <div className="flex justify-between items-center p-4 border-t border-gray-800">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className={`text-sm ${currentPage === 1 ? 'text-gray-600 cursor-not-allowed' : 'text-red-500 hover:text-red-400'}`}
                    >
                        Previous
                    </button>

                    <div className="text-xs text-gray-500">
                        Page {currentPage} of {totalPages}
                    </div>

                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className={`text-sm ${currentPage === totalPages ? 'text-gray-600 cursor-not-allowed' : 'text-red-500 hover:text-red-400'}`}
                    >
                        Next
                    </button>
                </div>
            )}


        </div>
    );
};

export default TransactionHistory;