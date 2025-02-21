export const shortenAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
};

export const copyToClipboard = (address: string, onCopied?: () => void) => {
    navigator.clipboard.writeText(address);
    onCopied?.();
};