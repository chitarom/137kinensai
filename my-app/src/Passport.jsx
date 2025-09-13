import './Passport.css'
import airplane from "/public/pictures/airplane.png"
import passport from "/public/pictures/passport.png"
import { useState } from 'react'
import { Link } from 'react-router-dom'
import scope from "/public/pictures/scope.png"
import camera from "/public/pictures/camera.png"
import giftpicture from "/public/pictures/giftpicture.png"

function Passport() {
    const [activeExplanation, setActiveExplanation] = useState(0)




    return (
        <div className="passport-con">
            <div className="title-con">
                <img src={airplane} alt="" />
                <h1>絵の旅パスポート</h1>
                <img src={passport} alt="" />
            </div>
            <div className="explanation-con">
                <button className="ex-button" onClick={() => setActiveExplanation(prev => (prev + 1) % 2)}>絵の旅パスポートとは？ <span className="oo8cff">{activeExplanation === 1 ? '▲' : '▼'}</span></button>
                {activeExplanation == 1 && <p>
                    校内のいろいろなところに貼ってある絵を探して、QRコードを読み取ってみよう！読み取った絵はコレクションに追加されるよ！6枚集めると、137th記念祭のオリジナル壁紙もらえる！
                </p>}
            </div>
            <div className="passport-menu">
                <Link to="/" className="pass-menu-button">
                    <img src={scope} alt="スコープアイコン" />
                    <h2>絵を探す</h2>
                </Link>
                <Link to="/readqr" className="pass-menu-button">
                    <img src={camera} alt="カメラ" />
                    <h2>QRコード</h2>
                </Link>
            </div>
            <div className="picture-puzzle">
                <h2>イラスト進捗</h2>
                <img src={giftpicture} alt="" />
            </div>
        </div>
    )

}

export default Passport;