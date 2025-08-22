import { Link } from 'react-router-dom';

import './FooterNav.css';
import search from './pictures/searchFooter.png'
import home from './pictures/homeFooter.png'
import event from './pictures/exclamationFooter.png'
import map from './pictures/mapFooter.png'
import schedule from './pictures/scheduleFooter.png'

function FooterNav() {
    return (
        <nav className="footer-nav">
            <Link to="/" className="footer-button-con">
                <img className="footer-button" src={home} alt="home" />
                <p>ホーム</p>
            </Link>
            <Link to="/search" className="footer-button-con">
                <img className="footer-button" src={search} alt="search" />
                <p>企画を探す</p>
            </Link>
            <Link to="/map" className="footer-button-con">
                <img className="footer-button" src={map} alt="map" />
                <p>マップ</p>
            </Link>
            <Link to="/schedule" className="footer-button-con">
                <img className="footer-button" src={schedule} alt="schedule" />
                <p>予定表</p>
            </Link>
            <Link to="/event" className="footer-button-con">
                <img className="footer-button" src={event} alt="event" />
                <p>イベント</p>
            </Link>


        </nav>
    )
}

export default FooterNav;