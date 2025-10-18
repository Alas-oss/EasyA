import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Upload as UploadIcon, Camera, FileText, X, CheckCircle, AlertCircle, Loader, QrCode } from 'lucide-react';
import toast from 'react-hot-toast';
import { useStore } from '../store/store';
import { useWallet } from '../contexts/WalletContext';
import { v4 as uuidv4 } from 'uuid';
import QRScanner from '../components/QRScanner';
import QRCodeTester from '../components/QRCodeTester';

const UploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const UploadCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const UploadTitle = styled.h2`
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 1rem;
`;

const UploadSubtitle = styled.p`
  color: #666;
  margin-bottom: 2rem;
`;

const UploadMethods = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const UploadMethod = styled.button<{ $active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem;
  background: ${props => props.$active ? '#667eea' : 'rgba(102, 126, 234, 0.1)'};
  color: ${props => props.$active ? 'white' : '#667eea'};
  border: 2px solid ${props => props.$active ? '#667eea' : 'transparent'};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.$active ? '#5a6fd8' : 'rgba(102, 126, 234, 0.2)'};
  }
`;

const Dropzone = styled.div<{ $isDragActive: boolean; $isDragReject: boolean }>`
  border: 2px dashed ${props => 
    props.$isDragReject ? '#ef4444' : 
    props.$isDragActive ? '#667eea' : '#d1d5db'
  };
  border-radius: 12px;
  padding: 3rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => 
    props.$isDragReject ? 'rgba(239, 68, 68, 0.1)' : 
    props.$isDragActive ? 'rgba(102, 126, 234, 0.1)' : 'transparent'
  };
  
  &:hover {
    border-color: #667eea;
    background: rgba(102, 126, 234, 0.05);
  }
