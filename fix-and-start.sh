#!/bin/bash

echo "🔧 Fixing ProofPay Frontend Issues"
echo "=================================="
echo ""

echo "📦 Installing all dependencies..."
npm install

echo ""
echo "🔍 Checking for missing types..."
npm install --save-dev @types/react @types/react-dom @types/node

echo ""
echo "✅ Dependencies installed successfully!"
echo ""
echo "🚀 Starting development server..."
echo "🌐 Open your browser to: http://localhost:3000"
echo ""
echo "✨ New Algorand Integration Features:"
echo "   • Real Pera Wallet connection"
echo "   • MyAlgo Wallet support"
echo "   • Live balance display"
echo "   • Blockchain transaction recording"
echo "   • Real receipt verification"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm start
