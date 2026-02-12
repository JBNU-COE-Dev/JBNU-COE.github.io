import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiShare2, FiBookmark } from 'react-icons/fi';
import { getActivityById, getResourceFileUrl } from '../../services/activityApi';
import { CATEGORY_LABEL } from './activityConstants';
import { getDDayLabel } from '../../utils/dday';
import './activities.css';

function ActivityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [shareTooltip, setShareTooltip] = useState('');

  useEffect(() => {
    if (!id) return;
    getActivityById(id)
      .then(setItem)
      .catch((err) => setError(err.message || '조회에 실패했습니다.'))
      .finally(() => setLoading(false));
  }, [id]);

  // localStorage 북마크 상태 복원
  useEffect(() => {
    if (!id) return;
    try {
      const bookmarks = JSON.parse(localStorage.getItem('activityBookmarks') || '[]');
      setBookmarked(bookmarks.includes(Number(id) || id));
    } catch {}
  }, [id]);

  const toggleBookmark = useCallback(() => {
    try {
      const bookmarks = JSON.parse(localStorage.getItem('activityBookmarks') || '[]');
      const key = Number(id) || id;
      const next = bookmarks.includes(key)
        ? bookmarks.filter((b) => b !== key)
        : [...bookmarks, key];
      localStorage.setItem('activityBookmarks', JSON.stringify(next));
      setBookmarked(!bookmarked);
    } catch {}
  }, [id, bookmarked]);

  const handleShare = useCallback(async () => {
    const url = window.location.href;
    const title = item?.title || '매칭플랫폼';
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {}
    }
    try {
      await navigator.clipboard.writeText(url);
      setShareTooltip('링크가 복사되었습니다!');
      setTimeout(() => setShareTooltip(''), 2000);
    } catch {}
  }, [item]);

  if (loading) {
    return (
      <div className="activities-page activities-loading">
        <div className="activities-spinner" />
        <p>불러오는 중...</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="activities-page activities-empty">
        <svg className="activities-empty-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <p>{error || '게시글을 찾을 수 없습니다.'}</p>
        <button
          type="button"
          className="btn-secondary activities-retry-btn"
          onClick={() => navigate('/activities')}
        >
          목록으로
        </button>
      </div>
    );
  }

  const thumbnailUrl = item.thumbnailUrl ? getResourceFileUrl(item.thumbnailUrl) : null;
  const ddayLabel = getDDayLabel(item.endDate);

  return (
    <div className="activities-detail">
      <div className="activities-detail-header">
        <span className="activity-card-category">{CATEGORY_LABEL[item.category] || item.category}</span>
        <h1 className="activities-detail-title">{item.title}</h1>
        <div className="activities-detail-meta">
          <span>작성자: {item.author}</span>
          {item.organization && <span>주최: {item.organization}</span>}
          {item.headcount != null && <span>모집 인원: {item.headcount}명</span>}
          {item.endDate && <span>모집 기한: {item.endDate} ({ddayLabel})</span>}
          <span>조회 {item.viewCount ?? 0}</span>
        </div>
      </div>

      {thumbnailUrl && (
        <div className="activities-detail-thumbnail">
          <img src={thumbnailUrl} alt="" />
        </div>
      )}

      <div className="activities-detail-content">{item.content}</div>

      <div className="activities-detail-actions">
        {item.applyUrl && (
          <a href={item.applyUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
            지원하기
          </a>
        )}
        {item.contactUrl && (
          <a href={item.contactUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
            오픈채팅/연락처
          </a>
        )}
        <div className="activities-detail-icon-actions">
          <button type="button" className="activities-icon-btn" onClick={handleShare} title="공유하기">
            <FiShare2 size={18} />
            {shareTooltip && <span className="activities-tooltip">{shareTooltip}</span>}
          </button>
          <button
            type="button"
            className={`activities-icon-btn ${bookmarked ? 'bookmarked' : ''}`}
            onClick={toggleBookmark}
            title={bookmarked ? '북마크 해제' : '북마크'}
          >
            <FiBookmark size={18} />
          </button>
        </div>
        <button type="button" className="btn-secondary" onClick={() => navigate('/activities')}>
          목록으로
        </button>
      </div>
    </div>
  );
}

export default ActivityDetail;
