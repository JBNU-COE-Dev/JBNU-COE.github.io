/**
 * 마감일(end_date)을 기준으로 D-Day 라벨 계산
 * @param {string|undefined|null} endDate - ISO 날짜 문자열 (yyyy-MM-dd) 또는 Date
 * @returns {string} 예: "D-7", "D-1", "오늘 마감", "마감", "상시"
 */
export function getDDayLabel(endDate) {
  if (!endDate) return '상시';
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  if (Number.isNaN(end.getTime())) return '상시';

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  const diffMs = end - today;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays > 0) return `D-${diffDays}`;
  if (diffDays === 0) return '오늘 마감';
  return '마감';
}

/**
 * D-Day 숫자만 반환 (정렬/강조용)
 * @param {string|undefined|null} endDate
 * @returns {number|null} 양수: D-n, 0: 오늘, 음수: 마감경과일, null: 상시
 */
export function getDDayNumber(endDate) {
  if (!endDate) return null;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  if (Number.isNaN(end.getTime())) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  return Math.ceil((end - today) / (1000 * 60 * 60 * 24));
}
