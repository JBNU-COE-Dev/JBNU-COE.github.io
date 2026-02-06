import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getActivityList } from '../../services/activityApi';
import PledgeCard from './PledgeCard';
import FilterBar from './FilterBar';
import './activities.css';

const VALID_CATEGORIES = ['EXTERNAL_ACTIVITY', 'CONTEST', 'TEAM_RECRUITMENT'];

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

  return (
    <div className="activities-page">
      <header className="activities-header">
        <h1>대외활동 · 공모전 · 팀원 모집</h1>
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
      />

      {loading ? (
        <div className="activities-loading">불러오는 중...</div>
      ) : error ? (
        <div className="activities-empty">
          <p>{error}</p>
          <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', color: '#6b7280' }}>
            API 주소(REACT_APP_API_URL)와 백엔드 실행 여부를 확인해주세요.
          </p>
          <button
            type="button"
            className="activities-detail-actions btn-primary"
            style={{ marginTop: '1rem' }}
            onClick={() => fetchList()}
          >
            다시 시도
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="activities-empty">등록된 게시글이 없습니다.</div>
      ) : (
        <>
          <div className="activities-grid">
            {items.map((item) => (
              <PledgeCard key={item.id} item={item} />
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

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <button
          type="button"
          className="activities-detail-actions btn-primary"
          onClick={() => navigate('/activities/recruit')}
        >
          팀원 모집 글쓰기
        </button>
      </div>
    </div>
  );
}

export default ActivityList;
