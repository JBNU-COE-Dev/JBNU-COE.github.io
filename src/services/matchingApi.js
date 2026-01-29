/**
 * 매칭 플랫폼 API 서비스
 * 스터디, 프로젝트, 멘토링 매칭 관련 API 호출
 */

import { get, post, put, del } from './api';

/**
 * 매칭 목록 조회
 * @param {Object} params - 검색 파라미터
 * @param {string} params.type - 매칭 타입 (study, project, mentor)
 * @param {number} params.page - 페이지 번호
 * @param {number} params.limit - 페이지당 항목 수
 * @param {string} params.search - 검색어
 * @param {string} params.category - 카테고리
 * @returns {Promise<Object>} 매칭 목록 및 페이지 정보
 */
export async function getMatchings(params = {}) {
  const queryParams = new URLSearchParams();
  
  if (params.type) queryParams.append('type', params.type);
  if (params.page) queryParams.append('page', params.page);
  if (params.limit) queryParams.append('limit', params.limit);
  if (params.search) queryParams.append('search', params.search);
  if (params.category) queryParams.append('category', params.category);
  
  const queryString = queryParams.toString();
  return get(`/api/matching${queryString ? `?${queryString}` : ''}`);
}

/**
 * 매칭 상세 조회
 * @param {number|string} id - 매칭 ID
 * @returns {Promise<Object>} 매칭 상세 정보
 */
export async function getMatchingDetail(id) {
  return get(`/api/matching/${id}`);
}

/**
 * 매칭 등록
 * @param {Object} matchingData - 매칭 데이터
 * @param {string} matchingData.title - 제목
 * @param {string} matchingData.type - 타입 (study, project, mentor)
 * @param {string} matchingData.category - 카테고리
 * @param {string} matchingData.description - 설명
 * @param {number} matchingData.maxMembers - 최대 인원
 * @param {string} matchingData.deadline - 마감일
 * @param {Object} matchingData.details - 상세 정보
 * @returns {Promise<Object>} 생성된 매칭 정보
 */
export async function createMatching(matchingData) {
  return post('/api/matching', matchingData);
}

/**
 * 매칭 수정
 * @param {number|string} id - 매칭 ID
 * @param {Object} matchingData - 수정할 매칭 데이터
 * @returns {Promise<Object>} 수정된 매칭 정보
 */
export async function updateMatching(id, matchingData) {
  return put(`/api/matching/${id}`, matchingData);
}

/**
 * 매칭 삭제
 * @param {number|string} id - 매칭 ID
 * @returns {Promise<void>}
 */
export async function deleteMatching(id) {
  return del(`/api/matching/${id}`);
}

/**
 * 매칭 지원
 * @param {number|string} id - 매칭 ID
 * @param {Object} applicationData - 지원 데이터
 * @returns {Promise<Object>} 지원 결과
 */
export async function applyMatching(id, applicationData = {}) {
  return post(`/api/matching/${id}/apply`, applicationData);
}

/**
 * 매칭 북마크 토글
 * @param {number|string} id - 매칭 ID
 * @returns {Promise<Object>} 북마크 상태
 */
export async function toggleBookmark(id) {
  return post(`/api/matching/${id}/bookmark`);
}

/**
 * 북마크한 매칭 목록 조회
 * @param {Object} params - 검색 파라미터
 * @returns {Promise<Object>} 북마크 목록
 */
export async function getBookmarkedMatchings(params = {}) {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page);
  if (params.limit) queryParams.append('limit', params.limit);
  
  const queryString = queryParams.toString();
  return get(`/api/matching/bookmarks${queryString ? `?${queryString}` : ''}`);
}

/**
 * 주최자 팔로우 토글
 * @param {number|string} organizerId - 주최자 ID
 * @returns {Promise<Object>} 팔로우 상태
 */
export async function toggleFollow(organizerId) {
  return post(`/api/matching/organizer/${organizerId}/follow`);
}

/**
 * 인기 매칭 목록 조회
 * @param {number} limit - 조회할 개수
 * @returns {Promise<Array>} 인기 매칭 목록
 */
export async function getPopularMatchings(limit = 5) {
  return get(`/api/matching/popular?limit=${limit}`);
}

/**
 * 카테고리 목록 조회
 * @param {string} type - 매칭 타입 (study, project, mentor)
 * @returns {Promise<Array>} 카테고리 목록
 */
export async function getCategories(type) {
  return get(`/api/matching/categories${type ? `?type=${type}` : ''}`);
}

/**
 * 조회수 증가
 * @param {number|string} id - 매칭 ID
 * @returns {Promise<void>}
 */
export async function incrementViewCount(id) {
  return post(`/api/matching/${id}/view`);
}

/**
 * 매칭 통계 조회 (관심 유저 등)
 * @param {number|string} id - 매칭 ID
 * @returns {Promise<Object>} 통계 정보
 */
export async function getMatchingStats(id) {
  return get(`/api/matching/${id}/stats`);
}

const matchingApi = {
  getMatchings,
  getMatchingDetail,
  createMatching,
  updateMatching,
  deleteMatching,
  applyMatching,
  toggleBookmark,
  getBookmarkedMatchings,
  toggleFollow,
  getPopularMatchings,
  getCategories,
  incrementViewCount,
  getMatchingStats,
};

export default matchingApi;
