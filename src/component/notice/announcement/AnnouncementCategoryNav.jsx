import React from 'react';
import { FilterRail, FilterRailOptions } from '../../common/FilterRail/FilterRail';

const CATEGORIES = [
  { value: 'all', label: '전체' },
  { value: '일반공지', label: '일반공지' },
  { value: '학사공지', label: '학사공지' },
  { value: '사업단공지', label: '사업단공지' },
  { value: '취업정보', label: '취업정보' },
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
  const options = CATEGORIES.map((category) => ({
    ...category,
    count: selectedCategory === category.value ? totalElements : null,
  }));

  return (
    <FilterRail as="nav" aria-label="분류">
      <FilterRailOptions
        heading="분류"
        options={options}
        value={selectedCategory}
        onChange={handleCategoryChange}
      />
    </FilterRail>
  );
}
