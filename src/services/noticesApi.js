/**
 * 공지사항 API
 */
import { get, post, put, del } from './api';

/**
 * 공지사항 목록 조회
 * @param {Object} params - 페이지네이션 및 필터 파라미터
 * @param {number} params.page - 페이지 번호 (0부터 시작)
 * @param {number} params.size - 페이지 크기
 * @param {string} params.category - 카테고리 필터
 * @param {string} params.keyword - 검색 키워드
 */
export async function getNotices(params = {}) {
  const {
    page = 0,
    size = 10,
    category,
    keyword,
  } = params;

  const queryParams = {
    page,
    size,
  };

  if (category && category !== 'all') {
    queryParams.category = category;
  }

  if (keyword) {
    queryParams.keyword = keyword;
  }

  return get('/api/notices', queryParams);
}

/**
 * 고정 공지사항 조회
 */
export async function getPinnedNotices() {
  return get('/api/notices/pinned');
}

/**
 * 공지사항 상세 조회
 * @param {number|string} id - 공지사항 ID
 */
export async function getNoticeDetail(id) {
  return get(`/api/notices/${id}`);
}

/**
 * 공지사항 생성
 * @param {Object} noticeData - 공지사항 데이터
 */
export async function createNotice(noticeData) {
  return post('/api/notices', noticeData);
}

/**
 * 공지사항 수정
 * @param {number|string} id - 공지사항 ID
 * @param {Object} noticeData - 수정할 공지사항 데이터
 */
export async function updateNotice(id, noticeData) {
  return put(`/api/notices/${id}`, noticeData);
}

/**
 * 공지사항 삭제
 * @param {number|string} id - 공지사항 ID
 */
export async function deleteNotice(id) {
  return del(`/api/notices/${id}`);
}

/**
 * 공지사항 고정/고정 해제
 * @param {number|string} id - 공지사항 ID
 * @param {boolean} pinned - 고정 여부
 */
export async function toggleNoticePin(id, pinned) {
  return put(`/api/notices/${id}/pin`, { pinned });
}

export default {
  getNotices,
  getPinnedNotices,
  getNoticeDetail,
  createNotice,
  updateNotice,
  deleteNotice,
  toggleNoticePin,
};