import { PeraWalletConnect } from '@perawallet/connect';
import MyAlgoConnect from '@randlabs/myalgo-connect';
import { Algodv2, Indexer } from 'algosdk';

// Algorand network configuration
export const ALGORAND_NETWORK = {
  MAINNET: 'mainnet',
  TESTNET: 'testnet',
  SANDBOX: 'sandbox'
};

export const ALGORAND_CONFIG = {
  [ALGORAND_NETWORK.TESTNET]: {
    algodToken: '',
    algodServer: 'https://testnet-api.algonode.cloud',
    algodPort: '',
    indexerToken: '',
    indexerServer: 'https://testnet-idx.algonode.cloud',
    indexerPort: '',
  },
  [ALGORAND_NETWORK.MAINNET]: {
    algodToken: '',
    algodServer: 'https://mainnet-api.algonode.cloud',
    algodPort: '',
    indexerToken: '',
    indexerServer: 'https://mainnet-idx.algonode.cloud',
    indexerPort: '',
  }
};

export interface WalletAccount {
  address: string;
  name?: string;
}

export interface WalletConnection {
  accounts: WalletAccount[];
  provider: 'pera' | 'myalgo';
}

class AlgorandWalletService {
  private peraWallet: PeraWalletConnect | null = null;
  private myAlgoConnect: MyAlgoConnect | null = null;
  private algodClient: Algodv2 | null = null;
  private indexerClient: Indexer | null = null;
  private currentNetwork: string = ALGORAND_NETWORK.TESTNET;

  constructor() {
    this.initializeClients();
  }

  private initializeClients() {
    // Initialize Pera Wallet
    this.peraWallet = new PeraWalletConnect({
      chainId: 416002, // Testnet chain ID
      bridge: 'https://bridge.walletconnect.org',
    });

    // Initialize MyAlgo Connect
    this.myAlgoConnect = new MyAlgoConnect();

    // Initialize Algorand clients
    const config = ALGORAND_CONFIG[this.currentNetwork];
    this.algodClient = new Algodv2(config.algodToken, config.algodServer, config.algodPort);
    this.indexerClient = new Indexer(config.indexerToken, config.indexerServer, config.indexerPort);
  }

  async connectPeraWallet(): Promise<WalletConnection> {
    if (!this.peraWallet) {
      throw new Error('Pera Wallet not initialized');
    }

    try {
      const accounts = await this.peraWallet.connect();
      return {
        accounts: accounts.map(address => ({ address })),
        provider: 'pera'
      };
    } catch (error) {
      console.error('Pera Wallet connection failed:', error);
      throw new Error('Failed to connect to Pera Wallet');
    }
  }

  async connectMyAlgoWallet(): Promise<WalletConnection> {
    if (!this.myAlgoConnect) {
      throw new Error('MyAlgo Connect not initialized');
    }

    try {
      const accounts = await this.myAlgoConnect.connect();
      return {
        accounts: accounts.map(account => ({
          address: account.address,
          name: account.name
        })),
        provider: 'myalgo'
      };
    } catch (error) {
      console.error('MyAlgo connection failed:', error);
      throw new Error('Failed to connect to MyAlgo Wallet');
    }
  }

  async disconnectWallet(provider: 'pera' | 'myalgo') {
    try {
      if (provider === 'pera' && this.peraWallet) {
        await this.peraWallet.disconnect();
      } else if (provider === 'myalgo' && this.myAlgoConnect) {
        await this.myAlgoConnect.disconnect();
      }
    } catch (error) {
      console.error('Wallet disconnection failed:', error);
    }
  }

  async getAccountInfo(address: string) {
    if (!this.indexerClient) {
      throw new Error('Indexer client not initialized');
    }

    try {
      const accountInfo = await this.indexerClient.lookupAccountByID(address).do();
      return accountInfo;
    } catch (error) {
      console.error('Failed to get account info:', error);
      throw new Error('Failed to fetch account information');
    }
  }

  async getAccountBalance(address: string): Promise<number> {
    try {
      const accountInfo = await this.getAccountInfo(address);
      return accountInfo.account?.amount || 0;
    } catch (error) {
      console.error('Failed to get account balance:', error);
      return 0;
    }
  }

  async sendTransaction(
    fromAddress: string,
    toAddress: string,
    amount: number,
    provider: 'pera' | 'myalgo'
  ): Promise<string> {
    if (!this.algodClient) {
      throw new Error('Algod client not initialized');
    }

    try {
      // Get account info
      const accountInfo = await this.algodClient.accountInformation(fromAddress).do();
      
      // Create transaction
      const suggestedParams = await this.algodClient.getTransactionParams().do();
      
      const transaction = {
        from: fromAddress,
        to: toAddress,
        amount: amount,
        ...suggestedParams,
      };

      // Sign and send transaction based on provider
      let signedTransaction;
      
      if (provider === 'pera' && this.peraWallet) {
        signedTransaction = await this.peraWallet.signTransaction([transaction]);
      } else if (provider === 'myalgo' && this.myAlgoConnect) {
        signedTransaction = await this.myAlgoConnect.signTransaction(transaction);
      } else {
        throw new Error('Invalid provider');
      }

      // Submit transaction
      const result = await this.algodClient.sendRawTransaction(signedTransaction).do();
      
      // Wait for confirmation
      const confirmedTxn = await this.waitForConfirmation(result.txId);
      
      return confirmedTxn.txId;
    } catch (error) {
      console.error('Transaction failed:', error);
      throw new Error('Failed to send transaction');
    }
  }

  private async waitForConfirmation(txId: string, timeout: number = 10000): Promise<any> {
    if (!this.algodClient) {
      throw new Error('Algod client not initialized');
    }

    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      try {
        const status = await this.algodClient.pendingTransactionInformation(txId).do();
        if (status.confirmedRound) {
          return status;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error('Error waiting for confirmation:', error);
        throw error;
      }
    }
    
    throw new Error('Transaction confirmation timeout');
  }

  async createReceiptTransaction(
    fromAddress: string,
    receiptHash: string,
    provider: 'pera' | 'myalgo'
  ): Promise<string> {
    // This would create a transaction that stores the receipt hash on-chain
    // For now, we'll simulate this with a simple transaction
    const mockToAddress = 'ALGO1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // Mock address
    
    return this.sendTransaction(fromAddress, mockToAddress, 0, provider);
  }

  setNetwork(network: string) {
    this.currentNetwork = network;
    this.initializeClients();
  }

  getCurrentNetwork(): string {
    return this.currentNetwork;
  }

  isConnected(): boolean {
    return !!(this.peraWallet?.isConnected || this.myAlgoConnect?.isConnected);
  }
}

// Export singleton instance
export const algorandWalletService = new AlgorandWalletService();
export default algorandWalletService;
