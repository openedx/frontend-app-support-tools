import PropTypes from 'prop-types';
import PROVISIONING_PAGE_TEXT from '../../data/constants';

const PolicyDescription = ({ description }) => {
  const { FORM: { ACCOUNT_DESCRIPTION } } = PROVISIONING_PAGE_TEXT;

  return (
    <div className="mb-1 mt-3">
      <h3>{ACCOUNT_DESCRIPTION.TITLE}</h3>
      <p className="small">
        {description}
      </p>
    </div>
  );
};

PolicyDescription.propTypes = {
  description: PropTypes.string.isRequired,
};

export default PolicyDescription;
