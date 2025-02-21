export const getNetworkName = (chainId: number) => {
    return chainId === 16 ? 'Coston Testnet' : 'Unknown Network';
};

export const getExplorerUrl = (chainId: number) => {
    return chainId === 16 ? 'https://coston-explorer.flare.network' : '';
};