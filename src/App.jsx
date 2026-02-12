import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import HeaderBar from './layouts/headerBar/headerBar.jsx';
import Banner from './layouts/banner/banner.jsx';
import TopBar from './layouts/topBar/topBar.jsx';
import FloatingButton from './layouts/floatingButton/FloatingButton.jsx';
import ErrorBoundary from './component/ErrorBoundary.jsx';
import './App.css';

import { useResponsive } from './component/hooks/useResponsive.jsx';
import { useLayoutResize } from './component/hooks/useLayoutResize.jsx';

/* ── 라우트 컴포넌트 lazy 로딩 ── */
const Home = lazy(() => import('./component/home/home.jsx'));
const Benefits = lazy(() => import('./component/benefits/benefits.jsx'));
const Contact = lazy(() => import('./component/contact/contact.jsx'));
const Notice = lazy(() => import('./component/notice/notice.jsx'));
const Resources = lazy(() => import('./component/resources/resources.jsx'));
const Intro = lazy(() => import('./component/about/intro/intro.jsx'));
const Organization = lazy(() => import('./component/about/organization/organization.jsx'));
const AnnouncementList = lazy(() => import('./component/notice/announcement/AnnouncementList.jsx'));
const AnnouncementDetail = lazy(() => import('./component/notice/announcement/AnnouncementDetail.jsx'));
const Gallery = lazy(() => import('./component/notice/gallery/Gallery.jsx'));
const StudySupport = lazy(() => import('./component/notice/studySupport/StudySupport.jsx'));
const MonthlyCalendar = lazy(() => import('./component/notice/calendar/MonthlyCalendar.jsx'));
const BuildingMap = lazy(() => import('./component/resources/buildingMap/BuildingMap.jsx'));
const Constitution = lazy(() => import('./component/resources/constitution/Constitution.jsx'));
const Rental = lazy(() => import('./component/resources/rental/Rental.jsx'));
const FacilityInspection = lazy(() => import('./component/resources/facilityInspection/FacilityInspection.jsx'));
const Finance = lazy(() => import('./component/resources/finance/Finance.jsx'));
const Pledge = lazy(() => import('./component/pledge/pledge.jsx'));
const Report = lazy(() => import('./component/contact/report/Report.jsx'));
const BoardInquiry = lazy(() => import('./component/contact/boardInquiry/BoardInquiry.jsx'));
const KakaoChannel = lazy(() => import('./component/contact/kakaoChannel/KakaoChannel.jsx'));
const ActivityList = lazy(() => import('./component/activities/ActivityList.jsx'));
const ActivityDetail = lazy(() => import('./component/activities/ActivityDetail.jsx'));
const ActivityRecruitForm = lazy(() => import('./component/activities/ActivityRecruitForm.jsx'));
const LoginPage = lazy(() => import('./component/auth/LoginPage.jsx'));
const NotFound = lazy(() => import('./component/notFound/NotFound.jsx'));

function PageLoader() {
  return (
    <div className="page-loader">
      <div className="activities-spinner" />
    </div>
  );
}

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
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/notice" element={<Notice />} />
              <Route path="/notice/announcement" element={<AnnouncementList />} />
              <Route path="/notice/announcement/:id" element={<AnnouncementDetail />} />
              <Route path="/notice/gallery" element={<ErrorBoundary><Gallery /></ErrorBoundary>} />
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
              <Route path="/matching" element={<Navigate to="/activities" replace />} />
              <Route path="/matching/:id" element={<Navigate to="/activities" replace />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/activities" element={<ActivityList />} />
              <Route path="/activities/recruit" element={<ActivityRecruitForm />} />
              <Route path="/activities/:id" element={<ActivityDetail />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>

        <div className='banner-container'>
            <Banner />
        </div>

        <FloatingButton />
      </div>

    </BrowserRouter>
  );
}

export default App;
