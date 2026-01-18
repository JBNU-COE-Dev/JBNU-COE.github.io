import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { rentalApi } from '../../../services';
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

const defaultCategories = ['전체', '학용품', '생활용품', '안전용품', '체육용품'];

export default function Rental() {
  const [rentalItems, setRentalItems] = useState([]);
  const [categories, setCategories] = useState(defaultCategories);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 물품 목록 조회
  const fetchRentalItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await rentalApi.getRentalItems({
        category: selectedCategory,
        keyword: searchKeyword,
      });

      // API 응답 처리
      if (Array.isArray(response)) {
        setRentalItems(response);
      } else if (response && response.content) {
        // 페이지네이션 형식 응답
        setRentalItems(response.content);
      } else {
        // API 응답이 없으면 기본 데이터 사용
        setRentalItems(defaultRentalItems);
      }
    } catch (err) {
      console.error('대여 물품 조회 실패:', err);
      // API 실패 시 기본 데이터 사용
      setRentalItems(defaultRentalItems);
      setError(null); // 에러 표시하지 않고 fallback 사용
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchKeyword]);

  // 카테고리 목록 조회
  const fetchCategories = useCallback(async () => {
    try {
      const response = await rentalApi.getRentalCategories();
      if (Array.isArray(response) && response.length > 0) {
        setCategories(['전체', ...response]);
      }
    } catch (err) {
      console.error('카테고리 조회 실패:', err);
      // 기본 카테고리 유지
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchRentalItems();
  }, [fetchRentalItems]);

  // 로컬 필터링 (API에서 필터링하지 않는 경우 대비)
  const filteredItems = rentalItems.filter(item => {
    const matchesCategory = selectedCategory === '전체' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchKeyword.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // 총 물품 수
  const totalItems = filteredItems.reduce((sum, item) => sum + item.quantity, 0);

  // 스켈레톤 로딩
  const SkeletonRow = () => (
    <tr className="skeleton-row">
      <td><div className="skeleton-cell short"></div></td>
      <td><div className="skeleton-cell"></div></td>
      <td><div className="skeleton-cell medium"></div></td>
      <td><div className="skeleton-cell short"></div></td>
    </tr>
  );

  return (
    <motion.div
      className="rental-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* 헤더 */}
      <div className="rental-header">
        <h1>대여사업 물품 목록</h1>
        <div className="rental-search">
          <input
            type="text"
            placeholder="물품명 검색..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="rental-search-input"
          />
        </div>
      </div>

      {/* 카테고리 필터 */}
      <div className="rental-category-filter">
        {categories.map((category) => (
          <button
            key={category}
            className={`rental-category-button ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* 통계 정보 */}
      <div className="rental-stats">
        <div className="rental-stat-card">
          <div className="stat-number">{loading ? '-' : filteredItems.length}</div>
          <div className="stat-label">물품 종류</div>
        </div>
        <div className="rental-stat-card">
          <div className="stat-number">{loading ? '-' : totalItems}</div>
          <div className="stat-label">총 수량</div>
        </div>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <motion.div
          className="rental-error"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {error}
          <button 
            className="error-retry-btn"
            onClick={fetchRentalItems}
          >
            다시 시도
          </button>
        </motion.div>
      )}

      {/* 물품 테이블 */}
      <div className="rental-table-container">
        <table className="rental-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>물품명</th>
              <th>카테고리</th>
              <th>수량</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              // 스켈레톤 로딩
              [...Array(8)].map((_, i) => <SkeletonRow key={i} />)
            ) : filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="rental-table-row"
                >
                  <td className="text-center">{index + 1}</td>
                  <td className="item-name">{item.name}</td>
                  <td>
                    <span className={`category-badge ${item.category}`}>
                      {item.category}
                    </span>
                  </td>
                  <td className="text-center">
                    <span className={`quantity-badge ${item.quantity <= 5 ? 'low' : ''}`}>
                      {item.quantity}개
                    </span>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="no-results">
                  {searchKeyword 
                    ? `'${searchKeyword}'에 대한 검색 결과가 없습니다.`
                    : '등록된 물품이 없습니다.'
                  }
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 안내 메시지 */}
      <div className="rental-notice">
        <h3>📋 대여 안내</h3>
        <ul>
          <li>공과대학 학생회실에서 대여 가능합니다.</li>
          <li>신분증을 지참하여 주시기 바랍니다.</li>
          <li>파손 및 분실 시 변상 처리됩니다.</li>
          <li>사용 후 반드시 반납해 주세요.</li>
        </ul>
      </div>
    </motion.div>
  );
}
