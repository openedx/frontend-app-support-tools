import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

class LicenseManagerApiService {
  static apiClient = getAuthenticatedHttpClient;

  static fetchCustomerSubscriptions(enterpriseId, options) {
    const queryParams = new URLSearchParams({
      enterprise_customer_uuid: enterpriseId,
      ...options,
    });
    const url = `${getConfig().LICENSE_MANAGER_URL}/api/v1/subscriptions/?${queryParams.toString()}`;
    return LicenseManagerApiService.apiClient().get(url);
  }
}

export default LicenseManagerApiService;
