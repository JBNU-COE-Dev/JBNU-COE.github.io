/**
 * 갤러리 API
 */
import { get, post, put, del, uploadFile } from './api';

/**
 * 갤러리 목록 조회
 * @param {Object} params - 페이지네이션 및 필터 파라미터
 * @param {number} params.page - 페이지 번호 (0부터 시작)
 * @param {number} params.size - 페이지 크기
 * @param {string} params.category - 카테고리 필터
 * @param {string} params.keyword - 검색 키워드
 */
export async function getGalleries(params = {}) {
  const {
    page = 0,
    size = 12,
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

  return get('/api/gallery', queryParams);
}

/**
 * 갤러리 상세 조회
 * @param {number|string} id - 갤러리 ID
 */
export async function getGalleryDetail(id) {
  return get(`/api/gallery/${id}`);
}

/**
 * 갤러리 생성
 * @param {Object} galleryData - 갤러리 데이터
 */
export async function createGallery(galleryData) {
  return post('/api/gallery', galleryData);
}

/**
 * 갤러리 수정
 * @param {number|string} id - 갤러리 ID
 * @param {Object} galleryData - 수정할 갤러리 데이터
 */
export async function updateGallery(id, galleryData) {
  return put(`/api/gallery/${id}`, galleryData);
}

/**
 * 갤러리 삭제
 * @param {number|string} id - 갤러리 ID
 */
export async function deleteGallery(id) {
  return del(`/api/gallery/${id}`);
}

/**
 * 이미지 업로드
 * @param {File|File[]} files - 업로드할 이미지 파일(들)
 * @param {Function} onProgress - 업로드 진행률 콜백 (0-100)
 */
export async function uploadImages(files, onProgress) {
  const formData = new FormData();
  
  // 단일 파일 또는 배열 처리
  const fileArray = Array.isArray(files) ? files : [files];
  fileArray.forEach((file, index) => {
    formData.append('images', file);
  });

  return uploadFile('/api/gallery/upload', formData, onProgress);
}

export default {
  getGalleries,
  getGalleryDetail,
  createGallery,
  updateGallery,
  deleteGallery,
  uploadImages,
};