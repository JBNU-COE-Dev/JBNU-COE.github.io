import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiDownload, FiEye, FiFileText, FiCalendar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { financeApi } from '../../../services';
import './Finance.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// 기본 데이터 (API 실패 시 fallback)
const defaultReports = [
  {
    id: 1,
    title: '2025년 미리보기 회계 보고서',
    description: '2025년 미리보기 회계 내역 보고서입니다.',
    fileName: '2025_1학기_회계보고서.pdf',
    fileUrl: '/finance/2025_1학기_회계보고서.pdf',
    fileSize: 2458624,
    year: 2025,
    month: 6,
    createdAt: '2025-06-30T10:00:00',
  },
];

export default function Finance() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [appliedKeyword, setAppliedKeyword] = useState('');
  const [sortOrder, setSortOrder] = useState('desc'); // desc: 최신순, asc: 오래된순
  const [selectedYear, setSelectedYear] = useState('전체');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(null);

  // 연도 목록 생성 (현재 연도부터 5년 전까지)
  const currentYear = new Date().getFullYear();
  const years = ['전체', ...Array.from({ length: 6 }, (_, i) => currentYear - i)];

  // 회계 보고서 목록 조회
  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await financeApi.getFinanceReports({
        page: currentPage,
        size: 10,
        keyword: appliedKeyword,
        sortBy: 'createdAt',
        sortOrder: sortOrder,
        year: selectedYear !== '전체' ? selectedYear : undefined,
      });

      if (response && response.content) {
        setReports(response.content);
        setTotalPages(response.totalPages || 1);
        setTotalElements(response.totalElements || response.content.length);
      } else if (Array.isArray(response)) {
        setReports(response);
        setTotalPages(1);
        setTotalElements(response.length);
      } else {
        // API 응답이 없으면 기본 데이터 사용
        setReports(defaultReports);
        setTotalPages(1);
        setTotalElements(defaultReports.length);
      }
    } catch (err) {
      console.error('회계 보고서 조회 실패:', err);
      // API 실패 시 기본 데이터 사용
      setReports(defaultReports);
      setTotalPages(1);
      setTotalElements(defaultReports.length);
      setError(null);
    } finally {
      setLoading(false);
    }
  }, [currentPage, appliedKeyword, sortOrder, selectedYear]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // 검색 실행
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(0);
    setAppliedKeyword(searchKeyword.trim());
  };

  // 검색 초기화
  const handleResetSearch = () => {
    setSearchKeyword('');
    setAppliedKeyword('');
    setSelectedYear('전체');
    setSortOrder('desc');
    setCurrentPage(0);
  };

  // 정렬 변경
  const handleSortChange = (order) => {
    setSortOrder(order);
    setCurrentPage(0);
  };

  // 연도 필터 변경
  const handleYearChange = (year) => {
    setSelectedYear(year);
    setCurrentPage(0);
  };

  // 파일 크기 포맷팅
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  // PDF 미리보기 열기
  const handlePreview = (report) => {
    const url = report.fileUrl?.startsWith('http') 
      ? report.fileUrl 
      : `${API_URL}${report.fileUrl}`;
    setPreviewUrl(url);
  };

  // PDF 미리보기 닫기
  const handleClosePreview = () => {
    setPreviewUrl(null);
  };

  // PDF 다운로드
  const handleDownload = (report) => {
    const url = report.fileUrl?.startsWith('http') 
      ? report.fileUrl 
      : `${API_URL}${report.fileUrl}`;
    
    const link = document.createElement('a');
    link.href = url;
    link.download = report.fileName || 'report.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    <div className="finance-report-card skeleton">
      <div className="skeleton-icon"></div>
      <div className="skeleton-content">
        <div className="skeleton-title"></div>
        <div className="skeleton-desc"></div>
        <div className="skeleton-meta"></div>
      </div>
    </div>
  );

  return (
    <motion.div
      className="finance-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* 헤더 */}
      <div className="finance-header">
        <h1>회계 내역 공개</h1>
        <p className="finance-subtitle">공과대학 학생회의 투명한 재정 운영을 위한 회계 보고서</p>
      </div>

      {/* 검색 및 필터 영역 */}
      <motion.div 
        className="finance-filter-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <form className="finance-search-form" onSubmit={handleSearch}>
          <div className="search-input-wrapper">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="보고서 제목 또는 내용 검색..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="finance-search-input"
            />
          </div>
          <button type="submit" className="search-btn">검색</button>
        </form>

        <div className="finance-filters">
          {/* 연도 필터 */}
          <div className="filter-group">
            <label>연도</label>
            <select 
              value={selectedYear} 
              onChange={(e) => handleYearChange(e.target.value)}
              className="filter-select"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}{year !== '전체' && '년'}</option>
              ))}
            </select>
          </div>

          {/* 정렬 */}
          <div className="filter-group">
            <label>정렬</label>
            <select 
              value={sortOrder} 
              onChange={(e) => handleSortChange(e.target.value)}
              className="filter-select"
            >
              <option value="desc">최신순</option>
              <option value="asc">오래된순</option>
            </select>
          </div>
        </div>

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
              초기화
            </button>
          </div>
        )}
      </motion.div>

      {/* 에러 메시지 */}
      {error && (
        <motion.div
          className="finance-error"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {error}
          <button className="error-retry-btn" onClick={fetchReports}>다시 시도</button>
        </motion.div>
      )}

      {/* 보고서 목록 */}
      <motion.div 
        className="finance-reports-list"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {loading ? (
          [...Array(5)].map((_, i) => <SkeletonCard key={i} />)
        ) : reports.length === 0 ? (
          <div className="no-reports">
            <FiFileText className="no-reports-icon" />
            <p>
              {appliedKeyword 
                ? `'${appliedKeyword}'에 대한 검색 결과가 없습니다.`
                : '등록된 회계 보고서가 없습니다.'
              }
            </p>
          </div>
        ) : (
          reports.map((report, index) => (
            <motion.div
              key={report.id}
              className="finance-report-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="report-icon">
                <FiFileText />
              </div>
              <div className="report-content">
                <h3 className="report-title">{report.title}</h3>
                {report.description && (
                  <p className="report-description">{report.description}</p>
                )}
                <div className="report-meta">
                  <span className="meta-item">
                    <FiCalendar />
                    {formatDate(report.createdAt)}
                  </span>
                  <span className="meta-item file-info">
                    {report.fileName} ({formatFileSize(report.fileSize)})
                  </span>
                </div>
              </div>
              <div className="report-actions">
                <button 
                  className="action-btn preview-btn"
                  onClick={() => handlePreview(report)}
                  title="미리보기"
                >
                  <FiEye />
                  <span>미리보기</span>
                </button>
                <button 
                  className="action-btn download-btn"
                  onClick={() => handleDownload(report)}
                  title="다운로드"
                >
                  <FiDownload />
                  <span>다운로드</span>
                </button>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <motion.div 
          className="finance-pagination"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button
            className="pagination-nav-btn"
            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
          >
            <FiChevronLeft />
          </button>
          
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
          
          <button
            className="pagination-nav-btn"
            onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
            disabled={currentPage >= totalPages - 1}
          >
            <FiChevronRight />
          </button>
        </motion.div>
      )}

      {/* 안내 메시지 */}
      <div className="finance-notice">
        <h3>📋 회계 공개 안내</h3>
        <ul>
          <li>회계 보고서는 PDF 형식으로 제공됩니다.</li>
          <li>문의사항이 있으시면 학생회로 연락 부탁드립니다.</li>
        </ul>
      </div>

      {/* PDF 미리보기 모달 */}
      {previewUrl && (
        <motion.div
          className="pdf-preview-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClosePreview}
        >
          <div className="pdf-preview-container" onClick={(e) => e.stopPropagation()}>
            <div className="pdf-preview-header">
              <h3>PDF 미리보기</h3>
              <button className="preview-close-btn" onClick={handleClosePreview}>×</button>
            </div>
            <div className="pdf-preview-content">
              <iframe
                src={previewUrl}
                title="PDF Preview"
                className="pdf-iframe"
              />
            </div>
            <div className="pdf-preview-footer">
              <a 
                href={previewUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="new-tab-btn"
              >
                새 탭에서 열기
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
