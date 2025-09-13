import './AnalyzeQR.css'
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function AnalyzeQR() {
  const location = useLocation();
  const qrText = location.state?.qrData || "";
  const [resultText, setResultText] = useState(""); // QR文字列を加工した結果

  // QR文字列に応じた処理
  useEffect(() => {
    if (!qrText) {
      setResultText("QRコードを読み取っていません");
      return;
    }

    // qrTextは、「1 Hello,World endqr」等の形式を想定
    const parts = qrText.split(" ");
    if (
      parts.length !== 3 ||
      isNaN(parts[0]) || // 先頭が数字か
      parts[2] !== "endqr"
    ) {
      setResultText(parts[1], "誤ったQRコードです");
      return;
    }

    // 処理例
    const T = parts[1];
    setResultText(T);
  }, [qrText]);

  return (
    <div className="analyzer-container">
      <h2>処理結果:</h2>
      <p>{resultText}</p>
    </div>
  );
}

export default AnalyzeQR;
