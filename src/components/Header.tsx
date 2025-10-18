import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Wallet, Upload, History, User, LogOut } from 'lucide-react';
import { useStore } from '../store/store';
import { useWallet } from '../contexts/WalletContext';
import WalletConnectionModal from './WalletConnectionModal';

const HeaderContainer = styled.header`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: #667eea;
  font-weight: bold;
  font-size: 1.5rem;
  
  &:hover {
    color: #764ba2;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 2rem;
  
  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const NavLink = styled(Link)<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: ${props => props.$active ? '#667eea' : '#666'};
  font-weight: ${props => props.$active ? '600' : '400'};
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
  }
  
  @media (max-width: 768px) {
    span {
      display: none;
    }
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const WalletInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 8px;
  font-size: 0.9rem;
  color: #667eea;
`;

const ConnectButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
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

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: transparent;
  color: #666;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 0, 0, 0.1);
    color: #ff4444;
  }
`;

const Header: React.FC = () => {
  const location = useLocation();
  const { user, clearData } = useStore();
  const { isConnected, currentAccount, balance, provider, disconnectWallet } = useWallet();
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  const handleConnectWallet = () => {
    setIsWalletModalOpen(true);
  };

  const handleLogout = async () => {
    if (isConnected) {
      await disconnectWallet();
    }
    clearData();
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo to="/">
          <Wallet size={24} />
          <span>ProofPay</span>
        </Logo>
        
        <Nav>
          <NavLink to="/" $active={location.pathname === '/'}>
            <Wallet size={20} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/upload" $active={location.pathname === '/upload'}>
            <Upload size={20} />
            <span>Upload</span>
          </NavLink>
          <NavLink to="/history" $active={location.pathname === '/history'}>
            <History size={20} />
            <span>History</span>
          </NavLink>
          <NavLink to="/profile" $active={location.pathname === '/profile'}>
            <User size={20} />
            <span>Profile</span>
          </NavLink>
        </Nav>
        
        <UserSection>
          {isConnected && currentAccount ? (
            <>
              <WalletInfo>
                <Wallet size={16} />
                <span>{formatAddress(currentAccount.address)}</span>
                <span style={{ marginLeft: '0.5rem', fontSize: '0.8rem', color: '#10b981' }}>
                  {balance.toFixed(2)} ALGO
                </span>
              </WalletInfo>
              <LogoutButton onClick={handleLogout}>
                <LogOut size={16} />
              </LogoutButton>
            </>
          ) : (
            <ConnectButton onClick={handleConnectWallet}>
              <Wallet size={16} />
              <span>Connect Wallet</span>
            </ConnectButton>
          )}
        </UserSection>
      </HeaderContent>
      
      <WalletConnectionModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
      />
    </HeaderContainer>
  );
};

export default Header;
