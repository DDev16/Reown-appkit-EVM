'use client';

import React from 'react';
import { useAccount, useBalance, useChainId } from 'wagmi';
import WalletHeader from '@/components/wallet/WalletHeader';
import OwnedNFTs from '@/components/wallet/OwnedNFTs';
import TransactionHistory from '@/components/wallet/TransactionHistory';
import { getNetworkName, getExplorerUrl } from '@/components/wallet/network-utils';


const WalletPage: React.FC = () => {
    const { address } = useAccount();
    const { data: balance } = useBalance({ address });
    const chainId = useChainId();

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-red-600">Your Wallet</h1>

            <WalletHeader
                address={address}
                balance={balance}
                networkName={getNetworkName(chainId)}
                explorerUrl={getExplorerUrl(chainId)}
            />

            <OwnedNFTs />

            <TransactionHistory />
        </div>
    );
};

export default WalletPage;