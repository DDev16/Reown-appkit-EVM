import React, { useState } from 'react';
import { ExternalLink, Copy, CheckCircle } from 'lucide-react';
import { formatEther } from 'viem';
import { useBalance } from 'wagmi';
import { copyToClipboard } from '@/components/wallet/address-utils';

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

interface TokenCardProps {
    token: TokenInfo;
    walletAddress?: string;
    explorerUrl: string;
}

const TokenCard: React.FC<TokenCardProps> = ({ token, walletAddress, explorerUrl }) => {
    const [isCopied, setIsCopied] = useState(false);

    const { data: tokenBalance } = useBalance({
        address: walletAddress as `0x${string}`,
        token: token.address as `0x${string}`,
    });

    const handleCopyAddress = () => {
        copyToClipboard(token.address, () => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    };

    return (
        <div className="bg-gray-800 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-white">{token.description}</h3>
                <span className="bg-red-500 text-white px-2 py-1 rounded text-xs">Flare Mainnet</span>
            </div>

            <div className="flex items-center mb-2">
                <p className="text-gray-400 font-mono text-sm break-all mr-2">{token.address}</p>
                <button onClick={handleCopyAddress} className="text-gray-400 hover:text-white">
                    {isCopied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
            </div>

            <p className="text-white mb-2">{token.name}</p>

            <div className="flex justify-between items-center mt-3">
                <div>
                    <p className="text-sm text-gray-400">Balance</p>
                    <p className="text-lg text-red-400">
                        {tokenBalance ? formatEther(tokenBalance.value) : '0.0'} {token.symbol}
                    </p>
                </div>

                <div className="flex space-x-2">
                    <a
                        href={`${explorerUrl}/address/${token.address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-400 hover:text-red-300 flex items-center text-sm"
                    >
                        View on Explorer
                        <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                    <a
                        href={`${explorerUrl}/address/${token.address}#code`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-400 hover:text-red-300 flex items-center text-sm"
                    >
                        View Contract Code
                        <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                </div>
            </div>
        </div>
    );
};

interface TokensProps {
    address?: string;
    explorerUrl: string;
}

const Tokens: React.FC<TokensProps> = ({ address, explorerUrl }) => {
    return (
        <div className="w-full">
            <h2 className="text-2xl font-bold text-white mb-6">Token Balances</h2>

            <div className="space-y-4">
                {tokensList.map((token) => (
                    <TokenCard
                        key={token.address}
                        token={token}
                        walletAddress={address}
                        explorerUrl={explorerUrl}
                    />
                ))}
            </div>
        </div>
    );
};

export default Tokens;