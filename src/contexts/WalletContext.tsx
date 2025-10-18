import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { algorandWalletService, WalletConnection, WalletAccount } from '../services/algorandWallet';
import toast from 'react-hot-toast';

interface WalletContextType {
  isConnected: boolean;
  accounts: WalletAccount[];
  currentAccount: WalletAccount | null;
  provider: 'pera' | 'myalgo' | null;
  balance: number;
  isLoading: boolean;
  connectPeraWallet: () => Promise<void>;
  connectMyAlgoWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  refreshBalance: () => Promise<void>;
  sendTransaction: (toAddress: string, amount: number) => Promise<string>;
  createReceiptTransaction: (receiptHash: string) => Promise<string>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [accounts, setAccounts] = useState<WalletAccount[]>([]);
  const [currentAccount, setCurrentAccount] = useState<WalletAccount | null>(null);
  const [provider, setProvider] = useState<'pera' | 'myalgo' | null>(null);
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if wallet is already connected on app load
    checkConnectionStatus();
  }, []);

  const checkConnectionStatus = async () => {
    try {
      const connected = algorandWalletService.isConnected();
      setIsConnected(connected);
      
      if (connected) {
        // Try to restore connection
        // This would need to be implemented based on the specific wallet
        console.log('Wallet connection restored');
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
    }
  };

  const connectPeraWallet = async () => {
    setIsLoading(true);
    try {
      const connection: WalletConnection = await algorandWalletService.connectPeraWallet();
      
      setAccounts(connection.accounts);
      setCurrentAccount(connection.accounts[0] || null);
      setProvider('pera');
      setIsConnected(true);
      
      // Get balance for the first account
      if (connection.accounts[0]) {
        await refreshBalance();
      }
      
      toast.success('Pera Wallet connected successfully!');
    } catch (error) {
      console.error('Pera Wallet connection failed:', error);
      toast.error('Failed to connect Pera Wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const connectMyAlgoWallet = async () => {
    setIsLoading(true);
    try {
      const connection: WalletConnection = await algorandWalletService.connectMyAlgoWallet();
      
      setAccounts(connection.accounts);
      setCurrentAccount(connection.accounts[0] || null);
      setProvider('myalgo');
      setIsConnected(true);
      
      // Get balance for the first account
      if (connection.accounts[0]) {
        await refreshBalance();
      }
      
      toast.success('MyAlgo Wallet connected successfully!');
    } catch (error) {
      console.error('MyAlgo connection failed:', error);
      toast.error('Failed to connect MyAlgo Wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = async () => {
    setIsLoading(true);
    try {
      if (provider) {
        await algorandWalletService.disconnectWallet(provider);
      }
      
      setIsConnected(false);
      setAccounts([]);
      setCurrentAccount(null);
      setProvider(null);
      setBalance(0);
      
      toast.success('Wallet disconnected');
    } catch (error) {
      console.error('Wallet disconnection failed:', error);
      toast.error('Failed to disconnect wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshBalance = async () => {
    if (!currentAccount) return;
    
    try {
      const accountBalance = await algorandWalletService.getAccountBalance(currentAccount.address);
      setBalance(accountBalance / 1000000); // Convert from microAlgos to Algos
    } catch (error) {
      console.error('Failed to refresh balance:', error);
    }
  };

  const sendTransaction = async (toAddress: string, amount: number): Promise<string> => {
    if (!currentAccount || !provider) {
      throw new Error('No wallet connected');
    }
    
    try {
      const txId = await algorandWalletService.sendTransaction(
        currentAccount.address,
        toAddress,
        amount * 1000000, // Convert Algos to microAlgos
        provider
      );
      
      toast.success('Transaction sent successfully!');
      await refreshBalance(); // Refresh balance after transaction
      
      return txId;
    } catch (error) {
      console.error('Transaction failed:', error);
      toast.error('Transaction failed');
      throw error;
    }
  };

  const createReceiptTransaction = async (receiptHash: string): Promise<string> => {
    if (!currentAccount || !provider) {
      throw new Error('No wallet connected');
    }
    
    try {
      const txId = await algorandWalletService.createReceiptTransaction(
        currentAccount.address,
        receiptHash,
        provider
      );
      
      toast.success('Receipt recorded on blockchain!');
      return txId;
    } catch (error) {
      console.error('Receipt transaction failed:', error);
      toast.error('Failed to record receipt on blockchain');
      throw error;
    }
  };

  const value: WalletContextType = {
    isConnected,
    accounts,
    currentAccount,
    provider,
    balance,
    isLoading,
    connectPeraWallet,
    connectMyAlgoWallet,
    disconnectWallet,
    refreshBalance,
    sendTransaction,
    createReceiptTransaction,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

