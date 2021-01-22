import React, { useCallback, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import {
  Button, Input,
} from '@edx/paragon';
import classNames from 'classnames';

import UserMessagesContext from '../user-messages/UserMessagesContext';
import AlertList from '../user-messages/AlertList';
import { postEntitlement, patchEntitlement } from './data/api';

export const REISSUE = 'reissue';
export const CREATE = 'create';

export default function EntitlementForm({
  formType,
  entitlement,
  changeHandler,
  closeHandler,
  user,
  forwardedRef,
}) {
  const [courseUuid, setCourseUuid] = useState(entitlement.courseUuid);
  const [mode, setMode] = useState(entitlement.mode);
  const [comments, setComments] = useState('');
  const { add, clear } = useContext(UserMessagesContext);

  const submit = useCallback(() => {
    clear('entitlements');
    if (formType === CREATE) {
      postEntitlement({
        user,
        courseUuid,
        mode,
        action: CREATE,
        comments,
      }).then((result) => {
        if (result.errors !== undefined) {
          result.errors.forEach(error => add(error));
        } else {
          changeHandler();
        }
      });
    } else if (formType === REISSUE) {
      patchEntitlement({
        uuid: entitlement.uuid,
        action: REISSUE,
        unenrolledRun: entitlement.enrollmentCourseRun,
        comments,
      }).then((result) => {
        if (result.errors !== undefined) {
          result.errors.forEach(error => add(error));
        } else {
          changeHandler();
        }
      });
    }
  });

  const isReissue = formType === REISSUE;
  const title = isReissue ? 'Re-issue Entitlement' : 'Create Entitlement';

  return (
    <section className="card mb-3">
      <form className="card-body">
        <AlertList topic="entitlements" className="mb-3" />
        <h4 className="card-title">{title}</h4>
        <h5 className="card-subtitle">All fields are required</h5>
        <div className="form-group">
          <label htmlFor="courseUuid">Course UUID</label>
          <Input
            type="text"
            disabled={isReissue}
            id="courseUuid"
            name="courseUuid"
            value={courseUuid}
            onChange={(event) => setCourseUuid(event.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="mode">Mode</label>
          <Input
            type="select"
            disabled={isReissue}
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
        <div className="form-group">
          <label htmlFor="comments">Comments</label>
          <Input
            type="textarea"
            id="comments"
            name="comments"
            defaultValue={comments}
            onChange={(event) => setComments(event.target.value)}
            ref={forwardedRef}
          />
        </div>
        <div>
          <Button
            className={classNames(
              'btn-primary mr-3',
              { disabled: !(courseUuid && mode && comments) },
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

EntitlementForm.propTypes = {
  formType: PropTypes.string.isRequired,
  entitlement: PropTypes.shape({
    uuid: PropTypes.string.isRequired,
    courseUuid: PropTypes.string.isRequired,
    enrollmentCourseRun: PropTypes.string,
    created: PropTypes.string.isRequired,
    modified: PropTypes.string.isRequired,
    expiredAt: PropTypes.string,
    mode: PropTypes.string.isRequired,
    orderNumber: PropTypes.string,
    supportDetails: PropTypes.arrayOf(PropTypes.shape({
      supportUser: PropTypes.string,
      action: PropTypes.string,
      comments: PropTypes.string,
      unenrolledRun: PropTypes.string,
    })),
    user: PropTypes.string.isRequired,
  }),
  user: PropTypes.string.isRequired,
  changeHandler: PropTypes.func.isRequired,
  closeHandler: PropTypes.func.isRequired,
  forwardedRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
};

EntitlementForm.defaultProps = {
  entitlement: {
    uuid: '',
    courseUuid: '',
    created: '',
    modified: '',
    expiredAt: '',
    mode: 'verified',
    orderNumber: '',
    supportDetails: [],
    user: '',
  },
  forwardedRef: null,
};
