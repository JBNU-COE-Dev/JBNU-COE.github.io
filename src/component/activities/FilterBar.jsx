import React from 'react';
import { CATEGORY_OPTIONS, SORT_OPTIONS } from './activityConstants';
import './activities.css';

/**
 * 카테고리 필터, 정렬 옵션, 검색 입력 바
 */
function FilterBar({ category, sort, onCategoryChange, onSortChange, searchQuery, onSearchChange }) {
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
    </div>
  );
}

export default FilterBar;
