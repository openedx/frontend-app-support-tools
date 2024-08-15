import { getConfig, snakeCaseObject } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

class SubsidyApiService {
  static apiClient = getAuthenticatedHttpClient;

  static getAllSubsidies = ({
    pageIndex,
    pageSize,
    sortBy,
    filteredData,
  }) => {
    const subsidiesURL = `${getConfig().SUBSIDY_BASE_URL}/api/v1/subsidies/`;
    const optionalUrlParams = new URLSearchParams(snakeCaseObject({
      pageSize,
      sortBy: sortBy || 'uuid',
      ...filteredData,
    })).toString();
    return SubsidyApiService.apiClient().get(`${subsidiesURL}?page=${pageIndex}&${optionalUrlParams}`);
  };

  static fetchSingleSubsidy = (uuid) => {
    const subsidiesURL = `${getConfig().SUBSIDY_BASE_URL}/api/v1/subsidies/`;
    return SubsidyApiService.apiClient().get(`${subsidiesURL}?uuid=${uuid}`);
  };

  /**
   * postSubsidy gets or creates a learner credit Subsidy (and corresponding ledger).
   *
   * @param {String} financialIdentifier - A reference to the object responsible for originating this subsidy, and the
   * key on which existing subsidies are retrieved.
   * @param {String} title
   * @param {String} enterpriseUUID
   * @param {String} startDate
   * @param {String} endDate
   * @param {Number} startingBalance - The initial balance of the new subsidy in USD Cents (integer).
   * @param {String} revenueCategory
   * @param {Boolean} internalOnly
   * @param {String} unit = 'usd_cents'
   *
   * @returns {Object} - The subsidy create endpoint response, containing a serialized subsidy.
   */
  static postSubsidy = (
    financialIdentifier,
    title,
    enterpriseUUID,
    startDate,
    endDate,
    startingBalance,
    revenueCategory,
    internalOnly,
    unit = 'usd_cents',
  ) => {
    const subsidiesURL = `${getConfig().SUBSIDY_BASE_URL}/api/v1/subsidies/`;
    return SubsidyApiService.apiClient().post(
      subsidiesURL,
      {
        reference_id: financialIdentifier,
        default_title: title,
        default_enterprise_customer_uuid: enterpriseUUID,
        default_active_datetime: startDate,
        default_expiration_datetime: endDate,
        default_unit: unit,
        default_starting_balance: startingBalance,
        default_revenue_category: revenueCategory,
        default_internal_only: internalOnly,
      },
    );
  };

  static patchSubsidy = (
    subsidyUuid,
    title,
    startDate,
    endDate,
    revenueCategory,
    internalOnly,
  ) => {
    const subsidiesURL = `${getConfig().SUBSIDY_BASE_URL}/api/v1/subsidies/${subsidyUuid}/`;
    return SubsidyApiService.apiClient().patch(
      subsidiesURL,
      {
        title,
        active_datetime: startDate,
        expiration_datetime: endDate,
        revenue_category: revenueCategory,
        internal_only: internalOnly,
      },
    );
  };
}

export default SubsidyApiService;
