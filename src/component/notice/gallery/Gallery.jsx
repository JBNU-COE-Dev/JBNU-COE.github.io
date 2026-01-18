import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiEye, FiPaperclip, FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';
import ImageSlider from './ImageSlider';
import { galleryApi } from '../../../services';
import './gallery.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export default function Gallery() {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [appliedKeyword, setAppliedKeyword] = useState(''); // 실제 적용된 검색어
  const [searchType, setSearchType] = useState('all');
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const searchTypes = [
    { id: 'all', label: '제목 + 내용' },
    { id: 'title', label: '제목' },
    { id: 'content', label: '내용' }
  ];

  // 갤러리 목록 조회
  const fetchGalleries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await galleryApi.getGalleries({
        page: currentPage,
        size: 15,
        keyword: appliedKeyword,
        searchType: searchType,
      });

      // API 응답 처리 (Spring Data Page 형식 또는 직접 배열)
      if (response && response.content) {
        setGalleries(response.content);
        setTotalPages(response.totalPages || 1);
        setTotalElements(response.totalElements || response.content.length);
      } else if (Array.isArray(response)) {
        setGalleries(response);
        setTotalPages(1);
        setTotalElements(response.length);
      } else {
        setGalleries([]);
        setTotalPages(0);
        setTotalElements(0);
      }
    } catch (err) {
      console.error('갤러리 조회 실패:', err);
      setError(err.message || '갤러리를 불러오는데 실패했습니다.');
      setGalleries([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, appliedKeyword, searchType]);

  useEffect(() => {
    fetchGalleries();
  }, [fetchGalleries]);

  // 검색 실행
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(0); // 검색 시 첫 페이지로 이동
    setAppliedKeyword(searchKeyword.trim());
  };

  // 검색 초기화
  const handleResetSearch = () => {
    setSearchKeyword('');
    setAppliedKeyword('');
    setSearchType('all');
    setCurrentPage(0);
  };

  // 이미지 클릭 시 슬라이더 열기 및 조회수 증가
  const handleImageClick = async (index) => {
    const gallery = galleries[index];
    if (gallery && gallery.id) {
      try {
        await galleryApi.incrementViewCount(gallery.id);
        // 로컬 상태 업데이트
        setGalleries(prev => prev.map((g, i) => 
          i === index ? { ...g, viewCount: (g.viewCount || 0) + 1 } : g
        ));
      } catch (err) {
        console.error('조회수 증가 실패:', err);
      }
    }
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

          {/* 검색 결과 정보 */}
          {appliedKeyword && (
            <div className="search-result-info">
              <span>
                '{appliedKeyword}' 검색 결과: <strong>{totalElements}건</strong>
              </span>
              <button 
                type="button" 
                className="search-reset-btn"
                onClick={handleResetSearch}
              >
                검색 초기화
              </button>
            </div>
          )}
        </motion.div>

        {/* 에러 메시지 */}
        {error && (
          <motion.div
            className="gallery-error"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {error}
            <button 
              className="error-retry-btn"
              onClick={fetchGalleries}
            >
              다시 시도
            </button>
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
              <p>
                {appliedKeyword 
                  ? `'${appliedKeyword}'에 대한 검색 결과가 없습니다.` 
                  : '등록된 갤러리가 없습니다.'
                }
              </p>
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
                    src={gallery.imageUrl?.startsWith('http') 
                      ? gallery.imageUrl 
                      : `${API_URL}${gallery.imageUrl}`
                    }
                    alt={gallery.title}
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/logo192.png'; // 기본 이미지
                    }}
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
