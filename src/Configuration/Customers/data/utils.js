import { useState } from 'react';
import { camelCaseObject } from '@edx/frontend-platform/utils';
import { logError } from '@edx/frontend-platform/logging';
import { getConfig } from '@edx/frontend-platform';
import EcommerceApiService from '../../../data/services/EcommerceApiService';
import LicenseManagerApiService from '../../../data/services/LicenseManagerApiService';
import LmsApiService from '../../../data/services/EnterpriseApiService';
import dayjs from '../../Provisioning/data/dayjs';
import fetchPaginatedData from '../../../data/services/utils';

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

export const getSubsidies = async (enterpriseUUID) => {
  const url = `${getConfig().SUBSIDY_BASE_URL}/api/v1/subsidies/?enterprise_customer_uuid=${enterpriseUUID}`;
  try {
    const { results } = await fetchPaginatedData(url);
    return results;
  } catch (error) {
    logError(error);
    return [];
  }
};

export const getEnterpriseCustomer = async (options) => {
  const response = await LmsApiService.fetchEnterpriseCustomerSupportTool(options);
  const enterpriseCustomer = camelCaseObject(response.data);
  return enterpriseCustomer;
};

export const formatDate = (date) => dayjs(date).utc().format('MMM D, YYYY');

export const useCopyToClipboard = (id) => {
  const [showToast, setShowToast] = useState(false);
  const copyToClipboard = () => {
    navigator.clipboard.writeText(id);
    setShowToast(true);
  };
  return {
    showToast,
    copyToClipboard,
    setShowToast,
  };
};
