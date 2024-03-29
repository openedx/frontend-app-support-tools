import React from 'react';
import PropTypes from 'prop-types';
import { CREATE, CHANGE } from './constants';
import CreateEnrollmentForm from './CreateEnrollmentForm';
import ChangeEnrollmentForm from './ChangeEnrollmentForm';

export default function EnrollmentForm({
  formType,
  enrollment,
  changeHandler,
  closeHandler,
  user,
  forwardedRef,
}) {
  if (formType === CHANGE) {
    return (
      <ChangeEnrollmentForm
        enrollment={enrollment}
        user={user}
        changeHandler={changeHandler}
        closeHandler={closeHandler}
        forwardedRef={forwardedRef}
      />
    );
  } if (formType === CREATE) {
    return (
      <CreateEnrollmentForm
        enrollment={enrollment}
        user={user}
        changeHandler={changeHandler}
        closeHandler={closeHandler}
        forwardedRef={forwardedRef}
      />
    );
  }
}

EnrollmentForm.propTypes = {
  formType: PropTypes.string.isRequired,
  enrollment: PropTypes.shape({
    courseId: PropTypes.string.isRequired,
    mode: PropTypes.string.isRequired,
    isActive: PropTypes.bool.isRequired,
  }),
  user: PropTypes.string.isRequired,
  changeHandler: PropTypes.func.isRequired,
  closeHandler: PropTypes.func.isRequired,
  forwardedRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
};

EnrollmentForm.defaultProps = {
  enrollment: {
    courseId: '',
    mode: '',
    isActive: false,
  },
  forwardedRef: null,
};
