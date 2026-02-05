/**
 * 공약 이행률 API
 * - GET /api/pledges/progress : 공약 ID별 이행 여부 (id -> completed)
 * 관리자에서 조정한 completed가 ID로 매칭되어 반환됨.
 */
import { get } from './api';

/**
 * 공약 이행 progress 조회
 * @returns {Promise<{ progress: Record<string, boolean> }>}
 */
export async function getPledgeProgress() {
  return get('/api/pledges/progress');
}

export default { getPledgeProgress };
