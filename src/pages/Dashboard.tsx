import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Receipt, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useStore } from '../store/store';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const WelcomeSection = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const WelcomeTitle = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 0.5rem;
`;

const WelcomeSubtitle = styled.p`
  color: #666;
  font-size: 1.1rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StatIcon = styled.div<{ $color: string }>`
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: ${props => props.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const StatContent = styled.div`
  flex: 1;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

const ChartsSection = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const ChartTitle = styled.h3`
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 1rem;
`;

const RecentTransactions = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const TransactionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  
  &:last-child {
    border-bottom: none;
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
  flex: 1;
`;

const TransactionMerchant = styled.div`
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
`;

const TransactionDate = styled.div`
  font-size: 0.8rem;
  color: #666;
`;

const TransactionAmount = styled.div`
  font-weight: bold;
  color: #10b981;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;
`;

const Dashboard: React.FC = () => {
  const { user, transactions } = useStore();

  // Mock data for charts
  const monthlyData = [
    { month: 'Jan', amount: 1200 },
    { month: 'Feb', amount: 1900 },
    { month: 'Mar', amount: 3000 },
    { month: 'Apr', amount: 2800 },
    { month: 'May', amount: 1890 },
    { month: 'Jun', amount: 2390 },
  ];

  const categoryData = [
    { name: 'Food & Dining', value: 35, color: '#667eea' },
    { name: 'Transportation', value: 25, color: '#764ba2' },
    { name: 'Services', value: 20, color: '#f093fb' },
    { name: 'Retail', value: 20, color: '#f5576c' },
  ];

  const recentTransactions = transactions.slice(0, 5);

  if (!user) {
    return (
      <DashboardContainer>
        <EmptyState>
          <h2>Welcome to ProofPay</h2>
          <p>Connect your wallet to start tracking your income</p>
        </EmptyState>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <WelcomeSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <WelcomeTitle>Welcome back, {user.name}!</WelcomeTitle>
        <WelcomeSubtitle>
          Track your verifiable income and build your financial identity
        </WelcomeSubtitle>
      </WelcomeSection>

      <StatsGrid>
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <StatIcon $color="#10b981">
            <DollarSign size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>${user.totalIncome.toLocaleString()}</StatValue>
            <StatLabel>Total Verified Income</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <StatIcon $color="#667eea">
            <Receipt size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>{user.transactionCount}</StatValue>
            <StatLabel>Verified Transactions</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <StatIcon $color="#f59e0b">
            <TrendingUp size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>+12.5%</StatValue>
            <StatLabel>Monthly Growth</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <StatIcon $color="#8b5cf6">
            <Clock size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>24h</StatValue>
            <StatLabel>Avg Verification Time</StatLabel>
          </StatContent>
        </StatCard>
      </StatsGrid>

      <ChartsSection>
        <ChartCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <ChartTitle>Monthly Income Trend</ChartTitle>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, 'Income']} />
              <Bar dataKey="amount" fill="#667eea" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <ChartTitle>Spending Categories</ChartTitle>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </ChartsSection>

      <RecentTransactions
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <ChartTitle>Recent Transactions</ChartTitle>
        {recentTransactions.length > 0 ? (
          recentTransactions.map((transaction) => (
            <TransactionItem key={transaction.id}>
              <TransactionIcon $verified={transaction.verified}>
                {transaction.verified ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              </TransactionIcon>
              <TransactionDetails>
                <TransactionMerchant>{transaction.merchant}</TransactionMerchant>
                <TransactionDate>
                  {format(transaction.timestamp, 'MMM dd, yyyy')}
                </TransactionDate>
              </TransactionDetails>
              <TransactionAmount>
                ${transaction.amount.toLocaleString()}
              </TransactionAmount>
            </TransactionItem>
          ))
        ) : (
          <EmptyState>
            <p>No transactions yet. Upload your first receipt to get started!</p>
          </EmptyState>
        )}
      </RecentTransactions>
    </DashboardContainer>
  );
};

export default Dashboard;
