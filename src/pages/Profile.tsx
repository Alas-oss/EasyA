import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { User, Mail, Wallet, Settings, Shield, Download, Share2, Edit3 } from 'lucide-react';
import { useStore } from '../store/store';

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ProfileHeader = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const ProfileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  font-weight: bold;
`;

const UserDetails = styled.div`
  flex: 1;
`;

const UserName = styled.h2`
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 0.5rem;
`;

const UserEmail = styled.p`
  color: #666;
  margin-bottom: 0.5rem;
`;

const WalletAddress = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: monospace;
  background: rgba(102, 126, 234, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  color: #667eea;
  font-size: 0.9rem;
`;

const ProfileStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
`;

const StatCard = styled.div`
  background: rgba(102, 126, 234, 0.1);
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

const ProfileSections = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const SectionCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
`;

const SettingLabel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const SettingName = styled.div`
  font-weight: 600;
  color: #333;
`;

const SettingDescription = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const Toggle = styled.button<{ $active: boolean }>`
  width: 50px;
  height: 24px;
  border-radius: 12px;
  background: ${props => props.$active ? '#667eea' : '#d1d5db'};
  border: none;
  cursor: pointer;
  position: relative;
  transition: background 0.2s ease;
  
  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${props => props.$active ? '26px' : '2px'};
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: white;
    transition: left 0.2s ease;
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(102, 126, 234, 0.2);
  }
`;

const EditButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s ease;
  
  &:hover {
    background: #5a6fd8;
  }
`;

const Profile: React.FC = () => {
  const { user, transactions } = useStore();
  const [notifications, setNotifications] = useState(true);
  const [privacyMode, setPrivacyMode] = useState(false);
  const [autoSync, setAutoSync] = useState(true);

  if (!user) {
    return (
      <ProfileContainer>
        <ProfileHeader>
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <h2>Please connect your wallet</h2>
            <p>Connect your wallet to view your profile</p>
          </div>
        </ProfileHeader>
      </ProfileContainer>
    );
  }

  const totalAmount = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const verifiedCount = transactions.filter(tx => tx.verified).length;
  const monthlyIncome = transactions
    .filter(tx => {
      const now = new Date();
      const txDate = new Date(tx.timestamp);
      return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <ProfileContainer>
      <ProfileHeader
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ProfileInfo>
          <Avatar>
            {user.name.charAt(0).toUpperCase()}
          </Avatar>
          <UserDetails>
            <UserName>{user.name}</UserName>
            <UserEmail>{user.email}</UserEmail>
            <WalletAddress>
              <Wallet size={16} />
              {user.walletAddress}
            </WalletAddress>
          </UserDetails>
          <EditButton>
            <Edit3 size={16} />
            Edit Profile
          </EditButton>
        </ProfileInfo>

        <ProfileStats>
          <StatCard>
            <StatValue>${totalAmount.toLocaleString()}</StatValue>
            <StatLabel>Total Income</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{verifiedCount}</StatValue>
            <StatLabel>Verified Transactions</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>${monthlyIncome.toLocaleString()}</StatValue>
            <StatLabel>This Month</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>98.5%</StatValue>
            <StatLabel>Verification Rate</StatLabel>
          </StatCard>
        </ProfileStats>
      </ProfileHeader>

      <ProfileSections>
        <SectionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <SectionTitle>
            <Settings size={20} />
            Settings
          </SectionTitle>
          
          <SettingItem>
            <SettingLabel>
              <SettingName>Push Notifications</SettingName>
              <SettingDescription>Get notified about verification status</SettingDescription>
            </SettingLabel>
            <Toggle
              $active={notifications}
              onClick={() => setNotifications(!notifications)}
            />
          </SettingItem>
          
          <SettingItem>
            <SettingLabel>
              <SettingName>Privacy Mode</SettingName>
              <SettingDescription>Hide transaction details from lenders</SettingDescription>
            </SettingLabel>
            <Toggle
              $active={privacyMode}
              onClick={() => setPrivacyMode(!privacyMode)}
            />
          </SettingItem>
          
          <SettingItem>
            <SettingLabel>
              <SettingName>Auto Sync</SettingName>
              <SettingDescription>Automatically sync with blockchain</SettingDescription>
            </SettingLabel>
            <Toggle
              $active={autoSync}
              onClick={() => setAutoSync(!autoSync)}
            />
          </SettingItem>
        </SectionCard>

        <SectionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <SectionTitle>
            <Shield size={20} />
            Security & Privacy
          </SectionTitle>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <ActionButton>
              <Download size={16} />
              Export Data
            </ActionButton>
            
            <ActionButton>
              <Share2 size={16} />
              Share Public Profile
            </ActionButton>
            
            <ActionButton style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
              <Shield size={16} />
              Reset Wallet Connection
            </ActionButton>
          </div>
        </SectionCard>

        <SectionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <SectionTitle>
            <User size={20} />
            Account Information
          </SectionTitle>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <SettingName>Account Type</SettingName>
              <SettingDescription>Individual - Verified</SettingDescription>
            </div>
            
            <div>
              <SettingName>Member Since</SettingName>
              <SettingDescription>January 2024</SettingDescription>
            </div>
            
            <div>
              <SettingName>Verification Level</SettingName>
              <SettingDescription>Level 2 - Enhanced</SettingDescription>
            </div>
            
            <div>
              <SettingName>Credit Score</SettingName>
              <SettingDescription>Building - 3 transactions verified</SettingDescription>
            </div>
          </div>
        </SectionCard>
      </ProfileSections>
    </ProfileContainer>
  );
};

export default Profile;
