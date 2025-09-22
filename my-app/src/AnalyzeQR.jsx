import './AnalyzeQR.css';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function AnalyzeQR() {
  const location = useLocation();
  const navigate = useNavigate();
  const cameFromApp = location.state?.qrData !== undefined; // ←これが重要
  const qrText = cameFromApp ? location.state.qrData : "";
  const [resultText, setResultText] = useState("");
  const [funcNum, setFuncNum] = useState(-1);

  // アプリ内から来た場合の処理
  useEffect(() => {
    if (!cameFromApp) return;

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

    const num = parseInt(parts[0]);
    const str = parts[1];
    setFuncNum(num);
    setResultText(str);
  }, [cameFromApp, qrText]);

  // URLから直接来た場合の処理
  useEffect(() => {
    if (cameFromApp) return; // ←アプリから来たならURL解析はスキップ

    const params = new URLSearchParams(location.search);
    const codeParam = params.get("code");

    if (!codeParam) {
      setResultText("QRコードが見つかりません");
      return;
    }

    try {
      const decoded = decodeURIComponent(codeParam);
      const parts = decoded.split("|");

      const type1 = (parts.length === 3 && parts[2] === "endqr" && (parts[0] === "1" || parts[0] === "2")); // 1|map.at_番号|endqr
      const type2 = (parts.length === 5 && parts[4] === "endqr" && (parts[0] === "1" || parts[0] === "2")); // 2|1|68.003,55.352|0|endqr
      if (!type1 && !type2) {
        setResultText("このQRコードは対応していません");
        return;
      }
      // 解析成功
      // 同じ形式
      const num = parseInt(parts[0]);
      const result = type2 ? `${parts[1]}|${parts[2]}|${parts[3]}` : parts[1];

      setFuncNum(num);
      setResultText(result);
    } catch (err) {
      console.error("解析エラー:", err);
      setResultText("QRコードの解析中にエラーが発生しました");
    }
  }, [location.search, cameFromApp]);


  // funcNum によるmapへの遷移処理（共通）
  useEffect(() => {
    if (funcNum !== 1 && funcNum !== 2) return;

    setFuncNum(-1);
    if (funcNum == 1) {
      if (localStorage.getItem("pictures") == null) localStorage.setItem("pictures", "[]");
      const pictures = JSON.parse(localStorage.getItem("pictures"));
      if (pictures.indexOf(resultText) != -1) {
        alert("このピースは既にゲットしています。");
        navigate("/passport");
      } else navigate("/map", { state: { "text": resultText, "num": funcNum } });
    } else if (funcNum == 2) {
      navigate("/map", { state: { "text": resultText, "num": funcNum } });
    }

    setFuncNum(-1); // 処理済みの印としてリセット
  }, [funcNum, navigate, resultText]);

  return (
    <div className="analyzer-container">
      {funcNum === -1 && (
        <button onClick={() => navigate("/")} className="back-home-button">
          ホームに戻る
        </button>
      )}
    </div>
  );
}

export default AnalyzeQR;

// URLの形式
// localhost → http://localhost:5173/analyzeqr?code=2%7C1%7C68.003%2C55.352%7C0%7Cendqr
// app.kinensai.jp → https://app.kinensai.jp/analyzeqr?code=2|1|68.003,55.352|0|endqr(現在地)
// app.kinensai.jp → https://app.kinensai.jp/analyzeqr?code=1|map.at_番号|endqr