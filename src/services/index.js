/**
 * API 서비스 통합 export
 */
import api from './api';
import resourcesApi from './resourcesApi';
import calendarApi from './calendarApi';
import rentalApi from './rentalApi';
import financeApi from './financeApi';
import pledgeApi from './pledgeApi';
import activityApi from './activityApi';

// Named exports
export { api, resourcesApi, calendarApi, rentalApi, financeApi, pledgeApi, activityApi };

// Default export
export default {
  api,
  resourcesApi,
  calendarApi,
  rentalApi,
  financeApi,
  pledgeApi,
  activityApi,
};