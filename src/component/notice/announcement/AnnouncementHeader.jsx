import React from 'react';
import { motion } from 'framer-motion';
import SearchInput from '../../common/SearchInput';

export default function AnnouncementHeader({
  searchKeyword,
  setSearchKeyword,
  handleSearch,
  error
}) {
  return (
    <>
      <motion.div
        className="announcement-header"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="announcement-heading">
          <h1>공지사항</h1>
        </div>

        <form onSubmit={handleSearch} className="search-form">
          <SearchInput
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="제목 또는 내용 검색"
          />
          <button type="submit" className="search-button">
            검색
          </button>
        </form>
      </motion.div>

      {error && <div className="announcement-error">{error}</div>}
    </>
  );
}
