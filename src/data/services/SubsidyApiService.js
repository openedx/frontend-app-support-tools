import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { snakeCaseWord } from '../../utils';

class SubsidyApiService {
  static apiClient = getAuthenticatedHttpClient;

  static getAllSubsidies = ({
    paginatedURL, pageSize, sortBy, filteredData,
  }) => {
    const subsidiesURL = `${getConfig().SUBSIDY_BASE_URL}/api/v1/subsidies/`;

    let optionalUrlParams = '';
    optionalUrlParams += pageSize ? `&page_size=${pageSize}` : '';
    optionalUrlParams += sortBy ? `&sortBy=${snakeCaseWord(sortBy)}` : '';
    Object.keys(filteredData).forEach((key) => {
      optionalUrlParams += `&${snakeCaseWord(key)}=${filteredData[key]}`;
    });
    if (paginatedURL) {
      return SubsidyApiService.apiClient().get(`${subsidiesURL}?page=${paginatedURL}${optionalUrlParams}`);
    }
    // If no page size is provided, by default, 10 items are returned.
    return SubsidyApiService.apiClient().get(subsidiesURL);
  };

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
    const wholeDollarStartingBalance = startingBalance * 100;
    return SubsidyApiService.apiClient().post(
      subsidiesURL,
      {
        reference_id: financialIdentifier,
        default_title: title,
        default_enterprise_customer_uuid: enterpriseUUID,
        default_active_datetime: startDate,
        default_expiration_datetime: endDate,
        default_unit: unit,
        default_starting_balance: wholeDollarStartingBalance,
        default_revenue_category: revenueCategory,
        default_internal_only: internalOnly,
      },
    );
  };
}

export default SubsidyApiService;
