import './Info.css';
function Info() {
    return (
        <div className='info-wrapper'>
            <div className="info About-ReadQR">
                <h2 className='title'>{"◎カメラのアクセスについて"}</h2>
                <p className='passage'>{
                    "許可の手順:\n" +
                    "①ブラウザ右上または右下の「︙」や「≡」→ [設定]をタップ\n" +
                    "②設定一覧にある [サイトの設定]や[Webサイト]、[サイトのアクセス許可]→[カメラ] へ移動\n" +
                    "③「ブロックリスト」の https://app.kinensai.jpをタップして、「許可する」を選択\n\n" +
                    "それでもうまくいかない場合(iOS + Safari):\n" +
                    "④スマホの [設定] を開き、下にスクロールして[Safari] をタップ\n" +
                    "⑤WEBサイトの設定→[カメラ] へ移動\n" +
                    "⑥カメラへのアクセスを許可、を選択\n\n" +
                    "それでもうまくいかない場合(Android)\n" +
                    "④スマホの[設定]の検索で、現在お使いのアプリを検索(Chromeなど)\n" +
                    "⑤アプリの情報の一覧にある、[権限]→[カメラ] へ移動\n" +
                    "⑥カメラへのアクセスを許可、を選択\n\n" +
                    "もしご不明な点がありましたら、お近くの東海生にお尋ねください。"
                }</p>
            </div>
        </div>
    );
};

export default Info;