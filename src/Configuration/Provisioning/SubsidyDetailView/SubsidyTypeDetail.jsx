import PropTypes from 'prop-types';
import PROVISIONING_PAGE_TEXT from '../data/constants';

const SubsidyTypeDetail = ({ revenueCategory }) => {
  const { FORM: { SUBSIDY_TYPE } } = PROVISIONING_PAGE_TEXT;
  return (
    <article className="mt-4.5">
      <div className="mb-1">
        <h3>{SUBSIDY_TYPE.TITLE}</h3>
        <p className="ml-3 mb-1">
          {SUBSIDY_TYPE.SUB_TITLE}
        </p>
        <p className="ml-3 text-gray-500">
          {SUBSIDY_TYPE.OPTIONS[revenueCategory]}
        </p>
      </div>
    </article>
  );
};

SubsidyTypeDetail.propTypes = {
  revenueCategory: PropTypes.string.isRequired,
};

export default SubsidyTypeDetail;
