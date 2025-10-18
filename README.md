# ProofPay Frontend

**Verifiable Receipts for the Global Informal Economy**

ProofPay converts every payment — cash or digital — into an on-chain, tamper-proof receipt that becomes part of a user's verifiable income record.

## 🚀 Features

- **Receipt Upload**: Drag-and-drop or camera capture for receipt images
- **AI Verification**: Automated verification of receipt authenticity
- **Blockchain Integration**: Algorand smart contract integration for on-chain storage
- **Income Dashboard**: Visual analytics of verified income streams
- **Transaction History**: Complete history of all verified transactions
- **User Profile**: Wallet management and privacy settings
- **Mobile Responsive**: Optimized for mobile and desktop devices

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Styled Components
- **State Management**: Zustand with persistence
- **Animations**: Framer Motion
- **Charts**: Recharts
- **File Upload**: React Dropzone
- **Notifications**: React Hot Toast
- **Icons**: Lucide React
- **Routing**: React Router DOM

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd proofpay-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Header.tsx      # Navigation header
├── pages/              # Main application pages
│   ├── Dashboard.tsx   # Income dashboard and analytics
│   ├── Upload.tsx      # Receipt upload functionality
│   ├── History.tsx     # Transaction history
│   └── Profile.tsx     # User profile and settings
├── store/              # State management
│   └── store.ts        # Zustand store configuration
├── App.tsx             # Main application component
├── index.tsx           # Application entry point
└── index.css           # Global styles
```

## 🎯 Key Components

### Dashboard
- Income analytics and trends
- Monthly income charts
- Spending category breakdown
- Recent transactions overview

### Upload
- Drag-and-drop file upload
- Camera capture support
- AI verification simulation
- Form validation and submission

### History
- Complete transaction history
- Search and filtering
- Pagination support
- Export functionality

### Profile
- User information management
- Privacy and security settings
- Account statistics
- Wallet connection status

## 🔧 Configuration

The application uses mock data for demonstration purposes. In a production environment, you would need to:

1. **Integrate with Algorand**: Connect to Algorand blockchain for real transaction storage
2. **AI Verification**: Implement actual AI/ML models for receipt verification
3. **Wallet Integration**: Connect with Algorand wallet providers (Pera, MyAlgo, etc.)
4. **Backend API**: Connect to backend services for data persistence

## 🚀 Deployment

To build the application for production:

```bash
npm run build
```

This creates a `build` folder with optimized production files ready for deployment.

## 📱 Mobile Support

The application is fully responsive and optimized for mobile devices with:
- Touch-friendly interfaces
- Mobile-first design approach
- Responsive grid layouts
- Optimized image handling

## 🔒 Privacy & Security

- Local data persistence with encryption
- Privacy mode for sensitive transactions
- Secure wallet integration
- Data export capabilities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🌟 About ProofPay

ProofPay addresses the challenge of financial inclusion in the informal economy by providing verifiable income records through blockchain technology. By converting cash transactions into tamper-proof receipts, users can build credit history and access formal financial services.

**Built with ❤️ for financial inclusion**
