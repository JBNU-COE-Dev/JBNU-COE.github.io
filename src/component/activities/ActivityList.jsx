import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [category, setCategoryState] = useState(initialCategory);
  const [sort, setSort] = useState('latest');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const size = 12;

  const observerRef = useRef(null);
  const sentinelRef = useRef(null);

  // URL 쿼리와 동기화
  useEffect(() => {
    const urlCategory = searchParams.get('category');
    const next = VALID_CATEGORIES.includes(urlCategory) ? urlCategory : undefined;
    setCategoryState(next);
  }, [searchParams]);

  const setCategory = useCallback((v) => {
    setCategoryState(v);
    setItems([]);
    setPage(0);
    setHasMore(true);
    setSearchParams(v ? { category: v } : {}, { replace: true });
  }, [setSearchParams]);

  const handleSortChange = useCallback((v) => {
    setSort(v);
    setItems([]);
    setPage(0);
    setHasMore(true);
  }, []);

  // 데이터 fetch
  const fetchList = useCallback(async (pageNum) => {
    if (pageNum === 0) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    setError(null);
    try {
      const params = { page: pageNum, size, sort };
      if (category) params.category = category;
      const res = await getActivityList(params);
      const newItems = Array.isArray(res.content) ? res.content : [];
      setItems((prev) => pageNum === 0 ? newItems : [...prev, ...newItems]);
      setHasMore(pageNum + 1 < (res.totalPages ?? 0));
    } catch (err) {
      console.error('[ActivityList] API 오류:', err);
      setError(err.message || '목록을 불러오지 못했습니다.');
      if (pageNum === 0) {
        setItems([]);
      }
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [category, sort]);

  // 카테고리, 정렬 변경 또는 최초 로드 시 page=0 fetch
  useEffect(() => {
    fetchList(0);
  }, [fetchList]);

  // page 증가 시 추가 fetch (page > 0)
  useEffect(() => {
    if (page > 0) {
      fetchList(page);
    }
  }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  // Intersection Observer로 sentinel 감지 → 다음 페이지 로드
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          setPage((prev) => prev + 1);
        }
      },
      { rootMargin: '200px' }
    );

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [hasMore, loading, loadingMore]);

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

  const renderSkeleton = (count = 6) => (
    <div className="activities-grid">
      {Array.from({ length: count }, (_, i) => (
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
  );

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
        onSortChange={handleSortChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {loading ? (
        renderSkeleton()
      ) : error ? (
        <div className="activities-empty">
          <p>{error}</p>
          <p className="activities-empty-sub">
            API 주소(REACT_APP_API_URL)와 백엔드 실행 여부를 확인해주세요.
          </p>
          <button
            type="button"
            className="btn-primary activities-retry-btn"
            onClick={() => { setItems([]); setPage(0); setHasMore(true); fetchList(0); }}
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

          {loadingMore && (
            <div className="activities-load-more">
              <div className="activities-spinner" />
            </div>
          )}

          {!hasMore && items.length > size && (
            <p className="activities-end-message">모든 게시글을 불러왔습니다.</p>
          )}
        </>
      )}

      {/* Intersection Observer sentinel */}
      <div ref={sentinelRef} className="activities-scroll-sentinel" />

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
