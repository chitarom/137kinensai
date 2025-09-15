import './AnalyzeQR.css'
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function AnalyzeQR() {
  const location = useLocation();
  const navigate = useNavigate();
  const qrText = location.state?.qrData || "";
  const [resultText, setResultText] = useState("");
  const [funcNum, setfuncNum] = useState(-1);

  useEffect(() => {
    if (!qrText) {
      setResultText("QRコードを読み取っていません");
      return;
    }

    // qrTextは、「1 Hello,World endqr」等の形式を想定
    const parts = qrText.split(" ");
    if (
      parts.length !== 3 ||
      (parts[0] !== "1" && parts[0] !== "2") ||
      parts[2] !== "endqr"
    ) {
      setResultText("このQRコードは対応していません");
      return;
    }

    let num = parseInt(parts[0]);
    let str = parts[1];
    setfuncNum(num);
    setResultText(str);
  }, [qrText]);

  // QRの種類ごとに遷移
  useEffect(() => {
    if (funcNum !== 1 && funcNum !== 2) return;
    
    setfuncNum(-1);
    const pictures = JSON.parse(localStorage.getItem("pictures"));
    if (pictures.indexOf(resultText) != -1) {
      alert("このピースは既にゲットしています。");
    } else navigate("/map", { state: { "text":resultText, "num":funcNum } });

  }, [funcNum, navigate, resultText]);

  return (
    <div className="analyzer-container">
      {funcNum === -1 ? (
        <>
          <p>{resultText}</p>
          <button
            onClick={() => navigate("/")}
            className="back-home-button"
          >
            ホームに戻る
          </button>
        </>
      ) : (
        <></>
      )
      }
    </div>
  );
}

export default AnalyzeQR;

/*
1 ... マップ現在地関連機能
2 ... 絵の旅パスポート関連機能
*/
