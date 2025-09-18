import './AboutFood.css'
import { Link } from 'react-router-dom'

function AboutFood() {
    return (
        <div className="about-food-con">
            <h2>お食事について</h2>
            <p>　校内に<span className="bold">食事を持参することはできません</span>。また、指定された飲食スペースでのみ食事が可能です。講堂やクラス内での食事はお控えください。
            <br />　模擬店や食堂にて、軽食・昼食の販売もございます。</p>
            <Link className="button" to="/">模擬店ページはこちら</Link>
        </div>

    )


}
export default AboutFood