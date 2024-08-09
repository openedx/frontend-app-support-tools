import { getConfig, snakeCaseObject } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

class EcommerceApiService {
  static apiClient = getAuthenticatedHttpClient;

  static baseUrl = getConfig().ECOMMERCE_BASE_URL;

  static fetchCouponOrders(enterpriseId, options) {
    const queryParams = new URLSearchParams({
      page: 1,
      page_size: 50,
      ...options,
    });
    const url = `${EcommerceApiService.baseUrl}/api/v2/enterprise/coupons/${enterpriseId}/overview/?${queryParams.toString()}`;
    return EcommerceApiService.apiClient().get(url);
  }

  static fetchEnterpriseOffers(enterpriseId, options) {
    let url = `${EcommerceApiService.baseUrl}/api/v2/enterprise/${enterpriseId}/enterprise-admin-offers/`;
    if (options) {
      const queryParams = new URLSearchParams(snakeCaseObject(options));
      url += `?${queryParams.toString()}`;
    }
    return EcommerceApiService.apiClient().get(url);
  }
}

export default EcommerceApiService;
