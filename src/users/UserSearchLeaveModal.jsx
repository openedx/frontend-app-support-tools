import PropTypes from 'prop-types';
import { ModalLayer, ModalCloseButton, Button } from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';
import messages from '../CourseTeamManagement/messages';

export default function CustomLeaveModalPopup({
  isOpen,
  onConfirm,
  onCancel,
  positionRef,
}) {
  const intl = useIntl();
  return (
    <ModalLayer positionRef={positionRef} isOpen={isOpen} onClose={onCancel}>
      <div
        role="dialog"
        aria-label="My dialog"
        className="p-4 bg-white mx-auto my-5 border rounded-sm"
      >
        <h3 className="mb-3">{intl.formatMessage(messages.userSearchUnsavedChangesModalHeader)}</h3>
        <p className="mb-4">
          {intl.formatMessage(messages.userSearchUnsavedChangesModalDescription)}
        </p>
        <p className="d-flex justify-content-end align-items-center">
          <ModalCloseButton
            className="mr-3"
            onClick={onCancel}
            variant="outline-primary"
          >
            {intl.formatMessage(messages.userSearchUnsavedChangesModalStageOnPageBtn)}
          </ModalCloseButton>
          <Button variant="brand" onClick={onConfirm}>
            {intl.formatMessage(messages.userSearchUnsavedChangesModalLeavePageBtn)}
          </Button>
        </p>
      </div>
    </ModalLayer>
  );
}

CustomLeaveModalPopup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  positionRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
};
