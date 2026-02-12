import React from 'react';
import { CATEGORY_OPTIONS, SORT_OPTIONS, CATEGORY_LABEL } from './activityConstants';
import './activities.css';

/**
 * 카테고리 필터, 정렬 옵션, 검색 입력 바 + 활성 필터 뱃지
 */
function FilterBar({ category, sort, onCategoryChange, onSortChange, searchQuery, onSearchChange }) {
  const hasActiveFilter = category || sort !== 'latest' || searchQuery.trim();
  const sortLabel = SORT_OPTIONS.find((o) => o.value === sort)?.label;

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
      <div className="activities-filter-group activities-search-group">
        <label className="activities-filter-label">검색</label>
        <div className="activities-search-wrap">
          <input
            type="text"
            className="activities-filter-select activities-search-input"
            placeholder="제목, 주최, 작성자 검색"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="activities-search-clear"
              onClick={() => onSearchChange('')}
              aria-label="검색어 지우기"
            >
              &times;
            </button>
          )}
        </div>
      </div>

      {hasActiveFilter && (
        <div className="activities-active-filters">
          {category && (
            <span className="activities-filter-badge">
              {CATEGORY_LABEL[category]}
              <button type="button" onClick={() => onCategoryChange(undefined)} aria-label="카테고리 필터 해제">&times;</button>
            </span>
          )}
          {sort !== 'latest' && (
            <span className="activities-filter-badge">
              {sortLabel}
              <button type="button" onClick={() => onSortChange('latest')} aria-label="정렬 초기화">&times;</button>
            </span>
          )}
          {searchQuery.trim() && (
            <span className="activities-filter-badge">
              "{searchQuery}"
              <button type="button" onClick={() => onSearchChange('')} aria-label="검색어 해제">&times;</button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default FilterBar;
