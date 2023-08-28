import PropTypes from 'prop-types';
import PROVISIONING_PAGE_TEXT from '../../data/constants';
import { formatCurrency } from '../../data/utils';

const PolicyLimitsDetail = ({ perLearnerLimit }) => {
  const { FORM: { LEARNER_CAP, LEARNER_CAP_DETAIL } } = PROVISIONING_PAGE_TEXT;

  return (
    <div className="mb-1 mt-3">
      <h3>{LEARNER_CAP.TITLE}</h3>
      <div className="ml-3">
        <p className="mb-1 mt-3">{LEARNER_CAP.SUB_TITLE}</p>
        <p className="text-gray-500">
          {perLearnerLimit ? LEARNER_CAP.OPTIONS.yes : LEARNER_CAP.OPTIONS.no}
        </p>
      </div>
      {perLearnerLimit ? (
        <div className="ml-3">
          <h4 className="mb-1 mt-4.5">{LEARNER_CAP_DETAIL.TITLE}</h4>
          <h5 className="mb-1 mt-3">{LEARNER_CAP_DETAIL.OPTIONS.perLearnerSpendCap.title}</h5>
          <p className="text-gray-500">
            {formatCurrency(perLearnerLimit)}
          </p>
        </div>
      ) : null}
    </div>
  );
};

PolicyLimitsDetail.propTypes = {
  perLearnerLimit: PropTypes.number,
};

PolicyLimitsDetail.defaultProps = {
  perLearnerLimit: null,
};

export default PolicyLimitsDetail;
