import './AnalyzeQR.css'
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import jsQR from 'jsqr'

function AnalyzeQR() {
  const location = useLocation();
  const imageURL = location.state?.image || null;
  const [qrText, setQrText] = useState("読み取り中...");
  const [resultText, setResultText] = useState(""); // QR文字列を加工した結果

  useEffect(() => {
    if (!imageURL) return;

    const img = new Image();
    img.src = imageURL;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        setQrText(code.data); // QRコードから文字列を取得
      } else {
        setQrText("QRコードが見つかりませんでした");
      }
    };

  }, [imageURL]);

// QR文字列に応じた処理
  useEffect(() => {
    if (!qrText || qrText === "読み取り中..." || qrText === "QRコードが見つかりませんでした") {
      setResultText("");
      return;
    }

    // qrTextは、「1 Hello,World endqr」等の形式を想定
    const parts = qrText.split(" ");
    if (
      parts.length !== 3 ||
      isNaN(parts[0]) || // 先頭が数字か
      parts[2] !== "endqr"
    ) {
      setResultText("誤ったQRコードです");
      return;
    }

    // 処理例
    const num = parseInt(parts[0], 10) + 1;
    const T = parts[1];
    const N = Math.min(num, T.length);
    setResultText(T.slice(0, N));
  }, [qrText]);


  return (
    <div className="analyzer-container">
      {/*<h2>QRコード解析</h2>*/}
      {/*imageURL && <img src={imageURL} alt="QR画像" style={{ maxWidth: '300px', marginTop: '10px' }} />*/}
      {/*<h2>QR解析状態:</h2>*/}
      {/*<p>{qrText}</p>*/}
      
      <h2>処理結果:</h2>
      <p>{resultText}</p>
    </div>
  );
}

export default AnalyzeQR;
