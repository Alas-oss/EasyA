// Demo QR code data generator for testing
// This creates sample QR codes that simulate real receipt data

export const generateDemoQRData = () => {
  const demoReceipts = [
    {
      amount: 25.50,
      merchant: "Coffee Corner",
      description: "Coffee and pastry",
      currency: "USD",
      timestamp: new Date().toISOString(),
      receiptId: "RCP-001-2024"
    },
    {
      amount: 89.99,
      merchant: "Tech Store Pro",
      description: "Mobile accessories",
      currency: "USD", 
      timestamp: new Date().toISOString(),
      receiptId: "RCP-002-2024"
    },
    {
      amount: 45.75,
      merchant: "Fresh Market",
      description: "Groceries - vegetables",
      currency: "USD",
      timestamp: new Date().toISOString(),
      receiptId: "RCP-003-2024"
    },
    {
      amount: 12.00,
      merchant: "Metro Transit",
      description: "Bus fare",
      currency: "USD",
      timestamp: new Date().toISOString(),
      receiptId: "RCP-004-2024"
    }
  ];

  const randomReceipt = demoReceipts[Math.floor(Math.random() * demoReceipts.length)];
  return JSON.stringify(randomReceipt);
};

export const generateSimpleQRData = () => {
  const simpleData = [
    "Receipt: $25.50 - Coffee Corner",
    "Receipt: $89.99 - Tech Store Pro", 
    "Receipt: $45.75 - Fresh Market",
    "Receipt: $12.00 - Metro Transit",
    "https://receipt.example.com/verify/abc123",
    "Receipt ID: RCP-001-2024 Amount: $25.50"
  ];
  
  return simpleData[Math.floor(Math.random() * simpleData.length)];
};

// QR code patterns for different receipt types
export const QR_PATTERNS = {
  JSON_RECEIPT: generateDemoQRData,
  SIMPLE_TEXT: generateSimpleQRData,
  URL_RECEIPT: () => `https://receipt.example.com/verify/${Math.random().toString(36).substr(2, 9)}`,
  PLAIN_TEXT: () => `Receipt ${Math.random().toString(36).substr(2, 6)} - $${(Math.random() * 100).toFixed(2)}`
};
