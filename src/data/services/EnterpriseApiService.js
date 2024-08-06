import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

class LmsApiService {
  static apiClient = getAuthenticatedHttpClient;

  static baseUrl = getConfig().LMS_BASE_URL;

  static enterpriseAPIBaseUrl = `${LmsApiService.baseUrl}/enterprise/api/v1/`;

  static enterpriseCatalogQueriesUrl = `${LmsApiService.enterpriseAPIBaseUrl}enterprise_catalog_query/`;

  static enterpriseCustomerCatalogsWriteUrl = `${LmsApiService.enterpriseAPIBaseUrl}enterprise_customer_catalog/`;

  static enterpriseCustomerUrl = `${LmsApiService.enterpriseAPIBaseUrl}enterprise-customer/`

  static enterpriseCustomersBasicListUrl = `${LmsApiService.baseUrl}/enterprise/api/v1/enterprise-customer/basic_list/`;

  static enterpriseCustomersSupportToolUrl = `${LmsApiService.baseUrl}/enterprise/api/v1/enterprise-customer/support_tool/`;

  static enterpriseCatalogsUrl = `${LmsApiService.enterpriseAPIBaseUrl}enterprise_catalogs/`;

  static fetchEnterpriseCatalogQueries = () => LmsApiService.apiClient().get(LmsApiService.enterpriseCatalogQueriesUrl);

  static fetchEnterpriseCustomersBasicList = (enterpriseNameOrUuid) => LmsApiService.apiClient().get(`${LmsApiService.enterpriseCustomersBasicListUrl}${enterpriseNameOrUuid !== undefined ? `?name_or_uuid=${enterpriseNameOrUuid}` : ''}`);

  static postEnterpriseCustomerCatalog = (
    enterpriseCustomerUuid,
    catalogQueryId,
    title,
  ) => LmsApiService.apiClient().post(LmsApiService.enterpriseCustomerCatalogsWriteUrl, {
    enterprise_customer: enterpriseCustomerUuid,
    enterprise_catalog_query: catalogQueryId,
    title,
  });

  static patchEnterpriseCustomerCatalog = (
    catalogQueryId,
    catalogUuid,
    title,
  ) => LmsApiService.apiClient().patch(LmsApiService.enterpriseCustomerCatalogsWriteUrl, {
    enterprise_catalog_query: catalogQueryId,
    uuid: catalogUuid,
    title,
  });

  static fetchEnterpriseCustomer = (enterpriseId) => {
    console.log(enterpriseId)
    return LmsApiService.apiClient().get(
      `${LmsApiService.enterpriseCustomerUrl}${enterpriseId}/`,
    );
  }

  static fetchEnterpriseCustomerSupportTool = (options) => {
    const queryParams = new URLSearchParams({
      ...options,
    });
    return LmsApiService.apiClient().get(
      `${LmsApiService.enterpriseCustomersSupportToolUrl}?${queryParams.toString()}`,
    );
  };

  /**
   * Retrieve one catalog (the plurality of the function name is due to the fact that this is a list endpoint).
   * @param {Number} catalogUuid - UUID of the single catalog to fetch.
   * @returns - Standard API list response. Contains 0 or 1 catalogs under `.data.results`.
   */
  static fetchEnterpriseCustomerCatalogs = ({ catalogUuid = undefined, customerUuid = undefined }) => {
    const params = {};
    if (catalogUuid) {
      params.uuid = catalogUuid;
    }
    if (customerUuid) {
      params.enterprise_customer = customerUuid;
    }
    let querystring = new URLSearchParams(params).toString();
    querystring = querystring ? `?${querystring}` : '';
    return LmsApiService.apiClient().get(
      `${LmsApiService.enterpriseCatalogsUrl}${querystring}`,
    );
  };

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

  static patchSubsidyAccessPolicy = ({
    uuid,
    description,
    catalogUuid,
    perLearnerSpendLimit,
    accessMethod,
    active = true,
  }) => LmsApiService.apiClient().patch(
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
