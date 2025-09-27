import './Home.css';
import React from 'react';
import { Link } from 'react-router-dom';
import NewsSlider from './NewSlider';
import search from '/pictures/search.png'
import foodHome from '/pictures/foodHome.png'
import qrHome from '/pictures/qrHome.png'
import passportHome from '/pictures/passportHome.png'
import listHome from '/pictures/listHome.png'
import eventHome from '/pictures/exclamationHome.png'
import linkHome from '/pictures/linkHome.png'
import OnAir from './OnAir';
import OnAirCopy from './OnAirCopy';




function Home() {
    return (
        <div>

            <NewsSlider />
            <Link to="/search" className="search-box">
                <button className="search-button">
                    <span><img className="glass" src={search} /></span>企画を見つける</button>
            </Link>
            <div className="home-menu">
                <div className="home-menu-top">
                    <Link to="/aboutfood" className="menu-button">
                        <img src={foodHome} alt="" />
                        <h2>お食事について</h2>
                    </Link>
                    <Link to="/readqr" className="menu-button">
                        <img src={qrHome} alt="" />
                        <h2>QRコードを読み取る</h2>
                    </Link>
                </div>
                <div className="home-menu-top">
                    <Link to="/passport" className="menu-button">
                        <img src={passportHome} alt="" />
                        <h2>絵の旅パスポート</h2>
                    </Link>
                    
                    <Link to="/pagelist" className="menu-button">
                        <img src={listHome} alt="" />
                        <h2>ページ一覧</h2>
                    </Link>
                </div>
                <div className="home-menu-top">
                    <a href='https://forms.gle/DeTVPckAjLxt1T1b7' className="menu-button hp-link">
                        <img src={linkHome} alt="" />
                        <h2>ご質問・ご感想</h2>
                    </a>
                    
                    <a href='https://kinensai.jp' className="menu-button hp-link">
                        <img src={linkHome} alt="" />
                        <h2>HPはこちら</h2>
                    </a>
                </div>
            </div>
            {/* <OnAirCopy /> */}

        </div>
    );
}

export default Home;