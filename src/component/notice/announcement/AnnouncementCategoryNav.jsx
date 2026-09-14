import React from 'react';

export const CATEGORIES = [
  { id: 'all', label: '전체' },
  { id: '일반공지', label: '일반공지' },
  { id: '학사공지', label: '학사공지' },
  { id: '사업단공지', label: '사업단공지' },
  { id: '취업정보', label: '취업정보' },
];

/**
 * 좌측 분류 내비게이션.
 *
 * 분류별 개수를 주는 API가 없으므로, 현재 선택된 분류의 건수
 * (목록 응답의 totalElements) 만 표시합니다.
 */
export default function AnnouncementCategoryNav({
  selectedCategory,
  handleCategoryChange,
  totalElements
}) {
  return (
    <nav className="category-nav">
      <span className="category-nav-label">분류</span>
      {CATEGORIES.map((category) => {
        const isActive = selectedCategory === category.id;
        return (
          <button
            key={category.id}
            type="button"
            onClick={() => handleCategoryChange(category.id)}
            className={`category-button ${isActive ? 'active' : ''}`}
          >
            {category.label}
            {isActive && totalElements != null && (
              <span className="category-count">{totalElements}</span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
