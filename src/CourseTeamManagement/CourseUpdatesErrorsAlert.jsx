import { Suspense, useRef } from 'react';
import { Button } from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';
import PropTypes from 'prop-types';

import Alert from '../userMessages/Alert';
import CoursesChangesModal from './CoursesChangesModal';
import messages from './messages';

export default function CourseUpdatesErrorsAlert({
  errors, email, username, onDismiss, showModal, setShowModal,
}) {
  const intl = useIntl();
  const saveButtonRef = useRef();
  return (
    <div className="mb-3 mt-5">
      <Suspense key="CourseUpdatesErrorsAlert" fallback={null}>
        <Alert
          type="danger"
          dismissible
          onDismiss={onDismiss}
        >
          <span className="d-flex align-items-center">
            <span>{intl.formatMessage(messages.courseUpdatesErrorsAlertMessage)}</span>{' '}
            <Button variant="link" onClick={() => setShowModal(true)} className="p-0 ml-1">
              {intl.formatMessage(messages.courseUpdatesErrorsAlertViewDetailsMessage)}
            </Button>
          </span>
        </Alert>
      </Suspense>
      <CoursesChangesModal
        changedData={errors}
        isOpen={showModal}
        onCancel={() => setShowModal(false)}
        username={username}
        email={email}
        positionRef={saveButtonRef}
        hasError
      />
    </div>
  );
}

CourseUpdatesErrorsAlert.propTypes = {
  email: PropTypes.string,
  username: PropTypes.string,
  errors: PropTypes.shape({
    newlyCheckedWithRoleErrors: PropTypes.shape({
      runId: PropTypes.string,
      role: PropTypes.string,
      courseName: PropTypes.string,
      number: PropTypes.string,
      courseId: PropTypes.string,
      error: PropTypes.string,
    }),
    uncheckedWithRoleErrors: PropTypes.shape({
      runId: PropTypes.string,
      role: PropTypes.string,
      courseName: PropTypes.string,
      number: PropTypes.string,
      courseId: PropTypes.string,
      error: PropTypes.string,
    }),
    roleChangedRowsErrors: PropTypes.shape({
      runId: PropTypes.string,
      from: PropTypes.string,
      to: PropTypes.string,
      courseName: PropTypes.string,
      number: PropTypes.string,
      courseId: PropTypes.string,
      error: PropTypes.string,
    }),
  }),
  onDismiss: PropTypes.func.isRequired,
  showModal: PropTypes.bool,
  setShowModal: PropTypes.func,
};
