/**
 * 대여사업 물품 API
 * 
 * 백엔드 API 엔드포인트:
 * - GET    /api/rental              : 대여 물품 목록 조회
 * - GET    /api/rental/:id          : 대여 물품 상세 조회
 * - POST   /api/rental              : 대여 물품 등록 (관리자)
 * - PUT    /api/rental/:id          : 대여 물품 수정 (관리자)
 * - DELETE /api/rental/:id          : 대여 물품 삭제 (관리자)
 * - GET    /api/rental/categories   : 카테고리 목록 조회
 * - PUT    /api/rental/:id/quantity : 수량 업데이트 (관리자)
 */
import { get, post, put, del } from './api';

/**
 * 대여 물품 목록 조회
 * @param {Object} params - 필터 파라미터
 * @param {string} params.category - 카테고리 필터
 * @param {string} params.keyword - 검색 키워드
 * @returns {Promise<Array>} 대여 물품 목록
 * 
 * 응답 형식:
 * [
 *   {
 *     id: number,
 *     name: string,
 *     quantity: number,
 *     category: string,
 *     description: string (optional),
 *     imageUrl: string (optional),
 *     available: boolean,
 *     createdAt: string,
 *     updatedAt: string
 *   }
 * ]
 */
export async function getRentalItems(params = {}) {
  const { category, keyword } = params;

  const queryParams = {};

  if (category && category !== '전체') {
    queryParams.category = category;
  }

  if (keyword && keyword.trim()) {
    queryParams.keyword = keyword.trim();
  }

  return get('/api/rental', queryParams);
}

/**
 * 대여 물품 상세 조회
 * @param {number|string} id - 물품 ID
 * @returns {Promise<Object>} 물품 상세 정보
 */
export async function getRentalItemDetail(id) {
  return get(`/api/rental/${id}`);
}

/**
 * 카테고리 목록 조회
 * @returns {Promise<Array<string>>} 카테고리 목록
 */
export async function getRentalCategories() {
  return get('/api/rental/categories');
}

/**
 * 대여 물품 등록 (관리자 전용)
 * @param {Object} itemData - 물품 데이터
 * @param {string} itemData.name - 물품명
 * @param {number} itemData.quantity - 수량
 * @param {string} itemData.category - 카테고리
 * @param {string} itemData.description - 설명 (optional)
 * @param {string} itemData.imageUrl - 이미지 URL (optional)
 * @returns {Promise<Object>} 등록된 물품 정보
 */
export async function createRentalItem(itemData) {
  return post('/api/rental', itemData);
}

/**
 * 대여 물품 수정 (관리자 전용)
 * @param {number|string} id - 물품 ID
 * @param {Object} itemData - 수정할 물품 데이터
 * @returns {Promise<Object>} 수정된 물품 정보
 */
export async function updateRentalItem(id, itemData) {
  return put(`/api/rental/${id}`, itemData);
}

/**
 * 대여 물품 삭제 (관리자 전용)
 * @param {number|string} id - 물품 ID
 * @returns {Promise<void>}
 */
export async function deleteRentalItem(id) {
  return del(`/api/rental/${id}`);
}

/**
 * 물품 수량 업데이트 (관리자 전용)
 * @param {number|string} id - 물품 ID
 * @param {number} quantity - 새 수량
 * @returns {Promise<Object>} 업데이트된 물품 정보
 */
export async function updateRentalQuantity(id, quantity) {
  return put(`/api/rental/${id}/quantity`, { quantity });
}

/**
 * 여러 물품 일괄 등록 (관리자 전용)
 * @param {Array<Object>} items - 물품 데이터 배열
 * @returns {Promise<Array<Object>>} 등록된 물품 목록
 */
export async function bulkCreateRentalItems(items) {
  return post('/api/rental/bulk', { items });
}

export default {
  getRentalItems,
  getRentalItemDetail,
  getRentalCategories,
  createRentalItem,
  updateRentalItem,
  deleteRentalItem,
  updateRentalQuantity,
  bulkCreateRentalItems,
};
