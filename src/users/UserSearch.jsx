import { useRef, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Button, Form, Icon } from '@openedx/paragon';
import { Search } from '@openedx/paragon/icons';
import CustomLeaveModalPopup from './UserSearchLeaveModal';
import messages from '../CourseTeamManagement/messages';

export default function UserSearch({
  userIdentifier, searchHandler, isOnCourseTeamPage, username,
}) {
  const intl = useIntl();
  const searchRef = useRef();
  const searchButtonRef = useRef();
  const [showModal, setShowModal] = useState(false);
  const [pendingSearch, setPendingSearch] = useState(null);

  const submit = useCallback((event) => {
    event.preventDefault();

    const hasUnsavedChanges = sessionStorage.getItem(`${username}hasUnsavedChanges`) === 'true';

    if (isOnCourseTeamPage && hasUnsavedChanges) {
      setPendingSearch(searchRef.current.value);
      setShowModal(true);
    } else {
      searchHandler(searchRef.current.value);
    }
  }, [searchHandler]);

  const handleConfirm = () => {
    setShowModal(false);
    searchHandler(pendingSearch);
    setPendingSearch(null);
    sessionStorage.setItem(`${username}hasUnsavedChanges`, false);
  };

  const handleCancel = () => {
    setShowModal(false);
    setPendingSearch(null);
  };

  return (
    <>
      <section className={`mb-3${!isOnCourseTeamPage ? ' px-2' : ''}`}>
        <Form className={isOnCourseTeamPage ? 'course-team-management-user-search-form' : ''}>
          <Form.Row className={isOnCourseTeamPage ? 'course-team-management-user-search-form-row' : ''}>
            {!isOnCourseTeamPage && (
            <Form.Label htmlFor="userIdentifier" className="my-auto">
              {intl.formatMessage(messages.supportToolHomePageUsernameOrEmailUserSearchPlaceholder)}
            </Form.Label>
            )}
            <Form.Control
              ref={searchRef}
              className={`${!isOnCourseTeamPage ? '' : 'flex-grow-1 '}ml-1 mr-1`}
              name="userIdentifier"
              defaultValue={userIdentifier}
              floatingLabel={isOnCourseTeamPage ? intl.formatMessage(messages.usernameOrEmailUserSearchPlaceholder) : ''}
              trailingElement={isOnCourseTeamPage ? <Icon src={Search} /> : ''}
            />
            <Button ref={searchButtonRef} type="submit" onClick={submit} variant="primary">{intl.formatMessage(messages.searchPlaceholder)}</Button>
          </Form.Row>
        </Form>
      </section>

      <CustomLeaveModalPopup
        isOpen={showModal}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        positionRef={searchButtonRef}
      />
    </>
  );
}

UserSearch.propTypes = {
  userIdentifier: PropTypes.string,
  searchHandler: PropTypes.func.isRequired,
  isOnCourseTeamPage: PropTypes.bool,
  username: PropTypes.string,
};

UserSearch.defaultProps = {
  userIdentifier: '',
  isOnCourseTeamPage: false,
  username: '',
};
