"use client";
import { useEffect, useState } from "react";
import { useAccount, useReadContracts } from "wagmi";
import { useRouter, usePathname } from "next/navigation";
import { parseAbi } from "viem";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;
const ADMIN_ADDRESS = "0xd0cfD2e3Be2D49976D870898fcD6fE94Dbc98f37";

const TOTAL_TIERS = 9;

// ERC1155 minimal ABI for balanceOf
const ERC1155_ABI = parseAbi([
    'function balanceOf(address account, uint256 id) view returns (uint256)',
]);

const AppKitButton = () => {
    const { address, isConnected } = useAccount();
    const router = useRouter();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    // Only create contracts array if we have a valid address
    const contracts = (mounted && isConnected && address)
        ? Array.from({ length: TOTAL_TIERS }, (_, i) => ({
            address: CONTRACT_ADDRESS,
            abi: ERC1155_ABI,
            functionName: 'balanceOf',
            args: [address, BigInt(i)],
        }))
        : [];

    const { data: balances } = useReadContracts({
        contracts
    });

    // Handle mounting
    useEffect(() => {
        setMounted(true);
    }, []);

    // Handle NFT check and routing
    useEffect(() => {
        if (!mounted) return;

        // If the connected address is the admin address, don't redirect.
        if (isConnected && address && address.toLowerCase() === ADMIN_ADDRESS.toLowerCase()) {
            return;
        }

        const checkNFTAndRoute = async () => {
            // Only check and redirect on specific pages (e.g., mint, sales)
            const redirectPages = ['/'];

            if (
                isConnected &&
                address &&
                balances &&
                balances.length > 0 &&
                redirectPages.includes(pathname)
            ) {
                try {
                    const hasNFT = balances.some(
                        (result) =>
                            result.status === 'success' &&
                            result.result !== undefined &&
                            result.result > BigInt(0)
                    );

                    if (hasNFT) {
                        router.push("/dashboard");
                    }
                } catch (error) {
                    console.error("Error checking NFT balance:", error);
                }
            }
        };

        checkNFTAndRoute();
    }, [mounted, isConnected, address, balances, router, pathname]);

    if (!mounted) {
        return (
            <div className="flex justify-center items-center">
                <div className="w-[150px] h-[40px]"></div>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center">
            <appkit-button></appkit-button>
        </div>
    );
};

export default AppKitButton;