import React from 'react';
import Home from './Home.jsx';
import FooterNav from './FooterNav.jsx';
import NewsBar from './NewsBar.jsx';
import Header from './Header.jsx';
import Schedule from './Schedule.jsx';
import Search from './Search.jsx';
import Map from './Map.jsx';
import Event from './Event.jsx';
import Login from './Login.jsx';
import PageList from './PageList.jsx';
import { Routes, Route } from 'react-router-dom';
import AboutFood from './AboutFood.jsx';
import ReadQR from './ReadQR.jsx';
import AnalyzeQR from './AnalyzeQR.jsx';
import Passport from './Passport.jsx';
import ArticleMenu from './ArticleMenu.jsx';
import ScrollToTop from './ScrollTopTo.jsx';
import Article from './Article.jsx';
import StageVote from './StageVote.jsx';
import Kaijin from './Kaijin.jsx';
import Shintenchi from './Shintenchi.jsx';
import Mogiten from './Mogiten.jsx';



function App() {
  return (
    <>
      <Header />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/map" element={<Map />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/event" element={<Event />} />
        <Route path="/login" element={<Login />} />
        <Route path="/pagelist" element={<PageList />} />
        <Route path="/aboutfood" element={<AboutFood />} />
        <Route path="/readqr" element={<ReadQR/>}/>
        <Route path="/analyzeqr" element={<AnalyzeQR/>}/>
        <Route path="/passport" element={<Passport/>}/>
        <Route path="/articlemenu" element={<ArticleMenu/>}/>
        <Route path="/article" element={<Article/>}/>
        <Route path="/stagevote" element={<StageVote/>}/>
        <Route path="/kaijin" element={<Kaijin/>}/>
        <Route path="/shintenchi" element={<Shintenchi/>}/>
        <Route path="/mogiten" element={<Mogiten/>}/>
      </Routes>
      <FooterNav />
    </>
  );
}

export default App;

