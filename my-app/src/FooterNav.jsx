import { Link } from 'react-router-dom';

import './FooterNav.css';
import search from '/pictures/searchFooter.png'
import home from '/pictures/homeFooter.png'
import event from '/pictures/exclamationFooter.png'
import map from '/pictures/mapFooter.png'
import schedule from '/pictures/scheduleFooter.png'
import { useLocation } from 'react-router-dom';

function FooterNav() {
    const iconMap = {
        home,
        search,
        map,
        schedule,
        event
    }
    const location = useLocation()
    const currentPath = location.pathname

    const navItems = [
        { label: 'ホーム', name:'home', path: '/' },
        { label: '企画を探す', name:'search', path: '/search' },
        { label: 'マップ', name:'map', path: '/map' },
        { label: '予定表', name:'schedule', path: '/schedule' },
        { label: 'イベント', name:'event', path: '/event' }
    ]

    const enhancedNavItems = navItems.map(item => ({
        ...item,
        isActive: item.path === currentPath
    }))


    return (
        <nav className="footer-nav">
            {enhancedNavItems.map(item => (
                <Link key={item.path} to={item.path} className={`footer-button-con ${item.isActive ? 'isactive' : ''}`}>
                    <img className="footer-button" src={iconMap[item.name]} alt={item.name} />
                    <p>{item.label}</p>
                </Link>
            ))}


{/* <Link to="/" className="footer-button-con">
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
            </Link> */}


        </nav >
    )
}

export default FooterNav;