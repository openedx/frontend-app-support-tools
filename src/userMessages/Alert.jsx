import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  faExclamationTriangle, faInfoCircle, faCheckCircle, faMinusCircle, faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@openedx/paragon';

function getAlertClass(type) {
  if (type === 'error') {
    return 'alert-warning';
  }
  if (type === 'danger') {
    return 'alert-danger';
  }
  if (type === 'success') {
    return 'alert-success';
  }
  return 'alert-info';
}

function getAlertIcon(type) {
  if (type === 'error') {
    return faExclamationTriangle;
  }
  if (type === 'danger') {
    return faMinusCircle;
  }
  if (type === 'success') {
    return faCheckCircle;
  }
  return faInfoCircle;
}

function Alert({
  type, dismissible, children, onDismiss,
}) {
  return (
    <div className={classNames('alert', { 'alert-dismissible': dismissible }, getAlertClass(type))}>
      <div className="d-flex align-items-start">
        <div className="mr-2">
          <FontAwesomeIcon icon={getAlertIcon(type)} />
        </div>
        <div role="alert" className="flex-grow-1">
          {children}
        </div>
      </div>
      {dismissible && <Button className="close" onClick={onDismiss}><FontAwesomeIcon size="sm" icon={faTimes} /></Button>}
    </div>
  );
}

Alert.propTypes = {
  type: PropTypes.oneOf(['error', 'danger', 'info', 'success']).isRequired,
  dismissible: PropTypes.bool,
  children: PropTypes.node,
  onDismiss: PropTypes.func,
};

Alert.defaultProps = {
  dismissible: false,
  children: undefined,
  onDismiss: null,
};

export default Alert;
