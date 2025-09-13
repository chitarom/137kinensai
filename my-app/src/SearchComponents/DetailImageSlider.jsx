import React from 'react'
import { useRef, useState, useEffect } from 'react';

const DetailImageSlider = ({ imagelist }) => {
    //スライド
    const sliderRef = useRef(null);
    const [slideCount, setSlideCount] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);

    // マウント時にスライド枚数を取得
    useEffect(() => {
        const slider = sliderRef.current;
        if (!slider) return;
        setSlideCount(slider.querySelectorAll('.detail-slide').length);
    }, []);

    // 自動で currentIndex をローテーション
    useEffect(() => {
        if (slideCount <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % slideCount);
        }, 5000);
        return () => clearInterval(interval);
    }, [slideCount]);

    // currentIndex が変わったら中央にスクロール
    useEffect(() => {
        const slider = sliderRef.current;
        if (!slider) return;
        const slides = slider.querySelectorAll('.detail-slide');
        const target = slides[currentIndex];
        if (!target) return;

        target.scrollIntoView({
            behavior: 'smooth',
            inline: 'center',
            block: 'nearest',
        });
    }, [currentIndex]);

    function getImageList() {
        const list = [];
        for (let i = 0; i < imagelist.length; i++) {
            list.push(<img className='detail-slide' src={"/pictures/" + imagelist[i]} id={i} key={i} />);
        }
        return list;
    }

    return (
        <div className='detail-images-wrap' ref={sliderRef}>
            <div className='detail-images'>
                {getImageList()}
            </div>
        </div>
    )
}

export default DetailImageSlider;