import { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { useIntl } from '@edx/frontend-platform/i18n';

import CourseUpdatesErrorsAlert from './CourseUpdatesErrorsAlert';
import AlertList from '../userMessages/AlertList';
import UserMessagesContext from '../userMessages/UserMessagesContext';
import CourseTeamPageUserSearch from '../users/UserPage';
import messages from './messages';

export default function CourseTeamManagementIndexPage() {
  const location = useLocation();
  const intl = useIntl();
  const [showModal, setShowModal] = useState(false);
  const [apiErrors, setApiErrors] = useState('');

  // This is required to keep custom checkbox column's state correct
  const [isAlertDismissed, setIsAlertDismissed] = useState(false);
  const { add, clear } = useContext(UserMessagesContext);
  const [courseUpdateErrors, setCourseUpdateErrors] = useState(
    {
      email: '',
      username: '',
      success: false,
      errors: {
        newlyCheckedWithRoleErrors: [],
        uncheckedWithRoleErrors: [],
        roleChangedRowsErrors: [],
      },
    },
  );
  const hasCourseUpdateErrors = Object.values(courseUpdateErrors.errors).some(arr => arr.length > 0);
  useEffect(() => {
    if (apiErrors) {
      clear('courseTeamManagementApiErrors');
      apiErrors.error.forEach(error => add(error));
    }
  }, [apiErrors]);

  return (
    <div className="container-fluid course-updates-errors-alert">
      <AlertList topic="general" className="mb-3 mt-5" />
      {apiErrors && <AlertList topic="courseTeamManagementApiErrors" className="mb-3 mt-5" isDismissed={isAlertDismissed} setIsDismissed={setIsAlertDismissed} />}
      {hasCourseUpdateErrors && (
        <CourseUpdatesErrorsAlert
          errors={courseUpdateErrors.errors}
          email={courseUpdateErrors.email}
          username={courseUpdateErrors.username}
          onDismiss={() => {
            setCourseUpdateErrors({
              success: false,
              errors: {
                newlyCheckedWithRoleErrors: [],
                uncheckedWithRoleErrors: [],
                roleChangedRowsErrors: [],
              },
            });
            setShowModal(false);
          }}
          showModal={showModal}
          setShowModal={setShowModal}

        />
      )}
      <section className="course-team-management-header">
        <h2 className="font-weight-bold">
          {intl.formatMessage(messages.pageTitle)}
        </h2>
      </section>
      <CourseTeamPageUserSearch
        location={location}
        isOnCourseTeamPage
        courseUpdateErrors={courseUpdateErrors}
        setCourseUpdateErrors={setCourseUpdateErrors}
        showErrorsModal={showModal}
        apiErrors={apiErrors}
        setApiErrors={setApiErrors}
        isAlertDismissed={isAlertDismissed}
        setIsAlertDismissed={setIsAlertDismissed}
      />
    </div>
  );
}
