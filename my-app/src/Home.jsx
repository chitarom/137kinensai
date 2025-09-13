import './Home.css';
import React from 'react';
import { Link } from 'react-router-dom';
import NewsSlider from './NewSlider';
import search from './pictures/search.png'
import foodHome from './pictures/foodHome.png'
import qrHome from './pictures/qrHome.png'
import passportHome from './pictures/passportHome.png'
import listHome from './pictures/listHome.png'
import eventHome from './pictures/exclamationHome.png'
import linkHome from './pictures/linkHome.png'
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
                    <div className="menu-button">
                        <img src={qrHome} alt="" />
                        <h2>QRコードを読み取る</h2>
                    </div>
                </div>
                <div className="home-menu-top">
                    <div className="menu-button">
                        <img src={passportHome} alt="" />
                        <h2>絵の旅パスポート</h2>
                    </div>
                    <Link to="/event" className="menu-button">
                        <img src={eventHome} alt="" />
                        <h2>イベント</h2>
                    </Link>
                </div>
                <div className="home-menu-top">
                    <Link to="/pagelist" className="menu-button">
                        <img src={listHome} alt="" />
                        <h2>ページ一覧</h2>
                    </Link>
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