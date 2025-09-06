import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { useNavigate } from 'react-router-dom';

function ReadQR() {
  const navigate = useNavigate();
  const [scanned, setScanned] = useState(false); // すでに読み取ったかどうか

  const handleResult = (result) => {
    if (!result) return;
    // 再実行は防止
    if (!scanned) { 
      setScanned(true);
      const text = result?.text;
      navigate('/analyzeqr', { state: { qrData: text } });
    }
    
  };

  return (
    <div className="readqr-container">
      <QrReader
        constraints={{ facingMode: 'environment' }}
        onResult={handleResult}
        style={{ width: '100%' }}
      />
    </div>
  );
}

export default ReadQR;
