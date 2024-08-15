import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

class LicenseManagerApiService {
  static apiClient = getAuthenticatedHttpClient;

  static fetchCustomerAgreementData(enterpriseId, options) {
    const queryParams = new URLSearchParams({
      enterprise_customer_uuid: enterpriseId,
      ...options,
    });
    const url = `${getConfig().LICENSE_MANAGER_URL}/api/v1/customer-agreement/?${queryParams.toString()}`;
    return LicenseManagerApiService.apiClient().get(url);
  }
}

export default LicenseManagerApiService;
