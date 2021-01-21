import React from 'react';
import PropTypes from 'prop-types';
import { CREATE, REISSUE, EXPIRE } from './EntitlementActions';
import CreateEntitlementForm from './CreateEntitlementForm';
import ReissueEntitlementForm from './ReissueEntitlementForm';
import ExpireEntitlementForm from './ExpireEntitlementForm';
import { EntitlementPropTypes, EntitlementDefaultProps } from './PropTypes';

export default function EntitlementForm({
  formType,
  entitlement,
  changeHandler,
  closeHandler,
  user,
  forwardedRef,
}) {
  if (formType === CREATE) {
    return (
      <CreateEntitlementForm
        key="entitlement-create-form"
        user={user}
        entitlement={entitlement}
        changeHandler={changeHandler}
        closeHandler={closeHandler}
        forwardedRef={forwardedRef}
      />
    );
  } if (formType === EXPIRE) {
    return (
      <ExpireEntitlementForm
        key="entitlement-expire-form"
        user={user}
        entitlement={entitlement}
        changeHandler={changeHandler}
        closeHandler={closeHandler}
        forwardedRef={forwardedRef}
      />
    );
  } if (formType === REISSUE) {
    return (
      <ReissueEntitlementForm
        key="entitlement-reissue-form"
        user={user}
        entitlement={entitlement}
        changeHandler={changeHandler}
        closeHandler={closeHandler}
        forwardedRef={forwardedRef}
      />
    );
  }
}

EntitlementForm.propTypes = {
  formType: PropTypes.string.isRequired,
  entitlement: EntitlementPropTypes,
  user: PropTypes.string.isRequired,
  changeHandler: PropTypes.func.isRequired,
  closeHandler: PropTypes.func.isRequired,
  forwardedRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
};

EntitlementForm.defaultProps = {
  entitlement: EntitlementDefaultProps,
  forwardedRef: null,
};
