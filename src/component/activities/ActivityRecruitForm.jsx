import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createActivity,
  updateActivity,
  getActivityById,
} from '../../services/activityApi';
import { useAuth } from '../../contexts/AuthContext';
import './activities.css';

function ActivityRecruitForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const { isAuthenticated, isLoading, userNickname, userEmail, userId } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const redirect = isEditMode
        ? `/login?redirect=/activities/${id}/edit`
        : '/login?redirect=/activities/recruit';
      navigate(redirect, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, isEditMode, id]);

  const [loading, setLoading] = useState(false);
  const [loadingPost, setLoadingPost] = useState(isEditMode);
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

  // 로그인 사용자 닉네임/이메일로 작성자 기본값 설정 (생성 모드)
  useEffect(() => {
    if (isEditMode) return;
    if (isAuthenticated && (userNickname || userEmail)) {
      setForm((prev) => ({
        ...prev,
        author: userNickname || userEmail || prev.author,
      }));
    }
  }, [isAuthenticated, userNickname, userEmail, isEditMode]);

  // 편집 모드: 기존 글 로드 후 본인·팀원모집만 허용
  useEffect(() => {
    if (!isEditMode || isLoading || !isAuthenticated) return;

    let cancelled = false;
    setLoadingPost(true);
    setError(null);

    getActivityById(id)
      .then((item) => {
        if (cancelled) return;

        const isOwn =
          item.category === 'TEAM_RECRUITMENT' &&
          item.authorId != null &&
          userId != null &&
          String(item.authorId) === String(userId);

        if (!isOwn) {
          navigate('/activities', { replace: true });
          return;
        }

        setForm({
          category: 'TEAM_RECRUITMENT',
          title: item.title || '',
          content: item.content || '',
          author: item.author || userNickname || userEmail || '',
          headcount: item.headcount != null ? String(item.headcount) : '',
          endDate: item.endDate || '',
          recruitmentRoles: item.recruitmentRoles || '',
          contactUrl: item.contactUrl || '',
          status: item.status === 'CLOSED' ? 'CLOSED' : 'RECRUITING',
        });
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || '게시글을 불러오지 못했습니다.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingPost(false);
      });

    return () => {
      cancelled = true;
    };
  }, [
    isEditMode,
    id,
    isLoading,
    isAuthenticated,
    userId,
    userNickname,
    userEmail,
    navigate,
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const buildFormData = () => {
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
    return fd;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const fd = buildFormData();
    try {
      if (isEditMode) {
        await updateActivity(id, fd);
        navigate(`/activities/${id}`);
      } else {
        const created = await createActivity(fd);
        navigate(`/activities/${created.id}`);
      }
    } catch (err) {
      const message = err.message || (isEditMode ? '수정에 실패했습니다.' : '등록에 실패했습니다.');
      if (/403|권한|forbidden/i.test(message)) {
        setError('권한이 없습니다.');
      } else {
        setError(message);
      }
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

  if (isEditMode && loadingPost) {
    return (
      <div className="activities-page activities-loading">게시글을 불러오는 중...</div>
    );
  }

  return (
    <div className="activities-page">
      <header className="activities-header">
        <h1>{isEditMode ? '팀원 모집글 수정' : '팀원 모집 글쓰기'}</h1>
        <p>
          {isEditMode
            ? '내용을 수정하거나 모집 상태를 변경할 수 있습니다.'
            : '프로젝트·스터디 팀원을 구할 때 오픈채팅 등 연락처를 함께 적어주세요.'}
        </p>
      </header>

      <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
        {error && (
          <div
            className="activities-empty"
            style={{
              padding: '1rem',
              marginBottom: '1rem',
              background: '#fef2f2',
              color: '#b91c1c',
              borderRadius: '8px',
            }}
          >
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
            readOnly
            required
            aria-readonly="true"
            maxLength={100}
            className="activities-filter-select"
            style={{ width: '100%', backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
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
        {isEditMode && (
          <div className="activities-filter-group" style={{ marginBottom: '1rem' }}>
            <label className="activities-filter-label">모집 상태</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="activities-filter-select"
              style={{ width: '100%' }}
            >
              <option value="RECRUITING">모집 중</option>
              <option value="CLOSED">모집 마감</option>
            </select>
          </div>
        )}
        <div className="activities-filter-group" style={{ marginBottom: '1rem' }}>
          <label className="activities-filter-label">
            썸네일 {isEditMode ? '(선택 · 새로 올리면 교체)' : '(선택)'}
          </label>
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
            {loading
              ? isEditMode
                ? '저장 중...'
                : '등록 중...'
              : isEditMode
                ? '저장'
                : '등록'}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate(isEditMode ? `/activities/${id}` : '/activities')}
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}

export default ActivityRecruitForm;
