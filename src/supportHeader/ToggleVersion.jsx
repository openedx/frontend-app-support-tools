import React, { useContext } from 'react';
import { Form } from '@edx/paragon';
import { AppContext } from '@edx/frontend-platform/react';
import { TAB_PATH_MAP } from '../SupportToolsTab/constants';

export default function ToggleVersion() {
  const { config } = useContext(AppContext);
  const handleChange = () => {
    if (window.location.href.indexOf('/v2') !== -1) {
      if (window.location.href.indexOf(TAB_PATH_MAP['feature-based-enrollment']) !== -1) {
        alert('Cannot Switch to Old Design for this tab');
      } else if (window.location.href.indexOf(TAB_PATH_MAP['learner-information']) !== -1) {
        window.location.href = window.location.href.replace(TAB_PATH_MAP['learner-information'], '/users');
      } else {
        window.location.href = window.location.href.replace('/v2', '');
      }
    } else if (window.location.href.indexOf('/users') !== -1) {
      window.location.href = window.location.href.replace('/users', TAB_PATH_MAP['learner-information']);
    } else {
      window.location.href = window.location.href.replace(config.BASE_URL, `${config.BASE_URL}/v2`);
    }
  };
  return (
    <Form.Check
      type="switch"
      id="custom-switch"
      label={<div style={{ marginTop: '4px', fontSize: '1vmax' }}>New Experience</div>}
      checked={(window.location.href.indexOf('/v2') !== -1)}
      onChange={handleChange}
      className="btn"
    />
  );
}
