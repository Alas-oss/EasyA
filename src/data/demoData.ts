// Demo data for ProofPay application
// This file contains sample transactions and user data for demonstration purposes

export const demoTransactions = [
  {
    id: '1',
    amount: 45.50,
    currency: 'USD',
    merchant: 'Fresh Market',
    description: 'Groceries - vegetables and fruits',
    timestamp: new Date('2024-01-15T10:30:00'),
    hash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
    verified: true,
    imageUrl: '/demo-receipt-1.jpg'
  },
  {
    id: '2',
    amount: 12.75,
    currency: 'USD',
    merchant: 'Metro Transit',
    description: 'Bus fare - downtown route',
    timestamp: new Date('2024-01-14T08:15:00'),
    hash: '0x2b3c4d5e6f7890abcdef1234567890abcdef1234',
    verified: true,
    imageUrl: '/demo-receipt-2.jpg'
  },
  {
    id: '3',
    amount: 89.99,
    currency: 'USD',
    merchant: 'Tech Store Pro',
    description: 'Mobile phone accessories',
    timestamp: new Date('2024-01-13T16:45:00'),
    hash: '0x3c4d5e6f7890abcdef1234567890abcdef123456',
    verified: true,
    imageUrl: '/demo-receipt-3.jpg'
  },
  {
    id: '4',
    amount: 25.00,
    currency: 'USD',
    merchant: 'Coffee Corner',
    description: 'Coffee and pastries for team meeting',
    timestamp: new Date('2024-01-12T14:20:00'),
    hash: '0x4d5e6f7890abcdef1234567890abcdef12345678',
    verified: true,
    imageUrl: '/demo-receipt-4.jpg'
  },
  {
    id: '5',
    amount: 150.00,
    currency: 'USD',
    merchant: 'Freelance Design Work',
    description: 'Logo design project - Client ABC',
    timestamp: new Date('2024-01-11T12:00:00'),
    hash: '0x5e6f7890abcdef1234567890abcdef1234567890',
    verified: true,
    imageUrl: '/demo-receipt-5.jpg'
  },
  {
    id: '6',
    amount: 67.50,
    currency: 'USD',
    merchant: 'Gas Station Plus',
    description: 'Fuel and car wash',
    timestamp: new Date('2024-01-10T18:30:00'),
    hash: '0x6f7890abcdef1234567890abcdef1234567890ab',
    verified: false,
    imageUrl: '/demo-receipt-6.jpg'
  },
  {
    id: '7',
    amount: 33.25,
    currency: 'USD',
    merchant: 'Pharmacy Express',
    description: 'Prescription medication',
    timestamp: new Date('2024-01-09T11:15:00'),
    hash: '0x7890abcdef1234567890abcdef1234567890abcd',
    verified: true,
    imageUrl: '/demo-receipt-7.jpg'
  },
  {
    id: '8',
    amount: 200.00,
    currency: 'USD',
    merchant: 'Tutoring Services',
    description: 'Math tutoring sessions - 4 hours',
    timestamp: new Date('2024-01-08T15:00:00'),
    hash: '0x890abcdef1234567890abcdef1234567890abcde',
    verified: true,
    imageUrl: '/demo-receipt-8.jpg'
  }
];

export const demoUser = {
  walletAddress: 'ALGO1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  name: 'Maria Rodriguez',
  email: 'maria.rodriguez@example.com',
  totalIncome: 625.99,
  transactionCount: 8
};

export const demoStats = {
  totalTransactions: 8,
  verifiedTransactions: 7,
  pendingTransactions: 1,
  totalAmount: 625.99,
  monthlyAmount: 625.99,
  verificationRate: 87.5,
  averageTransaction: 78.25
};

export const demoCategories = [
  { name: 'Food & Dining', value: 35, color: '#667eea' },
  { name: 'Transportation', value: 25, color: '#764ba2' },
  { name: 'Services', value: 20, color: '#f093fb' },
  { name: 'Healthcare', value: 10, color: '#f5576c' },
  { name: 'Other', value: 10, color: '#4ecdc4' }
];

export const demoMonthlyData = [
  { month: 'Jan', amount: 625.99 },
  { month: 'Feb', amount: 0 },
  { month: 'Mar', amount: 0 },
  { month: 'Apr', amount: 0 },
  { month: 'May', amount: 0 },
  { month: 'Jun', amount: 0 }
];
