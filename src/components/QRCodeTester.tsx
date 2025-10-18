import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { QrCode, Copy, CheckCircle } from 'lucide-react';
import { QR_PATTERNS } from '../utils/qrDemoData';
import toast from 'react-hot-toast';

const QRTestContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const QRTestTitle = styled.h3`
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const QRTestDescription = styled.p`
  color: #666;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
`;

const QRPatterns = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const QRPatternButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(102, 126, 234, 0.2);
    border-color: #667eea;
  }
`;

const QRDataDisplay = styled.div`
  background: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const QRDataText = styled.div`
  font-family: monospace;
  font-size: 0.8rem;
  color: #333;
  word-break: break-all;
  margin-bottom: 0.5rem;
`;

const CopyButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 1rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: background 0.2s ease;
  
  &:hover {
    background: #5a6fd8;
  }
`;

const QRTestInstructions = styled.div`
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
`;

const InstructionsTitle = styled.h4`
  color: #3b82f6;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const InstructionsList = styled.ul`
  color: #666;
  font-size: 0.8rem;
  margin: 0;
  padding-left: 1rem;
`;

const QRCodeTester: React.FC = () => {
  const [currentQRData, setCurrentQRData] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const generateQRData = (pattern: keyof typeof QR_PATTERNS) => {
    const data = QR_PATTERNS[pattern]();
    setCurrentQRData(data);
    toast.success('QR data generated!');
  };

  const copyToClipboard = async () => {
    if (currentQRData) {
      await navigator.clipboard.writeText(currentQRData);
      setCopied(true);
      toast.success('QR data copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <QRTestContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <QRTestTitle>
        <QrCode size={20} />
        QR Code Testing Tool
      </QRTestTitle>
      
      <QRTestDescription>
        Generate sample QR codes to test the scanner functionality. Click a pattern below to generate QR data.
      </QRTestDescription>

      <QRPatterns>
        <QRPatternButton onClick={() => generateQRData('JSON_RECEIPT')}>
          <QrCode size={24} />
          <span>JSON Receipt</span>
        </QRPatternButton>
        
        <QRPatternButton onClick={() => generateQRData('SIMPLE_TEXT')}>
          <QrCode size={24} />
          <span>Simple Text</span>
        </QRPatternButton>
        
        <QRPatternButton onClick={() => generateQRData('URL_RECEIPT')}>
          <QrCode size={24} />
          <span>URL Receipt</span>
        </QRPatternButton>
        
        <QRPatternButton onClick={() => generateQRData('PLAIN_TEXT')}>
          <QrCode size={24} />
          <span>Plain Text</span>
        </QRPatternButton>
      </QRPatterns>

      {currentQRData && (
        <QRDataDisplay>
          <QRDataText>{currentQRData}</QRDataText>
          <CopyButton onClick={copyToClipboard}>
            {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy QR Data'}
          </CopyButton>
        </QRDataDisplay>
      )}

      <QRTestInstructions>
        <InstructionsTitle>How to Test:</InstructionsTitle>
        <InstructionsList>
          <li>Generate QR data using the buttons above</li>
          <li>Copy the QR data to your clipboard</li>
          <li>Use an online QR code generator to create a QR code image</li>
          <li>Go to Upload page and select "Scan QR Code"</li>
          <li>Point your camera at the generated QR code</li>
        </InstructionsList>
      </QRTestInstructions>
    </QRTestContainer>
  );
};

export default QRCodeTester;
