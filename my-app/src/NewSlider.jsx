import './Home.css';
import { useRef, useState, useEffect } from 'react';
import stageSlide from '/pictures/stage-slide.png';


const NewsSlider = () => {
  const sliderRef = useRef(null);
  const [slideCount, setSlideCount] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

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

        <a className="news-slide">
          <img src={stageSlide} alt="" />
        </a>
        <a className="news-slide">
          <div className="center-center">
            <h2>スタンプラリー2</h2>
            <h1>開催決定</h1>
          </div>
        </a>
        <a className="news-slide">
          <div className="center-center">
            <h2>スタンプラリー3</h2>
            <h1>開催決定</h1>
          </div>
        </a>
        <div className="ghost-slide" aria-hidden="true" />

      </div>
    </div>
  );
};

export default NewsSlider;