import React, { useState } from 'react';
import {
  Form,
} from '@edx/paragon';

const ProvisioningFormFundType = () => {
  const [value, setValue] = useState('Yes');
  const handleChange = async (e) => {
    const newTabValue = e.target.value;
    setValue(newTabValue);
  };
  return (
    <article className="mt-4.5">
      <div>
        <h3>Fund Type</h3>
      </div>
      <p className="mt-4">Split funds by product?</p>
      <Form.RadioSet
        name="display-content"
        onChange={handleChange}
        value={value}
      >
        <Form.Radio
          value="Yes"
          type="radio"
        >
          Yes
        </Form.Radio>
        <Form.Radio
          value="No"
          type="radio"
        >
          No, first come first serve
        </Form.Radio>
      </Form.RadioSet>
    </article>
  );
};

export default ProvisioningFormFundType;
