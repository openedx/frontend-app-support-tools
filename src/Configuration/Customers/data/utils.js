import { camelCaseObject } from '@edx/frontend-platform/utils';
import EcommerceApiService from '../../../data/services/EcommerceApiService';
import LicenseManagerApiService from '../../../data/services/LicenseManagerApiService';
import EnterpriseAccessApiService from '../../../data/services/EnterpriseAccessApiService';

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

export const getCustomerAgreements = async (enterpriseId) => {
  const response = await LicenseManagerApiService.fetchCustomerAgreementData(enterpriseId);
  const customerAgreements = camelCaseObject(response.data);
  return customerAgreements;
};

export const getSubsidyAccessPolicies = async (enterpriseId) => {
  const response = await EnterpriseAccessApiService.fetchSubsidyAccessPolicies(enterpriseId);
  const subsidyAccessPolicies = camelCaseObject(response.data);
  return subsidyAccessPolicies;
};
