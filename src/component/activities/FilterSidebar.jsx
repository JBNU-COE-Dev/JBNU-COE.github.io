import React from 'react';
import { CATEGORY_LABEL, VALID_CATEGORIES } from './utils';
import './activities.css';

const CATEGORY_OPTIONS = [
  { value: '', label: '전체', countKey: 'ALL' },
  ...VALID_CATEGORIES.map((value) => ({ value, label: CATEGORY_LABEL[value], countKey: value })),
];

const WITHIN_OPTIONS = [
  { value: 7, label: '7일 이내' },
  { value: 30, label: '30일 이내' },
];

/**
 * 목록 왼쪽 필터 레일 (카테고리 / 모집 상태 / 마감까지).
 * 건수는 목록과 같은 필터로 서버에서 집계한 값이라 숫자와 실제 목록이 어긋나지 않는다.
 */
function FilterSidebar({ category, openOnly, within, counts, onCategoryChange, onOpenOnlyChange, onWithinChange }) {
  return (
    <aside className="activities-filters">
      <div className="activities-filter-block activities-filter-block-category">
        <span className="activities-filter-heading">카테고리</span>
        {CATEGORY_OPTIONS.map((opt) => {
          const active = (category || '') === opt.value;
          const count = counts ? counts[opt.countKey] : null;
          return (
            <button
              key={opt.countKey}
              type="button"
              className={`activities-filter-item${active ? ' is-active' : ''}`}
              aria-pressed={active}
              onClick={() => onCategoryChange(opt.value || undefined)}
            >
              {opt.label}
              {count != null && <span className="activities-filter-count">{count}</span>}
            </button>
          );
        })}
      </div>

      <div className="activities-filter-block activities-filter-block-status">
        <span className="activities-filter-heading">모집 상태</span>
        <label className="activities-filter-check">
          <input
            type="checkbox"
            checked={openOnly}
            onChange={(e) => onOpenOnlyChange(e.target.checked)}
          />
          <span className="activities-filter-checkbox" aria-hidden="true">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12.5l5 5L20 6.5" />
            </svg>
          </span>
          모집중만 보기
        </label>
      </div>

      <div className="activities-filter-block activities-filter-block-within">
        <span className="activities-filter-heading">마감까지</span>
        <div className="activities-filter-chips">
          {WITHIN_OPTIONS.map((opt) => {
            const active = within === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                className={`activities-filter-chip${active ? ' is-active' : ''}`}
                aria-pressed={active}
                onClick={() => onWithinChange(active ? undefined : opt.value)}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

export default FilterSidebar;
