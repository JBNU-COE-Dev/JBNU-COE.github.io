import React from 'react';
import './activities.css';

const CATEGORY_OPTIONS = [
  { value: '', label: '전체' },
  { value: 'EXTERNAL_ACTIVITY', label: '대외활동' },
  { value: 'CONTEST', label: '공모전' },
  { value: 'TEAM_RECRUITMENT', label: '팀원 모집' },
];

const SORT_OPTIONS = [
  { value: 'latest', label: '최신순' },
  { value: 'deadline', label: '마감 임박순' },
  { value: 'viewCount', label: '조회수순' },
];

/**
 * 카테고리 필터 및 정렬 옵션 선택 바
 */
function FilterBar({ category, sort, onCategoryChange, onSortChange }) {
  return (
    <div className="activities-filter-bar">
      <div className="activities-filter-group">
        <label className="activities-filter-label">카테고리</label>
        <select
          className="activities-filter-select"
          value={category || ''}
          onChange={(e) => onCategoryChange(e.target.value || undefined)}
        >
          {CATEGORY_OPTIONS.map((opt) => (
            <option key={opt.value || 'all'} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <div className="activities-filter-group">
        <label className="activities-filter-label">정렬</label>
        <select
          className="activities-filter-select"
          value={sort || 'latest'}
          onChange={(e) => onSortChange(e.target.value)}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default FilterBar;
