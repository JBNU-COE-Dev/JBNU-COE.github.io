import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiChevronLeft, FiChevronRight, FiCalendar, FiLoader } from 'react-icons/fi';
import { getResourcesByPeriod, getAvailableYears, getAvailableMonths } from '../../../services/resourcesApi';
import './facilityInspection.css';

// 이미지 모달 컴포넌트
const ImageModal = ({ image, allImages, currentIndex, onClose, onNext, onPrev }) => {
  return (
    <motion.div
      className="image-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="image-modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>
          <FiX />
        </button>

        {allImages.length > 1 && (
          <>
            <button className="modal-nav-button modal-prev" onClick={onPrev}>
              <FiChevronLeft />
            </button>
            <button className="modal-nav-button modal-next" onClick={onNext}>
              <FiChevronRight />
            </button>
          </>
        )}

        <motion.div
          className="modal-image-wrapper"
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <img src={image.fileUrl} alt={image.originalFileName} className="modal-image" />
          <div className="modal-info">
            <p>{image.title || image.originalFileName}</p>
          </div>
        </motion.div>

        {allImages.length > 1 && (
          <div className="modal-counter">
            {currentIndex + 1} / {allImages.length}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default function FacilityInspection() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
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
      const years = await getAvailableYears('inspection');
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
      const months = await getAvailableMonths('inspection', selectedYear);
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
      const data = await getResourcesByPeriod('inspection', selectedYear, selectedMonth);
      setImages(data);
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

  const handleImageClick = (image, index) => {
    setSelectedImage(image);
    setCurrentImageIndex(index);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
    setCurrentImageIndex(0);
  };

  const handleNextImage = () => {
    const nextIndex = (currentImageIndex + 1) % images.length;
    setCurrentImageIndex(nextIndex);
    setSelectedImage(images[nextIndex]);
  };

  const handlePrevImage = () => {
    const prevIndex = (currentImageIndex - 1 + images.length) % images.length;
    setCurrentImageIndex(prevIndex);
    setSelectedImage(images[prevIndex]);
  };

  return (
    <div className="facility-inspection-container">
      {/* 헤더 */}
      <motion.div
        className="facility-inspection-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="header-icon">
          <FiCalendar />
        </div>
        <h1>시설 점검 결과</h1>
        <p>공과대학 학생회 월별 시설 점검 현황입니다</p>
      </motion.div>

      {/* 연도/월 선택 바 */}
      {availableYears.length > 0 && (
        <motion.div
          className="period-selector"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* 연도 선택 */}
          <div className="year-selector">
            {availableYears.map((year) => (
              <motion.button
                key={year}
                className={`year-btn ${selectedYear === year ? 'active' : ''}`}
                onClick={() => setSelectedYear(year)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {year}년
              </motion.button>
            ))}
          </div>

          {/* 월 선택 */}
          {availableMonths.length > 0 && (
            <div className="month-selector">
              {availableMonths.map((month) => (
                <motion.button
                  key={month}
                  className={`month-btn ${selectedMonth === month ? 'active' : ''}`}
                  onClick={() => setSelectedMonth(month)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {month}월
                </motion.button>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* 콘텐츠 영역 */}
      <div className="facility-inspection-content">
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
            <FiCalendar className="empty-icon" />
            <p>
              {availableYears.length === 0
                ? '등록된 시설 점검 결과가 없습니다.'
                : '선택한 기간에 등록된 점검 결과가 없습니다.'}
            </p>
          </div>
        ) : (
          <motion.div
            className="inspection-grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {images.map((image, index) => (
              <motion.div
                key={image.id}
                className="inspection-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => handleImageClick(image, index)}
              >
                <div className="inspection-image-container">
                  <img
                    src={image.fileUrl}
                    alt={image.title || image.originalFileName}
                    className="inspection-image"
                    loading="lazy"
                  />
                  <div className="inspection-overlay">
                    <span className="view-text">자세히 보기</span>
                  </div>
                </div>
                <div className="inspection-info">
                  <p>{image.title || `${selectedYear}년 ${selectedMonth}월 시설 점검`}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* 이미지 모달 */}
      <AnimatePresence>
        {selectedImage && (
          <ImageModal
            image={selectedImage}
            allImages={images}
            currentIndex={currentImageIndex}
            onClose={handleCloseModal}
            onNext={handleNextImage}
            onPrev={handlePrevImage}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
