import PROVISIONING_PAGE_TEXT from '../../data/constants';
import {
  formatCurrency,
  indexOnlyPropType,
  selectProvisioningContext,
} from '../../data/utils';

const { FORM } = PROVISIONING_PAGE_TEXT;

const PolicyDetail = ({ index }) => {
  const [formData] = selectProvisioningContext('formData');

  return (
    <div className="mb-1 mt-3">
      <h3>Default</h3>
      <h3>{FORM.ACCOUNT_DETAIL.TITLE}</h3>
      <div className="mb-1 ml-3 mt-3">
        <h4>{FORM.ACCOUNT_DETAIL.OPTIONS.displayName}</h4>
        <p className="small">
          {formData.policies[index].accountName}
        </p>
        <h4>{FORM.ACCOUNT_DETAIL.OPTIONS.totalAccountValue.title}</h4>
        <p className="small">
          {formatCurrency(formData.policies[index].accountValue)}
        </p>
      </div>
    </div>
  );
};

PolicyDetail.propTypes = indexOnlyPropType;

export default PolicyDetail;
