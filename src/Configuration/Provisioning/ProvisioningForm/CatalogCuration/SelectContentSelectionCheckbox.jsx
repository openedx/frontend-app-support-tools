import React from 'react';
import PropTypes from 'prop-types';
import { CheckboxControl } from '@edx/paragon';

const SelectContentSelectionCheckbox = ({ row }) => {
  const {
    indeterminate,
    checked,
    ...toggleRowSelectedProps
  } = row.getToggleRowSelectedProps();

  return (
    <div>
      <CheckboxControl
        {...toggleRowSelectedProps}
        checked={checked}
        title="Toggle row selected"
        isIndeterminate={indeterminate}
        style={{ cursor: 'pointer' }}
      />
    </div>
  );
};

SelectContentSelectionCheckbox.propTypes = {
  row: PropTypes.shape({
    getToggleRowSelectedProps: PropTypes.func.isRequired,
  }).isRequired,
};

export default SelectContentSelectionCheckbox;
