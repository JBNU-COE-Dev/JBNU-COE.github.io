/**
 * API 서비스 통합 export
 */
import api, { getApiUrl } from './api';
import noticesApi from './noticesApi';
import galleryApi from './galleryApi';
import resourcesApi from './resourcesApi';
import calendarApi from './calendarApi';
import rentalApi from './rentalApi';
import financeApi from './financeApi';
import matchingApi from './matchingApi';
import pledgeApi from './pledgeApi';
import activityApi from './activityApi';

// Named exports
export { api, getApiUrl, noticesApi, galleryApi, resourcesApi, calendarApi, rentalApi, financeApi, matchingApi, pledgeApi, activityApi };

// Default export
export default {
  api,
  noticesApi,
  galleryApi,
  resourcesApi,
  calendarApi,
  rentalApi,
  financeApi,
  matchingApi,
  pledgeApi,
  activityApi,
};