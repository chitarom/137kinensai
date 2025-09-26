import './ReadQR.css'
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import jsQR from 'jsqr';


function ReadQR() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [scanning, setScanning] = useState(false); // 起動中かどうか
  const [stream, setStream] = useState(null); // カメラから取得した MediaStream を保持する状態
  const [errorMessage, setErrorMessage] = useState(""); // エラーメッセージ用
  const [showLink, setShowLink] = useState(false);

  // カメラを起動する
  const startCamera = () => {
    setErrorMessage(""); // 前回のエラーをクリア
    navigator.mediaDevices.getUserMedia({
      video: { facingMode: { exact: "environment" } } // 追加：背面カメラを指定
    })
      .then(s => {
        setStream(s);
        setScanning(true);
      })
      .catch(err => {
        // 背面カメラ指定で取得できない場合、フロントカメラを試す
        navigator.mediaDevices.getUserMedia({ video: true })
          .then(s => {
            setStream(s);
            setScanning(true);
          })
          .catch(err => {
            setScanning(false);
            setErrorMessage(
              "お願い:\n" +
              "QRコードの読み取りには、カメラへのアクセスを許可してください。\n"
            );
            setShowLink(true);
          });
      });
  };

  // video に stream をセットする
  useEffect(() => {
    if (scanning && stream && videoRef.current) {
      const video = videoRef.current;
      video.srcObject = stream;
      video.muted = true;
      video.playsInline = true;
      video.autoplay = true;
      video.play().catch(err => {
        // 権限が与えられなかった場合
        setScanning(false);
        setErrorMessage("カメラをうまく起動できませんでした。\nもう一度お試しください。\n");
      });

      // QRコード読み取り + 変換 (0.5sごとに行う)
      const interval = setInterval(() => {
        if (!videoRef.current || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (!code) return;
        console.log("QRコード検出:", code.data);
        clearInterval(interval); // 検出後は停止
        stream.getTracks().forEach(track => track.stop()); // カメラ停止
        if (videoRef.current) {
          videoRef.current.srcObject = null; // video要素をリセット
        }
        navigate("/analyzeqr", { state: { qrData: code.data } });

      }, 500);

      return () => {
        clearInterval(interval)
        // バグ回避
        if (stream) stream.getTracks().forEach(track => track.stop());
        if (videoRef.current) videoRef.current.srcObject = null;
      };
    }
  }, [scanning, stream, navigate]);

  return (
    <div className="reader-container">
      {!scanning ? (
        // スキャン前、失敗時も
        <>
          <button onClick={startCamera} className="qr-button">
            カメラを起動
          </button>
          {errorMessage && (
            <p
              className="error-message"
              style={{ whiteSpace: "pre-line" }}
            >{errorMessage}</p>
          )}
          <p className="readqr-exp">校内に掲示してある、「絵の旅パスポート（新天地企画）」と「ここどこ～ド（校内現在地機能）」のQRコードを読み取ることができます。</p>
          <div className="read-pass-con"><Link to="/passport" className="event passport"></Link></div>
          
          {showLink && false && (
            /*上のfalseを取るとリンク表示*/
              <Link to="/info" className='links'>やり方が分からない場合はこちら</Link>
          )}

        </>
      ) : (
        // スキャン中...
        <>
          <p className="pleaseread title">QRコード読み取り</p>
          <p className="pleaseread comment">QRコードをカメラにかざしてください</p>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="qr-video"
          />
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </>
      )}
      <button className="cancel-button" onClick={() => navigate('/')}>
        {scanning ? "閉じる" : "戻る"}
      </button>
    </div>
  );
}

export default ReadQR;



/* 以下、ChatGPTより

PCカメラでスマホQRコードを読み取るコツ

1. QRコードはできるだけ大きく表示
スマホ画面に表示する場合、QRコードのサイズは 画面の半分以上が理想です。
小さいとカメラがピントを合わせにくく、読み取りに失敗しやすいです。

2. カメラとスマホの距離
PCカメラは固定されていることが多いので、QRコードの端が切れない距離を保ちます。
目安はカメラから20〜30cmくらい。
遠すぎるとQRコードが小さくなり、近すぎるとフォーカスが合わず読み取り失敗。

3. 光の環境
明るめの環境で撮影すると読み取りが安定します。
画面の輝度を少し上げると、カメラで認識しやすくなります。
反射や指紋で画面がギラつくと失敗しやすいので、角度を少し調整する。

4. カメラの位置・角度
QRコードを 画面中央にまっすぐ映すようにします。
傾きや斜めからの撮影だと認識率が下がります。

5. 読み取り待ち時間
今のコードは 0.5秒ごとに画像を読み取り しています。
しばらく静止してカメラ映像が安定すると成功しやすいです。

6. 複数QRコードがある場合
画面上に一つだけ表示する方が認識が安定します。

補足:
PCカメラはスマホのカメラよりピント調整が遅いことが多いので、少し時間を置いてから読み取ると確実です。
「カメラの自動フォーカスが効かない場合は、スマホのQR表示を少し動かす」だけでも読み取り成功率が上がります。

*/