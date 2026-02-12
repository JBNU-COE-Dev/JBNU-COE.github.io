/**
 * 매칭플랫폼(활동) 공통 상수
 */

export const CATEGORY_LABEL = {
  EXTERNAL_ACTIVITY: '대외활동',
  CONTEST: '공모전',
  TEAM_RECRUITMENT: '팀원 모집',
};

export const CATEGORY_OPTIONS = [
  { value: '', label: '전체' },
  { value: 'EXTERNAL_ACTIVITY', label: '대외활동' },
  { value: 'CONTEST', label: '공모전' },
  { value: 'TEAM_RECRUITMENT', label: '팀원 모집' },
];

export const SORT_OPTIONS = [
  { value: 'latest', label: '최신순' },
  { value: 'deadline', label: '마감 임박순' },
  { value: 'viewCount', label: '조회수순' },
];

export const VALID_CATEGORIES = ['EXTERNAL_ACTIVITY', 'CONTEST', 'TEAM_RECRUITMENT'];
