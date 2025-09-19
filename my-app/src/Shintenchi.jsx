import "./Shintenchi.css"
import { Link } from "react-router-dom";

function Shintenchi() {
    return (
        <div className="shin-con">
            <div className="shin-title-con">
                <p>137th記念祭実行委員会企画</p>
                <h2>新天地</h2>
            </div>
            <div className="shin-exp-con">
                <h4>新天地とは？</h4>
                <p>ようこそ、新天地へ！ここは、今年の記念祭がより良いものとなるように願ってつくられた、私たちの新企画についてのページです！ぜひお楽しみください！</p>
            </div>
            <div className="shin-detail-con">
                <h2>①スタンプラリー</h2>
                <div className="shin-de-passage">
                    <h3>設置場所：<br />
                        事務室前・
                        講堂前(大回廊)・
                        4階中高連絡階段・
                        4階高校美術室前</h3>
                    <p>私達と一緒に、記念祭を旅してみませんか？校舎内各地におかれているスタンプを見つけ、全部集めよう！最後まで集めたら景品があります！諦めないで！</p>
                </div>
                <div className="shin-button-con">
                    <Link to="/map" className="shin-button">スタンプ設置場所を探す</Link>
                </div>
                <img src="/pictures/stamp.png" alt="" />
            </div>
            <div className="shin-detail-con right">
                <h2 className="green">②参加型立て看板</h2>
                <div className="shin-de-passage">
                    <h3>設置場所：ステージ横</h3>
                    <p>貼って、貼って、貼りまくれ！みんなで協力してまっさらな立て看板を彩ろう！一人一枚色紙を貼っていくと、絵画が出来上がっていきます！完成した時の絵画の全貌は、最後に貼り終えたもののみぞ知る…</p>
                </div>
                <img src="/pictures/greenmemo.png" alt="" />
            </div>
            <div className="shin-detail-con">
                <h2 className="red">③絵の旅パスポート</h2>
                <div className="shin-de-passage">
                    <h3>設置場所：高校校舎</h3>
                    <p>校内のいろいろなところに貼ってある絵を探して、QRコードを読み取ってみよう！読み取った絵はコレクションに追加されるよ！6枚集めると、137th記念祭のオリジナル壁紙がもらえる！</p>
                </div>
                <div className="shin-button-con"><Link to="/passport" className="shin-button">特設ページ</Link></div>
                <img src="/pictures/passportstamp.png" alt="" />
            </div>

        </div>
    )
}

export default Shintenchi;
