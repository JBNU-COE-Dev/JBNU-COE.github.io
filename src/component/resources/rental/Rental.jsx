import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { rentalApi } from '../../../services';
import SearchInput from '../../common/SearchInput';
import { FilterRail, FilterRailOptions } from '../../common/FilterRail/FilterRail';
import './rental.css';

// 기본 대여 물품 데이터 (API 실패 시 fallback)
const defaultRentalItems = [
  { id: 1, name: '공학용 계산기', quantity: 8, category: '학용품' },
  { id: 2, name: '우산', quantity: 2, category: '생활용품' },
  { id: 3, name: '헬멧', quantity: 11, category: '안전용품' },
  { id: 4, name: '배구공', quantity: 15, category: '체육용품' },
  { id: 5, name: '피구공(탱탱볼)', quantity: 5, category: '체육용품' },
  { id: 6, name: '농구공', quantity: 2, category: '체육용품' },
  { id: 7, name: '축구공', quantity: 8, category: '체육용품' },
  { id: 8, name: '탁구공', quantity: 42, category: '체육용품' },
  { id: 9, name: '조끼(빨)', quantity: 1, category: '체육용품' },
  { id: 10, name: '조끼(연)', quantity: 10, category: '체육용품' },
  { id: 11, name: '조끼(핑)', quantity: 10, category: '체육용품' },
  { id: 12, name: '조끼(주)', quantity: 8, category: '체육용품' },
  { id: 13, name: '조끼(흰)', quantity: 1, category: '체육용품' },
  { id: 14, name: '조끼(파)', quantity: 13, category: '체육용품' },
  { id: 15, name: '조끼(학교지킴이)', quantity: 9, category: '안전용품' },
  { id: 16, name: '조끼(안전)', quantity: 13, category: '안전용품' },
  { id: 17, name: '실험복(남, 100)', quantity: 3, category: '학용품' },
  { id: 18, name: '실험복(남, 105)', quantity: 2, category: '학용품' },
  { id: 19, name: '실험복(남, 110)', quantity: 3, category: '학용품' },
  { id: 20, name: '실험복(여, 55)', quantity: 6, category: '학용품' },
  { id: 21, name: '실험복(여, 66)', quantity: 3, category: '학용품' },
  { id: 22, name: '풋살공', quantity: 2, category: '안전용품' },
];

const ALL = '전체';
const defaultCategories = ['학용품', '생활용품', '안전용품', '체육용품'];

/** 이 수량 이하면 '잔여 적음'으로 표시합니다. */
const LOW_STOCK = 5;

const SkeletonRow = () => (
  <div className="rental-row rental-skeleton-row">
    <span className="rental-skeleton-bar"></span>
    <span className="rental-skeleton-bar wide"></span>
    <span className="rental-skeleton-bar narrow"></span>
  </div>
);

