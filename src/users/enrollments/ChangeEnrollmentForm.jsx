import React, { useCallback, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import {
  Button, Input, InputSelect,
} from '@edx/paragon';

import AlertList from '../../userMessages/AlertList';
import { patchEnrollment } from '../data/api';
import UserMessagesContext from '../../userMessages/UserMessagesContext';
import { reasons } from './constants';

const getModes = function getModes(enrollment) {
  const modeList = [];
  enrollment.courseModes.map(mode => (
    modeList.push(mode.slug)
  ));
  if (!modeList.some(mode => mode === enrollment.mode)) {
    modeList.push(enrollment.mode);
  }
  return modeList.sort();
};

export default function ChangeEnrollmentForm({
  user,
  enrollment,
  changeHandler,
  closeHandler,
  forwardedRef,
}) {
  const [mode, setMode] = useState(enrollment.mode);
  const [reason, setReason] = useState('');
  const [comments, setComments] = useState('');
  const { add } = useContext(UserMessagesContext);

  const submit = useCallback(() => {
    const sendReason = (reason === 'other') ? comments : reason;
    patchEnrollment({
      user,
      courseID: enrollment.courseId,
      oldMode: enrollment.mode,
      newMode: mode,
      reason: sendReason,
    }).then((result) => {
      if (result.errors !== undefined) {
        result.errors.forEach(error => add(error));
      } else {
        changeHandler();
      }
    });
  });

  return (
    <section className="card mb-3">
      <form className="card-body">
        <AlertList topic="enrollments" className="mb-3" />
        <h4 className="card-title">Change Enrollment</h4>
        <div className="form-group">
          <h5>Current Enrollment Data</h5>
          <div className="mb-1"><strong>Course Run ID:</strong> {enrollment.courseId}</div>
          <div className="mb-1"><strong>Mode:</strong> {enrollment.mode}</div>
          <div className="mb-1"><strong>Active:</strong> {enrollment.isActive.toString()}</div>
        </div>
        <hr />
        <div className="form-group">
          <h5 className="card-subtitle">All fields are required</h5>
          <InputSelect
            label="New Mode"
            type="select"
            options={getModes(enrollment)}
            id="mode"
            name="mode"
            value={enrollment.mode}
            onChange={(event) => setMode(event)}
          />
        </div>
        <div className="form-group">
          <InputSelect
            label="Reason for change"
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
            disabled={!(mode && reason)}
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

ChangeEnrollmentForm.propTypes = {
  enrollment: PropTypes.shape({
    courseId: PropTypes.string.isRequired,
    mode: PropTypes.string.isRequired,
    isActive: PropTypes.bool.isRequired,
  }),
  user: PropTypes.string.isRequired,
  changeHandler: PropTypes.func.isRequired,
  closeHandler: PropTypes.func.isRequired,
  forwardedRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
};

ChangeEnrollmentForm.defaultProps = {
  enrollment: {
    courseId: '',
    mode: '',
    isActive: false,
  },
  forwardedRef: null,
};
