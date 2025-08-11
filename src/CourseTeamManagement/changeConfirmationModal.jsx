import PropTypes from 'prop-types';
import { useState } from 'react';
import {
  ModalLayer, ModalCloseButton, Button, StatefulButton, Icon,
} from '@openedx/paragon';
import { CheckCircleOutline, SpinnerSimple } from '@openedx/paragon/icons';
import { useIntl } from '@edx/frontend-platform/i18n';
import messages from './messages';

export default function ChangeConfirmationModal({
  changedData,
  isOpen,
  onConfirm,
  submitButtonState,
  onCancel,
  username,
  email,
  positionRef,
}) {
  const intl = useIntl();

  // Track expanded states for each section
  const [expanded, setExpanded] = useState({
    added: false,
    removed: false,
    updated: false,
  });

  const renderSection = (title, items, type, formatter) => {
    if (!items?.length) { return null; }

    const isExpanded = expanded[type];
    const displayItems = isExpanded ? items : items.slice(0, 4);
    const hiddenCount = items.length - 4;

    return (
      <div className="mb-4">
        <p className="mb-2"><strong>{intl.formatMessage(title, { count: items.length })}</strong></p>
        {displayItems.map(formatter)}
        {hiddenCount > 0 && !isExpanded && (
          <Button
            variant="link"
            onClick={() => setExpanded(prev => ({ ...prev, [type]: true }))}
            data-testid="show-more-changes"
          >
            {
              intl.formatMessage(
                messages.showMoreChangesInConfirmChangesModal,
                {
                  hiddenCount,
                },
              )
            }
          </Button>
        )}
      </div>
    );
  };

  return (
    <ModalLayer
      isOpen={isOpen}
      onClose={onCancel}
      positionRef={positionRef}
      closeOnOutsideClick={submitButtonState !== 'pending'}
    >
      <div
        role="dialog"
        aria-label={intl.formatMessage(messages.confirmChangesModalHeader)}
        className="p-4 bg-white mx-auto my-5 border rounded-sm change-confirm-modal"
      >
        <div className="d-flex justify-content-start align-items-center mb-3">
          <h2 className="text-lg font-semibold">
            {intl.formatMessage(messages.confirmChangesModalHeader)}
          </h2>
        </div>
        <div className="mb-3 section-divider-1" />

        <p className="mb-2 text-sm text-gray-700">
          {intl.formatMessage(messages.confirmChangesModalDescription)}
        </p>
        <span className="d-flex justify-content-start align-items-center">
          <p className="mr-2">
            <strong>
              {`${username.charAt(0).toUpperCase()}${username.slice(1).toLowerCase()} `}
            </strong>
          </p>
          <p>{email}</p>
        </span>
        <div className="mb-3 section-divider-2" />

        {changedData && (
          <div className="ctm-courses-changes mb-4">
            {renderSection(
              messages.addedToCourseCountChangesInConfirmChangesModal,
              changedData.newlyCheckedWithRole,
              'added',
              ({
                courseName, number, runId, role,
              }) => (
                <p key={`added-${runId}`}>
                  <span>{`${courseName} (${number} - ${runId})`}</span> {role === 'instructor' ? 'Instructor' : 'Staff'}
                </p>
              ),
            )}

            {renderSection(
              messages.removedFromCourseCountChangesInConfirmChangesModal,
              changedData.uncheckedWithRole,
              'removed',
              ({
                courseName, number, runId, role,
              }) => (
                <p key={`removed-${runId}`}>
                  <span>{`${courseName} (${number} - ${runId})`}</span> {role === 'instructor' ? 'Instructor' : 'Staff'}
                </p>
              ),
            )}

            {renderSection(
              messages.roleUpdatedInCourseCountChangesInConfirmChangesModal,
              changedData.roleChangedRows,
              'updated',
              ({
                courseName, number, runId, from, to,
              }) => (
                <p key={`role-${runId}`}>
                  <span className="font-medium">{`${courseName} (${number} - ${runId}) ${from === 'instructor' ? 'Instructor' : 'Staff'} → ${to === 'instructor' ? 'Instructor' : 'Staff'}`}</span>
                </p>
              ),
            )}
          </div>
        )}

        <div className="d-flex justify-content-end align-items-center">
          <ModalCloseButton
            className="mr-3"
            variant="outline-primary"
            disabled={submitButtonState === 'pending' || submitButtonState === 'complete'}
            data-testid="cancel-save-course-changes"
            onClick={() => {
              setExpanded({ added: false, removed: false, updated: false });
              onCancel();
            }}
          >
            {intl.formatMessage(messages.confirmChangesModalCancelButton)}
          </ModalCloseButton>
          <StatefulButton
            labels={{
              default: 'Save',
              pending: 'Saving',
              complete: 'Saved',
            }}
            data-testid="confirm-save-course-changes"
            variant={submitButtonState === 'Error' ? 'danger' : 'brand'}
            icons={{
              pending: <Icon src={SpinnerSimple} className="icon-spin" />,
              complete: <Icon src={CheckCircleOutline} />,
            }}
            onClick={() => {
              setExpanded({ added: false, removed: false, updated: false });
              onConfirm('pending');
            }}
            state={submitButtonState}
          />
        </div>
      </div>
    </ModalLayer>
  );
}

ChangeConfirmationModal.propTypes = {
  changedData: PropTypes.shape({
    newlyCheckedWithRole: PropTypes.shape({
      courseName: PropTypes.string,
      number: PropTypes.string,
      runId: PropTypes.string,
      role: PropTypes.string,
    }).isRequired,
    uncheckedWithRole: PropTypes.shape({
      courseName: PropTypes.string,
      number: PropTypes.string,
      runId: PropTypes.string,
      role: PropTypes.string,
    }).isRequired,
    roleChangedRows: PropTypes.shape({
      courseName: PropTypes.string,
      number: PropTypes.string,
      runId: PropTypes.string,
      role: PropTypes.string,
    }).isRequired,
  }).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  submitButtonState: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  positionRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
};
