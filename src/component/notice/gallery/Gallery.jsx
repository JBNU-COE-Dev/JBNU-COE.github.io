import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiEye, FiPaperclip, FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';
import ImageSlider from './ImageSlider';
import './gallery.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export default function Gallery() {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchType, setSearchType] = useState('all'); // 검색 타입: all, title, content
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const searchTypes = [
    { id: 'all', label: '제목 + 내용' },
    { id: 'title', label: '제목' },
    { id: 'content', label: '내용' }
  ];

  const fetchGalleries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `${API_URL}/api/gallery?page=${currentPage}&size=15`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('갤러리를 불러오는데 실패했습니다.');
      const data = await response.json();
      setGalleries(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchGalleries();
  }, [fetchGalleries]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchKeyword.trim()) {
      fetchGalleries();
      return;
    }

    setLoading(true);
    setError(null);
    try {
      let url = `${API_URL}/api/gallery/search?keyword=${encodeURIComponent(searchKeyword)}&searchType=${searchType}&page=${currentPage}&size=15`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('검색에 실패했습니다.');
      const data = await response.json();
      setGalleries(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
  };

  const handleCloseSlider = () => {
    setSelectedImageIndex(null);
  };

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  // 페이지네이션 번호 생성
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  // 스켈레톤 로딩
  const SkeletonCard = () => (
    <motion.div 
      className="gallery-card skeleton-card"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="gallery-card-image skeleton-image"></div>
      <div className="gallery-card-content">
        <div className="skeleton-title"></div>
        <div className="skeleton-meta"></div>
      </div>
    </motion.div>
  );

  return (
    <div className="gallery-page">
      {/* 페이지 타이틀 섹션 */}
        <div className="gallery-title">
          <h1>갤러리</h1>
          <p>공과대학 학생회의 다양한 활동을 사진으로 만나보세요</p>
        </div>

      {/* 메인 컨텐츠 */}
      <div className="gallery-main">
        {/* 검색 영역 */}
        <motion.div 
          className="gallery-search-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <form className="gallery-search-form" onSubmit={handleSearch}>
            <div className="search-select-wrapper">
              <select 
                value={searchType} 
                onChange={(e) => setSearchType(e.target.value)}
                className="search-select"
              >
                {searchTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.label}</option>
                ))}
              </select>
            </div>
            <div className="search-input-wrapper">
              <input
                type="text"
                className="search-input"
                placeholder="검색어를 입력하세요"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
            </div>
            <button type="submit" className="search-btn">
              <FiSearch />
              <span>검색</span>
            </button>
          </form>
        </motion.div>

        {/* 에러 메시지 */}
        {error && (
          <motion.div
            className="gallery-error"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {error}
          </motion.div>
        )}

        {/* 갤러리 그리드 */}
        <motion.div 
          className="gallery-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {loading ? (
            [...Array(15)].map((_, i) => <SkeletonCard key={i} />)
          ) : galleries.length === 0 ? (
            <div className="no-galleries">
              <p>등록된 갤러리가 없습니다.</p>
            </div>
          ) : (
            galleries.map((gallery, index) => (
              <motion.div
                key={gallery.id}
                className="gallery-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => handleImageClick(index)}
              >
                <div className="gallery-card-image">
                  <img
                    src={`${API_URL}${gallery.imageUrl}`}
                    alt={gallery.title}
                    loading="lazy"
                  />
                  <div className="gallery-card-hover">
                    <span>자세히 보기</span>
                  </div>
                </div>
                <div className="gallery-card-content">
                  <h3 className="gallery-card-title">{gallery.title}</h3>
                  <div className="gallery-card-meta">
                    <span className="meta-date">
                      작성일 {formatDate(gallery.createdAt)}
                    </span>
                    <span className="meta-views">
                      <FiEye />
                      조회수 {gallery.viewCount || 0}
                    </span>
                    <span className="meta-files">
                      <FiPaperclip />
                      첨부파일 ({gallery.attachmentCount || 0})
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <motion.div 
            className="gallery-pagination"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* 처음으로 */}
            <button
              className="pagination-nav-btn"
              onClick={() => setCurrentPage(0)}
              disabled={currentPage === 0}
              aria-label="첫 페이지로 이동"
            >
              <FiChevronsLeft />
            </button>
            
            {/* 이전 */}
            <button
              className="pagination-nav-btn"
              onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
              aria-label="이전 페이지로 이동"
            >
              <FiChevronLeft />
            </button>
            
            {/* 페이지 번호 */}
            <div className="pagination-numbers">
              {getPageNumbers().map(pageNum => (
                <button
                  key={pageNum}
                  className={`pagination-num-btn ${currentPage === pageNum ? 'active' : ''}`}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum + 1}
                </button>
              ))}
            </div>
            
            {/* 다음 */}
            <button
              className="pagination-nav-btn"
              onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
              disabled={currentPage >= totalPages - 1}
              aria-label="다음 페이지로 이동"
            >
              <FiChevronRight />
            </button>
            
            {/* 마지막으로 */}
            <button
              className="pagination-nav-btn"
              onClick={() => setCurrentPage(totalPages - 1)}
              disabled={currentPage >= totalPages - 1}
              aria-label="마지막 페이지로 이동"
            >
              <FiChevronsRight />
            </button>
          </motion.div>
        )}
      </div>

      {/* 이미지 슬라이더 모달 */}
      <AnimatePresence>
        {selectedImageIndex !== null && (
          <ImageSlider
            images={galleries}
            initialIndex={selectedImageIndex}
            onClose={handleCloseSlider}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
