import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './home.css';

import mainSlider1 from '../../img/main-slider/main-slider1.JPG';
import mainSlider2 from '../../img/main-slider/main-slider2.JPG';
import mainSlider3 from '../../img/main-slider/main-slider3.JPG';
import mainSlider4 from '../../img/main-slider/main-slider4.JPG';
import mainSlider5 from '../../img/main-slider/main-slider5.JPG';

import ImageSlider from './imageSlider/imageSlider.jsx';

import CardSection from './cardSection/cardSection.jsx';

import { useResponsive } from '../hooks/useResponsive.jsx';
import { useLayoutResize } from '../hooks/useLayoutResize.jsx';

import PartnerShowcase from './partnerSlider/PartnerShowcase.jsx';

import MonthlyCalendar from '../notice/calendar/MonthlyCalendar.jsx';
import { HiMenu } from 'react-icons/hi';

const Home = () => {
  const slides = [{image: mainSlider1}, {image: mainSlider2}, {image: mainSlider3}, {image: mainSlider4}, {image: mainSlider5}];
  const { isMobile, isTablet, isDesktop } = useResponsive();
  useLayoutResize();
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  // JS 강제 페이지 넘김(휠/키 이벤트 + transform) 해제: CSS scroll-snap만 사용
  
  return (
    <div className="app-container">
      <div className='first-screen'>
        {/* 여기까지가 pc로 한 화면으로 나오게 부탁드립니다.. */}
        <div id="slider-container" className='slider-container'>
          <ImageSlider slides={slides} />
        </div>
        <div id="cards-container" className='cards-container'>
          <CardSection isMobile={isMobile} isTablet={isTablet} isDesktop={isDesktop}/>
        </div>
      </div>

      <div className='second-screen'>
        <div className='benefit-toolbar'>
          <div className='benefit-title'>제휴 업체 검색</div>
          <div className='benefit-search'>
            <input type='text' placeholder='' aria-label='제휴 업체 검색' value={searchText} onChange={(e)=>setSearchText(e.target.value)} />
          </div>
          <button className='benefit-add' aria-label='업체 제안'>+</button>
        </div>

        <PartnerShowcase query={searchText} />

        <div className='benefit-footer'>
          <button className='benefit-list-btn' onClick={() => navigate('/benefits')}>
            <HiMenu/> 목록 보기
          </button>
        </div>
      </div>

      <div className='third-screen'>
        {/* 툴바 + 행사 달력이 딱 한 화면에 나오도록 부탁드립니다. */}
        <div className='calender-container'>
          <MonthlyCalendar />
        </div>
      </div>
    </div>
  );
};

export default Home; 