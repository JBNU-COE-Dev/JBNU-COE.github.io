import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getActivityById, getResourceFileUrl } from '../../services/activityApi';
import { getDDayLabel } from '../../utils/dday';
import './activities.css';

const CATEGORY_LABEL = {
  EXTERNAL_ACTIVITY: '대외활동',
  CONTEST: '공모전',
  TEAM_RECRUITMENT: '팀원 모집',
};

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
        <span className="pledge-card-category">{CATEGORY_LABEL[item.category] || item.category}</span>
        <h1 className="activities-detail-title">{item.title}</h1>
        <div className="activities-detail-meta">
          <span>작성자: {item.author}</span>
          {item.organization && <span>주최: {item.organization}</span>}
          {item.endDate && <span>마감: {item.endDate} ({ddayLabel})</span>}
          <span>조회 {item.viewCount ?? 0}</span>
        </div>
      </div>

      {thumbnailUrl && (
        <div className="pledge-card-image-wrap" style={{ paddingTop: '40%', marginBottom: '1.5rem' }}>
          <img src={thumbnailUrl} alt="" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
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
