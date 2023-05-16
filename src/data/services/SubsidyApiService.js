import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

class SubsidyApiService {
  static apiClient = getAuthenticatedHttpClient;

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
