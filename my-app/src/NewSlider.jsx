import './Home.css';
import { useRef, useState, useEffect } from 'react';
import stageSlide from '/pictures/stage-slide.png';
import kaijinSlide from '/pictures/kaijin.png';
import shinslide from '/pictures/shin-slide.png';
import { Link } from 'react-router-dom';
import enotabi from '/pictures/enotabi2.png'


const NewsSlider = () => {
  const sliderRef = useRef(null);
  const [slideCount, setSlideCount] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(1);

  // マウント時にスライド枚数を取得
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    setSlideCount(slider.querySelectorAll('.news-slide').length);
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
    const slides = slider.querySelectorAll('.news-slide');
    const target = slides[currentIndex];
    if (!target) return;

    target.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block:   'nearest',
    });
  }, [currentIndex]);

  return (
    <div className="news-slide-box-con" ref={sliderRef}>
      <div className="news-slide-box">
        <div className="ghost-slide" aria-hidden="true" />

        <Link to="/stagevote" className="news-slide">
          <img src={stageSlide} alt="" />
        </Link>
        <Link to="/kaijin" className="news-slide">
        <img src={kaijinSlide} alt="" />
        </Link>
        <Link to="/shintenchi" className="news-slide">
          <img src={shinslide} alt="" />
        </Link>
        <Link to="/passport" className="news-slide">
          <img src={enotabi} alt="" />
        </Link>
        <div className="ghost-slide" aria-hidden="true" />

      </div>
    </div>
  );
};

export default NewsSlider;