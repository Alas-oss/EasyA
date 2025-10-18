@echo off
echo 🚀 Starting ProofPay Frontend Development Server
echo ================================================
echo.
echo 📦 Installing dependencies...
call npm install

echo.
echo 🔧 Starting development server...
echo 🌐 Open your browser to: http://localhost:3000
echo.
echo ✨ Features available:
echo    • Upload receipts with drag-and-drop
echo    • View income dashboard with analytics
echo    • Browse transaction history
echo    • Manage user profile and settings
echo.
echo Press Ctrl+C to stop the server
echo.

call npm start
