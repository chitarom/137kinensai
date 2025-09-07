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
import Administrator from './Administrator.jsx';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/map" element={<Map />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/event" element={<Event />} />
        <Route path="/login" element={<Login />} />
        <Route path="/administrator" element={<Administrator />} />
      </Routes>
      <FooterNav />
    </>
  );
}

export default App;

