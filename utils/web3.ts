import { ethers } from 'ethers';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * Truncate Ethereum address for display
 */
export const truncateAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

/**
 * Sign a message with wallet to authenticate with Firebase
 * This is a simplified example - in production you would use a more robust approach
 */
export const signMessageForAuth = async (provider: any): Promise<{ signature: string, message: string }> => {
  if (!provider) {
    throw new Error('Web3 provider not connected');
  }
  
  const signer = provider.getSigner();
  const address = await signer.getAddress();
  
  // Create a message that includes a timestamp to prevent replay attacks
  const timestamp = Date.now();
  const message = `Authenticate with our platform: ${timestamp}`;
  
  // Sign the message
  const signature = await signer.signMessage(message);
  
  return { signature, message };
};

/**
 * Verify analytics data access for wallet
 * In a real application, this would be done server-side
 */
export const verifyAnalyticsAccess = async (walletAddress: string, signature: string, message: string): Promise<boolean> => {
  try {
    // Recover the address from the signature
    const recoveredAddress = ethers.verifyMessage(message, signature);
    
    // Check if the recovered address matches the claimed wallet address
    const isValidSignature = recoveredAddress.toLowerCase() === walletAddress.toLowerCase();
    
    if (!isValidSignature) {
      return false;
    }
    
    // Check if the wallet has access to the tier level in a real app
    // This would typically involve checking NFT ownership or membership status
    const userDocRef = doc(db, 'userProfiles', walletAddress.toLowerCase());
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      // If no profile exists, create one (simplified flow)
      await setDoc(userDocRef, {
        walletAddress: walletAddress.toLowerCase(),
        tierLevel: 1, // Default tier
        createdAt: new Date().toISOString()
      });
      return true;
    }
    
    return true;
  } catch (error) {
    console.error('Error verifying analytics access:', error);
    return false;
  }
};

/**
 * Get user's tier level based on wallet
 * In production, this would check NFT ownership or other on-chain data
 */
export const getUserTierLevel = async (walletAddress: string): Promise<number> => {
  try {
    if (!walletAddress) return 1; // Default tier
    
    const userDocRef = doc(db, 'userProfiles', walletAddress.toLowerCase());
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      return 1; // Default tier
    }
    
    return userDoc.data()?.tierLevel || 1;
  } catch (error) {
    console.error('Error getting user tier level:', error);
    return 1; // Default to tier 1 on error
  }
};