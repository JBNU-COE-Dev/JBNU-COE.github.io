/**
 * 캘린더(행사 일정) API
 */
import { get, post, put, del } from './api';

/**
 * 월별 행사 일정 목록 조회
 * @param {Object} params - 필터 파라미터
 * @param {string} params.year - 연도 (예: "2024", "2025")
 * @param {string} params.month - 월 (예: "01", "12")
 * @param {Date} params.startDate - 시작 날짜 (선택)
 * @param {Date} params.endDate - 종료 날짜 (선택)
 */
export async function getCalendarEvents(params = {}) {
  const {
    year,
    month,
    startDate,
    endDate,
  } = params;

  const queryParams = {};

  if (year) {
    queryParams.year = year;
  }

  if (month) {
    queryParams.month = month;
  }

  if (startDate) {
    queryParams.startDate = startDate instanceof Date 
      ? startDate.toISOString().split('T')[0]
      : startDate;
  }

  if (endDate) {
    queryParams.endDate = endDate instanceof Date
      ? endDate.toISOString().split('T')[0]
      : endDate;
  }

  return get('/api/calendar/events', queryParams);
}

/**
 * 특정 날짜 범위의 행사 일정 조회
 * @param {string|Date} startDate - 시작 날짜
 * @param {string|Date} endDate - 종료 날짜
 */
export async function getCalendarEventsByRange(startDate, endDate) {
  const start = startDate instanceof Date
    ? startDate.toISOString().split('T')[0]
    : startDate;
  const end = endDate instanceof Date
    ? endDate.toISOString().split('T')[0]
    : endDate;

  return get('/api/calendar/events', {
    startDate: start,
    endDate: end,
  });
}

/**
 * 행사 일정 상세 조회
 * @param {number|string} id - 행사 일정 ID
 */
export async function getCalendarEventDetail(id) {
  return get(`/api/calendar/events/${id}`);
}

/**
 * 행사 일정 생성
 * @param {Object} eventData - 행사 일정 데이터
 * @param {string} eventData.date_start - 시작 날짜 (YYYY-MM-DD)
 * @param {string} eventData.date_end - 종료 날짜 (YYYY-MM-DD)
 * @param {string} eventData.event_korean - 행사명 (한글)
 * @param {string} eventData.event_english - 행사명 (영문)
 * @param {string} eventData.description - 설명 (선택)
 */
export async function createCalendarEvent(eventData) {
  return post('/api/calendar/events', eventData);
}

/**
 * 행사 일정 수정
 * @param {number|string} id - 행사 일정 ID
 * @param {Object} eventData - 수정할 행사 일정 데이터
 */
export async function updateCalendarEvent(id, eventData) {
  return put(`/api/calendar/events/${id}`, eventData);
}

/**
 * 행사 일정 삭제
 * @param {number|string} id - 행사 일정 ID
 */
export async function deleteCalendarEvent(id) {
  return del(`/api/calendar/events/${id}`);
}

/**
 * 전체 행사 일정 조회 (캐시 가능)
 * 페이지네이션 없이 모든 일정 반환
 */
export async function getAllCalendarEvents() {
  return get('/api/calendar/events/all');
}

export default {
  getCalendarEvents,
  getCalendarEventsByRange,
  getCalendarEventDetail,
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
  getAllCalendarEvents,
};
