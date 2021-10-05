import React, { useCallback, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import {
  Button, Input, Modal,
} from '@edx/paragon';

import UserMessagesContext from '../../../userMessages/UserMessagesContext';
import AlertList from '../../../userMessages/AlertList';
import { postEntitlement } from '../../data/api';
import { CREATE } from '../EntitlementActions';
import { EntitlementPropTypes, EntitlementDefaultProps } from '../PropTypes';

export default function CreateEntitlementForm({
  entitlement,
  changeHandler,
  closeHandler,
  user,
  forwardedRef,
}) {
  const [courseUuid, setCourseUuid] = useState(entitlement.courseUuid);
  const [mode, setMode] = useState(entitlement.mode);
  const [comments, setComments] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(true);
  const [showLoader, setShowLoader] = useState(false);
  const { add, clear } = useContext(UserMessagesContext);

  const submit = useCallback(() => {
    clear('createEntitlement');
    setShowLoader(true);
    postEntitlement({
      requestData: {
        course_uuid: courseUuid,
        user,
        mode,
        refund_locked: true,
        support_details: [{
          action: CREATE,
          comments,
        }],
      },
    }).then((result) => {
      setShowLoader(false);
      if (result.errors !== undefined) {
        result.errors.forEach(error => add(error));
      } else {
        const successMessage = {
          code: null,
          dismissible: true,
          text: 'New Entitlement successfully created.',
          type: 'success',
          topic: 'createEntitlement',
        };
        add(successMessage);
        changeHandler();
      }
    });
  });

  const createEntitlementForm = (
    <form>
      <AlertList topic="createEntitlement" className="mb-3" />
      <Input
        className="mb-4"
        type="text"
        id="courseUuid"
        name="courseUuid"
        placeholder="Course UUID"
        value={courseUuid}
        onChange={(event) => setCourseUuid(event.target.value)}
        ref={forwardedRef}
      />
      <Input
        className="mb-4"
        type="select"
        id="mode"
        name="mode"
        defaultValue=""
        options={[
          { label: 'Mode', value: '', disabled: true },
          { label: 'Verified', value: 'verified' },
          { label: 'Professional', value: 'professional' },
          { label: 'No ID Professional', value: 'no-id-professional' },
        ]}
        onChange={(event) => setMode(event.target.value)}
      />
      <Input
        placeholder="Explanation"
        type="textarea"
        id="comments"
        name="comments"
        defaultValue=""
        onChange={(event) => setComments(event.target.value)}
      />
    </form>
  );

  return (
    <Modal
      open={modalIsOpen}
      onClose={() => {
        closeHandler(false);
        setModalIsOpen(false);
        clear('createEntitlement');
      }}
      title="Create New Entitlement"
      id="create-entitlement"
      dialogClassName="modal-lg"
      body={(
        createEntitlementForm
      )}
      buttons={[
        showLoader
          ? (<div className="spinner-border text-primary" role="status" />)
          : (
            <Button
              variant="primary"
              disabled={!(courseUuid && mode && comments)}
              className="mr-3"
              onClick={submit}
            >
              Submit
            </Button>
          ),
      ]}
    />
  );
}

CreateEntitlementForm.propTypes = {
  entitlement: EntitlementPropTypes,
  user: PropTypes.string.isRequired,
  changeHandler: PropTypes.func.isRequired,
  closeHandler: PropTypes.func.isRequired,
  forwardedRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
};

CreateEntitlementForm.defaultProps = {
  entitlement: EntitlementDefaultProps,
  forwardedRef: null,
};
