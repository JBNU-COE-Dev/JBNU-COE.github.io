import React from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const PAGE_WINDOW = 5;

/** 현재 페이지 주변의 페이지 번호 목록 (최대 5개) */
const getPageNumbers = (currentPage, totalPages) => {
  const start = Math.max(0, Math.min(currentPage - Math.floor(PAGE_WINDOW / 2), totalPages - PAGE_WINDOW));
  const end = Math.min(totalPages, start + PAGE_WINDOW);
  return Array.from({ length: end - start }, (_, i) => start + i);
};

const SkeletonRow = () => (
  <div className="skeleton-row">
    <div className="skeleton-bar"></div>
    <div className="skeleton-bar wide"></div>
    <div className="skeleton-bar skeleton-author"></div>
    <div className="skeleton-bar"></div>
    <div className="skeleton-bar"></div>
  </div>
);

export default function AnnouncementContent({
  notices,
  pinnedNotices,
  loading,
  currentPage,
  setCurrentPage,
  totalPages,
  totalElements,
  formatDate
}) {
  return (
    <section className="notice-section">
      {/* 고정 공지 */}
      {pinnedNotices.length > 0 && (
        <>
          <div className="section-head">
            <div className="section-title-group">
              <h2>고정 공지</h2>
              <span className="section-count">{pinnedNotices.length}</span>
            </div>
          </div>
          {/* 전체 공지와 같은 행 형식 (열 구성 동일) */}
          <div className="notice-table pinned-table">
            {pinnedNotices.map((notice) => (
              <Link
                key={notice.id}
                to={`/notice/announcement/${notice.id}`}
                className="notice-row"
              >
                <span className="notice-category">{notice.category}</span>
                <span className="notice-title">
                  {notice.title}
                </span>
                <span className="notice-author">{notice.author}</span>
                <span className="notice-date">{formatDate(notice.createdAt)}</span>
                <span className="notice-views">{notice.viewCount}</span>
                <span className="notice-row-mobile-meta">
                  <span>{formatDate(notice.createdAt)}</span>
                  <span className="meta-divider">|</span>
                  <span>조회 {notice.viewCount}</span>
                </span>
              </Link>
            ))}
          </div>
        </>
      )}

      {/* 전체 공지 */}
      <div className="section-head">
        <div className="section-title-group">
          <h2>전체 공지</h2>
          {totalElements != null && (
            <span className="section-count">{totalElements}</span>
          )}
        </div>
        {totalPages > 0 && (
          <span className="section-page">
            {currentPage + 1} / {totalPages} 페이지
          </span>
        )}
      </div>

      <div className="notice-table">
        <div className="notice-row notice-table-head">
          <span>분류</span>
          <span>제목</span>
          <span className="notice-author">작성자</span>
          <span>등록일</span>
          <span className="notice-views">조회</span>
        </div>

        {loading ? (
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => <SkeletonRow key={i} />)
        ) : notices.length === 0 ? (
          <div className="no-notices">공지사항이 없습니다.</div>
        ) : (
          /* 행은 .notice-table 의 직계 자식이어야 합니다 (:last-child 테두리) */
          notices.map((notice) => (
            <Link
              key={notice.id}
              to={`/notice/announcement/${notice.id}`}
              className="notice-row"
            >
              <span className="notice-category">{notice.category}</span>
              <span className="notice-title">{notice.title}</span>
              <span className="notice-author">{notice.author}</span>
              <span className="notice-date">{formatDate(notice.createdAt)}</span>
              <span className="notice-views">{notice.viewCount}</span>
              {/* 모바일에서만 보이는 메타 줄 */}
              <span className="notice-row-mobile-meta">
                <span>{formatDate(notice.createdAt)}</span>
                <span className="meta-divider">|</span>
                <span>조회 {notice.viewCount}</span>
              </span>
            </Link>
          ))
        )}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            type="button"
            onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
            className="page-button"
            aria-label="이전 페이지"
          >
            <FiChevronLeft />
          </button>

          {getPageNumbers(currentPage, totalPages).map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => setCurrentPage(page)}
              className={`page-button ${page === currentPage ? 'active' : ''}`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page + 1}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
            disabled={currentPage >= totalPages - 1}
            className="page-button"
            aria-label="다음 페이지"
          >
            <FiChevronRight />
          </button>
        </div>
      )}
    </section>
  );
}
