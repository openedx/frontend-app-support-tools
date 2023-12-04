import PropTypes from 'prop-types';
import PROVISIONING_PAGE_TEXT from '../../data/constants';

const { FORM } = PROVISIONING_PAGE_TEXT;

const PolicyDescription = ({ description }) => (
  <div className="mb-1 mt-3">
    <h3>{FORM.ACCOUNT_DESCRIPTION.TITLE}</h3>
    <p className="small">
      {description}
    </p>
  </div>
);

PolicyDescription.propTypes = {
  description: PropTypes.string.isRequired,
};

export default PolicyDescription;
