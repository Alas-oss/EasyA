import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, CheckCircle, AlertCircle, RotateCcw } from 'lucide-react';
import QrScanner from 'qr-scanner';
import toast from 'react-hot-toast';

const ScannerContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ScannerContent = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
  aspect-ratio: 1;
  border-radius: 16px;
  overflow: hidden;
  background: #000;
`;

const VideoElement = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ScannerOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
`;

const ScannerFrame = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  border: 2px solid #667eea;
  border-radius: 12px;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
`;

const ScannerCorners = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    border: 3px solid #667eea;
  }
  
  &::before {
    top: -3px;
    left: -3px;
    border-right: none;
    border-bottom: none;
  }
  
  &::after {
    top: -3px;
    right: -3px;
    border-left: none;
    border-bottom: none;
  }
`;

const ScannerControls = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const ControlButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &.close {
    background: rgba(239, 68, 68, 0.9);
    color: white;
    
    &:hover {
      background: #ef4444;
    }
  }
  
  &.flip {
    background: rgba(255, 255, 255, 0.9);
    color: #333;
    
    &:hover {
      background: white;
    }
  }
`;

const ScannerInstructions = styled.div`
  position: absolute;
  top: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  text-align: center;
  backdrop-filter: blur(10px);
`;

const ScannerTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

const ScannerSubtitle = styled.p`
  font-size: 0.9rem;
  opacity: 0.8;
`;

const ResultModal = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  max-width: 400px;
  width: 90%;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
`;

const ResultIcon = styled.div<{ $success: boolean }>`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${props => props.$success ? '#10b981' : '#ef4444'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin: 0 auto 1rem;
`;

const ResultTitle = styled.h3`
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 0.5rem;
`;

const ResultText = styled.p`
  color: #666;
  margin-bottom: 1.5rem;
  word-break: break-all;
`;

const ResultActions = styled.div`
  display: flex;
  gap: 1rem;
`;

const ActionButton = styled.button<{ $primary?: boolean }>`
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  
  ${props => props.$primary ? `
    background: #667eea;
    color: white;
    
    &:hover {
      background: #5a6fd8;
    }
  ` : `
    background: transparent;
    color: #666;
    border: 1px solid #d1d5db;
    
    &:hover {
      background: rgba(102, 126, 234, 0.1);
      color: #667eea;
      border-color: #667eea;
    }
  `}
`;

interface QRScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (data: string) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ isOpen, onClose, onScan }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    if (isOpen) {
      startScanner();
    } else {
      stopScanner();
    }

    return () => {
      stopScanner();
    };
  }, [isOpen]);

  const startScanner = async () => {
    if (!videoRef.current) return;

    try {
      // Check camera permissions
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode } 
      });
      setHasPermission(true);
      stream.getTracks().forEach(track => track.stop());

      scannerRef.current = new QrScanner(
        videoRef.current,
        (result) => {
          handleScan(result.data);
        },
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
          preferredCamera: facingMode,
        }
      );

      await scannerRef.current.start();
      setIsScanning(true);
    } catch (error) {
      console.error('Camera access failed:', error);
      setHasPermission(false);
      toast.error('Camera access denied. Please enable camera permissions.');
    }
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.stop();
      scannerRef.current.destroy();
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  const handleScan = (data: string) => {
    setScannedData(data);
    stopScanner();
    toast.success('QR Code detected!');
  };

  const handleConfirmScan = () => {
    if (scannedData) {
      onScan(scannedData);
      onClose();
    }
  };

  const handleRetryScan = () => {
    setScannedData(null);
    startScanner();
  };

  const toggleCamera = () => {
    const newFacingMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(newFacingMode);
    stopScanner();
    setTimeout(() => {
      startScanner();
    }, 100);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <ScannerContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ScannerInstructions>
          <ScannerTitle>Scan Receipt QR Code</ScannerTitle>
          <ScannerSubtitle>
            Position the QR code within the frame to scan
          </ScannerSubtitle>
        </ScannerInstructions>

        <ScannerContent>
          <VideoElement ref={videoRef} />
          
          <ScannerOverlay>
            <ScannerFrame>
              <ScannerCorners />
            </ScannerFrame>
          </ScannerOverlay>

          <ScannerControls>
            <ControlButton className="flip" onClick={toggleCamera}>
              <RotateCcw size={20} />
            </ControlButton>
            <ControlButton className="close" onClick={onClose}>
              <X size={20} />
            </ControlButton>
          </ScannerControls>
        </ScannerContent>

        {scannedData && (
          <ResultModal
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ResultIcon $success={true}>
              <CheckCircle size={30} />
            </ResultIcon>
            
            <ResultTitle>QR Code Detected!</ResultTitle>
            
            <ResultText>
              {scannedData.length > 100 
                ? `${scannedData.substring(0, 100)}...` 
                : scannedData
              }
            </ResultText>
            
            <ResultActions>
              <ActionButton onClick={handleRetryScan}>
                Scan Again
              </ActionButton>
              <ActionButton $primary onClick={handleConfirmScan}>
                Use This Data
              </ActionButton>
            </ResultActions>
          </ResultModal>
        )}

        {hasPermission === false && (
          <ResultModal
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <ResultIcon $success={false}>
              <AlertCircle size={30} />
            </ResultIcon>
            
            <ResultTitle>Camera Access Required</ResultTitle>
            
            <ResultText>
              Please enable camera permissions to scan QR codes.
            </ResultText>
            
            <ResultActions>
              <ActionButton onClick={onClose}>
                Close
              </ActionButton>
            </ResultActions>
          </ResultModal>
        )}
      </ScannerContainer>
    </AnimatePresence>
  );
};

export default QRScanner;
