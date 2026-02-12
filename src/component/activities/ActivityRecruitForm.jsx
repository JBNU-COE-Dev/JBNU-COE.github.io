import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createActivity } from '../../services/activityApi';
import { useAuth } from '../../contexts/AuthContext';
import './activities.css';

function ActivityRecruitForm() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, userNickname, userEmail } = useAuth();

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
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const fileInputRef = useRef(null);

  // 로그인 사용자 닉네임/이메일로 작성자 기본값 설정
  useEffect(() => {
    if (isAuthenticated && (userNickname || userEmail)) {
      setForm((prev) => ({
        ...prev,
        author: userNickname || userEmail || prev.author,
      }));
    }
  }, [isAuthenticated, userNickname, userEmail]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0] || null;
    setThumbnailFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setThumbnailPreview(ev.target.result);
      reader.readAsDataURL(file);
    } else {
      setThumbnailPreview(null);
    }
  };

  const removeThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
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
      <div className="activities-page activities-loading">
        <div className="activities-spinner" />
        <p>로그인 확인 중...</p>
      </div>
    );
  }

  return (
    <div className="activities-page">
      <header className="activities-header">
        <h1>팀원 모집 글쓰기</h1>
        <p>프로젝트·스터디 팀원을 구할 때 오픈채팅 등 연락처를 함께 적어주세요.</p>
      </header>

      <form onSubmit={handleSubmit} className="activities-form">
        {error && (
          <div className="activities-form-error">
            {error}
          </div>
        )}
        <div className="activities-form-field">
          <label className="activities-filter-label">제목 *</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            maxLength={500}
            className="activities-form-input"
          />
        </div>
        <div className="activities-form-field">
          <label className="activities-filter-label">내용 *</label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            required
            rows={8}
            className="activities-form-input activities-form-textarea"
          />
        </div>
        <div className="activities-form-field">
          <label className="activities-filter-label">작성자(닉네임) *</label>
          <input
            type="text"
            name="author"
            value={form.author}
            readOnly
            required
            aria-readonly="true"
            maxLength={100}
            className="activities-form-input activities-form-readonly"
          />
        </div>
        <div className="activities-form-field">
          <label className="activities-filter-label">모집 인원 (명)</label>
          <input
            type="number"
            name="headcount"
            value={form.headcount}
            onChange={handleChange}
            min={1}
            max={999}
            placeholder="예: 3"
            className="activities-form-input"
          />
        </div>
        <div className="activities-form-field">
          <label className="activities-filter-label">모집 기한</label>
          <input
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
            className="activities-form-input"
          />
        </div>
        <div className="activities-form-field">
          <label className="activities-filter-label">모집 역할 (예: 프론트엔드, 백엔드, 기획)</label>
          <input
            type="text"
            name="recruitmentRoles"
            value={form.recruitmentRoles}
            onChange={handleChange}
            placeholder="쉼표로 구분"
            className="activities-form-input"
          />
        </div>
        <div className="activities-form-field">
          <label className="activities-filter-label">오픈채팅/연락처 URL *</label>
          <input
            type="url"
            name="contactUrl"
            value={form.contactUrl}
            onChange={handleChange}
            required
            placeholder="https://open.kakao.com/..."
            className="activities-form-input"
          />
        </div>
        <div className="activities-form-field">
          <label className="activities-filter-label">썸네일 (선택)</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
            className="activities-form-input"
          />
          {thumbnailPreview && (
            <div className="activities-form-preview">
              <img src={thumbnailPreview} alt="썸네일 미리보기" />
              <button type="button" className="activities-form-preview-remove" onClick={removeThumbnail}>
                &times;
              </button>
            </div>
          )}
        </div>
        <div className="activities-detail-actions activities-form-actions">
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
