import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

class LmsApiService {
  static apiClient = getAuthenticatedHttpClient;

  static baseUrl = getConfig().LMS_BASE_URL;

  static enterpriseCatalogQueriesUrl = `${LmsApiService.baseUrl}/enterprise/api/v1/enterprise_catalog_query/`;

  static enterpriseCustomersBasicListUrl = `${LmsApiService.baseUrl}/enterprise/api/v1/enterprise-customer/basic_list/`;

  static fetchEnterpriseCatalogQueries = () => LmsApiService.apiClient().get(LmsApiService.enterpriseCatalogQueriesUrl);

  static fetchEnterpriseCustomersBasicList = (enterpriseNameOrUuid) => LmsApiService.apiClient().get(`${LmsApiService.enterpriseCustomersBasicListUrl}${enterpriseNameOrUuid !== undefined ? `?name_or_uuid=${enterpriseNameOrUuid}` : ''}`);
}

export default LmsApiService;
