import './Header.css'
import logo from './pictures/logo.png';
import hamburger from './pictures/hamburger.svg'
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
                <div className="app-title">
                    <img src={logo} alt="ロゴ" width="64" height="64" />
                    <h2>記念祭</h2>
                </div>
                {/* <h3>あと<span>{limitDays}</span>日</h3> */}
            </div>
            {displayHamburger &&
                (
                    <div className='hamburger-menu'>
                        <a className='hamberger-menu-tab' href='./Login'>管理者用</a>
                        <a className='hamberger-menu-tab' href='./Login'>管理者用</a>
                    </div>
                )
            }
        </div>

    )
}

export default Header;

