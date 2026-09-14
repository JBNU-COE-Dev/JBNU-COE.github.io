import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getDDayLabel, getDDayNumber } from '../../utils/dday';
import { getResourceFileUrl } from '../../services/activityApi';
import { CATEGORY_LABEL, formatDeadline, parseRoles } from './utils';
import './activities.css';

const URGENT_DAYS = 7;

/** 썸네일이 없을 때 카테고리별로 깔아주는 선화 아이콘 */
function CategoryGlyph({ category }) {
  const common = {
    width: 26,
    height: 26,
    viewBox: '0 0 24 24',
    fill: 'none',
    strokeWidth: 1.5,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  };
  if (category === 'CONTEST') {
    return (
      <svg {...common}>
        <path d="M8 4h8v5a4 4 0 0 1-8 0V4z" />
        <path d="M8 6H5v1a3 3 0 0 0 3 3" />
        <path d="M16 6h3v1a3 3 0 0 1-3 3" />
        <path d="M12 13v3" />
        <path d="M10 16h4l1.2 4H8.8L10 16z" />
      </svg>
    );
  }
  if (category === 'TEAM_RECRUITMENT') {
    return (
      <svg {...common}>
        <circle cx="9" cy="8" r="3.2" />
        <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
        <circle cx="17.2" cy="9.6" r="2.4" />
        <path d="M16.2 14.4a5 5 0 0 1 4.3 4.6" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M3 10v4a1 1 0 0 0 1 1h3l6 4V5L7 9H4a1 1 0 0 0-1 1z" />
      <path d="M17.5 8.5a5 5 0 0 1 0 7" />
      <path d="M20.5 6a9 9 0 0 1 0 12" />
    </svg>
  );
}

/**
 * 목록 한 줄. 마감일을 오른쪽에 크게 붙여서 마감 순으로 훑을 수 있게 한다.
 */
function ActivityRow({ item }) {
  const navigate = useNavigate();

  const dday = getDDayNumber(item.endDate);
  const isTeamRecruitment = item.category === 'TEAM_RECRUITMENT';
  // 팀원 모집은 작성자가 직접 마감 처리할 수 있고, 정보성 글은 마감일로만 판단한다.
  const isClosed = (isTeamRecruitment && item.status === 'CLOSED') || (dday != null && dday < 0);
  const isUrgent = !isClosed && dday != null && dday <= URGENT_DAYS;

  const thumbnailUrl = item.thumbnailUrl ? getResourceFileUrl(item.thumbnailUrl) : null;
  const roles = parseRoles(item.recruitmentRoles);
  const deadlineText = formatDeadline(item.endDate);

  const ddayTone = isClosed ? 'closed' : isUrgent ? 'urgent' : 'normal';
  const openDetail = () => navigate(`/activities/${item.id}`);

  const metaParts = [item.organization || item.author];
  if (item.headcount != null) metaParts.push(`모집 ${item.headcount}명`);
  if (roles.length > 0) metaParts.push(roles.join(', '));
  if (!isTeamRecruitment && item.viewCount != null) metaParts.push(`조회 ${item.viewCount}`);

  return (
    <article
      className={`activity-row${isClosed ? ' is-closed' : ''}`}
      role="button"
      tabIndex={0}
      onClick={openDetail}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openDetail();
        }
      }}
    >
      <div className={`activity-row-thumb category-${item.category}`}>
        {thumbnailUrl ? <img src={thumbnailUrl} alt="" /> : <CategoryGlyph category={item.category} />}
      </div>

      <div className="activity-row-main">
        <div className="activity-row-badges">
          <span className="activity-row-category">{CATEGORY_LABEL[item.category] || item.category}</span>
          {isTeamRecruitment && (
            <span className={`activity-row-status ${isClosed ? 'closed' : 'recruiting'}`}>
              {isClosed ? '마감' : '모집중'}
            </span>
          )}
        </div>
        <h3 className="activity-row-title">{item.title}</h3>
        <div className="activity-row-meta">
          {metaParts.map((part, i) => (
            <React.Fragment key={`${i}-${part}`}>
              {i > 0 && <span className="activity-row-meta-sep" aria-hidden="true">·</span>}
              <span>{part}</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="activity-row-dday">
        <span className={`activity-row-dday-value ${ddayTone}`}>{getDDayLabel(item.endDate)}</span>
        {deadlineText && (
          <span className="activity-row-dday-date">
            {deadlineText} {isClosed ? '종료' : '마감'}
          </span>
        )}
      </div>
    </article>
  );
}

export default ActivityRow;
