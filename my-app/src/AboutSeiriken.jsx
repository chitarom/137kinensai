import './AboutSeiriken.css';
import { Link } from 'react-router-dom';

function AboutSeiriken () {
    return (
        <div className='about-seiriken-con'>
            <h2>整理券配布について</h2>
            <p>　記念祭をより快適にお楽しみいただくため、一部のクラス企画では<span className="bold">整理券制度を導入しております</span>。</p>
            <p>また、指定された企画でのみ利用が可能です。雑な扱いはやめましょう。
            <br />　各企画にて、整理券の配布される時間は決まっております。</p>
            <Link className="button" to="/search">クラス企画の詳細はこちら</Link>
        </div>
    );
};

export default AboutSeiriken;