import React, { useCallback, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import {
  ActionRow,
  Button, Form, ModalDialog,
} from '@openedx/paragon';

import UserMessagesContext from '../../userMessages/UserMessagesContext';
import AlertList from '../../userMessages/AlertList';
import { patchEntitlement } from '../data/api';
import { REISSUE } from './EntitlementActions';
import { EntitlementPropTypes, EntitlementDefaultProps } from './PropTypes';
import makeRequestData from './utils';

export default function ReissueEntitlementForm({
  entitlement,
  changeHandler,
  closeHandler,
  forwardedRef,
}) {
  const [comments, setComments] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(true);
  const [showLoader, setShowLoader] = useState(false);
  const [hideSubmit, setHideSubmit] = useState(false);
  const { add, clear } = useContext(UserMessagesContext);

  const submit = useCallback(() => {
    clear('reissueEntitlement');
    setShowLoader(true);
    patchEntitlement({
      uuid: entitlement.uuid,
      requestData: makeRequestData({
        enrollmentCourseRun: entitlement.enrollmentCourseRun,
        action: REISSUE,
        comments,
      }),
    }).then((result) => {
      if (result.errors !== undefined) {
        result.errors.forEach(error => add(error));
      } else {
        const successMessage = {
          code: null,
          dismissible: true,
          text: 'Entitlement successfully reissued.',
          type: 'success',
          topic: 'reissueEntitlement',
        };
        setHideSubmit(true);
        add(successMessage);
        changeHandler();
      }
      setShowLoader(false);
    });
  });

  const reissueEntitlementForm = (
    <form>
      <AlertList topic="reissueEntitlement" className="mb-3" />
      <div className="row small">
        <div className="col-sm-6">
          Course UUID
        </div>
        <div className="col-sm-6">
          {entitlement.courseUuid}
        </div>
      </div>
      <hr />

      <div className="row small">
        <div className="col-sm-6">
          Mode
        </div>
        <div className="col-sm-6">
          {entitlement.mode}
        </div>
      </div>
      <hr />
      <Form.Control
        as="textarea"
        id="comments"
        name="comments"
        placeholder="Explanation"
        defaultValue=""
        onChange={(event) => setComments(event.target.value)}
        disabled={hideSubmit}
        ref={forwardedRef}
      />
    </form>
  );

  return (
    <ModalDialog
      isOpen={modalIsOpen}
      onClose={() => {
        clear('reissueEntitlement');
        closeHandler(false);
        setModalIsOpen(false);
      }}
      hasCloseButton
      id="reissue-entitlement"
      size="lg"
    >
      <ModalDialog.Header className="mb-3">
        <ModalDialog.Title className="modal-title">
          Reissue Entitlement
        </ModalDialog.Title>
      </ModalDialog.Header>
      <ModalDialog.Body>
        {reissueEntitlementForm}
      </ModalDialog.Body>
      <ModalDialog.Footer>
        <ActionRow>
          <ModalDialog.CloseButton
            variant="link"
          >
            Close
          </ModalDialog.CloseButton>
          { showLoader
            ? (<div className="spinner-border text-primary" role="status" />)
            : (
              <Button
                variant="primary"
                className="mr-3"
                disabled={!(entitlement.courseUuid && entitlement.mode && comments)}
                hidden={hideSubmit}
                onClick={submit}
              >
                Submit
              </Button>
            )}
        </ActionRow>
      </ModalDialog.Footer>
    </ModalDialog>
  );
}

ReissueEntitlementForm.propTypes = {
  entitlement: EntitlementPropTypes,
  changeHandler: PropTypes.func.isRequired,
  closeHandler: PropTypes.func.isRequired,
  forwardedRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
};

ReissueEntitlementForm.defaultProps = {
  entitlement: EntitlementDefaultProps,
  forwardedRef: null,
};
