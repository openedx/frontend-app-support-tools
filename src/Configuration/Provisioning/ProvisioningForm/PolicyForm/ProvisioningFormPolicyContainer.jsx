import PropTypes from 'prop-types';
import { useContextSelector } from 'use-context-selector';
import { Alert } from '@edx/paragon';
import ProvisioningFormCatalogContainer from './ProvisioningFormCatalogContainer';
import ProvisioningFormAccountDetails from './ProvisioningFormAccountDetails';
import ProvisioningFormPerLearnerCapContainer from './ProvisioningFormPerLearnerCapContainer';
import { ProvisioningContext } from '../../ProvisioningContext';
import PROVISIONING_PAGE_TEXT from '../../data/constants';

const ProvisioningFormPolicyContainer = ({ title, index }) => {
  const { ALERTS } = PROVISIONING_PAGE_TEXT.FORM;
  const { multipleFunds } = useContextSelector(ProvisioningContext, v => v[0]);
  if (multipleFunds === undefined) {
    return (
      <Alert variant="warning" className="mt-5">
        {ALERTS.unselectedAccountType}
      </Alert>
    );
  }

  return (
    <div className="mt-5">
      <h2>{title}</h2>
      <ProvisioningFormAccountDetails index={index} />
      <ProvisioningFormCatalogContainer index={index} />
      <ProvisioningFormPerLearnerCapContainer index={index} />
    </div>
  );
};

ProvisioningFormPolicyContainer.propTypes = {
  title: PropTypes.string,
  index: PropTypes.number.isRequired,
};

ProvisioningFormPolicyContainer.defaultProps = {
  title: '',
};

export default ProvisioningFormPolicyContainer;
