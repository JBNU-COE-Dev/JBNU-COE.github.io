import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getActivityList } from '../../services/activityApi';
import { VALID_CATEGORIES, CATEGORY_LABEL } from './activityConstants';
import ActivityCard from './ActivityCard';
import FilterBar from './FilterBar';
import './activities.css';

function ActivityList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category');
  const initialCategory = VALID_CATEGORIES.includes(categoryFromUrl) ? categoryFromUrl : undefined;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategoryState] = useState(initialCategory);
  const [sort, setSort] = useState('latest');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const size = 12;

  // URL 쿼리와 동기화: 헤더에서 /activities?category=CONTEST 등으로 진입 시 반영
  useEffect(() => {
    const urlCategory = searchParams.get('category');
    const next = VALID_CATEGORIES.includes(urlCategory) ? urlCategory : undefined;
    setCategoryState(next);
  }, [searchParams]);

  const setCategory = useCallback((v) => {
    setCategoryState(v);
    setPage(0);
    setSearchParams(v ? { category: v } : {}, { replace: true });
  }, [setSearchParams]);

  const fetchList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, size, sort };
      if (category) params.category = category;
      const res = await getActivityList(params);
      setItems(Array.isArray(res.content) ? res.content : []);
      setTotalPages(res.totalPages ?? 0);
    } catch (err) {
      console.error('[ActivityList] API 오류:', err);
      setError(err.message || '목록을 불러오지 못했습니다.');
      setItems([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [category, sort, page]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  // 클라이언트 사이드 검색 필터링
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.trim().toLowerCase();
    return items.filter(
      (item) =>
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.organization && item.organization.toLowerCase().includes(q)) ||
        (item.author && item.author.toLowerCase().includes(q))
    );
  }, [items, searchQuery]);

  const categoryName = category ? CATEGORY_LABEL[category] : null;

  const renderEmptyState = () => {
    if (searchQuery.trim()) {
      return (
        <div className="activities-empty">
          <svg className="activities-empty-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <p>"{searchQuery}" 검색 결과가 없습니다.</p>
          <p className="activities-empty-sub">다른 키워드로 검색해보세요.</p>
        </div>
      );
    }
    return (
      <div className="activities-empty">
        <svg className="activities-empty-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
        <p>{categoryName ? `${categoryName} 카테고리에 ` : ''}등록된 게시글이 없습니다.</p>
        <p className="activities-empty-sub">새 글을 작성해보세요!</p>
      </div>
    );
  };

  return (
    <div className="activities-page">
      <header className="activities-header">
        <h1>매칭플랫폼</h1>
        <p>공과대학 학우를 위한 대외활동, 공모전 정보와 팀원 모집을 한눈에 확인하세요.</p>
      </header>

      <FilterBar
        category={category}
        sort={sort}
        onCategoryChange={setCategory}
        onSortChange={(v) => {
          setSort(v);
          setPage(0);
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {loading ? (
        <div className="activities-grid">
          {Array.from({ length: 6 }, (_, i) => (
            <div className="skeleton-card" key={`skel-${i}`}>
              <div className="skeleton-bone skeleton-card-image" />
              <div className="skeleton-card-body">
                <div className="skeleton-bone skeleton-card-category" />
                <div className="skeleton-bone skeleton-card-title" />
                <div className="skeleton-bone skeleton-card-title-short" />
                <div className="skeleton-card-meta">
                  <div className="skeleton-bone skeleton-card-meta-left" />
                  <div className="skeleton-bone skeleton-card-meta-right" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="activities-empty">
          <p>{error}</p>
          <p className="activities-empty-sub">
            API 주소(REACT_APP_API_URL)와 백엔드 실행 여부를 확인해주세요.
          </p>
          <button
            type="button"
            className="btn-primary activities-retry-btn"
            onClick={() => fetchList()}
          >
            다시 시도
          </button>
        </div>
      ) : filteredItems.length === 0 ? (
        renderEmptyState()
      ) : (
        <>
          <div className="activities-grid">
            {filteredItems.map((item) => (
              <ActivityCard key={item.id} item={item} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="activities-pagination">
              <button
                type="button"
                disabled={page <= 0}
                onClick={() => setPage((p) => p - 1)}
              >
                이전
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  className={page === i ? 'active' : ''}
                  onClick={() => setPage(i)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                type="button"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
              >
                다음
              </button>
            </div>
          )}
        </>
      )}

      <div className="activities-write-btn-wrap">
        <button
          type="button"
          className="btn-primary activities-write-btn"
          onClick={() => navigate('/activities/recruit')}
        >
          팀원 모집 글쓰기
        </button>
      </div>
    </div>
  );
}

export default ActivityList;
