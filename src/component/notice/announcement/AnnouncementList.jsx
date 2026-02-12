import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import AnnouncementHeader from './AnnouncementHeader';
import AnnouncementContent from './AnnouncementContent';
import { formatDate } from './utils';
import './announcement.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export default function AnnouncementList() {
  const [notices, setNotices] = useState([]);
  const [pinnedNotices, setPinnedNotices] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const fetchNotices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `${API_URL}/api/notices?page=${currentPage}&size=10`;
      if (selectedCategory !== 'all') {
        url += `&category=${encodeURIComponent(selectedCategory)}`;
      }
      const response = await fetch(url);
      if (!response.ok) throw new Error('공지사항을 불러오는데 실패했습니다.');
      const data = await response.json();
      setNotices(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedCategory]);

  const fetchPinnedNotices = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/notices/pinned`);
      if (response.ok) {
        const data = await response.json();
        setPinnedNotices(data);
      }
    } catch (err) {
      console.error('고정 공지사항 로드 실패:', err);
    }
  }, []);

  useEffect(() => {
    fetchNotices();
    fetchPinnedNotices();
  }, [fetchNotices, fetchPinnedNotices]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchKeyword.trim()) {
      fetchNotices();
      return;
    }

    setLoading(true);
    setError(null);
    try {
      let url = `${API_URL}/api/notices/search?keyword=${encodeURIComponent(searchKeyword)}&page=${currentPage}&size=10`;
      if (selectedCategory !== 'all') {
        url += `&category=${encodeURIComponent(selectedCategory)}`;
      }
      const response = await fetch(url);
      if (!response.ok) throw new Error('검색에 실패했습니다.');
      const data = await response.json();
      setNotices(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(0);
    setSearchKeyword('');
  };

  return (
    <motion.div
      className="announcement-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <AnnouncementHeader
        searchKeyword={searchKeyword}
        setSearchKeyword={setSearchKeyword}
        handleSearch={handleSearch}
        selectedCategory={selectedCategory}
        handleCategoryChange={handleCategoryChange}
        error={error}
      />

      <AnnouncementContent
        notices={notices}
        pinnedNotices={pinnedNotices}
        loading={loading}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        formatDate={formatDate}
      />
    </motion.div>
  );
}
