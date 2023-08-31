import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { logError } from '@edx/frontend-platform/logging';
import AccountTypeDetail from './AccountTypeDetail';
import CustomerDetail from './CustomerDetail';
import EditButton from './EditButton';
import InternalOnlyDetail from './InternalOnlyDetail';
import LmsApiService from '../../../data/services/EnterpriseApiService';
import PROVISIONING_PAGE_TEXT from '../data/constants';
import ROUTES from '../../../data/constants/routes';
import SubsidyApiService from '../../../data/services/SubsidyApiService';
import SubsidyTypeDetail from './SubsidyTypeDetail';
import TermDetail from './TermDetail';
import TitleDetail from './TitleDetail';
import PolicyContainer from './PolicyDetailView/PolicyContainer';
import PageLoading from '../../../components/common/PageLoading';

export async function getSubsidy(subsidyUuid) {
  const response = await SubsidyApiService.fetchSingleSubsidy(subsidyUuid);
  return response;
}

export async function getCustomer(customerUuid) {
  const response = await LmsApiService.fetchEnterpriseCustomersBasicList(customerUuid);
  return response;
}

export async function getPolicies(customerUuid) {
  const response = await LmsApiService.fetchSubsidyAccessPolicies(customerUuid);
  return response;
}

export async function getCatalogs(catalogUuid) {
  const response = await LmsApiService.fetchEnterpriseCustomerCatalogs(catalogUuid);
  return response;
}

/**
 * gets the catalog uuid that matches subsidy id of the policies
 */
function getCatalogUuid(policies, subsidyUuid) {
  const foundPolicies = policies.data.results.filter(policy => policy.subsidy_uuid === subsidyUuid);
  if (foundPolicies.length) {
    return foundPolicies.map(policy => policy.catalog_uuid);
  }
  return undefined;
}

const SubsidyDetailView = () => {
  const navigate = useNavigate();
  const { FORM } = PROVISIONING_PAGE_TEXT;
  const [isLoading, setIsLoading] = useState(true);

  const { SUB_DIRECTORY: { ERROR } } = ROUTES.CONFIGURATION.SUB_DIRECTORY.PROVISIONING;

  const params = useParams();
  const subsidyUuid = params.id;

  const [enterpriseSubsidiesData, setEnterpriseSubsidiesData] = useState({});

  const redirectOnError = (statusCode, message) => {
    navigate(ERROR, {
      state: {
        errorMessage: `Error ${statusCode}: ${message}`,
      },
    });
  };

  useEffect(() => {
    const fetchEnterpriseSubsidiesData = async () => {
      try {
        const subsidy = await getSubsidy(subsidyUuid);
        const subsidyCustomerId = subsidy.data.results[0].enterprise_customer_uuid;
        const [customer, policies] = await Promise.all([
          getCustomer(subsidyCustomerId), getPolicies(subsidyCustomerId),
        ]);
        const catalogUuids = getCatalogUuid(policies, subsidyUuid);
        setEnterpriseSubsidiesData((prevState) => ({
          ...prevState,
          subsidy: {
            ...subsidy.data.results[0],
          },
          customer: {
            ...customer.data[0],
          },
          policies: policies.data.results.filter(policy => policy.subsidy_uuid === subsidyUuid),
        }));

        let catalogs;
        if (catalogUuids !== undefined) {
          catalogs = await Promise.all(catalogUuids.map(async (catalogUuid) => {
            const catalog = await getCatalogs(catalogUuid);
            return Object.assign({}, ...catalog.data.results);
          }));
        }

        setEnterpriseSubsidiesData((prevState) => ({
          ...prevState,
          catalogs,
        }));
        setIsLoading(false);
      } catch (error) {
        const { customAttributes } = error;
        logError(error);
        redirectOnError(customAttributes?.httpErrorStatus, error);
      }
    };
    fetchEnterpriseSubsidiesData();
  }, [subsidyUuid]);

  return (
    !isLoading ? (
      <div className="m-0 p-0 mb-5 mt-5">
        <div className="mt-4.5">
          <h2>{FORM.SUB_TITLE}</h2>
        </div>
        <hr />
        <TitleDetail title={enterpriseSubsidiesData?.subsidy?.title} />
        <CustomerDetail
          enterpriseCustomer={enterpriseSubsidiesData?.customer?.name}
          financialIdentifier={enterpriseSubsidiesData?.subsidy?.reference_id}
          uuid={enterpriseSubsidiesData?.customer?.id}
        />
        <TermDetail
          startDate={enterpriseSubsidiesData?.subsidy?.active_datetime}
          endDate={enterpriseSubsidiesData?.subsidy?.expiration_datetime}
        />
        <InternalOnlyDetail isInternalOnly={enterpriseSubsidiesData?.subsidy?.internal_only} />
        <SubsidyTypeDetail revenueCategory={enterpriseSubsidiesData?.subsidy?.revenue_category} />
        <AccountTypeDetail isMultipleFunds={enterpriseSubsidiesData?.catalogs?.length > 1} />
        {enterpriseSubsidiesData?.policies ? <PolicyContainer data={enterpriseSubsidiesData} /> : null}
        <EditButton />
      </div>
    ) : <PageLoading srMessage="Loading" />
  );
};

export default SubsidyDetailView;
