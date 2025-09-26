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
            {/*
                <img className="buppan-title" alt src={'./pictures/' + pictureList[0]}></img>
            */}
            <div className="buppan-description-con">
                <p className="buppan-description">
                    正門入ってすぐ横の記念祭本部(物販)にて記念祭限定グッズの販売を行っております。
                    是非お買い求めください。
                </p>
            </div>
            {/*
            <DetailImageSlider imagelist={pictureList}/>
            */}
        </div>
    );
};

export default Buppan;