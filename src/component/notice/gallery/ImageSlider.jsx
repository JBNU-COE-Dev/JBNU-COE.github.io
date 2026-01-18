import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';
import './gallery.css';

export default function ImageSlider({ images, initialIndex = 0, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
    if (e.key === 'Escape' && onClose) onClose();
  }, [goToPrevious, goToNext, onClose]);

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!images || images.length === 0) return null;

  const currentImage = images[currentIndex];
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

  // 이미지 URL 처리 (절대 URL이면 그대로, 상대 URL이면 API_URL 추가)
  const getImageUrl = (url) => {
    if (!url) return '/logo192.png';
    if (url.startsWith('http')) return url;
    return `${API_URL}${url}`;
  };

  return (
    <motion.div
      className="image-slider-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="image-slider-container" onClick={(e) => e.stopPropagation()}>
        {/* 닫기 버튼 */}
        {onClose && (
          <button className="slider-close-button" onClick={onClose}>
            <FiX />
          </button>
        )}

        {/* 이전 버튼 */}
        {images.length > 1 && (
          <button className="slider-nav-button slider-prev" onClick={goToPrevious}>
            <FiChevronLeft />
          </button>
        )}

        {/* 이미지 영역 */}
        <div className="slider-image-wrapper">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={getImageUrl(currentImage.imageUrl)}
              alt={currentImage.title}
              className="slider-image"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            />
          </AnimatePresence>

          {/* 이미지 정보 */}
          <motion.div
            className="slider-info"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3>{currentImage.title}</h3>
            {currentImage.description && <p>{currentImage.description}</p>}
            {currentImage.photographer && (
              <span className="photographer">촬영: {currentImage.photographer}</span>
            )}
          </motion.div>
        </div>

        {/* 다음 버튼 */}
        {images.length > 1 && (
          <button className="slider-nav-button slider-next" onClick={goToNext}>
            <FiChevronRight />
          </button>
        )}

        {/* 인디케이터 */}
        {images.length > 1 && (
          <div className="slider-indicators">
            {images.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`이미지 ${index + 1}로 이동`}
              />
            ))}
          </div>
        )}

        {/* 카운터 */}
        <div className="slider-counter">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </motion.div>
  );
}
