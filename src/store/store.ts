import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  merchant: string;
  description: string;
  timestamp: Date;
  hash: string;
  verified: boolean;
  imageUrl?: string;
  qrData?: string;
}

export interface User {
  walletAddress: string;
  name: string;
  email: string;
  totalIncome: number;
  transactionCount: number;
}

interface AppState {
  user: User | null;
  transactions: Transaction[];
  isLoading: boolean;
  setUser: (user: User) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  setLoading: (loading: boolean) => void;
  clearData: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      transactions: [],
      isLoading: false,
      
      setUser: (user) => set({ user }),
      
      addTransaction: (transaction) => 
        set((state) => ({
          transactions: [transaction, ...state.transactions],
          user: state.user ? {
            ...state.user,
            totalIncome: state.user.totalIncome + transaction.amount,
            transactionCount: state.user.transactionCount + 1,
          } : null,
        })),
      
      updateTransaction: (id, updates) =>
        set((state) => ({
          transactions: state.transactions.map((tx) =>
            tx.id === id ? { ...tx, ...updates } : tx
          ),
        })),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      clearData: () => set({ user: null, transactions: [] }),
    }),
    {
      name: 'proofpay-storage',
      partialize: (state) => ({
        user: state.user,
        transactions: state.transactions,
      }),
    }
  )
);
