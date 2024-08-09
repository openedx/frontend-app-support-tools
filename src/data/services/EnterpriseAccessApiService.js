import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

class EnterpriseAccessApiService {
  static apiClient = getAuthenticatedHttpClient;

  static fetchSubsidyAccessPolicies(enterpriseId, options) {
    const queryParams = new URLSearchParams({
      enterprise_customer_uuid: enterpriseId,
      ...options,
    });
    const url = `${getConfig().ENTERPRISE_ACCESS_BASE_URL}/api/v1/subsidy-access-policies/?${queryParams.toString()}`;
    return EnterpriseAccessApiService.apiClient().get(url);
  }
}

export default EnterpriseAccessApiService;
