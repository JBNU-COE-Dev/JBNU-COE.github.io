/** 활동 목록/상세에서 공통으로 쓰는 표시용 변환 */

export const CATEGORY_LABEL = {
  EXTERNAL_ACTIVITY: '대외활동',
  CONTEST: '공모전',
  TEAM_RECRUITMENT: '팀원 모집',
};

export const VALID_CATEGORIES = Object.keys(CATEGORY_LABEL);

const WEEKDAY = ['일', '월', '화', '수', '목', '금', '토'];

function parseDate(value) {
  if (!value) return null;
  if (typeof value === 'string') {
    const m = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  }
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatDeadline(endDate) {
  const d = parseDate(endDate);
  if (!d) return '';
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${mm}.${dd}(${WEEKDAY[d.getDay()]})`;
}


export function parseRoles(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.map((r) => String(r).trim()).filter(Boolean);

  const text = String(raw).trim();
  if (text.startsWith('[')) {
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) return parsed.map((r) => String(r).trim()).filter(Boolean);
    } catch {
      // JSON 이 아니면 아래 쉼표 분리로 처리
    }
  }
  return text.split(',').map((r) => r.trim()).filter(Boolean);
}
