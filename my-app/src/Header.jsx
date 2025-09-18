import './Header.css'
import { Link } from 'react-router-dom';
import logo from '/pictures/logo.png';
import hamburger from '/pictures/hamburger.svg'
import NewsBar from './NewsBar';
import { useState } from 'react';

function daysSinceNewYear() {
    const now = new Date(); // 今日
    const eventDay = new Date(now.getFullYear(), 8, 27); // 1月1日（0が1月）

    const diffMs = eventDay - now; // ミリ秒差
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)); // 日数に変換

    return diffDays;
}
const limitDays = daysSinceNewYear();

function Header() {
    const [displayHamburger, setDisplayHamburger] = useState(false);
    const toggleHamburger = () => {
        setDisplayHamburger(!displayHamburger);
    }
    return (
        <div className="header-con">
            <NewsBar />
            <div className="app-title-con">
                <button className="hamburger" onClick={toggleHamburger}>
                    {!displayHamburger && (<img src={hamburger} alt="" />)}
                    {displayHamburger && (<div>×</div>)}
                </button>
                <Link to="/" className="app-title">
                    <img src={logo} alt="ロゴ" width="64" height="64" />
                    <h2>記念祭</h2>
                </Link>
                {/* <h3>あと<span>{limitDays}</span>日</h3> */}
            </div>
            {displayHamburger &&
                (<div className="hamburger-attention-con" onClick={() => setDisplayHamburger(false)}>
                    <div className='hamburger-menu' onClick={(e) => e.stopPropagation()}>
                        {/* <Link to="/articlemenu" onClick={() => setDisplayHamburger(false)} className='hamburger-menu-tab'>ニュース・記事</Link> */}
                        <Link to="/passport" onClick={() => setDisplayHamburger(false)} className='hamburger-menu-tab'>絵の旅パスポート</Link>
                        <Link to="/shintenchi" onClick={() => setDisplayHamburger(false)} className='hamburger-menu-tab'>新天地</Link>
                        <Link to="/stagevote" onClick={() => setDisplayHamburger(false)} className='hamburger-menu-tab'>ステージ投票</Link>
                        <Link to="/kaijin" onClick={() => setDisplayHamburger(false)} className='hamburger-menu-tab'>海神</Link>
                        <Link to="/mogiten" onClick={() => setDisplayHamburger(false)} className='hamburger-menu-tab'>模擬店</Link>
                        <Link to="/pagelist" onClick={() => setDisplayHamburger(false)} className='hamburger-menu-tab'>ページ一覧</Link>
                        <Link to="/login" onClick={() => setDisplayHamburger(false)} className='hamburger-menu-tab'>管理者専用</Link>
                    </div>
                </div>
                )
            }
        </div>

    )
}

export default Header;

