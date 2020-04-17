import React, { useCallback, useState, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Button, Input, InputSelect,
} from '@edx/paragon';
import classNames from 'classnames';

import AlertList from '../user-messages/AlertList';
import { postEnrollmentChange, postEnrollmentCreation } from './api';
import UserMessagesContext from '../user-messages/UserMessagesContext';

export const CREATE = 'create';
export const CHANGE = 'change';

const getModes = function getModes(enrollment) {
  const modeList = [];
  enrollment.courseModes.map(mode => (
    modeList.push(mode.slug)
  ));
  return modeList;
};

export default function EnrollmentForm({
  formType,
  user,
  enrollment,
  changeHandler,
  closeHandler,
  forwardedRef,
}) {
  const [courseId, setCourseId] = useState(undefined);
  const [mode, setMode] = useState(enrollment.mode);
  const [reason, setReason] = useState('');
  const [comments, setComments] = useState('');
  const { add } = useContext(UserMessagesContext);

  const submit = useCallback(() => {
    const sendReason = (reason === 'other') ? comments : reason;
    if (formType === CREATE) {
      console.log('Send post request to create the new enrollment');
      postEnrollmentCreation({
        user,
        mode,
        courseID: courseId,
        reason: sendReason,
      }).then((result) => {
        if (result.errors !== undefined) {
          result.errors.forEach(error => add(error));
        } else {
          changeHandler();
        }
      });
    } else if (formType === CHANGE) {
      postEnrollmentChange({
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
    }
  });

  const renderCreationFields = () => (
    <>
      <div className="form-group">
        <label htmlFor="courseUuid">Course Run ID</label>
        <Input
          type="text"
          id="courseId"
          name="courseId"
          onChange={(event) => setCourseId(event.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="mode">Mode</label>
        <Input
          type="select"
          id="mode"
          name="mode"
          defaultValue={mode}
          options={[
            { label: '--', value: '' },
            { label: 'Verified', value: 'verified' },
            { label: 'Professional', value: 'professional' },
            { label: 'No ID Professional', value: 'no-id-professional' },
          ]}
          onChange={(event) => setMode(event.target.value)}
        />
      </div>
    </>
  );

  const reasons = [
    { label: '--', value: '' },
    { label: 'Financial Assistance', value: 'Financial Assistance' },
    { label: 'Upset Learner', value: 'Upset Learner' },
    { label: 'Teaching Assistant', value: 'Teaching Assistant' },
    { label: 'Other', value: 'other' },
  ];

  const isChangeForm = formType === CHANGE;
  const title = isChangeForm ? 'Change Enrollment' : 'Create Enrollment';

  return (
    <section className="card mb-3">
      <form className="card-body">
        <AlertList topic="enrollments" className="mb-3" />
        <h4 className="card-title">{title}</h4>
        {isChangeForm && (
          <div className="form-group">
            <h5>Current Enrollment Data</h5>
            <div className="mb-1"><strong>Course Run ID:</strong> {enrollment.courseId}</div>
            <div className="mb-1"><strong>Mode:</strong> {enrollment.mode}</div>
            <div className="mb-1"><strong>Active:</strong> {enrollment.isActive.toString()}</div>
          </div>
        )}
        <hr />
        <div className="form-group">
          <h5 className="card-subtitle">All fields are required</h5>
          {isChangeForm ? (
            <InputSelect
              label="New Mode"
              type="select"
              options={getModes(enrollment)}
              id="mode"
              name="mode"
              value={enrollment.mode}
              onChange={(event) => setMode(event)}
            />
          ) : (
            renderCreationFields()
          )}
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
            className={classNames(
              'btn-primary mr-3',
              { disabled: !reason },
            )}
            onClick={submit}
          >
            Submit
          </Button>
          <Button
            className="btn-outline-secondary"
            onClick={closeHandler}
          >
            Cancel
          </Button>
        </div>
      </form>
    </section>
  );
}

EnrollmentForm.propTypes = {
  formType: PropTypes.string.isRequired,
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

EnrollmentForm.defaultProps = {
  enrollment: {
    courseId: '',
    mode: '',
    isActive: false,
  },
  forwardedRef: null,
};
