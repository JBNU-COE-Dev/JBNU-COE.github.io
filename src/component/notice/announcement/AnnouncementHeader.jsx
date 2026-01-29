import React from 'react';
import { motion } from 'framer-motion';
import { FiSearch } from 'react-icons/fi';

const CATEGORIES = [
  { id: 'all', label: '전체' },
  { id: '일반공지', label: '일반공지' },
  { id: '학사공지', label: '학사공지' },
  { id: '사업단공지', label: '사업단공지' },
  { id: '취업정보', label: '취업정보' },
];

export default function AnnouncementHeader({
  searchKeyword,
  setSearchKeyword,
  handleSearch,
  selectedCategory,
  handleCategoryChange,
  error
}) {
  return (
    <>
      <div className="announcement-header">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          공지사항
        </motion.h1>
        <motion.form
          onSubmit={handleSearch}
          className="search-form"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="search-input-wrapper">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="검색어를 입력하세요"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="search-input"
            />
          </div>
          <motion.button
            type="submit"
            className="search-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            검색
          </motion.button>
        </motion.form>
      </div>

      {error && (
        <motion.div
          className="announcement-error"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          {error}
        </motion.div>
      )}

      {/* 카테고리 필터 */}
      <motion.div
        className="category-filter"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {CATEGORIES.map((category, index) => (
          <motion.button
            key={category.id}
            onClick={() => handleCategoryChange(category.id)}
            className={`category-button ${selectedCategory === category.id ? 'active' : ''}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {category.label}
          </motion.button>
        ))}
      </motion.div>
    </>
  );
}
