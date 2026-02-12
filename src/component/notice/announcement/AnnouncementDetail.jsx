import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiClock, FiUser, FiEye, FiArrowLeft } from 'react-icons/fi';
import { BsPinAngleFill } from 'react-icons/bs';
import { formatDate } from './utils';
import './announcement.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export default function AnnouncementDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNoticeDetail = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/notices/${id}`);
      if (!response.ok) throw new Error('공지사항을 불러오는데 실패했습니다.');
      const data = await response.json();
      setNotice(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchNoticeDetail();
  }, [fetchNoticeDetail]);

  if (loading) {
    return (
      <motion.div
        className="announcement-detail-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="detail-skeleton">
          <div className="skeleton-title-large"></div>
          <div className="skeleton-meta-row">
            <div className="skeleton-text"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-text"></div>
          </div>
          <div className="skeleton-divider"></div>
          <div className="skeleton-content-block">
            <div className="skeleton-text-line"></div>
            <div className="skeleton-text-line"></div>
            <div className="skeleton-text-line"></div>
            <div className="skeleton-text-line short"></div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="announcement-error-container"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="announcement-error">{error}</div>
        <motion.button
          onClick={() => navigate('/notice/announcement')}
          className="back-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiArrowLeft /> 목록으로 돌아가기
        </motion.button>
      </motion.div>
    );
  }

  if (!notice) {
    return (
      <motion.div
        className="announcement-error"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        공지사항을 찾을 수 없습니다.
      </motion.div>
    );
  }

  return (
    <motion.div
      className="announcement-detail-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="detail-header"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="detail-title-section">
          {notice.isPinned && (
            <motion.span
              className="pinned-badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
            >
              <BsPinAngleFill /> 고정
            </motion.span>
          )}
          {notice.category && (
            <motion.span
              className="category-badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: 'spring' }}
            >
              {notice.category}
            </motion.span>
          )}
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            {notice.title}
          </motion.h1>
        </div>
        <motion.div
          className="detail-meta"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <span className="detail-author">
            <FiUser /> {notice.author}
          </span>
          <span className="detail-date">
            <FiClock /> {formatDate(notice.createdAt, true)}
          </span>
          {notice.updatedAt !== notice.createdAt && (
            <span className="detail-updated">
              <FiClock /> (수정: {formatDate(notice.updatedAt, true)})
            </span>
          )}
          <span className="detail-views">
            <FiEye /> {notice.viewCount}
          </span>
        </motion.div>
      </motion.div>

      <motion.div
        className="detail-divider"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.7 }}
      ></motion.div>

      <motion.div
        className="detail-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        {notice.imageUrl && (
          <motion.div
            className="detail-image-container"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 }}
          >
            <img
              src={`${API_URL}${notice.imageUrl}`}
              alt={notice.title}
              className="detail-image"
              onError={(e) => {
                e.target.style.display = 'none';
                console.error('이미지 로드 실패:', notice.imageUrl);
              }}
            />
          </motion.div>
        )}
        {notice.content.split('\n').map((line, index) => (
          <motion.p
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 + index * 0.05 }}
          >
            {line}
          </motion.p>
        ))}
      </motion.div>

      <motion.div
        className="detail-actions"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <motion.button
          onClick={() => navigate('/notice/announcement')}
          className="back-button"
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiArrowLeft /> 목록으로
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
