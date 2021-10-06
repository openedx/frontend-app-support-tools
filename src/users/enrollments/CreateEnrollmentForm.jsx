import React, { useCallback, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import {
  Button, Input, InputSelect,
} from '@edx/paragon';

import AlertList from '../../userMessages/AlertList';
import { postEnrollment } from '../data/api';
import UserMessagesContext from '../../userMessages/UserMessagesContext';
import { reasons, modes } from './constants';

export default function CreateEnrollmentForm({
  user,
  closeHandler,
  forwardedRef,
}) {
  const [courseID, setCourseID] = useState('');
  const [mode, setMode] = useState('');
  const [reason, setReason] = useState('');
  const [comments, setComments] = useState('');
  const { add } = useContext(UserMessagesContext);

  const submit = useCallback(() => {
    const sendReason = (reason === 'other') ? comments : reason;
    postEnrollment({
      user,
      courseID,
      mode,
      reason: sendReason,
    }).then((result) => {
      if (result.errors !== undefined) {
        result.errors.forEach(error => add(error));
      } else {
        const successMessage = {
          code: null,
          dismissible: true,
          text:
              'New Enrollment successfully created.',
          type: 'success',
          topic: 'createEnrollments',
        };
        add(successMessage);
      }
    });
  });

  return (
    <section className="card mb-3">
      <form className="card-body">
        <AlertList topic="createEnrollments" className="mb-3" />
        <h4 className="card-title">Create New Enrollment</h4>
        <hr />
        <div className="form-group">
          <h5 className="card-subtitle">All fields are required</h5>
          <label htmlFor="courseID">Course Run ID</label>
          <Input
            type="text"
            id="courseID"
            name="courseID"
            onChange={(event) => setCourseID(event.target.value)}
          />
        </div>
        <div className="form-group">
          <h5 className="card-subtitle">All fields are required</h5>
          <InputSelect
            label="Mode"
            type="select"
            options={modes}
            id="mode"
            name="mode"
            onChange={(event) => setMode(event)}
          />
        </div>
        <div className="form-group">
          <InputSelect
            label="Reason"
            type="select"
            options={reasons}
            id="reason"
            name="reason"
            value=""
            onChange={(event) => setReason(event)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="comments">Explain if other</label>
          <Input
            type="textarea"
            id="comments"
            name="comments"
            defaultValue=""
            onChange={(event) => setComments(event.target.value)}
            ref={forwardedRef}
          />
        </div>
        <div>
          <Button
            variant="primary"
            disabled={!(courseID && reason)}
            className="mr-3"
            onClick={submit}
          >
            Submit
          </Button>
          <Button
            variant="outline-secondary"
            onClick={closeHandler}
          >
            Cancel
          </Button>
        </div>
      </form>
    </section>
  );
}

CreateEnrollmentForm.propTypes = {
  user: PropTypes.string.isRequired,
  closeHandler: PropTypes.func.isRequired,
  forwardedRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
};

CreateEnrollmentForm.defaultProps = {
  forwardedRef: null,
};
