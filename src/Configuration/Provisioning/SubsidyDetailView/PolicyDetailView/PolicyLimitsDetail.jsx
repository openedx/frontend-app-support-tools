import PROVISIONING_PAGE_TEXT from '../../data/constants';
import { formatCurrency, indexOnlyPropType, selectProvisioningContext } from '../../data/utils';

// TODO: Use formatCurrency (FIRST UPDATE STATE TO STORE CENTS IN formData.policies[index].perLearnerCapAmount).

const { FORM } = PROVISIONING_PAGE_TEXT;

const PolicyLimitsDetail = ({ index }) => {
  const [formData] = selectProvisioningContext('formData');

  return (
    <div className="ml-4 mb-1 mt-3">
      <h3>{FORM.LEARNER_CAP.TITLE}</h3>
      <div className="ml-3">
        <p className="mb-1 mt-3">{FORM.LEARNER_CAP.SUB_TITLE}</p>
        <p className="text-gray-500">
          {formData.policies[index].perLearnerCap ? FORM.LEARNER_CAP.OPTIONS.yes : FORM.LEARNER_CAP.OPTIONS.no}
        </p>
      </div>
      {formData.policies[index].perLearnerCap ? (
        <div className="ml-3">
          <h4 className="mb-1 mt-4.5">{FORM.LEARNER_CAP_DETAIL.TITLE}</h4>
          <div className="ml-3">
            <h5 className="mb-1 mt-3">{FORM.LEARNER_CAP_DETAIL.OPTIONS.perLearnerSpendCap.title}</h5>
            <p className="text-gray">
              {formatCurrency(formData.policies[index].perLearnerCapAmount)}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

PolicyLimitsDetail.propTypes = indexOnlyPropType;

export default PolicyLimitsDetail;
