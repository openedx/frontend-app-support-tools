import React, { useCallback, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import {
  Button, Input, Modal,
} from '@edx/paragon';

import UserMessagesContext from '../../../userMessages/UserMessagesContext';
import AlertList from '../../../userMessages/AlertList';
import { patchEntitlement } from '../../data/api';
import { EXPIRE } from '../EntitlementActions';
import { EntitlementPropTypes, EntitlementDefaultProps } from '../PropTypes';
import makeRequestData from '../utils';

export default function ExpireEntitlementForm({
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
    const now = new Date().toISOString();
    clear('expireEntitlement');
    setShowLoader(true);
    patchEntitlement({
      uuid: entitlement.uuid,
      requestData: makeRequestData({
        expiredAt: now,
        enrollmentCourseRun: entitlement.enrollmentCourseRun,
        action: EXPIRE,
        comments,
      }),
    }).then((result) => {
      if (result.errors !== undefined) {
        result.errors.forEach(error => add(error));
      } else {
        const successMessage = {
          code: null,
          dismissible: true,
          text: 'Entitlement successfully expired.',
          type: 'success',
          topic: 'expireEntitlement',
        };
        setHideSubmit(true);
        add(successMessage);
        changeHandler();
      }
      setShowLoader(false);
    });
  });

  const expireEntitlementForm = (
    <form>
      <AlertList topic="expireEntitlement" className="mb-3" />
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
      <Input
        type="textarea"
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
    <Modal
      open={modalIsOpen}
      onClose={() => {
        closeHandler(false);
        setModalIsOpen(false);
        clear('expireEntitlement');
      }}
      title="Expire Entitlement"
      id="expire-entitlement"
      dialogClassName="modal-lg"
      body={(
        expireEntitlementForm
      )}
      buttons={[
        showLoader
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
          ),
      ]}
    />
  );
}

ExpireEntitlementForm.propTypes = {
  entitlement: EntitlementPropTypes,
  changeHandler: PropTypes.func.isRequired,
  closeHandler: PropTypes.func.isRequired,
  forwardedRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
};

ExpireEntitlementForm.defaultProps = {
  entitlement: EntitlementDefaultProps,
  forwardedRef: null,
};
