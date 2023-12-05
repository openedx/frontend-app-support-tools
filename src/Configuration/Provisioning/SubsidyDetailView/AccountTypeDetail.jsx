import PropTypes from 'prop-types';
import PROVISIONING_PAGE_TEXT from '../data/constants';
import ProvisioningFormHelpText from '../ProvisioningForm/ProvisioningFormHelpText';

const AccountTypeDetail = ({ isMultipleFunds }) => {
  const { FORM: { ACCOUNT_CREATION } } = PROVISIONING_PAGE_TEXT;

  return (
    <article className="mt-4.5">
      <div className="mb-1">
        <h3>{ACCOUNT_CREATION.TITLE}</h3>
        <p className="ml-3 mb-1">
          {ACCOUNT_CREATION.SUB_TITLE}
        </p>
        <p className="ml-3 text-gray-500">
          {isMultipleFunds ? ACCOUNT_CREATION.OPTIONS.multiple : ACCOUNT_CREATION.OPTIONS.single}
        </p>
        <ProvisioningFormHelpText className="ml-3 my-n2.5" />
      </div>
    </article>
  );
};

AccountTypeDetail.propTypes = {
  isMultipleFunds: PropTypes.bool.isRequired,
};

export default AccountTypeDetail;
