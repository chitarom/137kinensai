import './ReadQR.css'
import React from "react";
import { useNavigate } from "react-router-dom";

function ReadQR() {
  const navigate = useNavigate();

  const handleCapture = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    // Fileを文字列などに変換してAnalyzeQRへ渡す
    const fileURL = URL.createObjectURL(file);
    // console.log(fileURL);
    navigate("/analyzeqr", { state: { image: fileURL } });
    
  };

  return (
    <div className="reader-container">
        <p className="pleaseread">QRコードを読み取ってください</p>
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleCapture}
      />
    </div>
  );
}

export default ReadQR;
