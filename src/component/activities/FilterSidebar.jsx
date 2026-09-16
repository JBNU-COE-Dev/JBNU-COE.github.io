import React from 'react';
import {
  FilterRail,
  FilterRailOptions,
  FilterRailGroup,
  FilterRailCheckbox,
  FilterRailChips,
} from '../common/FilterRail/FilterRail';
import { CATEGORY_LABEL, VALID_CATEGORIES } from './utils';

const CATEGORY_OPTIONS = [
  { key: 'ALL', value: undefined, label: '전체' },
  ...VALID_CATEGORIES.map((value) => ({ key: value, value, label: CATEGORY_LABEL[value] })),
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
  const categoryOptions = CATEGORY_OPTIONS.map((opt) => ({
    ...opt,
    count: counts ? counts[opt.key] : null,
  }));

  return (
    <FilterRail>
      <FilterRailOptions
        heading="카테고리"
        options={categoryOptions}
        value={category}
        onChange={onCategoryChange}
      />

      <FilterRailGroup heading="모집 상태">
        <FilterRailCheckbox label="모집중만 보기" checked={openOnly} onChange={onOpenOnlyChange} />
      </FilterRailGroup>

      <FilterRailGroup heading="마감까지">
        <FilterRailChips options={WITHIN_OPTIONS} value={within} onChange={onWithinChange} />
      </FilterRailGroup>
    </FilterRail>
  );
}

export default FilterSidebar;