export default function Rental() {
  const [rentalItems, setRentalItems] = useState([]);
  const [categories, setCategories] = useState(defaultCategories);
  const [selectedCategory, setSelectedCategory] = useState(ALL);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [loading, setLoading] = useState(true);

  /*
   * 물품 목록은 한 번만 받아 와서 분류 · 검색을 화면에서 처리합니다.
   * 전체 20여 종이라 서버를 다시 부를 이유가 없고, 분류 옆 건수를 전
   * 분류에 표시하려면 어차피 필터링되지 않은 전체 목록이 필요합니다.
   */
  const fetchRentalItems = useCallback(async () => {
    setLoading(true);
    try {
      const response = await rentalApi.getRentalItems();

      if (Array.isArray(response)) {
        setRentalItems(response);
      } else if (response && Array.isArray(response.content)) {
        // 페이지네이션 형식 응답
        setRentalItems(response.content);
      } else {
        setRentalItems(defaultRentalItems);
      }
    } catch (err) {
      // 실패해도 화면은 기본 목록으로 채웁니다 (오류 메시지 없음)
      console.error('대여 물품 조회 실패:', err);
      setRentalItems(defaultRentalItems);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await rentalApi.getRentalCategories();
      if (Array.isArray(response) && response.length > 0) {
        // '전체' 는 아래에서 따로 붙이므로 응답에 섞여 있으면 걸러냅니다.
        setCategories(response.filter((category) => category !== ALL));
      }
    } catch (err) {
      console.error('카테고리 조회 실패:', err);
      // 기본 카테고리 유지
    }
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchRentalItems();
  }, [fetchCategories, fetchRentalItems]);

  // 분류별 물품 종류 수 (검색어와 무관하게 셉니다)
  const categoryCounts = useMemo(() => {
    return rentalItems.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {});
  }, [rentalItems]);

  const categoryOptions = useMemo(() => {
    return [
      { value: ALL, label: ALL, count: rentalItems.length },
      ...categories.map((category) => ({
        value: category,
        label: category,
        count: categoryCounts[category] || 0,
      })),
    ];
  }, [categories, categoryCounts, rentalItems.length]);

  const filteredItems = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();
    return rentalItems.filter((item) => {
      const matchesCategory = selectedCategory === ALL || item.category === selectedCategory;
      const matchesSearch = !keyword || item.name.toLowerCase().includes(keyword);
      return matchesCategory && matchesSearch;
    });
  }, [rentalItems, selectedCategory, searchKeyword]);

  const totalQuantity = filteredItems.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockCount = filteredItems.filter((item) => item.quantity <= LOW_STOCK).length;

  return (
    <motion.div
      className="rental-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <header className="rental-header">
        <div className="rental-heading">
          <h1>대여 물품</h1>
        </div>

        <form className="rental-search-form" onSubmit={(e) => e.preventDefault()}>
          <SearchInput
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="물품명 검색"
            wrapperClassName="rental-search"
            inputClassName="rental-search-input"
            aria-label="물품명 검색"
          />
          <button type="submit" className="rental-search-button">
            검색
          </button>
        </form>
      </header>

      <div className="rental-body">
        <FilterRail as="nav" className="rental-rail" aria-label="분류">
          <FilterRailOptions
            heading="분류"
            options={categoryOptions}
            value={selectedCategory}
            onChange={setSelectedCategory}
          />
        </FilterRail>

        <section className="rental-section">
          <div className="rental-section-head">
            <div className="rental-section-title">
              <h2>{selectedCategory === ALL ? '전체 물품' : selectedCategory}</h2>
              {!loading && (
                <span className="rental-section-count">
                  {filteredItems.length}종 · {totalQuantity}개
                </span>
              )}
            </div>
            {!loading && lowStockCount > 0 && (
              <span className="rental-section-note">
                재고 {LOW_STOCK}개 이하 {lowStockCount}종
              </span>
            )}
          </div>

          <div className="rental-table">
            <div className="rental-row rental-table-head">
              <span>분류</span>
              <span>물품명</span>
              <span className="rental-quantity">보유 수량</span>
            </div>

            {loading ? (
              [1, 2, 3, 4, 5, 6, 7, 8].map((i) => <SkeletonRow key={i} />)
            ) : filteredItems.length === 0 ? (
              <div className="rental-no-items">
                {searchKeyword
                  ? `'${searchKeyword}'에 대한 검색 결과가 없습니다.`
                  : '등록된 물품이 없습니다.'}
              </div>
            ) : (
              filteredItems.map((item) => {
                const isLow = item.quantity <= LOW_STOCK;
                return (
                  <div key={item.id} className="rental-row">
                    <span className="rental-category">{item.category}</span>
                    <span className="rental-name">{item.name}</span>
                    <span className="rental-quantity">
                      {isLow && <span className="rental-low-badge">잔여 적음</span>}
                      <span className={`rental-quantity-number${isLow ? ' is-low' : ''}`}>
                        {item.quantity}
                        <span className="rental-quantity-unit">개</span>
                      </span>
                    </span>
                  </div>
                );
              })
            )}
          </div>

          <p className="rental-table-note">
            보유 수량은 학생회가 가지고 있는 전체 수량입니다. 지금 빌려 나간 수량은 반영되지 않습니다.
          </p>
        </section>

        {/* 대여 안내: 목록 아래가 아니라 옆에 둡니다 (1180px 이하에서는 목록 위) */}
        <aside className="rental-guide" aria-label="대여 안내">
          <h2>대여 안내</h2>

          {/* 운영시간이 정해지면 여기에 한 항목 더 넣으면 됩니다. */}
          <dl className="rental-guide-list">
            <div className="rental-guide-item">
              <dt>대여 장소</dt>
              <dd>공과대학 학생회실 (1호관 243호)</dd>
            </div>
            <div className="rental-guide-item">
              <dt>준비물</dt>
              <dd>학생증 또는 신분증</dd>
            </div>
          </dl>

          <ul className="rental-guide-rules">
            {['사용 후 반드시 반납해 주세요.', '파손 · 분실 시 변상 처리됩니다.'].map((rule) => (
              <li key={rule}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 12.5l5 5L20 6.5" />
                </svg>
                {rule}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </motion.div>
  );
}
