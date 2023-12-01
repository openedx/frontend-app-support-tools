import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

class LmsApiService {
  static apiClient = getAuthenticatedHttpClient;

  static baseUrl = getConfig().LMS_BASE_URL;

  static enterpriseAPIBaseUrl = `${LmsApiService.baseUrl}/enterprise/api/v1/`;

  static enterpriseCatalogQueriesUrl = `${LmsApiService.enterpriseAPIBaseUrl}enterprise_catalog_query/`;

  static enterpriseCustomerCatalogsUrl = `${LmsApiService.enterpriseAPIBaseUrl}enterprise_customer_catalog/`;

  static enterpriseCustomersBasicListUrl = `${LmsApiService.baseUrl}/enterprise/api/v1/enterprise-customer/basic_list/`;

  static enterpriseCatalogsUrl = `${LmsApiService.enterpriseAPIBaseUrl}enterprise_catalogs/`;

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

  static patchEnterpriseCustomerCatalog = (
    catalogQueryUUID,
    catalogUuid,
    title,
  ) => LmsApiService.apiClient().patch(LmsApiService.enterpriseCustomerCatalogsUrl, {
    enterprise_catalog_query: catalogQueryUUID,
    uuid: catalogUuid,
    title,
  });

  static fetchEnterpriseCustomerCatalogs = (catalogUuid) => LmsApiService.apiClient().get(`${LmsApiService.enterpriseCatalogsUrl}?uuid=${catalogUuid}`);

  // Did not include perLearnerEnrollmentLimit field because it is
  // not used in the current implementation of the provisioning form
  static postSubsidyAccessPolicy = (
    displayName,
    description,
    enterpriseCustomerUuid,
    catalogUuid,
    subsidyUuid,
    perLearnerSpendLimit,
    spendLimit,
    accessMethod,
    policyType,
    active = true,
  ) => LmsApiService.apiClient().post(
    `${getConfig().ENTERPRISE_ACCESS_BASE_URL}/api/v1/subsidy-access-policies/`,
    {
      policy_type: policyType,
      display_name: displayName,
      description,
      active,
      enterprise_customer_uuid: enterpriseCustomerUuid,
      catalog_uuid: catalogUuid,
      subsidy_uuid: subsidyUuid,
      access_method: accessMethod,
      per_learner_spend_limit: perLearnerSpendLimit,
      spend_limit: spendLimit,
    },
  );

  static patchSubsidyAccessPolicy = (
    uuid,
    description,
    catalogUuid,
    perLearnerSpendLimit,
    accessMethod = 'direct',
    active = true,
  ) => LmsApiService.apiClient().patch(
    `${getConfig().ENTERPRISE_ACCESS_BASE_URL}/api/v1/subsidy-access-policies/${uuid}/`,
    {
      description,
      active,
      catalog_uuid: catalogUuid,
      access_method: accessMethod,
      per_learner_spend_limit: perLearnerSpendLimit,
    },
  );

  static fetchSubsidyAccessPolicies = async (enterpriseCustomerUuid) => LmsApiService.apiClient().get(
    `${getConfig().ENTERPRISE_ACCESS_BASE_URL}/api/v1/subsidy-access-policies/?enterprise_customer_uuid=${enterpriseCustomerUuid}`,
  );
}

export default LmsApiService;
