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

  static postSubsidyAccessPolicy = (
    description,
    enterpriseCustomerUuid,
    catalogUuid,
    subsidyUuid,
    perLearnerSpendLimit,
    spendLimit,
    accessMethod = 'direct',
    active = true,
    perLearnerEnrollmentLimit = null,
    policyType = 'PerLearnerSpendCreditAccessPolicy',
  ) => LmsApiService.apiClient().post(
    `${getConfig().ENTERPRISE_ACCESS_BASE_URL}/api/v1/admin/policy/`,
    {
      policy_type: policyType,
      description,
      active,
      enterprise_customer_uuid: enterpriseCustomerUuid,
      catalog_uuid: catalogUuid,
      subsidy_uuid: subsidyUuid,
      access_method: accessMethod,
      per_learner_spend_limit: perLearnerSpendLimit,
      per_learner_enrollment_limit: perLearnerEnrollmentLimit,
      spend_limit: spendLimit,
    },
  );
}

export default LmsApiService;
