import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getActivityById, getResourceFileUrl } from '../../services/activityApi';
import { getDDayLabel } from '../../utils/dday';
import { CATEGORY_LABEL } from './utils';
import './activities.css';

function ActivityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    getActivityById(id)
      .then(setItem)
      .catch((err) => setError(err.message || '조회에 실패했습니다.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="activities-page activities-loading">불러오는 중...</div>;
  if (error || !item) {
    return (
      <div className="activities-page activities-empty">
        {error || '게시글을 찾을 수 없습니다.'}
        <button
          type="button"
          className="activities-detail-actions btn-secondary"
          style={{ marginTop: '1rem' }}
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
        <span className="activities-detail-category">{CATEGORY_LABEL[item.category] || item.category}</span>
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
        <div className="activities-detail-thumb">
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
        <button type="button" className="btn-secondary" onClick={() => navigate('/activities')}>
          목록으로
        </button>
      </div>
    </div>
  );
}

export default ActivityDetail;
