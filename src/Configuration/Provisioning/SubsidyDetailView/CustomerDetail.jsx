import PropTypes from 'prop-types';
import PROVISIONING_PAGE_TEXT from '../data/constants';
import ProvisioningFormHelpText from '../ProvisioningForm/ProvisioningFormHelpText';

const CustomerDetail = ({ enterpriseCustomer, financialIdentifier, uuid }) => {
  const { FORM: { CUSTOMER } } = PROVISIONING_PAGE_TEXT;

  return (
    <article className="mt-4.5">
      <div className="mb-1">
        <h3>{CUSTOMER.TITLE}</h3>
      </div>
      <div className="mb-1 ml-3 mt-3">
        <h4>{CUSTOMER.ENTERPRISE_UUID.TITLE}</h4>
        <p className="small">
          {enterpriseCustomer} / {uuid}
        </p>
        <ProvisioningFormHelpText className="my-n2.5" />
      </div>
      <div className="mb-1 ml-3 mt-4.5">
        <h4>{CUSTOMER.FINANCIAL_IDENTIFIER.TITLE}</h4>
        <p className="small">
          {financialIdentifier}
        </p>
        <ProvisioningFormHelpText className="my-n2.5" />
      </div>
    </article>
  );
};

CustomerDetail.propTypes = {
  enterpriseCustomer: PropTypes.string.isRequired,
  financialIdentifier: PropTypes.string.isRequired,
  uuid: PropTypes.string.isRequired,
};

export default CustomerDetail;
