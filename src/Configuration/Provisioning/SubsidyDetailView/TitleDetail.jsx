import PropTypes from 'prop-types';
import PROVISIONING_PAGE_TEXT from '../data/constants';

const TitleDetail = ({ title }) => {
  const { FORM: { PLAN_TITLE } } = PROVISIONING_PAGE_TEXT;
  return (
    <article className="mt-4.5">
      <div className="mb-1">
        <h3>{PLAN_TITLE.HEADER}</h3>
        <p className="ml-3">
          {title}
        </p>
      </div>
    </article>
  );
};

TitleDetail.propTypes = {
  title: PropTypes.string.isRequired,
};

export default TitleDetail;
