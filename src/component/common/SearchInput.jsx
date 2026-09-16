import React from 'react';
import { FiSearch } from 'react-icons/fi';
import './SearchInput.css';

/**
 * 검색 입력 필드 (돋보기 아이콘 + input)
 *
 * 아이콘은 항상 표시되며 위치는 SearchInput.css 가 담당합니다.
 * input 의 크기/여백 등 나머지 스타일은 사용하는 페이지의 CSS에 맡깁니다.
 *
 * 기본 클래스는 .search-input-wrapper / .search-input 이며
 * (announcement.css, gallery.css), 다른 클래스를 쓰는 페이지는
 * wrapperClassName / inputClassName 으로 교체합니다.
 * 교체하는 경우 wrapper 에 position: relative 와
 * input 좌측 여백(아이콘 자리)이 필요합니다. (rental.css, Finance.css 참고)
 *
 * value, onChange 외의 props는 input 요소로 그대로 전달됩니다.
 */
export default function SearchInput({
  value,
  onChange,
  placeholder = '검색어를 입력하세요',
  wrapperClassName = 'search-input-wrapper',
  inputClassName = 'search-input',
  ...inputProps
}) {
  return (
    <div className={wrapperClassName}>
      <FiSearch className="search-icon" />
      <input
        type="text"
        className={inputClassName}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...inputProps}
      />
    </div>
  );
}
