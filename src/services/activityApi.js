/**
 * 대외활동 / 공모전 / 팀원 모집 API
 */
import { get, del, getResourceFileUrl, getApiUrl } from './api';

const BASE = '/api/activities';

/**
 * 목록 조회 (페이징, 카테고리, 정렬)
 * @param {Object} params - { category, page, size, sort }
 * @param {string} [params.category] - EXTERNAL_ACTIVITY | CONTEST | TEAM_RECRUITMENT
 * @param {string} [params.sort] - latest | deadline | viewCount
 */
export async function getActivityList(params = {}) {
  return get(BASE, params);
}

/**
 * 상세 조회 (조회수 증가)
 */
export async function getActivityById(id) {
  return get(`${BASE}/${id}`);
}

/**
 * 게시글 생성 (FormData: 필드 + thumbnail 파일)
 */
export async function createActivity(formData) {
  let token = null;
  try {
    token = localStorage.getItem('authToken');
  } catch {}
  const res = await fetch(`${getApiUrl()}${BASE}`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json();
}

/**
 * 게시글 수정
 */
export async function updateActivity(id, formData) {
  let token = null;
  try {
    token = localStorage.getItem('authToken');
  } catch {}
  const res = await fetch(`${getApiUrl()}${BASE}/${id}`, {
    method: 'PUT',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json();
}

/**
 * 게시글 삭제
 */
export async function deleteActivity(id) {
  return del(`${BASE}/${id}`);
}

/** 썸네일 등 리소스 URL 정규화 */
export { getResourceFileUrl };

export default {
  getActivityList,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity,
  getResourceFileUrl,
};
