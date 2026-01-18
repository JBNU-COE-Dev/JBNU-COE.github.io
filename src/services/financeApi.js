/**
 * 회계 보고서 API
 * 
 * 백엔드 API 엔드포인트:
 * - GET    /api/finance/reports           : 회계 보고서 목록 조회
 * - GET    /api/finance/reports/:id       : 회계 보고서 상세 조회
 * - POST   /api/finance/reports           : 회계 보고서 등록 (관리자)
 * - PUT    /api/finance/reports/:id       : 회계 보고서 수정 (관리자)
 * - DELETE /api/finance/reports/:id       : 회계 보고서 삭제 (관리자)
 * - POST   /api/finance/reports/upload    : PDF 파일 업로드 (관리자)
 * - GET    /api/finance/reports/:id/download : PDF 파일 다운로드
 */
import { get, post, put, del, uploadFile } from './api';

/**
 * 회계 보고서 목록 조회
 * @param {Object} params - 필터 파라미터
 * @param {number} params.page - 페이지 번호 (0부터 시작)
 * @param {number} params.size - 페이지 크기
 * @param {string} params.keyword - 검색 키워드
 * @param {string} params.sortBy - 정렬 기준 (createdAt, title)
 * @param {string} params.sortOrder - 정렬 순서 (desc, asc)
 * @param {number} params.year - 연도 필터
 * @returns {Promise<Object>} 회계 보고서 목록
 * 
 * 응답 형식:
 * {
 *   content: [{
 *     id: number,
 *     title: string,
 *     description: string,
 *     fileName: string,
 *     fileUrl: string,
 *     fileSize: number,
 *     year: number,
 *     month: number,
 *     createdAt: string,
 *     updatedAt: string
 *   }],
 *   totalPages: number,
 *   totalElements: number
 * }
 */
export async function getFinanceReports(params = {}) {
  const {
    page = 0,
    size = 10,
    keyword,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    year,
  } = params;

  const queryParams = {
    page,
    size,
    sortBy,
    sortOrder,
  };

  if (keyword && keyword.trim()) {
    queryParams.keyword = keyword.trim();
  }

  if (year) {
    queryParams.year = year;
  }

  return get('/api/finance/reports', queryParams);
}

/**
 * 회계 보고서 상세 조회
 * @param {number|string} id - 보고서 ID
 * @returns {Promise<Object>} 보고서 상세 정보
 */
export async function getFinanceReportDetail(id) {
  return get(`/api/finance/reports/${id}`);
}

/**
 * 회계 보고서 등록 (관리자 전용)
 * @param {Object} reportData - 보고서 데이터
 * @param {string} reportData.title - 제목
 * @param {string} reportData.description - 설명
 * @param {string} reportData.fileUrl - PDF 파일 URL
 * @param {string} reportData.fileName - 파일명
 * @param {number} reportData.fileSize - 파일 크기
 * @param {number} reportData.year - 연도
 * @param {number} reportData.month - 월
 * @returns {Promise<Object>} 등록된 보고서 정보
 */
export async function createFinanceReport(reportData) {
  return post('/api/finance/reports', reportData);
}

/**
 * 회계 보고서 수정 (관리자 전용)
 * @param {number|string} id - 보고서 ID
 * @param {Object} reportData - 수정할 보고서 데이터
 * @returns {Promise<Object>} 수정된 보고서 정보
 */
export async function updateFinanceReport(id, reportData) {
  return put(`/api/finance/reports/${id}`, reportData);
}

/**
 * 회계 보고서 삭제 (관리자 전용)
 * @param {number|string} id - 보고서 ID
 * @returns {Promise<void>}
 */
export async function deleteFinanceReport(id) {
  return del(`/api/finance/reports/${id}`);
}

/**
 * PDF 파일 업로드 (관리자 전용)
 * @param {File} file - PDF 파일
 * @param {Function} onProgress - 업로드 진행률 콜백 (0-100)
 * @returns {Promise<Object>} 업로드된 파일 정보
 * 
 * 응답 형식:
 * {
 *   fileUrl: string,
 *   fileName: string,
 *   fileSize: number
 * }
 */
export async function uploadFinancePDF(file, onProgress) {
  const formData = new FormData();
  formData.append('file', file);

  return uploadFile('/api/finance/reports/upload', formData, onProgress);
}

/**
 * PDF 파일 다운로드 URL 생성
 * @param {number|string} id - 보고서 ID
 * @returns {string} 다운로드 URL
 */
export function getDownloadUrl(id) {
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
  return `${API_URL}/api/finance/reports/${id}/download`;
}

export default {
  getFinanceReports,
  getFinanceReportDetail,
  createFinanceReport,
  updateFinanceReport,
  deleteFinanceReport,
  uploadFinancePDF,
  getDownloadUrl,
};
