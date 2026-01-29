/**
 * 한국 공휴일 데이터 및 유틸리티
 * 출처: 행정안전부 공공데이터 (간소화된 버전)
 */

// 한국 공휴일 데이터 (2024-2026)
const koreanHolidays = {
  '2024': [
    { date: '2024-01-01', name: '신정' },
    { date: '2024-03-01', name: '3·1절' },
    { date: '2024-05-05', name: '어린이날' },
    { date: '2024-05-15', name: '석가탄신일' },
    { date: '2024-06-06', name: '현충일' },
    { date: '2024-08-15', name: '광복절' },
    { date: '2024-10-03', name: '개천절' },
    { date: '2024-10-09', name: '한글날' },
    { date: '2024-12-25', name: '크리스마스' },
    // 설날 (음력)
    { date: '2024-02-09', name: '설날' },
    { date: '2024-02-10', name: '설날' },
    { date: '2024-02-11', name: '설날' },
    { date: '2024-02-12', name: '설날 연휴' },
    // 추석 (음력)
    { date: '2024-09-16', name: '추석' },
    { date: '2024-09-17', name: '추석' },
    { date: '2024-09-18', name: '추석' },
  ],
  '2025': [
    { date: '2025-01-01', name: '신정' },
    { date: '2025-03-01', name: '3·1절' },
    { date: '2025-05-05', name: '어린이날' },
    { date: '2025-05-06', name: '어린이날 대체공휴일' },
    { date: '2025-06-06', name: '현충일' },
    { date: '2025-08-15', name: '광복절' },
    { date: '2025-10-03', name: '개천절' },
    { date: '2025-10-06', name: '개천절 대체공휴일' },
    { date: '2025-10-09', name: '한글날' },
    { date: '2025-12-25', name: '크리스마스' },
    // 설날 (음력)
    { date: '2025-01-28', name: '설날' },
    { date: '2025-01-29', name: '설날' },
    { date: '2025-01-30', name: '설날' },
    // 부처님 오신 날 (음력)
    { date: '2025-05-05', name: '부처님 오신 날' },
    // 추석 (음력)
    { date: '2025-10-05', name: '추석' },
    { date: '2025-10-06', name: '추석' },
    { date: '2025-10-07', name: '추석' },
    { date: '2025-10-08', name: '추석 연휴' },
  ],
  '2026': [
    { date: '2026-01-01', name: '신정' },
    { date: '2026-01-02', name: '신정 연휴' },
    { date: '2026-03-01', name: '3·1절' },
    { date: '2026-05-05', name: '어린이날' },
    { date: '2026-06-06', name: '현충일' },
    { date: '2026-08-15', name: '광복절' },
    { date: '2026-08-17', name: '광복절 대체공휴일' },
    { date: '2026-10-03', name: '개천절' },
    { date: '2026-10-09', name: '한글날' },
    { date: '2026-12-25', name: '크리스마스' },
    // 설날 (음력)
    { date: '2026-02-16', name: '설날' },
    { date: '2026-02-17', name: '설날' },
    { date: '2026-02-18', name: '설날' },
    // 부처님 오신 날 (음력)
    { date: '2026-05-24', name: '부처님 오신 날' },
    // 추석 (음력)
    { date: '2026-09-24', name: '추석' },
    { date: '2026-09-25', name: '추석' },
    { date: '2026-09-26', name: '추석' },
    { date: '2026-09-27', name: '추석 연휴' },
  ],
};

/**
 * 특정 날짜가 공휴일인지 확인
 * @param {Date|string} date - 확인할 날짜
 * @returns {Object|null} 공휴일 정보 또는 null
 */
export function isHoliday(date) {
  const dateStr = typeof date === 'string' ? date : formatDate(date);
  const year = dateStr.substring(0, 4);
  
  if (!koreanHolidays[year]) {
    return null;
  }
  
  const holiday = koreanHolidays[year].find(h => h.date === dateStr);
  return holiday || null;
}

/**
 * 특정 년도의 모든 공휴일 가져오기
 * @param {number|string} year - 년도 (예: 2024, "2024")
 * @returns {Array} 공휴일 배열
 */
export function getHolidaysForYear(year) {
  const yearStr = String(year);
  return koreanHolidays[yearStr] || [];
}

/**
 * 날짜 범위 내의 공휴일 가져오기
 * @param {Date|string} startDate - 시작 날짜
 * @param {Date|string} endDate - 종료 날짜
 * @returns {Array} 공휴일 배열
 */
export function getHolidaysInRange(startDate, endDate) {
  const start = typeof startDate === 'string' ? startDate : formatDate(startDate);
  const end = typeof endDate === 'string' ? endDate : formatDate(endDate);
  
  const startYear = parseInt(start.substring(0, 4));
  const endYear = parseInt(end.substring(0, 4));
  
  const holidays = [];
  
  for (let year = startYear; year <= endYear; year++) {
    const yearHolidays = getHolidaysForYear(year);
    yearHolidays.forEach(holiday => {
      if (holiday.date >= start && holiday.date <= end) {
        holidays.push(holiday);
      }
    });
  }
  
  return holidays;
}

/**
 * 날짜를 YYYY-MM-DD 형식으로 변환
 * @param {Date} date - 변환할 날짜
 * @returns {string} YYYY-MM-DD 형식의 날짜 문자열
 */
function formatDate(date) {
  if (!(date instanceof Date)) {
    return date;
  }
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

/**
 * 공휴일 데이터를 이벤트 형식으로 변환
 * @param {Date|string} startDate - 시작 날짜
 * @param {Date|string} endDate - 종료 날짜
 * @returns {Object} 날짜를 키로 하는 공휴일 객체
 */
export function getHolidaysAsEvents(startDate, endDate) {
  const holidays = getHolidaysInRange(startDate, endDate);
  const events = {};
  
  holidays.forEach(holiday => {
    events[holiday.date] = events[holiday.date] || [];
    events[holiday.date].push({
      title: holiday.name,
      titleEn: '',
      dateRange: holiday.date,
      isHoliday: true, // 공휴일 구분 플래그
    });
  });
  
  return events;
}

export default {
  isHoliday,
  getHolidaysForYear,
  getHolidaysInRange,
  getHolidaysAsEvents,
};
