import { useContextSelector } from 'use-context-selector';
import PROVISIONING_PAGE_TEXT from '../../data/constants';
import ProvisioningFormCatalogContainer from './ProvisioningFormCatalogContainer';
import ProvisioningFormAccountDetails from './ProvisioningFormAccountDetails';
import ProvisioningFormPerLearnerCapContainer from './ProvisioningFormPerLearnerCapContainer';
import { ProvisioningContext } from '../../ProvisioningContext';

const ProvisioningFormPolicyContainer = () => {
  const { ACCOUNT_TYPE } = PROVISIONING_PAGE_TEXT.FORM;
  const { multipleFunds } = useContextSelector(ProvisioningContext, v => v[0]);
  if (multipleFunds === undefined || multipleFunds) {
    return null;
  }

  return (
    <div className="mt-5">
      <h2>{ACCOUNT_TYPE.OPTIONS.default}</h2>
      <ProvisioningFormAccountDetails />
      <ProvisioningFormCatalogContainer />
      <ProvisioningFormPerLearnerCapContainer />
    </div>
  );
};

export default ProvisioningFormPolicyContainer;
