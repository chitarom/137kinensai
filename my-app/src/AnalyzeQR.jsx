import React from 'react';
import { useLocation } from 'react-router-dom';

function AnalyzeQR() {
  const location = useLocation();
  const qrData = location.state?.qrData || "データがありません";

  return (
    <div className="analyzer-container">
      <h2>QRコード解析</h2>
      <p>読み取ったデータ: {qrData}</p>
      {/* ここで qrData を解析する処理を追加 */}
    </div>
  );
}

export default AnalyzeQR;
