import './AboutSeiriken.css';
import { Link } from 'react-router-dom';

function AboutSeiriken () {
    return (
        <div className='about-seiriken-con'>
            <h2>整理券について</h2>
            <p>　校内で<span className="bold">整理券を勝手に作ってはいけません</span>。また、指定された企画でのみ利用が可能です。雑な扱いはやめましょう。
            <br />　各企画にて、整理券の配布される時間は決まっております。</p>
            <Link className="button" to="/search">クラス企画の詳細はこちら</Link>
        </div>
    );
};

export default AboutSeiriken;