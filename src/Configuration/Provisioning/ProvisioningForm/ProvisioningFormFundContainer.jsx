import { useContextSelector } from 'use-context-selector';
import { ProvisioningContext } from '../ProvisioningContext';
import ProvisioningFormFundDetails from './ProvisioningFormFundDetails';
import ProvisioningFormFundType from './ProvisioningFormFundType';

const ProvisioningFormFundContainer = () => {
  const { multipleFunds } = useContextSelector(ProvisioningContext, v => v[0]);
  return (
    <>
      <ProvisioningFormFundType />
      {multipleFunds !== undefined && <ProvisioningFormFundDetails />}
    </>
  );
};

export default ProvisioningFormFundContainer;
