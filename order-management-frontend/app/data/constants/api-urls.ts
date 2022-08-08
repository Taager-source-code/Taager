/* eslint-disable max-len */
import { environment } from '../../../environments/environment';
export const API_URLS = {
  CREATE_PROVINCE_SHIPPING_COMPANY_URL:
  province_id =>
  `${environment.allocationBaseUrl}/provinces/${province_id}/shipping-companies-priorities`,
  CREATE_ZONE_SHIPPING_COMPANY_URL:
  (province_id, zone_id) =>
  `${environment.allocationBaseUrl}/provinces/${province_id}/zones/${zone_id}/shipping-companies-priorities`,
  UPDATE_PROVINCE_SHIPPING_COMPANY_PRIORITY_URL:
  province_id =>
  `${environment.allocationBaseUrl}/provinces/${province_id}/shipping-companies-priorities/re-sort`,
  UPDATE_ZONE_SHIPPING_COMPANY_PRIORITY_URL:
  (province_id, zone_id) =>
  `${environment.allocationBaseUrl}/provinces/${province_id}/zones/${zone_id}/shipping-companies-priorities/re-sort`,
  UPDATE_PROVINCE_SHIPPING_COMPANY_URL:
  (province_id, priority_id) =>
  `${environment.allocationBaseUrl}/provinces/${province_id}/shipping-companies-priorities/${priority_id}`,
  UPDATE_ZONE_SHIPPING_COMPANY_URL:
  (province_id, zone_id, priority_id) =>
  `${environment.allocationBaseUrl}/provinces/${province_id}/zones/${zone_id}/shipping-companies-priorities/${priority_id}`,
  DELETE_PROVINCE_SHIPPING_COMPANY_PRIORITY:
  (province_id, priority_id) =>
  `${environment.allocationBaseUrl}/provinces/${province_id}/shipping-companies-priorities/${priority_id}`,
  DELETE_ZONE_SHIPPING_COMPANY_PRIORIY:
  (province_id, zone_id, priority_id) =>
  `${environment.allocationBaseUrl}/provinces/${province_id}/zones/${zone_id}/shipping-companies-priorities/${priority_id}`,
  GET_PROVINCE_CAPACITY_URL:
  `${environment.allocationBaseUrl}/provinces`,
  GET_SHIPPING_COMPANIES_URL:
  `${environment.allocationBaseUrl}/shipping-companies`,
  GET_PROVINCE_ZONES_URL:
  province_id =>
  `${environment.allocationBaseUrl}/provinces/${province_id}/zones`,
  GET_PROVINCE_SHIPPING_COMPANY_PRIORITIES_URL:
  province_id =>
  `${environment.allocationBaseUrl}/provinces/${province_id}/shipping-companies-priorities`,
  GET_ZONE_SHIPPING_COMPANY_PRIORITIES_URL:
  (province_id, zone_id) =>
  `${environment.allocationBaseUrl}/provinces/${province_id}/zones/${zone_id}/shipping-companies-priorities`,
  ALLOCATION_SERVICE_STATUS_URL:
  `${environment.allocationBaseUrl}/allocator-status`,
  RUN_ALLOCATION_SERVICE_URL:
  `${environment.allocationBaseUrl}/run-allocator`,
  UPDATE_UNALLOCATION:
  `${environment.allocationBaseUrl}/orders/un-allocate`,
  ORDERS_LIST:
  params =>
  `${environment.baseUrl}after-sales/orders?${params}`,
  COUNTRIES_LIST_URL:
  `${environment.baseUrl}countries`,
  ORDER_DETAILS:
  orderId =>
  `${environment.baseUrl}after-sales/orders/${orderId}`,
  GET_PROVINCES:
  `${environment.baseUrl}province/getProvinces`,
};