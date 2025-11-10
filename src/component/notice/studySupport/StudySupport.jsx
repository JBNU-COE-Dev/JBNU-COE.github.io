import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';
import './studySupport.css';

// 월별 데이터 구조: 3월~11월
const AVAILABLE_MONTHS = [3, 4, 5, 6, 7, 8, 9, 10, 11];

const MONTH_NAMES = {
  3: '3월', 4: '4월', 5: '5월', 6: '6월', 7: '7월',
  8: '8월', 9: '9월', 10: '10월', 11: '11월'
};

export default function StudySupport() {
  const [selectedMonth, setSelectedMonth] = useState(3);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [slideDirection, setSlideDirection] = useState(0); // 슬라이드 방향: 1 = 다음, -1 = 이전

  // 선택된 월의 이미지 경로 배열 생성
  const getMonthImages = (month) => {
    const images = [];
    for (let i = 1; i <= 6; i++) {
      images.push(`${process.env.PUBLIC_URL}/feel_calendar/${month}/${month}_${i}.png`);
    }
    return images;
  };

  const currentImages = getMonthImages(selectedMonth);

  // 월 변경 핸들러
  const handleMonthChange = (month) => {
    setSelectedMonth(month);
    setCurrentImageIndex(0);
    setSlideDirection(0); // 월 변경 시 방향 초기화
  };

  // 이미지 네비게이션
  const handlePrevImage = () => {
    setSlideDirection(-1); // 이전 방향
    setCurrentImageIndex((prev) => (prev === 0 ? currentImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSlideDirection(1); // 다음 방향
    setCurrentImageIndex((prev) => (prev === currentImages.length - 1 ? 0 : prev + 1));
  };

  // 이미지 확대/축소 핸들러
  const handleImageClick = () => {
    setIsImageZoomed(true);
  };

  const handleCloseZoom = () => {
    setIsImageZoomed(false);
  };

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isImageZoomed) {
        handleCloseZoom();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isImageZoomed]);

  // 확대 모달에서 이미지 네비게이션
  const handleZoomPrevImage = (e) => {
    e.stopPropagation();
    setSlideDirection(-1);
    setCurrentImageIndex((prev) => (prev === 0 ? currentImages.length - 1 : prev - 1));
  };

  const handleZoomNextImage = (e) => {
    e.stopPropagation();
    setSlideDirection(1);
    setCurrentImageIndex((prev) => (prev === currentImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="study-support-page">
      {/* 헤더 */}
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
      </motion.div>

      {/* 월 선택 */}
      <motion.div
        className="month-selector-bar"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {AVAILABLE_MONTHS.map((month) => (
          <motion.button
            key={month}
            className={`month-btn ${selectedMonth === month ? 'active' : ''}`}
            onClick={() => handleMonthChange(month)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {MONTH_NAMES[month]}
          </motion.button>
        ))}
      </motion.div>

      {/* 이미지 슬라이더 */}
      <motion.div
        className="slider-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="slider-main">
          {/* 이전 버튼 */}
          <motion.button
            className="nav-button prev-btn"
            onClick={handlePrevImage}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiChevronLeft />
          </motion.button>

          {/* 이미지와 인디케이터 */}
          <div className="image-section" onClick={handleImageClick} style={{ cursor: 'pointer' }}>
            <AnimatePresence mode="wait" custom={slideDirection}>
              <motion.div
                className="image-container"
                key={`${selectedMonth}-${currentImageIndex}`}
                custom={slideDirection}
                initial={{ 
                  opacity: 0, 
                  x: slideDirection === 0 ? 0 : (slideDirection > 0 ? 100 : -100)
                }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ 
                  opacity: 0, 
                  x: slideDirection === 0 ? 0 : (slideDirection > 0 ? -100 : 100)
                }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={currentImages[currentImageIndex]}
                  alt={`${MONTH_NAMES[selectedMonth]} 행사 일정 ${currentImageIndex + 1}`}
                  className="calendar-image"
                />
              </motion.div>
            </AnimatePresence>

            {/* 인디케이터 */}
            <div className="image-indicators" onClick={(e) => e.stopPropagation()}>
              {currentImages.map((_, index) => (
                <button
                  key={index}
                  className={`indicator-dot ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={() => {
                    setSlideDirection(index > currentImageIndex ? 1 : -1);
                    setCurrentImageIndex(index);
                  }}
                  aria-label={`${index + 1}번째 이미지로 이동`}
                />
              ))}
            </div>

            {/* 카운터 */}
            <div className="image-counter" onClick={(e) => e.stopPropagation()}>
              {currentImageIndex + 1} / {currentImages.length}
            </div>
          </div>

          {/* 다음 버튼 */}
          <motion.button
            className="nav-button next-btn"
            onClick={handleNextImage}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiChevronRight />
          </motion.button>
        </div>
      </motion.div>

      {/* 이미지 확대 모달 */}
      <AnimatePresence>
        {isImageZoomed && (
          <motion.div
            className="image-zoom-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseZoom}
          >
            <motion.div
              className="zoom-modal-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* 닫기 버튼 */}
              <button
                className="zoom-close-btn"
                onClick={handleCloseZoom}
                aria-label="닫기"
              >
                <FiX />
              </button>

              {/* 이전 버튼 */}
              <button
                className="zoom-nav-btn zoom-prev-btn"
                onClick={handleZoomPrevImage}
                aria-label="이전 이미지"
              >
                <FiChevronLeft />
              </button>

              {/* 확대된 이미지 */}
              <AnimatePresence mode="wait" custom={slideDirection}>
                <motion.img
                  src={currentImages[currentImageIndex]}
                  alt={`${MONTH_NAMES[selectedMonth]} 행사 일정 ${currentImageIndex + 1}`}
                  className="zoomed-image"
                  key={`zoom-${selectedMonth}-${currentImageIndex}`}
                  custom={slideDirection}
                  initial={{ 
                    opacity: 0, 
                    x: slideDirection === 0 ? 0 : (slideDirection > 0 ? 100 : -100)
                  }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ 
                    opacity: 0, 
                    x: slideDirection === 0 ? 0 : (slideDirection > 0 ? -100 : 100)
                  }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatePresence>

              {/* 다음 버튼 */}
              <button
                className="zoom-nav-btn zoom-next-btn"
                onClick={handleZoomNextImage}
                aria-label="다음 이미지"
              >
                <FiChevronRight />
              </button>

              {/* 이미지 정보 */}
              <div className="zoom-image-info">
                <span className="zoom-counter">
                  {currentImageIndex + 1} / {currentImages.length}
                </span>
                <span className="zoom-month">
                  {MONTH_NAMES[selectedMonth]} 행사 일정
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
