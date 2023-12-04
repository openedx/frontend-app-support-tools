import PropTypes from 'prop-types';
import PROVISIONING_PAGE_TEXT from '../../data/constants';
import { formatCurrency } from '../../data/utils';
import ProvisioningFormHelpText from '../../ProvisioningForm/ProvisioningFormHelpText';

const PolicyDetail = ({ displayName, spendLimit }) => {
  const { FORM: { ACCOUNT_TYPE, ACCOUNT_DETAIL } } = PROVISIONING_PAGE_TEXT;

  return (
    <div className="mb-4 mt-3">
      <h3>{ACCOUNT_TYPE.DEFAULT}</h3>
      <h3>{ACCOUNT_DETAIL.TITLE}</h3>
      <div className="mb-1 ml-3 mt-3">
        <h4>{ACCOUNT_DETAIL.OPTIONS.displayName}</h4>
        <p className="small">
          {displayName}
        </p>
        <h4>{ACCOUNT_DETAIL.OPTIONS.totalAccountValue.title}</h4>
        <p className="small">
          {formatCurrency(spendLimit)}
        </p>
        <ProvisioningFormHelpText className="ml-1 my-n2.5" />
      </div>
    </div>
  );
};

PolicyDetail.propTypes = {
  displayName: PropTypes.string.isRequired,
  spendLimit: PropTypes.number.isRequired,
};

export default PolicyDetail;
