import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useContextSelector } from 'use-context-selector';

import { logError } from '@edx/frontend-platform/logging';
import AccountTypeDetail from './AccountTypeDetail';
import CustomerDetail from './CustomerDetail';
import EditButton from './EditButton';
import InternalOnlyDetail from './InternalOnlyDetail';
import PROVISIONING_PAGE_TEXT from '../data/constants';
import ROUTES from '../../../data/constants/routes';
import SubsidyTypeDetail from './SubsidyTypeDetail';
import TermDetail from './TermDetail';
import TitleDetail from './TitleDetail';
import PolicyContainer from './PolicyDetailView/PolicyContainer';
import PageLoading from '../../../components/common/PageLoading';
import ProvisioningFormInstructionAlert from '../ProvisioningForm/ProvisioningFormInstructionAlert';
import useProvisioningContext from '../data/hooks';
import { ProvisioningContext } from '../ProvisioningContext';

const SubsidyDetailView = () => {
  const navigate = useNavigate();
  const { FORM } = PROVISIONING_PAGE_TEXT;

  const { SUB_DIRECTORY: { ERROR } } = ROUTES.CONFIGURATION.SUB_DIRECTORY.PROVISIONING;

  const params = useParams();
  const subsidyUuid = params.id;

  const contextData = useContextSelector(ProvisioningContext, v => v[0]);
  const {
    formData,
    isLoading,
  } = contextData;

  const { hydrateEnterpriseSubsidiesData } = useProvisioningContext();

  const redirectOnError = (statusCode, message) => {
    navigate(ERROR, {
      state: {
        errorMessage: `Error ${statusCode}: ${message}`,
      },
    });
  };

  useEffect(() => {
    try {
      hydrateEnterpriseSubsidiesData(subsidyUuid);
    } catch (error) {
      const { customAttributes } = error;
      logError(error);
      if (error.customAttributes) {
        redirectOnError(customAttributes?.httpErrorStatus, error);
      }
    }
  }, [subsidyUuid]);

  return (
    isLoading === false ? (
      <div className="m-0 p-0 mb-5 mt-5">
        <ProvisioningFormInstructionAlert formMode={FORM.MODE.VIEW} />
        <div className="mt-4.5">
          <h2>{FORM.SUB_TITLE}</h2>
        </div>
        <hr />
        <TitleDetail title={formData.subsidyTitle} />
        <CustomerDetail
          enterpriseCustomer={formData.customerName}
          financialIdentifier={formData.financialIdentifier}
          uuid={formData.enterpriseUUID}
        />
        <TermDetail
          startDate={formData.startDate}
          endDate={formData.endDate}
        />
        <InternalOnlyDetail isInternalOnly={formData.internalOnly} />
        <SubsidyTypeDetail revenueCategory={formData.subsidyRevReq} />
        <AccountTypeDetail isMultipleFunds={formData.policies.length > 1} />
        {formData.policies ? <PolicyContainer /> : null}
        <EditButton />
      </div>
    ) : <PageLoading srMessage="Loading" />
  );
};

export default SubsidyDetailView;
