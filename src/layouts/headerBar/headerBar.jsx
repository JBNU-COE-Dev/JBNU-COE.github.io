// HeaderBar.jsx
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX } from 'react-icons/hi';
import './headerBar.css';
import logoImg_blue from '../../img/embulum_blue.png';
import logoImg_white from '../../img/embulum_white.png';
function HeaderBar({ isMobile }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [isAtTop, setIsAtTop] = useState(true);
  const location = useLocation();

  const toggleMenu = (menuName) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  useEffect(() => {
    const container = document.querySelector('.app-container');
    const getScrollTop = () => (container ? container.scrollTop : window.scrollY);
    const update = () => setIsAtTop(getScrollTop() <= 2);
    update(); // 최초 렌더 시 위치 확인
    const target = container || window;
    target.addEventListener('scroll', update, { passive: true });
    return () => target.removeEventListener('scroll', update);
  }, []);

  const p = (location.pathname || '').toLowerCase();
  const isExempt = (p === '/'); // /about/intro는 제외하여 다른 페이지와 동일하게 반응형 색상 적용
  const shouldBeBlueText = isAtTop && !isExempt;

  return (
    <>
      <motion.header 
        className={`header-bar ${shouldBeBlueText ? 'at-top-blue' : ''} ${!isAtTop ? 'header-scrolled' : ''}`}
        animate={{
          backgroundColor: isAtTop ? 'rgba(0,0,0,0)' : 'rgba(0,76,165,1)',
          boxShadow: isAtTop ? '0 0 0 rgba(0,0,0,0)' : '0 2px 6px rgba(0,0,0,0.15)'
        }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      >
        <div className='header-left'>
          <div className="logo-size-lg">
            <Link to="/">
              <AnimatePresence mode="wait">
                <motion.img
                  key={isAtTop ? 'blue' : 'white'}
                  src={isAtTop ? logoImg_blue : logoImg_white}
                  className="logo-img"
                  alt="로고"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ display: 'block', cursor: 'pointer' }}
                />
              </AnimatePresence>
            </Link>
          </div>
        </div>

        {!isMobile && (
          <nav className="nav-menu">
            <ul className="nav-list">
              <li className="dropdown" onMouseEnter={() => toggleMenu('about')} onMouseLeave={() => toggleMenu(null)}>
                <ul>학생회 소개</ul>
                {activeMenu === 'about' && (
                  <div className="dropdown-container">
                    <li><Link to="/about/intro">공과대학 학생회 소개</Link></li>
                    <li><Link to="/about/organization">조직도</Link></li>
                  </div>
                )}
              </li>
              <li className="dropdown" onMouseEnter={() => toggleMenu('notice')} onMouseLeave={() => toggleMenu(null)}>
                <ul>알림</ul>
                {activeMenu === 'notice' && (
                  <div className="dropdown-container">
                    <li><Link to="/notice/announcement">공지사항</Link></li>
                    <li><Link to="/notice/calendar">월별 행사</Link></li>
                    <li><Link to="/notice/study-support">심과함께</Link></li>
                    <li><Link to="/notice/pledge">공약 이행률</Link></li>
                  </div>
                )}
              </li>

              <li className="dropdown" onMouseEnter={() => toggleMenu('benefits')} onMouseLeave={() => toggleMenu(null)}>
                <ul>제휴 혜택</ul>
                {activeMenu === 'benefits' && (
                  <div className="dropdown-container">
                    <li><Link to="/benefits">제휴업체 리스트</Link></li>
                  </div>
                )}
              </li>

              <li className="dropdown" onMouseEnter={() => toggleMenu('contact')} onMouseLeave={() => toggleMenu(null)}>
                <ul>소통</ul>
                {activeMenu === 'contact' && (
                  <div className="dropdown-container">
                    <li><Link to="/contact/board-inquiry">게시판 이용 문의</Link></li>
                    <li><Link to="/contact/report">민원 접수</Link></li>
                    <li><Link to="/contact/kakao-channel">카카오톡 채널</Link></li>
                    <li><Link to="/matching">매칭 플랫폼</Link></li>
                  </div>
                )}
              </li>

              <li className="dropdown" onMouseEnter={() => toggleMenu('resources')} onMouseLeave={() => toggleMenu(null)}>
                <ul>자료실</ul>
                {activeMenu === 'resources' && (
                  <div className="dropdown-container">
                    <li><Link to="/resources/map">공과대학 내부 지도</Link></li>
                    <li><Link to="/resources/rental">대여사업 물품 목록</Link></li>
                    <li><Link to="/resources/constitution">공과대학 학생회칙</Link></li>
                    <li><Link to="/resources/finance">회계 내역 공개</Link></li>
                    <li><Link to="/resources/inspection">시설 정기 점검 결과</Link></li>
                    <li><Link to="/notice/gallery">갤러리</Link></li>
                  </div>
                )}
              </li>
            </ul>
          </nav>
        )}

        {isMobile && (
          <div className='header-right'>
            <button 
              className="menu-button" 
              onClick={() => setMenuOpen(true)} 
              aria-label="메뉴 열기"
              style={{ color: shouldBeBlueText ? '#004ca5' : 'white' }}
            >
              <HiMenu />
            </button>
            {menuOpen && (
              <div className="mobile-menu-overlay">
                <div className="mobile-menu">
                  <button className="close-button" onClick={() => setMenuOpen(false)} aria-label="메뉴 닫기">
                    <HiX />
                  </button>
                  <ul className="mobile-nav-list">
                    <li>
                    <button className={`mobile-nav-button ${activeMenu === 'about' ? 'active' : ''}`} onClick={() => toggleMenu('about')}>학생회 소개</button>
                      {activeMenu === 'about' && (
                        <ul className="mobile-submenu">
                          <li><Link to="/about/intro" onClick={() => setMenuOpen(false)}>공과대학 학생회 소개</Link></li>
                          <li><Link to="/about/organization" onClick={() => setMenuOpen(false)}>조직도</Link></li>
                        </ul>
                      )}
                    </li>
                    <li>
                      <button className={`mobile-nav-button ${activeMenu === 'notice' ? 'active' : ''}`} onClick={() => toggleMenu('notice')}>알림</button>
                      {activeMenu === 'notice' && (
                        <ul className="mobile-submenu">
                          <li><Link to="/notice/announcement" onClick={() => setMenuOpen(false)}>공지사항</Link></li>
                          <li><Link to="/notice/calendar" onClick={() => setMenuOpen(false)}>월별 행사</Link></li>
                          <li><Link to="/notice/study-support" onClick={() => setMenuOpen(false)}>심과함께</Link></li>
                          <li><Link to="/notice/pledge" onClick={() => setMenuOpen(false)}>공약 이행률</Link></li>
                        </ul>
                      )}
                    </li>
                    <li>
                      <button className={`mobile-nav-button ${activeMenu === 'benefits' ? 'active' : ''}`} onClick={() => toggleMenu('benefits')}>제휴 혜택</button>
                      {activeMenu === 'benefits' && (
                        <ul className="mobile-submenu">
                          <li><Link to="/benefits" onClick={() => setMenuOpen(false)}>제휴업체 리스트</Link></li>
                        </ul>
                      )}
                    </li>
                    <li>
                      <button className={`mobile-nav-button ${activeMenu === 'contact' ? 'active' : ''}`} onClick={() => toggleMenu('contact')}>소통</button>
                      {activeMenu === 'contact' && (
                        <ul className="mobile-submenu">
                          <li><Link to="/contact/board-inquiry" onClick={() => setMenuOpen(false)}>게시판 이용 문의</Link></li>
                          <li><Link to="/contact/report" onClick={() => setMenuOpen(false)}>민원 접수</Link></li>
                          <li><Link to="/contact/kakao-channel" onClick={() => setMenuOpen(false)}>카카오톡 채널</Link></li>
                          <li><Link to="/matching" onClick={() => setMenuOpen(false)}>매칭 플랫폼</Link></li>
                        </ul>
                      )}
                    </li>
                    <li>
                      <button className={`mobile-nav-button ${activeMenu === 'resources' ? 'active' : ''}`} onClick={() => toggleMenu('resources')}>자료실</button>
                      {activeMenu === 'resources' && (
                        <ul className="mobile-submenu">
                          <li><Link to="/resources/map" onClick={() => setMenuOpen(false)}>공과대학 내부 지도</Link></li>
                          <li><Link to="/resources/rental" onClick={() => setMenuOpen(false)}>대여사업 물품 목록</Link></li>
                          <li><Link to="/resources/constitution" onClick={() => setMenuOpen(false)}>공과대학 학생회칙</Link></li>
                          <li><Link to="/resources/finance" onClick={() => setMenuOpen(false)}>회계 내역 공개</Link></li>
                          <li><Link to="/resources/inspection" onClick={() => setMenuOpen(false)}>시설 정기 점검 결과</Link></li>
                          <li><Link to="/notice/gallery" onClick={() => setMenuOpen(false)}>갤러리</Link></li>
                        </ul>
                      )}
                    </li>
                  </ul>
                </div>
              </div>
            )}

          </div>
        )}
      </motion.header>
    </>
  );
}

export default HeaderBar; 