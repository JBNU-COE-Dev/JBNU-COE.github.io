import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiX, FiLoader } from 'react-icons/fi';
import { getResourcesByPeriod, getAvailableYears, getAvailableMonths } from '../../../services/resourcesApi';
import './studySupport.css';

export default function StudySupport() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [slideDirection, setSlideDirection] = useState(0);

  // API 데이터 상태
  const [images, setImages] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [availableMonths, setAvailableMonths] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 사용 가능한 연도 목록 조회
  const fetchAvailableYears = useCallback(async () => {
    try {
      const years = await getAvailableYears('study-support');
      setAvailableYears(years);
      if (years.length > 0) {
        setSelectedYear(years[0]);
      }
    } catch (err) {
      console.error('연도 목록 조회 실패:', err);
      setError('데이터를 불러오는데 실패했습니다.');
    }
  }, []);

  // 사용 가능한 월 목록 조회
  const fetchAvailableMonths = useCallback(async () => {
    if (!selectedYear) return;

    try {
      const months = await getAvailableMonths('study-support', selectedYear);
      setAvailableMonths(months);
      if (months.length > 0) {
        setSelectedMonth(months[0]);
      } else {
        setSelectedMonth(null);
        setImages([]);
      }
    } catch (err) {
      console.error('월 목록 조회 실패:', err);
    }
  }, [selectedYear]);

  // 이미지 목록 조회
  const fetchImages = useCallback(async () => {
    if (!selectedYear || !selectedMonth) {
      setImages([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await getResourcesByPeriod('study-support', selectedYear, selectedMonth);
      setImages(data);
      setCurrentImageIndex(0);
    } catch (err) {
      console.error('이미지 조회 실패:', err);
      setError('이미지를 불러오는데 실패했습니다.');
      setImages([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedYear, selectedMonth]);

  // 초기 로드
  useEffect(() => {
    fetchAvailableYears();
  }, [fetchAvailableYears]);

  // 연도 변경 시 월 목록 조회
  useEffect(() => {
    if (selectedYear) {
      fetchAvailableMonths();
    }
  }, [selectedYear, fetchAvailableMonths]);

  // 월 변경 시 이미지 조회
  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  // 월 변경 핸들러
  const handleMonthChange = (month) => {
    setSelectedMonth(month);
    setCurrentImageIndex(0);
    setSlideDirection(0);
  };

  // 연도 변경 핸들러
  const handleYearChange = (year) => {
    setSelectedYear(year);
    setCurrentImageIndex(0);
    setSlideDirection(0);
  };

  // 이미지 네비게이션
  const handlePrevImage = () => {
    if (images.length === 0) return;
    setSlideDirection(-1);
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    if (images.length === 0) return;
    setSlideDirection(1);
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // 이미지 확대/축소 핸들러
  const handleImageClick = () => {
    if (images.length > 0) {
      setIsImageZoomed(true);
    }
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
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleZoomNextImage = (e) => {
    e.stopPropagation();
    setSlideDirection(1);
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const currentImage = images[currentImageIndex];

  return (
    <div className="study-support-page">
      {/* 헤더 */}
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>심과함께</h1>
        <p>공과대학 학생회 월별 프로그램 안내입니다</p>
      </motion.div>

      {/* 연도 선택 */}
      {availableYears.length > 0 && (
        <motion.div
          className="year-selector-bar"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {availableYears.map((year) => (
            <motion.button
              key={year}
              className={`year-btn ${selectedYear === year ? 'active' : ''}`}
              onClick={() => handleYearChange(year)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {year}년
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* 월 선택 */}
      {availableMonths.length > 0 && (
        <motion.div
          className="month-selector-bar"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {availableMonths.map((month) => (
            <motion.button
              key={month}
              className={`month-btn ${selectedMonth === month ? 'active' : ''}`}
              onClick={() => handleMonthChange(month)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {month}월
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* 콘텐츠 영역 */}
      {isLoading ? (
        <div className="loading-state">
          <FiLoader className="loading-icon spin" />
          <p>로딩 중...</p>
        </div>
      ) : error ? (
        <div className="error-state">
          <p>{error}</p>
          <button onClick={fetchImages} className="retry-btn">
            다시 시도
          </button>
        </div>
      ) : images.length === 0 ? (
        <div className="empty-state">
          <p>
            {availableYears.length === 0
              ? '등록된 콘텐츠가 없습니다.'
              : '선택한 기간에 등록된 콘텐츠가 없습니다.'}
          </p>
        </div>
      ) : (
        /* 이미지 슬라이더 */
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
              disabled={images.length <= 1}
            >
              <FiChevronLeft />
            </motion.button>

            {/* 이미지와 인디케이터 */}
            <div className="image-section" onClick={handleImageClick} style={{ cursor: 'pointer' }}>
              <AnimatePresence mode="wait" custom={slideDirection}>
                <motion.div
                  className="image-container"
                  key={`${selectedYear}-${selectedMonth}-${currentImageIndex}`}
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
                    src={currentImage?.fileUrl}
                    alt={currentImage?.title || `${selectedMonth}월 행사 일정 ${currentImageIndex + 1}`}
                    className="calendar-image"
                  />
                </motion.div>
              </AnimatePresence>

              {/* 인디케이터 */}
              {images.length > 1 && (
                <div className="image-indicators" onClick={(e) => e.stopPropagation()}>
                  {images.map((_, index) => (
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
              )}

              {/* 카운터 */}
              <div className="image-counter" onClick={(e) => e.stopPropagation()}>
                {currentImageIndex + 1} / {images.length}
              </div>
            </div>

            {/* 다음 버튼 */}
            <motion.button
              className="nav-button next-btn"
              onClick={handleNextImage}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              disabled={images.length <= 1}
            >
              <FiChevronRight />
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* 이미지 확대 모달 */}
      <AnimatePresence>
        {isImageZoomed && currentImage && (
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
              {images.length > 1 && (
                <button
                  className="zoom-nav-btn zoom-prev-btn"
                  onClick={handleZoomPrevImage}
                  aria-label="이전 이미지"
                >
                  <FiChevronLeft />
                </button>
              )}

              {/* 확대된 이미지 */}
              <AnimatePresence mode="wait" custom={slideDirection}>
                <motion.img
                  src={currentImage.fileUrl}
                  alt={currentImage.title || `${selectedMonth}월 행사 일정 ${currentImageIndex + 1}`}
                  className="zoomed-image"
                  key={`zoom-${selectedYear}-${selectedMonth}-${currentImageIndex}`}
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
              {images.length > 1 && (
                <button
                  className="zoom-nav-btn zoom-next-btn"
                  onClick={handleZoomNextImage}
                  aria-label="다음 이미지"
                >
                  <FiChevronRight />
                </button>
              )}

              {/* 이미지 정보 */}
              <div className="zoom-image-info">
                <span className="zoom-counter">
                  {currentImageIndex + 1} / {images.length}
                </span>
                <span className="zoom-month">
                  {selectedYear}년 {selectedMonth}월
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
