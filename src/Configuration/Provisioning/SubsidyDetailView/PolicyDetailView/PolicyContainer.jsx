import { Stack } from '@openedx/paragon';
import AssociatedCatalogDetail from './AssociatedCatalogDetail';
import PolicyDescription from './PolicyDescription';
import PolicyDetail from './PolicyDetail';
import PolicyDetailHeader from './PolicyDetailHeader';
import PolicyLimitsDetail from './PolicyLimitsDetail';
import PolicyDistributionDetail from './PolicyDistributionDetail';
import { selectProvisioningContext } from '../../data/utils';

const PolicyContainer = () => {
  const [formData] = selectProvisioningContext('formData');
  const renderPolicy = formData.policies.map((policy, index) => (
    <Stack key={policy.uuid} gap={48}>
      <PolicyDetailHeader index={index} />
      <PolicyDetail index={index} />
      <PolicyDescription description={policy.accountDescription} />
      <AssociatedCatalogDetail index={index} />
      <PolicyDistributionDetail policyType={policy.policyType} />
      <PolicyLimitsDetail index={index} />
    </Stack>
  ));
  return renderPolicy;
};

export default PolicyContainer;
