import './Buppan.css';
import './SearchComponents/DetailImageSlider';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import DetailImageSlider from './SearchComponents/DetailImageSlider';
// import img1 from './img/buppan/1.jpg';
import enotabipictures from './JSON/EnotabiPictures.json';

function Buppan() {
    let pictureList = [];

    for (let i = 1; i < 10; i++) {
        pictureList.push(enotabipictures["map.at_" + i][0]);
    }

    return (
        <div className="buppan-con">
            <h2 className="buppan-title">物販</h2>
            <p className="buppan-description">現在、物販の予定はありません。</p>
            <p className="buppan-description">最新情報は公式Twitterをご確認ください。</p>
            <DetailImageSlider imagelist={pictureList}/>
        </div>
    );
};

export default Buppan;