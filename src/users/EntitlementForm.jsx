import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';

import {
  Button, Input,
} from '@edx/paragon';

const REISSUE = 'reissue';
const CREATE = 'create';

export default function EntitlementForm({
  formType,
  isOpen,
  entitlement,
  createEntitlement,
  reissueEntitlement,
  closeHandler,
}) {
  const [courseUuid, setCourseUuid] = useState(entitlement.courseUuid);
  const [mode, setMode] = useState(entitlement.mode);
  const [user, setUser] = useState(entitlement.user);
  const [comments, setComments] = useState('');

  const submit = useCallback(() => {
    if (formType === REISSUE) {
      reissueEntitlement({
        courseUuid, mode, user, comments,
      });
    } else {
      createEntitlement({
        courseUuid, mode, user, comments,
      });
    }
  });

  const isReissue = this.props.formType === REISSUE;
  const title = isReissue ? 'Re-issue Entitlement' : 'Create Entitlement';

  const body = (
    <div>
      <h3>{title}</h3>
      <Input
        type="text"
        disabled={isReissue}
        name="courseUuid"
        label="Course UUID"
        value={courseUuid}
        onChange={(event) => setCourseUuid(event.target.value)}
      />
      <Input
        type="text"
        disabled={isReissue}
        name="username"
        label="Username"
        value={user}
        onChange={(event) => setUser(event.target.value)}
      />
      <Input
        type="select"
        disabled={isReissue}
        name="mode"
        label="Mode"
        defaultValue={mode}
        options={[
          { label: '--', value: '' },
          { label: 'Verified', value: 'verified' },
          { label: 'Professional', value: 'professional' },
          { label: 'No ID Professional', value: 'no-id-professional' },
        ]}
        onChange={(event) => setMode(event.target.value)}
      />
      <Input
        type="textarea"
        name="comments"
        label="Comments"
        defaultValue={comments}
        onChange={(event) => setComments(event.target.value)}
      />
      <div>
        <Button
          className={['btn', 'btn-secondary']}
          label="Close"
          onClick={closeHandler}
        />
        <Button
          className={['btn', 'btn-primary']}
          label="Submit"
          onClick={submit}
        />
      </div>
    </div>
  );

  return isOpen && body;
}

EntitlementForm.propTypes = {
  formType: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  entitlement: PropTypes.shape({
    uuid: PropTypes.string.isRequired,
    courseUuid: PropTypes.string.isRequired,
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
  createEntitlement: PropTypes.func.isRequired,
  reissueEntitlement: PropTypes.func.isRequired,
  closeForm: PropTypes.func.isRequired,
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
};
