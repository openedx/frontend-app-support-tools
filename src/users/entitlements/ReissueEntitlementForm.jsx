import React, { useCallback, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import {
  Button, Input, Modal,
} from '@edx/paragon';

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
        clear('reissueEntitlement');
        closeHandler(false);
        setModalIsOpen(false);
      }}
      title="Reissue Entitlement"
      id="reissue-entitlement"
      dialogClassName="modal-lg"
      body={(
        reissueEntitlementForm
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
