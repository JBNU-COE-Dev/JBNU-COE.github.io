/**
 * 갤러리 API
 * 
 * 백엔드 API 엔드포인트:
 * - GET    /api/gallery              : 갤러리 목록 조회
 * - GET    /api/gallery/:id          : 갤러리 상세 조회
 * - POST   /api/gallery              : 갤러리 생성 (관리자)
 * - PUT    /api/gallery/:id          : 갤러리 수정 (관리자)
 * - DELETE /api/gallery/:id          : 갤러리 삭제 (관리자)
 * - POST   /api/gallery/upload       : 이미지 업로드 (관리자)
 */
import { get, post, put, del, uploadFile } from './api';

/**
 * 갤러리 목록 조회
 * @param {Object} params - 페이지네이션 및 필터 파라미터
 * @param {number} params.page - 페이지 번호 (0부터 시작)
 * @param {number} params.size - 페이지 크기
 * @param {string} params.category - 카테고리 필터
 * @param {string} params.keyword - 검색 키워드
 * @param {string} params.searchType - 검색 타입 (all: 제목+내용, title: 제목, content: 내용)
 * @returns {Promise<Object>} 페이지네이션된 갤러리 목록
 * 
 * 응답 형식 (Spring Data Page):
 * {
 *   content: [{id, title, imageUrl, description, viewCount, attachmentCount, createdAt, ...}],
 *   totalPages: number,
 *   totalElements: number,
 *   number: number (현재 페이지),
 *   size: number (페이지 크기)
 * }
 */
export async function getGalleries(params = {}) {
  const {
    page = 0,
    size = 15,
    category,
    keyword,
    searchType = 'all',
  } = params;

  const queryParams = {
    page,
    size,
  };

  if (category && category !== 'all') {
    queryParams.category = category;
  }

  if (keyword && keyword.trim()) {
    queryParams.keyword = keyword.trim();
    queryParams.searchType = searchType;
  }

  return get('/api/gallery', queryParams);
}

/**
 * 갤러리 상세 조회
 * @param {number|string} id - 갤러리 ID
 * @returns {Promise<Object>} 갤러리 상세 정보
 * 
 * 응답 형식:
 * {
 *   id: number,
 *   title: string,
 *   description: string,
 *   imageUrl: string,
 *   images: [{id, url, caption}], // 다중 이미지 지원 시
 *   category: string,
 *   viewCount: number,
 *   attachmentCount: number,
 *   createdAt: string (ISO 8601),
 *   updatedAt: string (ISO 8601)
 * }
 */
export async function getGalleryDetail(id) {
  return get(`/api/gallery/${id}`);
}

/**
 * 갤러리 생성 (관리자 전용)
 * @param {Object} galleryData - 갤러리 데이터
 * @param {string} galleryData.title - 제목
 * @param {string} galleryData.description - 설명
 * @param {string} galleryData.imageUrl - 메인 이미지 URL
 * @param {string[]} galleryData.imageUrls - 추가 이미지 URL 배열
 * @param {string} galleryData.category - 카테고리
 * @returns {Promise<Object>} 생성된 갤러리 정보
 */
export async function createGallery(galleryData) {
  return post('/api/gallery', galleryData);
}

/**
 * 갤러리 수정 (관리자 전용)
 * @param {number|string} id - 갤러리 ID
 * @param {Object} galleryData - 수정할 갤러리 데이터
 * @returns {Promise<Object>} 수정된 갤러리 정보
 */
export async function updateGallery(id, galleryData) {
  return put(`/api/gallery/${id}`, galleryData);
}

/**
 * 갤러리 삭제 (관리자 전용)
 * @param {number|string} id - 갤러리 ID
 * @returns {Promise<void>}
 */
export async function deleteGallery(id) {
  return del(`/api/gallery/${id}`);
}

/**
 * 이미지 업로드 (관리자 전용)
 * @param {File|File[]} files - 업로드할 이미지 파일(들)
 * @param {Function} onProgress - 업로드 진행률 콜백 (0-100)
 * @returns {Promise<Object>} 업로드된 이미지 정보
 * 
 * 응답 형식:
 * {
 *   urls: string[], // 업로드된 이미지 URL 배열
 *   fileNames: string[]
 * }
 */
export async function uploadImages(files, onProgress) {
  const formData = new FormData();
  
  // 단일 파일 또는 배열 처리
  const fileArray = Array.isArray(files) ? files : [files];
  fileArray.forEach((file) => {
    formData.append('images', file);
  });

  return uploadFile('/api/gallery/upload', formData, onProgress);
}

/**
 * 조회수 증가
 * @param {number|string} id - 갤러리 ID
 * @returns {Promise<void>}
 */
export async function incrementViewCount(id) {
  return post(`/api/gallery/${id}/view`);
}

export default {
  getGalleries,
  getGalleryDetail,
  createGallery,
  updateGallery,
  deleteGallery,
  uploadImages,
  incrementViewCount,
};
