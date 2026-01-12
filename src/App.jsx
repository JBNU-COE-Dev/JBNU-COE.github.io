import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './component/home/home.jsx';

import Benefits from './component/benefits/benefits.jsx';
import Contact from './component/contact/contact.jsx';
import Notice from './component/notice/notice.jsx';
import Resources from './component/resources/resources.jsx';
import Intro from './component/about/intro/intro.jsx';
import Organization from './component/about/organization/organization.jsx';
import AnnouncementList from './component/notice/announcement/AnnouncementList.jsx';
import AnnouncementDetail from './component/notice/announcement/AnnouncementDetail.jsx';
import Gallery from './component/notice/gallery/Gallery.jsx';
import StudySupport from './component/notice/studySupport/StudySupport.jsx';
import MonthlyCalendar from './component/notice/calendar/MonthlyCalendar.jsx';
import BuildingMap from './component/resources/buildingMap/BuildingMap.jsx';
import Constitution from './component/resources/constitution/Constitution.jsx';
import Rental from './component/resources/rental/Rental.jsx';
import FacilityInspection from './component/resources/facilityInspection/FacilityInspection.jsx';
import Finance from './component/resources/finance/Finance.jsx';
import Pledge from './component/pledge/pledge.jsx';
import Report from './component/contact/report/Report.jsx';
import BoardInquiry from './component/contact/boardInquiry/BoardInquiry.jsx';
import KakaoChannel from './component/contact/kakaoChannel/KakaoChannel.jsx';
import Matching from './component/matching/Matching.jsx';
import HeaderBar from './layouts/headerBar/headerBar.jsx';
import Banner from './layouts/banner/banner.jsx';
import TopBar from './layouts/topBar/topBar.jsx';
import './App.css';

import { useResponsive } from './component/hooks/useResponsive.jsx';
import { useLayoutResize } from './component/hooks/useLayoutResize.jsx';

function App() {
  const { isMobile, isTablet, isDesktop } = useResponsive();
  useLayoutResize();
  
  return (
    <BrowserRouter basename="/">
      <div className="app-container">
        <TopBar />
        <div id="header-container" className='header-container'>
          <HeaderBar isMobile={isMobile} isTablet={isTablet} isDesktop={isDesktop} />
        </div>

        <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/notice" element={<Notice />} />
              <Route path="/notice/announcement" element={<AnnouncementList />} />
              <Route path="/notice/announcement/:id" element={<AnnouncementDetail />} />
              <Route path="/notice/gallery" element={<Gallery />} />
              <Route path="/notice/study-support" element={<StudySupport />} />
              <Route path="/notice/calendar" element={<MonthlyCalendar />} />
              <Route path="/benefits" element={<Benefits />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/contact/report" element={<Report />} />
              <Route path="/contact/board-inquiry" element={<BoardInquiry />} />
              <Route path="/contact/kakao-channel" element={<KakaoChannel />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/resources/map" element={<BuildingMap />} />
              <Route path="/resources/constitution" element={<Constitution />} />
              <Route path="/resources/rental" element={<Rental />} />
              <Route path="/resources/finance" element={<Finance />} />
              <Route path="/resources/inspection" element={<FacilityInspection />} />
              <Route path="/about/intro" element={<Intro />} />
              <Route path="/about/organization" element={<Organization />} />
              <Route path="/notice/pledge" element={<Pledge />} />
              <Route path="/matching" element={<Matching />} />
            </Routes>
          </main>

        <div className='banner-container'>
            <Banner />
        </div>
      </div>

    </BrowserRouter>
  );
}

export default App; 