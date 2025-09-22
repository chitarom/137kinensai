import './AboutSeiriken.css';
import { Link } from 'react-router-dom';

function AboutSeiriken() {
    return (
        <div className='about-seiriken-con'>
            <h1>整理券配布について</h1>
            <img src="/pictures/整理券について.webp" className='seiriken-image'/>
            <p>　整理券の配布時間は<span className='bold'>α・βの2パターン</span>があり、土曜日の場合、上図のように2時間周期で配布が行われます。</p>
            <p>　なお、土曜・日曜ともに学校開場直後の公演のみ先着順となります。</p>
            <p>　クラス前で待機することが可能になるのは、整理券に記載されている上演開始時刻の<span className='underline bold'>10分前</span>からです。</p>
            <br/>
            <p>　それぞれのクラス企画がどの整理券パターンかは、企画検索から確認いただけます。</p>
            <Link className="button" to="/search">企画の検索はこちら</Link>
        </div>
    );
};

export default AboutSeiriken;