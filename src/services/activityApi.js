/**
 * 대외활동 / 공모전 / 팀원 모집 API
 */
import { get, del, getResourceFileUrl, getApiUrl } from './api';

const BASE = '/api/activities';

/**
 * 빈 값은 쿼리에서 제외한다.
 * URLSearchParams 는 undefined/null 도 "undefined"/"null" 문자열로 직렬화해서
 * 그대로 넘기면 백엔드가 카테고리 파싱에 실패한다.
 */
function withoutEmpty(params) {
  return Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
  );
}

/**
 * 목록 조회 (페이징, 카테고리, 정렬, 필터)
 * @param {Object} params - { category, open, within, page, size, sort }
 * @param {string} [params.category] - EXTERNAL_ACTIVITY | CONTEST | TEAM_RECRUITMENT
 * @param {string} [params.sort] - latest | deadline | viewCount
 * @param {boolean} [params.open] - true면 마감된 글 제외
 * @param {number} [params.within] - 지정하면 오늘부터 N일 안에 마감하는 글만
 */
export async function getActivityList(params = {}) {
  return get(BASE, withoutEmpty(params));
}

/**
 * 목록과 같은 필터 기준의 카테고리별 건수
 * @param {Object} params - { open, within }
 * @returns {Promise<{ALL: number, EXTERNAL_ACTIVITY: number, CONTEST: number, TEAM_RECRUITMENT: number}>}
 */
export async function getActivityCounts(params = {}) {
  return get(`${BASE}/counts`, withoutEmpty(params));
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
  getActivityCounts,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity,
  getResourceFileUrl,
};
