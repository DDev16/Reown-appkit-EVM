import React, { useState } from 'react';
import { ExternalLink, Copy, CheckCircle } from 'lucide-react';
import { formatEther } from 'viem';
import { UseBalanceReturnType } from 'wagmi';
import { shortenAddress, copyToClipboard } from '@/components/wallet/address-utils';

interface WalletHeaderProps {
    address?: string;
    balance?: UseBalanceReturnType['data'];
    networkName: string;
    explorerUrl: string;
}

const WalletHeader: React.FC<WalletHeaderProps> = ({
    address,
    balance,
    networkName,
    explorerUrl
}) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopyAddress = () => {
        if (address) {
            copyToClipboard(address, () => {
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
            });
        }
    };

    return (
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
                    onClick={handleCopyAddress}
                    className="flex items-center bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded transition-colors"
                >
                    {isCopied ? <CheckCircle className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    {isCopied ? 'Copied!' : 'Copy Address'}
                </button>
                {address && (
                    <a
                        href={`${explorerUrl}/address/${address}`}
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
                <p className="text-gray-400">{networkName}</p>
            </div>
        </div>
    );
};

export default WalletHeader;