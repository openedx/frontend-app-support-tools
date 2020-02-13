import React, { useCallback, useState, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Button, Input, InputSelect
} from '@edx/paragon';
import AlertList from '../user-messages/AlertList';
import { postEnrollmentChange } from './api';
import UserMessagesContext from '../user-messages/UserMessagesContext';

export default function EnrollmentForm ({
  user,
  enrollment,
  submitHandler,
  closeHandler,
}) {
  const [mode, setMode] = useState(enrollment.mode);
  const [reason, setReason] = useState('');
  const [comments, setComments] = useState('');
  const { add, clear } = useContext(UserMessagesContext);

  const submit = useCallback( () => {
    console.log('Submit Form');
    const sendReason = (reason === 'other') ? comments : reason;
    postEnrollmentChange({
      user,
      courseID: enrollment.courseId,
      oldMode: enrollment.mode,
      reason: sendReason,
    }).then( (result)=> {
      if (result.errors !== undefined) {
        result.errors.forEach(error => add(error));
      } else {
        // changeHandler();
      }
    })
  });

  const getModes = function getModes(enrollment) {
    console.log(enrollment);
    let modeList = [];
    enrollment.courseModes.map(mode => (
      modeList.push(mode.slug)
    ));
    return modeList;
  };

  const reasons = [
    {label: '--', value: ''},
    {label: 'Financial Assistance', value: 'Financial Assistance'},
    {label: 'Upset Learner', value: 'Upset Learner'},
    {label: 'Teaching Assistant', value: 'Teaching Assistant'},
    {label: 'Other', value: 'other'},
  ];

  return (
    <section className="card mb-3">
      <form className="card-body">
        <AlertList topic="enrollments" className="mb-3" />
        <h4 className="card-title">Change Enrollment</h4>
        <div  className="form-group">
          <h5>Current Enrollment</h5>
          <label>Course Run ID:</label> {enrollment.courseId}
          <br/>
          <label>Mode:</label> {enrollment.mode}
          <br/>
          <label>Active:</label> {enrollment.isActive.toString()}
          <br/>
        </div>
        <hr/>
        <div className="form-group">
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
            value=''
            onChange={(event) => setReason(event)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="comments">Explain if other</label>
          <Input
            type="textarea"
            id="comments"
            name="comments"
            defaultValue=''
            onChange={(event) => setComments(event.target.value)}
          />
        </div>
        <div>
          <Button
            className="btn-primary mr-3"
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
  enrollment: PropTypes.shape({
    courseId: PropTypes.string.isRequired,
    mode: PropTypes.string.isRequired,
    isActive: PropTypes.bool.isRequired,
  }),
  user: PropTypes.string.isRequired,
};

EnrollmentForm.defaultProps = {
  enrollment: {
    courseId: '',
    mode: '',
    isActive: false,
  },
};
