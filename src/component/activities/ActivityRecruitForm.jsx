import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createActivity } from '../../services/activityApi';
import { useAuth } from '../../contexts/AuthContext';
import './activities.css';

function ActivityRecruitForm() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login?redirect=/activities/recruit', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    category: 'TEAM_RECRUITMENT',
    title: '',
    content: '',
    author: '',
    headcount: '',
    endDate: '',
    recruitmentRoles: '',
    contactUrl: '',
    status: 'RECRUITING',
  });
  const [thumbnailFile, setThumbnailFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const fd = new FormData();
    fd.append('category', form.category);
    fd.append('title', form.title);
    fd.append('content', form.content);
    fd.append('author', form.author);
    if (form.headcount !== '') fd.append('headcount', form.headcount);
    if (form.endDate) fd.append('endDate', form.endDate);
    fd.append('recruitmentRoles', form.recruitmentRoles);
    fd.append('contactUrl', form.contactUrl);
    fd.append('status', form.status);
    if (thumbnailFile) fd.append('thumbnail', thumbnailFile);
    try {
      const created = await createActivity(fd);
      navigate(`/activities/${created.id}`);
    } catch (err) {
      setError(err.message || '등록에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="activities-page" style={{ padding: '3rem', textAlign: 'center' }}>
        로그인 확인 중...
      </div>
    );
  }

  return (
    <div className="activities-page">
      <header className="activities-header">
        <h1>팀원 모집 글쓰기</h1>
        <p>프로젝트·스터디 팀원을 구할 때 오픈채팅 등 연락처를 함께 적어주세요.</p>
      </header>

      <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
        {error && (
          <div className="activities-empty" style={{ padding: '1rem', marginBottom: '1rem', background: '#fef2f2', color: '#b91c1c', borderRadius: '8px' }}>
            {error}
          </div>
        )}
        <div className="activities-filter-group" style={{ marginBottom: '1rem' }}>
          <label className="activities-filter-label">제목 *</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            maxLength={500}
            className="activities-filter-select"
            style={{ width: '100%' }}
          />
        </div>
        <div className="activities-filter-group" style={{ marginBottom: '1rem' }}>
          <label className="activities-filter-label">내용 *</label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            required
            rows={8}
            className="activities-filter-select"
            style={{ width: '100%', resize: 'vertical' }}
          />
        </div>
        <div className="activities-filter-group" style={{ marginBottom: '1rem' }}>
          <label className="activities-filter-label">작성자(닉네임) *</label>
          <input
            type="text"
            name="author"
            value={form.author}
            onChange={handleChange}
            required
            maxLength={100}
            className="activities-filter-select"
            style={{ width: '100%' }}
          />
        </div>
        <div className="activities-filter-group" style={{ marginBottom: '1rem' }}>
          <label className="activities-filter-label">모집 인원 (명)</label>
          <input
            type="number"
            name="headcount"
            value={form.headcount}
            onChange={handleChange}
            min={1}
            max={999}
            placeholder="예: 3"
            className="activities-filter-select"
            style={{ width: '100%' }}
          />
        </div>
        <div className="activities-filter-group" style={{ marginBottom: '1rem' }}>
          <label className="activities-filter-label">모집 기한</label>
          <input
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
            className="activities-filter-select"
            style={{ width: '100%' }}
          />
        </div>
        <div className="activities-filter-group" style={{ marginBottom: '1rem' }}>
          <label className="activities-filter-label">모집 역할 (예: 프론트엔드, 백엔드, 기획)</label>
          <input
            type="text"
            name="recruitmentRoles"
            value={form.recruitmentRoles}
            onChange={handleChange}
            placeholder="쉼표로 구분"
            className="activities-filter-select"
            style={{ width: '100%' }}
          />
        </div>
        <div className="activities-filter-group" style={{ marginBottom: '1rem' }}>
          <label className="activities-filter-label">오픈채팅/연락처 URL *</label>
          <input
            type="url"
            name="contactUrl"
            value={form.contactUrl}
            onChange={handleChange}
            required
            placeholder="https://open.kakao.com/..."
            className="activities-filter-select"
            style={{ width: '100%' }}
          />
        </div>
        <div className="activities-filter-group" style={{ marginBottom: '1rem' }}>
          <label className="activities-filter-label">썸네일 (선택)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
            className="activities-filter-select"
            style={{ width: '100%' }}
          />
        </div>
        <div className="activities-detail-actions" style={{ marginTop: '1.5rem' }}>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? '등록 중...' : '등록'}
          </button>
          <button type="button" className="btn-secondary" onClick={() => navigate('/activities')}>
            취소
          </button>
        </div>
      </form>
    </div>
  );
}

export default ActivityRecruitForm;
