import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getDDayLabel } from '../../utils/dday';
import { getResourceFileUrl } from '../../services/activityApi';
import { CATEGORY_LABEL } from './activityConstants';
import './activities.css';

/**
 * 썸네일, 제목, D-Day 배지, 모집 상태 배지를 포함하는 카드 (링커리어 스타일)
 */
function ActivityCard({ item }) {
  const navigate = useNavigate();
  const ddayLabel = getDDayLabel(item.endDate);
  const thumbnailUrl = item.thumbnailUrl ? getResourceFileUrl(item.thumbnailUrl) : null;
  const isTeamRecruitment = item.category === 'TEAM_RECRUITMENT';
  const statusLabel = item.status === 'CLOSED' ? '마감' : '모집중';

  const handleClick = () => {
    navigate(`/activities/${item.id}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <article
      className="activity-card"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="link"
      aria-label={`${item.title} - ${CATEGORY_LABEL[item.category] || item.category}`}
    >
      <div className="activity-card-image-wrap">
        {thumbnailUrl ? (
          <img src={thumbnailUrl} alt={item.title} className="activity-card-image" loading="lazy" />
        ) : (
          <div className="activity-card-image-placeholder">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}
        <span className="activity-card-dday">{ddayLabel}</span>
        {isTeamRecruitment && (
          <span className={`activity-card-status ${item.status === 'CLOSED' ? 'closed' : 'recruiting'}`}>
            {statusLabel}
          </span>
        )}
      </div>
      <div className="activity-card-body">
        <span className="activity-card-category">{CATEGORY_LABEL[item.category] || item.category}</span>
        <h3 className="activity-card-title">{item.title}</h3>
        <div className="activity-card-meta">
          <span>{item.organization || item.author}</span>
          {item.headcount != null && <span>모집 {item.headcount}명</span>}
          {item.viewCount != null && <span>조회 {item.viewCount}</span>}
        </div>
      </div>
    </article>
  );
}

export default ActivityCard;
