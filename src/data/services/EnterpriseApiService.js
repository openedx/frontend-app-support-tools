import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

class LmsApiService {
  static apiClient = getAuthenticatedHttpClient;

  static baseUrl = getConfig().LMS_BASE_URL;

  static enterpriseAPIBaseUrl = `${LmsApiService.baseUrl}/enterprise/api/v1/`;

  static enterpriseCatalogQueriesUrl = `${LmsApiService.enterpriseAPIBaseUrl}enterprise_catalog_query/`;

  static enterpriseCustomerCatalogsUrl = `${LmsApiService.enterpriseAPIBaseUrl}enterprise_customer_catalog/`;

  static enterpriseCustomersBasicListUrl = `${LmsApiService.baseUrl}/enterprise/api/v1/enterprise-customer/basic_list/`;

  static fetchEnterpriseCatalogQueries = () => LmsApiService.apiClient().get(LmsApiService.enterpriseCatalogQueriesUrl);

  static fetchEnterpriseCustomersBasicList = (enterpriseNameOrUuid) => LmsApiService.apiClient().get(`${LmsApiService.enterpriseCustomersBasicListUrl}${enterpriseNameOrUuid !== undefined ? `?name_or_uuid=${enterpriseNameOrUuid}` : ''}`);

  static postEnterpriseCustomerCatalog = (
    enterpriseCustomerUUID,
    catalogQueryUUID,
    title,
  ) => LmsApiService.apiClient().post(LmsApiService.enterpriseCustomerCatalogsUrl, {
    enterprise_customer: enterpriseCustomerUUID,
    enterprise_catalog_query: catalogQueryUUID,
    title,
  });
}

export default LmsApiService;
