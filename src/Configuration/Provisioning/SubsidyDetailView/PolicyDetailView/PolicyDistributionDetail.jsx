import PropTypes from 'prop-types';
import PROVISIONING_PAGE_TEXT from '../../data/constants';
import ProvisioningFormHelpText from '../../ProvisioningForm/ProvisioningFormHelpText';

const PolicyDistributionDetail = ({ policyType }) => {
  const { FORM: { POLICY_TYPE } } = PROVISIONING_PAGE_TEXT;

  return (
    <div className="mb-1 mt-3">
      <h3>{POLICY_TYPE.TITLE}</h3>
      <div className="ml-3">
        <p className="mb-1 mt-3">{POLICY_TYPE.LABEL}</p>
        <p className="text-gray">
          {(policyType === POLICY_TYPE.OPTIONS.ADMIN_SELECTS.VALUE)
            && POLICY_TYPE.OPTIONS.ADMIN_SELECTS.DESCRIPTION}
          {(policyType === POLICY_TYPE.OPTIONS.LEARNER_SELECTS.VALUE)
            && POLICY_TYPE.OPTIONS.LEARNER_SELECTS.DESCRIPTION}
          <ProvisioningFormHelpText />
        </p>
      </div>
    </div>
  );
};

PolicyDistributionDetail.propTypes = {
  policyType: PropTypes.number,
};

PolicyDistributionDetail.defaultProps = {
  policyType: null,
};

export default PolicyDistributionDetail;
