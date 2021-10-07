import React, { useCallback, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import {
  Button, Input,
} from '@edx/paragon';
import classNames from 'classnames';

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
  const [courseUuid, setCourseUuid] = useState(entitlement.courseUuid);
  const [mode, setMode] = useState(entitlement.mode);
  const [comments, setComments] = useState('');
  const { add, clear } = useContext(UserMessagesContext);

  const submit = useCallback(() => {
    clear('reissueEntitlement');
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
        changeHandler();
      }
    });
  });

  return (
    <section className="card mb-3">
      <form className="card-body">
        <AlertList topic="reissueEntitlement" className="mb-3" />
        <h4 className="card-title">Reissue Entitlement</h4>
        <h5 className="card-subtitle">All fields are required</h5>
        <div className="form-group">
          <label htmlFor="courseUuid">Course UUID</label>
          <Input
            type="text"
            id="courseUuid"
            name="courseUuid"
            value={courseUuid}
            onChange={(event) => setCourseUuid(event.target.value)}
            disabled
          />
        </div>
        <div className="form-group">
          <label htmlFor="mode">Mode</label>
          <Input
            type="text"
            id="mode"
            name="mode"
            defaultValue={mode}
            onChange={(event) => setMode(event.target.value)}
            disabled
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
            className={classNames(
              'btn-primary mr-3',
              { disabled: !(courseUuid && mode && comments) },
            )}
            disabled={!(courseUuid && mode && comments)}
            onClick={submit}
          >
            Submit
          </Button>
          <Button
            onClick={closeHandler}
            variant="outline-secondary"
          >
            Cancel
          </Button>
        </div>
      </form>
    </section>
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
