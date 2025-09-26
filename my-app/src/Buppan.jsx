import './Buppan.css';
import './SearchComponents/DetailImageSlider';
import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import imgtitle from '/pictures/物販.png';
/*
import img1 from '/pictures/buppan (1).jpg';
import img2 from '/pictures/buppan (2).jpg';
import img3 from '/pictures/buppan (3).jpg';
import img4 from '/pictures/buppan (4).jpg';
*/
import img11 from '/pictures/buppan_1.jpg';
import img12 from '/pictures/buppan_2.jpg';
import img13 from '/pictures/buppan_3.jpg';
import img14 from '/pictures/buppan_4.jpg';
import enotabipictures from './JSON/EnotabiPictures.json';

function Buppan() {
    let pictureList1 = [], pictureList2 = [];

    for (let i = 1; i <= 4; i++) {
        pictureList1.push('buppan_' + i + '.jpg');
    }
    for (let i = 3; i <= 4; i++) {
        pictureList2.push('buppan_' + i + '.jpg');
    }

    return (
        <div className="buppan-con">
            <img className="buppan-title" alt src={imgtitle}></img>

            <div className="buppan-description-con">
                <p className="buppan-description">
                    正門入ってすぐ横の記念祭本部(物販)にて記念祭限定グッズの販売を行っております。
                    是非お買い求めください。
                </p>
            </div>

            <DetailImageSlider imagelist={pictureList1} className='buppan-picture-list' />
            {/*
            <div className="spacer"></div>
            <DetailImageSlider imagelist={pictureList2} className='buppan-picture-list' />
            */}

        </div>
    );
};


const DetailImageSlider = ({ imagelist }) => {
    const sliderRef = useRef(null);
    const [slideCount, setSlideCount] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [modalImage, setModalImage] = useState(null); // 拡大画像用state

    useEffect(() => {
        const slider = sliderRef.current;
        if (!slider) return;
        setSlideCount(slider.querySelectorAll('.detail-slide').length);
    }, []);

    useEffect(() => {
        if (slideCount <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % slideCount);
        }, 5000);
        return () => clearInterval(interval);
    }, [slideCount]);

    useEffect(() => {
        const slider = sliderRef.current;
        if (!slider) return;
        const slides = slider.querySelectorAll('.detail-slide');
        const target = slides[currentIndex];
        if (!target) return;

        slider.scrollTo({
            left: target.offsetLeft - slider.offsetWidth / 2 + target.offsetWidth / 2,
            behavior: 'smooth',
        });
    }, [currentIndex]);

    function getImageList() {
        return imagelist.map((img, i) => (
            <img
                className='detail-slide'
                src={"/pictures/" + img}
                id={i}
                key={i}
                onClick={() => setModalImage("/pictures/" + img)} // クリックで拡大画像をセット
            />
        ));
    }

    return (
        <>
            <div className='detail-images-wrap' ref={sliderRef}>
                <div className='detail-images'>
                    {getImageList()}
                </div>
            </div>
            {modalImage &&
                <div className='modal-overlay' onClick={() => setModalImage(null)}>
                    <img
                        className='modal-image'
                        src={modalImage}
                        alt="拡大画像"
                        // onClick={(e) => e.stopPropagation()}  // 画像クリックでは閉じない
                    />
                </div>
            }
        </>
    )
};


export default Buppan;