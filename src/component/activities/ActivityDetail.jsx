import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getActivityById, deleteActivity, getResourceFileUrl } from '../../services/activityApi';
import { useAuth } from '../../contexts/AuthContext';
import { getDDayLabel } from '../../utils/dday';
import { CATEGORY_LABEL } from './utils';
import './activities.css';

function ActivityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, userId } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    getActivityById(id)
      .then(setItem)
      .catch((err) => setError(err.message || '조회에 실패했습니다.'))
      .finally(() => setLoading(false));
  }, [id]);

  const isOwnTeamPost =
    item?.category === 'TEAM_RECRUITMENT' &&
    isAuthenticated &&
    item?.authorId != null &&
    userId != null &&
    String(item.authorId) === String(userId);

  const handleDelete = async () => {
    if (!window.confirm('이 모집글을 삭제할까요? 삭제 후에는 복구할 수 없습니다.')) {
      return;
    }
    setDeleting(true);
    setError(null);
    try {
      await deleteActivity(id);
      navigate('/activities?category=TEAM_RECRUITMENT', { replace: true });
    } catch (err) {
      const message = err.message || '삭제에 실패했습니다.';
      if (/403|권한|forbidden/i.test(message)) {
        setError('권한이 없습니다.');
      } else {
        setError(message);
      }
      setDeleting(false);
    }
  };

  if (loading) return <div className="activities-page activities-loading">불러오는 중...</div>;
  if ((error && !item) || !item) {
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

      {error && item && (
        <div className="activities-detail-error" role="alert">
          {error}
        </div>
      )}

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
        {isOwnTeamPost && (
          <>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate(`/activities/${id}/edit`)}
              disabled={deleting}
            >
              수정
            </button>
            <button
              type="button"
              className="btn-danger"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? '삭제 중...' : '삭제'}
            </button>
          </>
        )}
        <button type="button" className="btn-secondary" onClick={() => navigate('/activities')}>
          목록으로
        </button>
      </div>
    </div>
  );
}

export default ActivityDetail;
