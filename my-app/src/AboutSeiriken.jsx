import './AboutSeiriken.css';
import { Link } from 'react-router-dom';

function AboutSeiriken() {
    return (
        <div className='about-seiriken-con'>
            <h2>整理券配布について</h2>
            <p>　記念祭をより快適にお楽しみ頂くため、一部のクラス企画では整理券制度を導入しております。</p>
            <br/>
            <img src="/pictures/整理券example.png" className='seiriken-image'/>
            <p>　整理券の配布時間はα・βの2 パターンが存在し、2時間周期で配布が行われます。配布開始から二時間先の開始分までの整理券が配布されます。配布時刻の詳細と各クラスがどの配布パターンに該当するかは下図をご覧ください。</p>
            <p>なお、土曜・日曜ともに学校開場直後の公演のみ先着順となります。整理券配布は初回公演の入場が終了してから行われます。</p>
            <p>クラス前で待機することが可能になるのは、整理券に記載されている上演開始時刻の<span className='underline bold'>10分前</span>からです。</p>
            <Link className="button" to="/search">クラス企画の詳細はこちら</Link>
        </div>
    );
};

export default AboutSeiriken;