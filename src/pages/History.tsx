import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Search, Filter, Download, Eye, CheckCircle, AlertCircle, Calendar, DollarSign } from 'lucide-react';
import { useStore } from '../store/store';
import { format } from 'date-fns';

const HistoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const HeaderSection = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const HistoryTitle = styled.h2`
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 1rem;
`;

const HistorySubtitle = styled.p`
  color: #666;
  margin-bottom: 2rem;
`;

const ControlsSection = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SearchInput = styled.div`
  position: relative;
  flex: 1;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  size: 20;
`;

const FilterButton = styled.button`
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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
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

const TransactionsList = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const TransactionItem = styled(motion.div)`
  display: grid;
  grid-template-columns: auto 1fr auto auto auto;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: auto 1fr auto;
    gap: 0.5rem;
  }
`;

const TransactionIcon = styled.div<{ $verified: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: ${props => props.$verified ? '#10b981' : '#f59e0b'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const TransactionDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const TransactionMerchant = styled.div`
  font-weight: 600;
  color: #333;
`;

const TransactionDescription = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const TransactionDate = styled.div`
  font-size: 0.8rem;
  color: #999;
`;

const TransactionAmount = styled.div`
  font-weight: bold;
  color: #10b981;
  text-align: right;
`;

const TransactionHash = styled.div`
  font-family: monospace;
  font-size: 0.8rem;
  color: #666;
  background: rgba(0, 0, 0, 0.05);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem;
  background: transparent;
  color: #666;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
`;

const PageButton = styled.button<{ $active: boolean }>`
  padding: 0.5rem 1rem;
  background: ${props => props.$active ? '#667eea' : 'transparent'};
  color: ${props => props.$active ? 'white' : '#666'};
  border: 1px solid ${props => props.$active ? '#667eea' : '#d1d5db'};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.$active ? '#5a6fd8' : 'rgba(102, 126, 234, 0.1)'};
    color: ${props => props.$active ? 'white' : '#667eea'};
  }
`;

const History: React.FC = () => {
  const { transactions } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredTransactions = transactions.filter(transaction =>
    transaction.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalAmount = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const verifiedCount = transactions.filter(tx => tx.verified).length;
  const pendingCount = transactions.filter(tx => !tx.verified).length;

  const handleViewReceipt = (transactionId: string) => {
    // In a real app, this would open a modal or navigate to receipt details
    console.log('View receipt:', transactionId);
  };

  const handleDownloadReceipt = (transactionId: string) => {
    // In a real app, this would download the receipt
    console.log('Download receipt:', transactionId);
  };

  return (
    <HistoryContainer>
      <HeaderSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <HistoryTitle>Transaction History</HistoryTitle>
        <HistorySubtitle>
          View all your verified receipts and transaction records
        </HistorySubtitle>

        <ControlsSection>
          <SearchInput>
            <SearchIcon size={20} />
            <Input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchInput>
          <FilterButton>
            <Filter size={20} />
            <span>Filter</span>
          </FilterButton>
        </ControlsSection>

        <StatsGrid>
          <StatCard>
            <StatValue>{transactions.length}</StatValue>
            <StatLabel>Total Transactions</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>${totalAmount.toLocaleString()}</StatValue>
            <StatLabel>Total Amount</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{verifiedCount}</StatValue>
            <StatLabel>Verified</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{pendingCount}</StatValue>
            <StatLabel>Pending</StatLabel>
          </StatCard>
        </StatsGrid>
      </HeaderSection>

      <TransactionsList
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {paginatedTransactions.length > 0 ? (
          <>
            {paginatedTransactions.map((transaction, index) => (
              <TransactionItem
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <TransactionIcon $verified={transaction.verified}>
                  {transaction.verified ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                </TransactionIcon>
                
                <TransactionDetails>
                  <TransactionMerchant>{transaction.merchant}</TransactionMerchant>
                  {transaction.description && (
                    <TransactionDescription>{transaction.description}</TransactionDescription>
                  )}
                  <TransactionDate>
                    {format(transaction.timestamp, 'MMM dd, yyyy • HH:mm')}
                  </TransactionDate>
                </TransactionDetails>
                
                <TransactionAmount>
                  ${transaction.amount.toLocaleString()}
                </TransactionAmount>
                
                <TransactionHash>
                  {transaction.hash}
                </TransactionHash>
                
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <ActionButton onClick={() => handleViewReceipt(transaction.id)}>
                    <Eye size={16} />
                  </ActionButton>
                  <ActionButton onClick={() => handleDownloadReceipt(transaction.id)}>
                    <Download size={16} />
                  </ActionButton>
                </div>
              </TransactionItem>
            ))}
            
            {totalPages > 1 && (
              <Pagination>
                <PageButton
                  $active={false}
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </PageButton>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <PageButton
                    key={page}
                    $active={page === currentPage}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </PageButton>
                ))}
                
                <PageButton
                  $active={false}
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </PageButton>
              </Pagination>
            )}
          </>
        ) : (
          <EmptyState>
            <Calendar size={48} color="#ccc" />
            <h3>No transactions found</h3>
            <p>
              {searchTerm 
                ? 'No transactions match your search criteria'
                : 'Start uploading receipts to build your transaction history'
              }
            </p>
          </EmptyState>
        )}
      </TransactionsList>
    </HistoryContainer>
  );
};

export default History;
