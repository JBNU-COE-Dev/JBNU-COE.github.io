/**
 * API 유틸리티 함수
 * 백엔드 API와 통신하기 위한 중앙화된 함수들
 */

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
const API_TIMEOUT = 30000; // 30초

/**
 * 기본 fetch 래퍼 함수
 * 에러 처리, 타임아웃, 인증 헤더 등을 통합 관리
 */
async function fetchAPI(endpoint, options = {}) {
  const {
    method = 'GET',
    body = null,
    headers = {},
    timeout = API_TIMEOUT,
    ...restOptions
  } = options;

  // 기본 헤더 설정
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  };

  // 인증 토큰이 있으면 추가 (나중에 백엔드 구현 시 사용)
  const token = localStorage.getItem('authToken');
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  // 타임아웃 컨트롤러
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers: defaultHeaders,
      body: body ? JSON.stringify(body) : null,
      signal: controller.signal,
      ...restOptions,
    });

    clearTimeout(timeoutId);

    // 응답이 성공이 아니면 에러 처리
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: `HTTP Error: ${response.status} ${response.statusText}`,
      }));
      throw new Error(errorData.message || '요청에 실패했습니다.');
    }

    // JSON 파싱 (빈 응답인 경우 null 반환)
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    return null;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      throw new Error('요청 시간이 초과되었습니다.');
    }

    // 네트워크 에러 처리
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('서버에 연결할 수 없습니다. 네트워크를 확인해주세요.');
    }

    throw error;
  }
}

/**
 * GET 요청
 */
export async function get(endpoint, params = {}) {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${endpoint}?${queryString}` : endpoint;
  return fetchAPI(url, { method: 'GET' });
}

/**
 * POST 요청
 */
export async function post(endpoint, data = {}) {
  return fetchAPI(endpoint, {
    method: 'POST',
    body: data,
  });
}

/**
 * PUT 요청
 */
export async function put(endpoint, data = {}) {
  return fetchAPI(endpoint, {
    method: 'PUT',
    body: data,
  });
}

/**
 * PATCH 요청
 */
export async function patch(endpoint, data = {}) {
  return fetchAPI(endpoint, {
    method: 'PATCH',
    body: data,
  });
}

/**
 * DELETE 요청
 */
export async function del(endpoint) {
  return fetchAPI(endpoint, {
    method: 'DELETE',
  });
}

/**
 * 파일 업로드 (FormData 사용)
 */
export async function uploadFile(endpoint, formData, onProgress) {
  const controller = new AbortController();
  
  // Progress 이벤트 리스너 (XMLHttpRequest 사용)
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    // Progress 이벤트
    if (onProgress) {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          onProgress(percentComplete);
        }
      });
    }
    
    // 완료 이벤트
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        } catch {
          resolve(xhr.responseText);
        }
      } else {
        reject(new Error(`HTTP Error: ${xhr.status}`));
      }
    });
    
    // 에러 이벤트
    xhr.addEventListener('error', () => {
      reject(new Error('파일 업로드에 실패했습니다.'));
    });
    
    // 취소 이벤트
    xhr.addEventListener('abort', () => {
      reject(new Error('파일 업로드가 취소되었습니다.'));
    });
    
    // 인증 토큰 추가
    const token = localStorage.getItem('authToken');
    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }
    
    xhr.open('POST', `${API_URL}${endpoint}`);
    xhr.send(formData);
    
    // AbortController와 연결
    controller.signal.addEventListener('abort', () => {
      xhr.abort();
    });
  });
}

export default {
  get,
  post,
  put,
  patch,
  delete: del,
  uploadFile,
};