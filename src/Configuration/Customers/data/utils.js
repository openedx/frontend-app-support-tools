import { camelCaseObject } from '@edx/frontend-platform/utils';
import EcommerceApiService from '../../../data/services/EcommerceApiService';
import LicenseManagerApiService from '../../../data/services/LicenseManagerApiService';
import EnterpriseAccessApiService from '../../../data/services/EnterpriseAccessApiService';
import LmsApiService from '../../../data/services/EnterpriseApiService';
import dayjs from '../../Provisioning/data/dayjs';

export const getEnterpriseOffers = async (enterpriseId) => {
  const response = await EcommerceApiService.fetchEnterpriseOffers(enterpriseId);
  const enterpriseOffers = camelCaseObject(response.data);
  return enterpriseOffers;
};

export const getCouponOrders = async (enterpriseId, options) => {
  const response = await EcommerceApiService.fetchCouponOrders(enterpriseId, options);
  const couponOrders = camelCaseObject(response.data);
  return couponOrders;
};

export const getCustomerSubscriptions = async (enterpriseId) => {
  const response = await LicenseManagerApiService.fetchCustomerSubscriptions(enterpriseId);
  const subscriptions = camelCaseObject(response.data);
  return subscriptions;
};

export const getSubsidyAccessPolicies = async (enterpriseId) => {
  const response = await EnterpriseAccessApiService.fetchSubsidyAccessPolicies(enterpriseId);
  const subsidyAccessPolicies = camelCaseObject(response.data);
  return subsidyAccessPolicies;
};

export const getEnterpriseCustomer = async (options) => {
  const response = await LmsApiService.fetchEnterpriseCustomerSupportTool(options);
  const enterpriseCustomer = camelCaseObject(response.data);
  return enterpriseCustomer;
};

export const formatDate = (date) => dayjs(date).utc().format('MMM D, YYYY');
