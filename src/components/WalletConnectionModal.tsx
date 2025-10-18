import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, X, ExternalLink, Copy, CheckCircle } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import toast from 'react-hot-toast';

const WalletModal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: #666;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(0, 0, 0, 0.1);
    color: #333;
  }
`;

const WalletOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const WalletOption = styled.button<{ $disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(102, 126, 234, 0.1);
  border: 2px solid rgba(102, 126, 234, 0.2);
  border-radius: 12px;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  opacity: ${props => props.$disabled ? 0.6 : 1};
  
  &:hover:not(:disabled) {
    background: rgba(102, 126, 234, 0.2);
    border-color: #667eea;
  }
`;

const WalletIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: #667eea;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const WalletInfo = styled.div`
  flex: 1;
  text-align: left;
`;

const WalletName = styled.div`
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
`;

const WalletDescription = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const WalletStatus = styled.div<{ $connected: boolean }>`
  color: ${props => props.$connected ? '#10b981' : '#666'};
  font-size: 0.8rem;
  font-weight: 500;
`;

const AccountInfo = styled.div`
  background: rgba(102, 126, 234, 0.1);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const AccountHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const AccountAddress = styled.div`
  font-family: monospace;
  font-size: 0.9rem;
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
  padding: 0.5rem;
  border-radius: 8px;
  word-break: break-all;
`;

const CopyButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem;
  background: transparent;
  border: 1px solid #667eea;
  border-radius: 6px;
  color: #667eea;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: #667eea;
    color: white;
  }
`;

const BalanceInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const BalanceLabel = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

const BalanceValue = styled.div`
  font-weight: bold;
  color: #10b981;
  font-size: 1.1rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const ActionButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s ease;
  
  &:hover {
    background: #5a6fd8;
  }
`;

const DisconnectButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: transparent;
  color: #ef4444;
  border: 1px solid #ef4444;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(239, 68, 68, 0.1);
  }
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

interface WalletConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WalletConnectionModal: React.FC<WalletConnectionModalProps> = ({ isOpen, onClose }) => {
  const {
    isConnected,
    currentAccount,
    provider,
    balance,
    isLoading,
    connectPeraWallet,
    connectMyAlgoWallet,
    disconnectWallet,
    refreshBalance,
  } = useWallet();

  const [copied, setCopied] = useState(false);

  const handleConnectPera = async () => {
    await connectPeraWallet();
    onClose();
  };

  const handleConnectMyAlgo = async () => {
    await connectMyAlgoWallet();
    onClose();
  };

  const handleDisconnect = async () => {
    await disconnectWallet();
    onClose();
  };

  const handleCopyAddress = async () => {
    if (currentAccount?.address) {
      await navigator.clipboard.writeText(currentAccount.address);
      setCopied(true);
      toast.success('Address copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRefreshBalance = async () => {
    await refreshBalance();
    toast.success('Balance refreshed');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <WalletModal
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <ModalContent
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalHeader>
              <ModalTitle>
                <Wallet size={24} />
                {isConnected ? 'Wallet Connected' : 'Connect Wallet'}
              </ModalTitle>
              <CloseButton onClick={onClose}>
                <X size={20} />
              </CloseButton>
            </ModalHeader>

            {!isConnected ? (
              <WalletOptions>
                <WalletOption onClick={handleConnectPera} disabled={isLoading}>
                  <WalletIcon>
                    <Wallet size={20} />
                  </WalletIcon>
                  <WalletInfo>
                    <WalletName>Pera Wallet</WalletName>
                    <WalletDescription>
                      Connect with Pera Wallet (Mobile & Desktop)
                    </WalletDescription>
                  </WalletInfo>
                  {isLoading && <LoadingSpinner />}
                </WalletOption>

                <WalletOption onClick={handleConnectMyAlgo} disabled={isLoading}>
                  <WalletIcon>
                    <Wallet size={20} />
                  </WalletIcon>
                  <WalletInfo>
                    <WalletName>MyAlgo Wallet</WalletName>
                    <WalletDescription>
                      Connect with MyAlgo Wallet (Web)
                    </WalletDescription>
                  </WalletInfo>
                  {isLoading && <LoadingSpinner />}
                </WalletOption>
              </WalletOptions>
            ) : (
              <>
                <AccountInfo>
                  <AccountHeader>
                    <div>
                      <div style={{ fontWeight: '600', color: '#333', marginBottom: '0.25rem' }}>
                        {provider === 'pera' ? 'Pera Wallet' : 'MyAlgo Wallet'}
                      </div>
                      <WalletStatus $connected={isConnected}>
                        {isConnected ? 'Connected' : 'Disconnected'}
                      </WalletStatus>
                    </div>
                    <CopyButton onClick={handleCopyAddress}>
                      {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                      {copied ? 'Copied' : 'Copy'}
                    </CopyButton>
                  </AccountHeader>
                  
                  <AccountAddress>
                    {currentAccount?.address}
                  </AccountAddress>
                  
                  <BalanceInfo>
                    <BalanceLabel>Balance</BalanceLabel>
                    <BalanceValue>{balance.toFixed(4)} ALGO</BalanceValue>
                  </BalanceInfo>
                </AccountInfo>

                <ActionButtons>
                  <ActionButton onClick={handleRefreshBalance}>
                    <ExternalLink size={16} />
                    Refresh Balance
                  </ActionButton>
                  <DisconnectButton onClick={handleDisconnect}>
                    <X size={16} />
                    Disconnect
                  </DisconnectButton>
                </ActionButtons>
              </>
            )}
          </ModalContent>
        </WalletModal>
      )}
    </AnimatePresence>
  );
};

export default WalletConnectionModal;

