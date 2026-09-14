import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getActivityList, getActivityCounts } from '../../services/activityApi';
import ActivityRow from './ActivityRow';
import FilterSidebar from './FilterSidebar';
import { CATEGORY_LABEL, VALID_CATEGORIES } from './utils';
import './activities.css';

const PAGE_SIZE = 10;
const URGENT_DAYS = 7;
const URGENT_SIZE = 3;

const SORT_OPTIONS = [
  { value: 'deadline', label: '마감 임박순' },
  { value: 'latest', label: '최신순' },
  { value: 'viewCount', label: '조회수순' },
];
const VALID_SORTS = SORT_OPTIONS.map((o) => o.value);
const VALID_WITHIN = [7, 30];

/** 현재 페이지 주변만 보여주는 페이지 번호 목록 */
function pageWindow(current, total, span = 5) {
  if (total <= span) return Array.from({ length: total }, (_, i) => i);
  const start = Math.min(Math.max(0, current - Math.floor(span / 2)), total - span);
  return Array.from({ length: span }, (_, i) => start + i);
}

function ActivityList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // 필터 상태는 URL 쿼리 하나만 원본으로 둔다. 헤더의 /activities?category=CONTEST 진입도
  // 그대로 반영되고, 필터를 건 화면을 링크로 공유할 수 있다.
  const rawCategory = searchParams.get('category');
  const category = VALID_CATEGORIES.includes(rawCategory) ? rawCategory : undefined;
  const rawSort = searchParams.get('sort');
  const sort = VALID_SORTS.includes(rawSort) ? rawSort : 'deadline';
  const openOnly = searchParams.get('open') !== 'false';
  const rawWithin = Number(searchParams.get('within'));
  const within = VALID_WITHIN.includes(rawWithin) ? rawWithin : undefined;
  const page = Math.max(0, Number(searchParams.get('page')) || 0);

  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [counts, setCounts] = useState(null);
  const [urgentItems, setUrgentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryKey, setRetryKey] = useState(0);

  /** 필터를 바꾸면 페이지는 처음으로 되돌린다 */
  const updateParams = useCallback((patch) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      Object.entries(patch).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') next.delete(key);
        else next.set(key, String(value));
      });
      if (!('page' in patch)) next.delete('page');
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  const openParam = openOnly ? true : undefined;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getActivityList({ category, sort, open: openParam, within, page, size: PAGE_SIZE })
      .then((res) => {
        if (cancelled) return;
        setItems(Array.isArray(res.content) ? res.content : []);
        setTotalPages(res.totalPages ?? 0);
        setTotalElements(res.totalElements ?? 0);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('[ActivityList] API 오류:', err);
        setError(err.message || '목록을 불러오지 못했습니다.');
        setItems([]);
        setTotalPages(0);
        setTotalElements(0);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [category, sort, openParam, within, page, retryKey]);

  // 건수는 부가 정보라 실패해도 목록을 막지 않는다 (숫자만 빠진 채로 렌더링)
  useEffect(() => {
    let cancelled = false;
    getActivityCounts({ open: openParam, within })
      .then((res) => { if (!cancelled) setCounts(res); })
      .catch(() => { if (!cancelled) setCounts(null); });
    return () => { cancelled = true; };
  }, [openParam, within, retryKey]);

  // "이번 주 마감"은 목록 맨 위 바로가기라서 현재 카테고리를 따라간다.
  // 이미 7일 이내로 거른 화면이나 2페이지부터는 중복이라 띄우지 않는다.
  const showUrgent = page === 0 && within !== URGENT_DAYS;
  useEffect(() => {
    if (!showUrgent) {
      setUrgentItems([]);
      return undefined;
    }
    let cancelled = false;
    getActivityList({ category, sort: 'deadline', open: true, within: URGENT_DAYS, page: 0, size: URGENT_SIZE })
      .then((res) => { if (!cancelled) setUrgentItems(Array.isArray(res.content) ? res.content : []); })
      .catch(() => { if (!cancelled) setUrgentItems([]); });
    return () => { cancelled = true; };
  }, [category, showUrgent, retryKey]);

  const categoryLabel = category ? CATEGORY_LABEL[category] : '전체';

  return (
    <div className="activities-page">
      <header className="activities-header">
        <div className="activities-header-text">
          <span className="activities-eyebrow">JBNU COLLEGE OF ENGINEERING</span>
          <h1>대외활동 · 공모전 · 팀원 모집</h1>
          <p>마감이 가까운 순서대로, 한 화면에 더 많이 훑어볼 수 있게.</p>
        </div>
        <button
          type="button"
          className="activities-cta"
          onClick={() => navigate('/activities/recruit')}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
            <path d="M12 5v14" /><path d="M5 12h14" />
          </svg>
          팀원 모집 글쓰기
        </button>
      </header>

      <div className="activities-body">
        <FilterSidebar
          category={category}
          openOnly={openOnly}
          within={within}
          counts={counts}
          onCategoryChange={(v) => updateParams({ category: v })}
          onOpenOnlyChange={(v) => updateParams({ open: v ? undefined : 'false' })}
          onWithinChange={(v) => updateParams({ within: v })}
        />

        <section className="activities-main">
          <div className="activities-toolbar">
            <span className="activities-total">
              {categoryLabel} <strong>{totalElements}건</strong>
            </span>
            <div className="activities-sort" role="group" aria-label="정렬">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`activities-sort-item${sort === opt.value ? ' is-active' : ''}`}
                  aria-pressed={sort === opt.value}
                  onClick={() => updateParams({ sort: opt.value })}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {showUrgent && urgentItems.length > 0 && (
            <section className="activities-urgent">
              <h2 className="activities-urgent-title">
                <span className="activities-urgent-dot" aria-hidden="true" />
                이번 주 마감
              </h2>
              <div className="activities-urgent-list">
                {urgentItems.map((item) => (
                  <ActivityRow key={item.id} item={item} />
                ))}
              </div>
            </section>
          )}

          {loading ? (
            <div className="activities-loading">불러오는 중...</div>
          ) : error ? (
            <div className="activities-empty">
              <p>{error}</p>
              <p className="activities-empty-hint">
                API 주소(REACT_APP_API_URL)와 백엔드 실행 여부를 확인해주세요.
              </p>
              <button
                type="button"
                className="activities-retry"
                onClick={() => setRetryKey((k) => k + 1)}
              >
                다시 시도
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="activities-empty">
              <p>조건에 맞는 게시글이 없습니다.</p>
              <p className="activities-empty-hint">필터를 넓혀보세요.</p>
            </div>
          ) : (
            <>
              <div className="activities-list">
                <h2 className="activities-list-title">전체 목록</h2>
                {items.map((item) => (
                  <ActivityRow key={item.id} item={item} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="activities-pagination">
                  <button
                    type="button"
                    disabled={page <= 0}
                    onClick={() => updateParams({ page: page - 1 })}
                  >
                    이전
                  </button>
                  {pageWindow(page, totalPages).map((i) => (
                    <button
                      key={i}
                      type="button"
                      className={page === i ? 'active' : ''}
                      aria-current={page === i ? 'page' : undefined}
                      onClick={() => updateParams({ page: i })}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    type="button"
                    disabled={page >= totalPages - 1}
                    onClick={() => updateParams({ page: page + 1 })}
                  >
                    다음
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default ActivityList;
