import React from 'react';
import './FilterRail.css';

/**
 * 목록 페이지 왼쪽 필터 레일.
 *
 * 공지사항(분류)과 대외활동(카테고리/모집 상태/마감까지)이 같은 디자인과
 * 동작을 쓰기 때문에 하나로 모았습니다. 넓은 화면에서는 세로 레일,
 * 좁은 화면에서는 가로 스크롤 칩으로 바뀝니다. (breakpoint 는 FilterRail.css)
 */
export function FilterRail({ as: Tag = 'aside', className = '', children, ...rest }) {
  return (
    <Tag className={`filter-rail ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  );
}

/** 레일 안의 한 묶음. heading 은 좁은 화면에서 숨겨집니다. */
export function FilterRailGroup({ heading, className = '', children }) {
  return (
    <div className={`filter-rail-group ${className}`.trim()}>
      {heading && <span className="filter-rail-heading">{heading}</span>}
      {children}
    </div>
  );
}

/**
 * 가장 흔한 형태: 하나만 고르는 옵션 목록 (+ 선택 항목 옆 건수).
 *
 * options: [{ value, label, count? }]
 * count 가 null/undefined 면 숫자를 그리지 않으므로, 건수를 주는 API가 없는
 * 화면은 선택된 항목에만 값을 넣어 쓰면 됩니다.
 */
export function FilterRailOptions({ heading, options, value, onChange }) {
  return (
    <FilterRailGroup heading={heading} className="filter-rail-group-options">
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.key ?? opt.value ?? opt.label}
            type="button"
            className={`filter-rail-option${active ? ' is-active' : ''}`}
            aria-pressed={active}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
            {opt.count != null && <span className="filter-rail-count">{opt.count}</span>}
          </button>
        );
      })}
    </FilterRailGroup>
  );
}

/** 네이티브 input 은 남겨두고 시각만 교체한 체크박스 */
export function FilterRailCheckbox({ label, checked, onChange }) {
  return (
    <label className="filter-rail-check">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="filter-rail-checkbox" aria-hidden="true">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12.5l5 5L20 6.5" />
        </svg>
      </span>
      {label}
    </label>
  );
}

/** 껐다 켰다 하는 칩 묶음. 켜져 있는 칩을 다시 누르면 해제됩니다. */
export function FilterRailChips({ options, value, onChange }) {
  return (
    <div className="filter-rail-chips">
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            className={`filter-rail-chip${active ? ' is-active' : ''}`}
            aria-pressed={active}
            onClick={() => onChange(active ? undefined : opt.value)}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