`;

const DropzoneContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const DropzoneIcon = styled.div<{ $color: string }>`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${props => props.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const DropzoneText = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
`;

const DropzoneSubtext = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: #333;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const SubmitButton = styled.button<{ $loading: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: ${props => props.$loading ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.$loading ? 0.7 : 1};
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: #5a6fd8;
  }
`;

const PreviewSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PreviewImage = styled.img`
  max-width: 100%;
  max-height: 300px;
  border-radius: 8px;
  object-fit: contain;
`;

const StatusCard = styled(motion.div)<{ $status: 'success' | 'error' | 'loading' }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: ${props => 
    props.$status === 'success' ? 'rgba(16, 185, 129, 0.1)' :
    props.$status === 'error' ? 'rgba(239, 68, 68, 0.1)' :
    'rgba(59, 130, 246, 0.1)'
  };
  border: 1px solid ${props => 
    props.$status === 'success' ? '#10b981' :
    props.$status === 'error' ? '#ef4444' :
    '#3b82f6'
  };
  border-radius: 8px;
  color: ${props => 
    props.$status === 'success' ? '#10b981' :
    props.$status === 'error' ? '#ef4444' :
    '#3b82f6'
  };
`;

const Upload: React.FC = () => {
  const [uploadMethod, setUploadMethod] = useState<'file' | 'camera' | 'qr'>('file');
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'USD',
    merchant: '',
    description: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error' | 'loading'>('idle');
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [qrData, setQrData] = useState<string | null>(null);
  
  const { addTransaction } = useStore();
  const { isConnected, createReceiptTransaction } = useWallet();

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    if (rejectedFiles.length > 0) {
      toast.error('Please upload a valid image file');
      return;
    }
    
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
      toast.success('File selected successfully');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    if (!selectedFile && !qrData) {
      toast.error('Please upload a file or scan a QR code');
      return;
    }

    if (!formData.amount || !formData.merchant) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsUploading(true);
    setUploadStatus('loading');

    try {
      // Step 1: Simulate AI verification process
      toast('Verifying receipt with AI...', { icon: 'ℹ️' });
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock verification - in real app, this would call AI verification API
      const isVerified = Math.random() > 0.1; // 90% success rate for demo
      
      if (isVerified) {
        // Step 2: Create receipt hash (in real app, this would be generated from the image)
        const receiptHash = `receipt_${uuidv4()}_${Date.now()}`;
        
        // Step 3: Record on blockchain
        toast('Recording receipt on Algorand blockchain...', { icon: '⛓️' });
        const blockchainHash = await createReceiptTransaction(receiptHash);
        
        const newTransaction = {
          id: uuidv4(),
          amount: parseFloat(formData.amount),
          currency: formData.currency,
          merchant: formData.merchant,
          description: formData.description,
          timestamp: new Date(),
          hash: blockchainHash,
          verified: true,
          imageUrl: selectedFile ? URL.createObjectURL(selectedFile) : undefined,
          qrData: qrData || undefined,
        };

        addTransaction(newTransaction);
        setUploadStatus('success');
        toast.success('Receipt verified and recorded on blockchain!');
        
        // Reset form
        setFormData({
          amount: '',
          currency: 'USD',
          merchant: '',
          description: '',
        });
        setSelectedFile(null);
        setQrData(null);
      } else {
        setUploadStatus('error');
        toast.error('Receipt verification failed. Please try again.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
      toast.error('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCameraCapture = () => {
    // In a real app, this would open camera
    toast('Camera functionality would be implemented here', { icon: '📷' });
  };

  const handleQRScan = (data: string) => {
    setQrData(data);
    setIsQRScannerOpen(false);
    
    // Try to parse QR data as JSON (common format for receipt QR codes)
    try {
      const parsedData = JSON.parse(data);
      if (parsedData.amount) {
        setFormData(prev => ({
          ...prev,
          amount: parsedData.amount.toString(),
          merchant: parsedData.merchant || prev.merchant,
          description: parsedData.description || prev.description,
        }));
        toast.success('Receipt data extracted from QR code!');
      }
    } catch (error) {
      // If not JSON, treat as plain text
      toast.success('QR code scanned successfully!');
    }
  };

  const handleOpenQRScanner = () => {
    setIsQRScannerOpen(true);
  };

  return (
    <UploadContainer>
      <QRCodeTester />
      
      <UploadCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <UploadTitle>Upload Receipt</UploadTitle>
        <UploadSubtitle>
          Convert your cash transactions into verifiable blockchain records
        </UploadSubtitle>

        <UploadMethods>
          <UploadMethod
            $active={uploadMethod === 'file'}
            onClick={() => setUploadMethod('file')}
          >
            <FileText size={32} />
            <span>Upload File</span>
          </UploadMethod>
          <UploadMethod
            $active={uploadMethod === 'camera'}
            onClick={() => setUploadMethod('camera')}
          >
            <Camera size={32} />
            <span>Take Photo</span>
          </UploadMethod>
          <UploadMethod
            $active={uploadMethod === 'qr'}
            onClick={() => setUploadMethod('qr')}
          >
            <QrCode size={32} />
            <span>Scan QR Code</span>
          </UploadMethod>
        </UploadMethods>

        {uploadMethod === 'file' ? (
          <Dropzone
            {...getRootProps()}
            $isDragActive={isDragActive}
            $isDragReject={isDragReject}
          >
            <input {...getInputProps()} />
            <DropzoneContent>
              <DropzoneIcon $color={isDragReject ? '#ef4444' : '#667eea'}>
                <UploadIcon size={32} />
              </DropzoneIcon>
              <DropzoneText>
                {isDragActive ? 'Drop the file here' : 'Drag & drop your receipt here'}
              </DropzoneText>
              <DropzoneSubtext>
                or click to select a file (JPG, PNG, GIF, WebP)
              </DropzoneSubtext>
            </DropzoneContent>
          </Dropzone>
        ) : uploadMethod === 'camera' ? (
          <Dropzone
            onClick={handleCameraCapture}
            $isDragActive={false}
            $isDragReject={false}
          >
            <DropzoneContent>
              <DropzoneIcon $color="#667eea">
                <Camera size={32} />
              </DropzoneIcon>
              <DropzoneText>Take a photo of your receipt</DropzoneText>
              <DropzoneSubtext>Click to open camera</DropzoneSubtext>
            </DropzoneContent>
          </Dropzone>
        ) : (
          <Dropzone
            onClick={handleOpenQRScanner}
            $isDragActive={false}
            $isDragReject={false}
          >
            <DropzoneContent>
              <DropzoneIcon $color="#667eea">
                <QrCode size={32} />
              </DropzoneIcon>
              <DropzoneText>Scan QR code on receipt</DropzoneText>
              <DropzoneSubtext>Click to open QR scanner</DropzoneSubtext>
            </DropzoneContent>
          </Dropzone>
        )}

        {selectedFile && (
          <PreviewSection>
            <Label>Preview</Label>
            <PreviewImage src={URL.createObjectURL(selectedFile)} alt="Receipt preview" />
          </PreviewSection>
        )}

        {qrData && (
          <PreviewSection>
            <Label>QR Code Data</Label>
            <div style={{ 
              background: 'rgba(102, 126, 234, 0.1)', 
              padding: '1rem', 
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              wordBreak: 'break-all',
              color: '#667eea'
            }}>
              {qrData}
            </div>
          </PreviewSection>
        )}

        <form onSubmit={handleSubmit}>
          <FormSection>
            <FormRow>
              <FormGroup>
                <Label htmlFor="amount">Amount *</Label>
                <Input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="currency">Currency</Label>
                <Input
                  type="text"
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  placeholder="USD"
                />
              </FormGroup>
            </FormRow>

            <FormGroup>
              <Label htmlFor="merchant">Merchant *</Label>
              <Input
                type="text"
                id="merchant"
                name="merchant"
                value={formData.merchant}
                onChange={handleInputChange}
                placeholder="Store or business name"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="description">Description</Label>
              <TextArea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Additional details about the transaction"
              />
            </FormGroup>

            <SubmitButton type="submit" $loading={isUploading} disabled={isUploading}>
              {isUploading ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  Verifying Receipt...
                </>
              ) : (
                <>
                  <UploadIcon size={20} />
                  Upload & Verify Receipt
                </>
              )}
            </SubmitButton>
          </FormSection>
        </form>

        <AnimatePresence>
          {uploadStatus !== 'idle' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <StatusCard $status={uploadStatus}>
                {uploadStatus === 'loading' && <Loader size={20} className="animate-spin" />}
                {uploadStatus === 'success' && <CheckCircle size={20} />}
                {uploadStatus === 'error' && <AlertCircle size={20} />}
                <div>
                  {uploadStatus === 'loading' && 'Verifying receipt with AI...'}
                  {uploadStatus === 'success' && 'Receipt verified and recorded on blockchain!'}
                  {uploadStatus === 'error' && 'Verification failed. Please try again.'}
                </div>
              </StatusCard>
            </motion.div>
          )}
        </AnimatePresence>
      </UploadCard>
      
      <QRScanner
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
        onScan={handleQRScan}
      />
    </UploadContainer>
  );
};

export default Upload;
