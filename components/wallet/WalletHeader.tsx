import React, { useState } from 'react';
import { ExternalLink, Copy, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { formatEther } from 'viem';
import { UseBalanceReturnType, useBalance } from 'wagmi';
import { shortenAddress, copyToClipboard } from '@/components/wallet/address-utils';

interface TokenInfo {
    name: string;
    symbol: string;
    address: string;
    description: string;
}

const tokensList: TokenInfo[] = [
    {
        name: "Defi Bull World Token",
        symbol: "DBW",
        address: "0x31Db774C3B1c44ea7d718fFbf7D3FFbc6484B1fc",
        description: "DBW Token Contract"
    },
    {
        name: "Defi Bull World FTSO Token",
        symbol: "DBWF",
        address: "0x77aA1BCf27D2F2eD9ABa33F66958F4978B3Ab611",
        description: "DBWF Token Contract"
    },
    {
        name: "Defi Bull World Liquidator Token",
        symbol: "DBWL",
        address: "0x8D41444B9d0ca97b9FEB993640963988458c5f71",
        description: "DBWL Token Contract"
    },
    {
        name: "Defi Bull Token",
        symbol: "DBT",
        address: "0xE259f855f9EdCbBCD5837794948C1CD418665d03",
        description: "DBT Token Contract"
    },
    {
        name: "NFT Collateral",
        symbol: "NFTC",
        address: "0xF5976f03bBe85315e5610F0c9C306cA979DeA6E5",
        description: "NFTC Token Contract"
    }
];

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
    const [tokensOpen, setTokensOpen] = useState(false);

    const handleCopyAddress = () => {
        if (address) {
            copyToClipboard(address, () => {
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
            });
        }
    };

    const toggleTokens = () => {
        setTokensOpen(!tokensOpen);
    };

    return (
        <div className="bg-gray-900 rounded-lg mb-4">
            {/* Address and Network */}
            <div className="flex justify-between items-center p-4">
                <h2 className="text-lg font-medium text-white">
                    {address ? shortenAddress(address) : 'Address Not Available'}
                </h2>
                <span className="text-xs bg-gray-800 text-gray-300 px-3 py-1 rounded">
                    {networkName}
                </span>
            </div>

            {/* Actions */}
            <div className="flex items-center px-4 mb-3">
                <button
                    onClick={handleCopyAddress}
                    className="flex items-center bg-gray-800 hover:bg-gray-700 text-white py-1 px-3 rounded text-xs"
                >
                    {isCopied ? <CheckCircle className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                    {isCopied ? 'Copied' : 'Copy'}
                </button>
                {address && (
                    <a
                        href={`${explorerUrl}/address/${address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-3 text-red-400 hover:text-red-300 flex items-center text-xs"
                    >
                        Explorer <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                )}
            </div>

            {/* Balance */}
            <div className="px-4 border-b border-gray-800 pb-3">
                <div className="flex items-center">
                    <span className="text-sm text-gray-400 mr-2">Balance:</span>
                    <span className="text-red-400 font-medium">
                        {balance ? formatEther(balance.value) : '0'} {balance?.symbol || 'C-FLR'}
                    </span>
                </div>
            </div>

            {/* Tokens Dropdown */}
            <div className="px-4 py-3 border-b border-gray-800">
                <button
                    onClick={toggleTokens}
                    className="flex items-center justify-between w-full text-white hover:text-gray-300 transition-colors"
                >
                    <span className="text-sm font-medium">Token Balances</span>
                    <span>
                        {tokensOpen ?
                            <ChevronUp className="w-4 h-4" /> :
                            <ChevronDown className="w-4 h-4" />
                        }
                    </span>
                </button>
            </div>

            {tokensOpen && (
                <div>
                    {tokensList.map((token, index) => (
                        <TokenRow
                            key={token.address}
                            token={token}
                            walletAddress={address}
                            explorerUrl={explorerUrl}
                            isLast={index === tokensList.length - 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

// Simple Token Row Component
interface TokenRowProps {
    token: TokenInfo;
    walletAddress?: string;
    explorerUrl: string;
    isLast?: boolean;
}

const TokenRow: React.FC<TokenRowProps> = ({ token, walletAddress, explorerUrl, isLast }) => {
    const { data: tokenBalance } = useBalance({
        address: walletAddress as `0x${string}`,
        token: token.address as `0x${string}`,
    });

    return (
        <div className={`px-4 py-3 ${!isLast ? 'border-b border-gray-800' : ''}`}>
            <div className="flex justify-between items-center">
                <div>
                    <div className="flex items-center">
                        <span className="text-sm text-white mr-2">{token.symbol}</span>
                        <span className="text-xs text-gray-400">{token.name.length > 20 ? `${token.name.substring(0, 20)}...` : token.name}</span>
                    </div>
                    <div className="text-xs text-gray-500 font-mono mt-1">
                        {token.address.substring(0, 8)}...{token.address.substring(token.address.length - 5)}
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-red-400 text-sm">
                        {tokenBalance ? parseFloat(formatEther(tokenBalance.value)).toFixed(4) : '0.0000'}
                    </span>
                    <a
                        href={`${explorerUrl}/address/${token.address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-red-400 hover:text-red-300 mt-1"
                    >
                        Explorer
                    </a>
                </div>
            </div>
        </div>
    );
};

export default WalletHeader;