import PropTypes from 'prop-types';
import { Icon } from '@openedx/paragon';
import { Check } from '@openedx/paragon/icons';
import PROVISIONING_PAGE_TEXT from '../data/constants';

const InternalOnlyDetail = ({ isInternalOnly }) => {
  const { FORM: { INTERNAL_ONLY } } = PROVISIONING_PAGE_TEXT;

  return (
    isInternalOnly ? (
      <article className="mt-4.5">
        <div className="mb-1">
          <h3>{INTERNAL_ONLY.TITLE}</h3>
        </div>
        <div className="d-flex">
          <Icon src={Check} className="mr-2" />
          <p className="small">{INTERNAL_ONLY.CHECKBOX.label}</p>
        </div>
      </article>
    ) : null
  );
};

InternalOnlyDetail.propTypes = {
  isInternalOnly: PropTypes.bool.isRequired,
};

export default InternalOnlyDetail;
