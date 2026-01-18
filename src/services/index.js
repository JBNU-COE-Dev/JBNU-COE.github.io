/**
 * API 서비스 통합 export
 */
import api from './api';
import noticesApi from './noticesApi';
import galleryApi from './galleryApi';
import resourcesApi from './resourcesApi';
import calendarApi from './calendarApi';
import rentalApi from './rentalApi';
import financeApi from './financeApi';

// Named exports
export { api, noticesApi, galleryApi, resourcesApi, calendarApi, rentalApi, financeApi };

// Default export
export default {
  api,
  noticesApi,
  galleryApi,
  resourcesApi,
  calendarApi,
  rentalApi,
  financeApi,
};