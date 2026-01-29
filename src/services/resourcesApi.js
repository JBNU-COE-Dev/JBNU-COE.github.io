/**
 * 자료실 API
 */
import { get, post, put, del, uploadFile } from './api';

/**
 * 자료 목록 조회
 * @param {Object} params - 페이지네이션 및 필터 파라미터
 * @param {number} params.page - 페이지 번호 (0부터 시작)
 * @param {number} params.size - 페이지 크기
 * @param {string} params.category - 카테고리 필터 (예: "constitution", "rental", "finance")
 * @param {string} params.keyword - 검색 키워드
 */
export async function getResources(params = {}) {
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

  if (category) {
    queryParams.category = category;
  }

  if (keyword) {
    queryParams.keyword = keyword;
  }

  return get('/api/resources', queryParams);
}

/**
 * 자료 상세 조회
 * @param {number|string} id - 자료 ID
 */
export async function getResourceDetail(id) {
  return get(`/api/resources/${id}`);
}

/**
 * 자료 생성
 * @param {Object} resourceData - 자료 데이터
 * @param {string} resourceData.category - 카테고리
 * @param {string} resourceData.title - 제목
 * @param {string} resourceData.content - 내용
 * @param {File[]} resourceData.files - 첨부 파일들 (선택)
 */
export async function createResource(resourceData) {
  // 파일이 있는 경우 FormData 사용
  if (resourceData.files && resourceData.files.length > 0) {
    const formData = new FormData();
    formData.append('category', resourceData.category);
    formData.append('title', resourceData.title);
    formData.append('content', resourceData.content);
    
    resourceData.files.forEach((file) => {
      formData.append('files', file);
    });

    return uploadFile('/api/resources', formData);
  }

  // 파일이 없는 경우 일반 JSON 요청
  return post('/api/resources', resourceData);
}

/**
 * 자료 수정
 * @param {number|string} id - 자료 ID
 * @param {Object} resourceData - 수정할 자료 데이터
 */
export async function updateResource(id, resourceData) {
  return put(`/api/resources/${id}`, resourceData);
}

/**
 * 자료 삭제
 * @param {number|string} id - 자료 ID
 */
export async function deleteResource(id) {
  return del(`/api/resources/${id}`);
}

/**
 * 회계 내역 조회
 * @param {Object} params - 필터 파라미터
 * @param {string} params.year - 연도
 * @param {string} params.month - 월
 */
export async function getFinanceRecords(params = {}) {
  return get('/api/resources/finance', params);
}

/**
 * 대여 물품 목록 조회
 */
export async function getRentalItems() {
  return get('/api/resources/rental');
}

/**
 * 대여 물품 수정
 * @param {number|string} id - 물품 ID
 * @param {Object} itemData - 수정할 물품 데이터
 */
export async function updateRentalItem(id, itemData) {
  return put(`/api/resources/rental/${id}`, itemData);
}

export default {
  getResources,
  getResourceDetail,
  createResource,
  updateResource,
  deleteResource,
  getFinanceRecords,
  getRentalItems,
  updateRentalItem,
};