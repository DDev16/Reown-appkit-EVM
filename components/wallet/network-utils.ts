export const getNetworkName = (chainId: number) => {
    return chainId === 14 ? 'Flare Networks' : 'Unknown Network';
};

export const getExplorerUrl = (chainId: number) => {
    return chainId === 14 ? 'https://flare-explorer.flare.network/' : '';
};