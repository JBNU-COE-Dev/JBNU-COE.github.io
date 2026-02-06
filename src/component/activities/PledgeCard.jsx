import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getDDayLabel } from '../../utils/dday';
import { getResourceFileUrl } from '../../services/activityApi';
import './activities.css';

const CATEGORY_LABEL = {
  EXTERNAL_ACTIVITY: '대외활동',
  CONTEST: '공모전',
  TEAM_RECRUITMENT: '팀원 모집',
};

/**
 * 썸네일, 제목, D-Day 배지, 모집 상태 배지를 포함하는 카드 (링커리어 스타일)
 */
function PledgeCard({ item }) {
  const navigate = useNavigate();
  const ddayLabel = getDDayLabel(item.endDate);
  const thumbnailUrl = item.thumbnailUrl ? getResourceFileUrl(item.thumbnailUrl) : null;
  const isTeamRecruitment = item.category === 'TEAM_RECRUITMENT';
  const statusLabel = item.status === 'CLOSED' ? '마감' : '모집중';

  const handleClick = () => {
    navigate(`/activities/${item.id}`);
  };

  return (
    <article className="pledge-card" onClick={handleClick}>
      <div className="pledge-card-image-wrap">
        {thumbnailUrl ? (
          <img src={thumbnailUrl} alt="" className="pledge-card-image" />
        ) : (
          <div className="pledge-card-image-placeholder" />
        )}
        <span className="pledge-card-dday">{ddayLabel}</span>
        {isTeamRecruitment && (
          <span className={`pledge-card-status ${item.status === 'CLOSED' ? 'closed' : 'recruiting'}`}>
            {statusLabel}
          </span>
        )}
      </div>
      <div className="pledge-card-body">
        <span className="pledge-card-category">{CATEGORY_LABEL[item.category] || item.category}</span>
        <h3 className="pledge-card-title">{item.title}</h3>
        <div className="pledge-card-meta">
          <span>{item.organization || item.author}</span>
          {item.viewCount != null && <span>조회 {item.viewCount}</span>}
        </div>
      </div>
    </article>
  );
}

export default PledgeCard;
