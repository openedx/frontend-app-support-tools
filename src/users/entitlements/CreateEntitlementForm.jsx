import React, { useCallback, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import {
  Button, Input,
} from '@edx/paragon';
import classNames from 'classnames';

import UserMessagesContext from '../../user-messages/UserMessagesContext';
import AlertList from '../../user-messages/AlertList';
import { postEntitlement } from '../data/api';
import { CREATE } from './EntitlementActions';
import { EntitlementPropTypes, EntitlementDefaultProps } from './PropTypes';

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
  const { add, clear } = useContext(UserMessagesContext);

  const submit = useCallback(() => {
    clear('entitlements');
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
        <AlertList topic="entitlements" className="mb-3" />
        <h4 className="card-title">Create Entitlement</h4>
        <h5 className="card-subtitle">All fields are required</h5>
        <div className="form-group">
          <label htmlFor="courseUuid">Course UUID</label>
          <Input
            type="text"
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
            variant="primary"
            disabled={!(courseUuid && mode && comments)}
            className={classNames(
              'mr-3',
              { disabled: !(courseUuid && mode && comments) },
            )}
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
