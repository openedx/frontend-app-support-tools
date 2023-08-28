import PropTypes from 'prop-types';
import PROVISIONING_PAGE_TEXT from '../../data/constants';

const PolicyDetailHeader = ({ accountType, policiesLength }) => {
  const { FORM: { ACCOUNT_TYPE, CATALOG } } = PROVISIONING_PAGE_TEXT;
  const renderAccountType = () => {
    let account;
    if (policiesLength > 1 && accountType.includes(CATALOG.OPTIONS.executiveEducation)) {
      account = ACCOUNT_TYPE.OPTIONS.executiveEducation;
    } else if (policiesLength > 1 && accountType.includes(CATALOG.OPTIONS.openCourses)) {
      account = ACCOUNT_TYPE.OPTIONS.openCourses;
    } else {
      account = ACCOUNT_TYPE.OPTIONS.default;
    }
    return account;
  };

  return (
    <article className="mt-4.5">
      <div className="mb-1">
        <h2>{renderAccountType()}</h2>
        <hr />
      </div>
    </article>
  );
};

PolicyDetailHeader.propTypes = {
  accountType: PropTypes.string.isRequired,
  policiesLength: PropTypes.number.isRequired,
};

export default PolicyDetailHeader;
