import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

class LmsApiService {
  static apiClient = getAuthenticatedHttpClient;

  static baseUrl = getConfig().LMS_BASE_URL;

  static enterpriseCatalogQueriesUrl = `${LmsApiService.baseUrl}/enterprise/api/v1/enterprise_catalog_query/`;

  static enterpriseCustomersBasicListUrl = `${LmsApiService.baseUrl}/enterprise/api/v1/enterprise-customer/basic_list/`;

  static fetchEnterpriseCatalogQueries = () => LmsApiService.apiClient().get(LmsApiService.enterpriseCatalogQueriesUrl);

  static fetchEnterpriseCustomersBasicList = (query) => LmsApiService.apiClient().get(`${LmsApiService.enterpriseCustomersBasicListUrl}${query !== undefined ? `?name_or_uuid=${query}` : ''}`);
}

export default LmsApiService;
