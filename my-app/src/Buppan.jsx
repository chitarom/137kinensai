import './Buppan.css';
import './SearchComponents/DetailImageSlider';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import DetailImageSlider from './SearchComponents/DetailImageSlider';
import img1 from '/pictures/buppan (1).jpg';
import img2 from '/pictures/buppan (2).jpg';
import img3 from '/pictures/buppan (3).jpg';
import img4 from '/pictures/buppan (4).jpg';
import enotabipictures from './JSON/EnotabiPictures.json';

function Buppan() {
    let pictureList1 = [], pictureList2 = [];

    for (let i = 1; i <= 2; i++) {
        pictureList1.push('buppan (' + i + ').jpg');
    }
    for (let i = 3; i <= 4; i++) {
        pictureList2.push('buppan (' + i + ').jpg');
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
            
            <DetailImageSlider imagelist={pictureList1}/>
            <div className='spacer'></div>
            <DetailImageSlider imagelist={pictureList2}/>
            
        </div>
    );
};

export default Buppan;