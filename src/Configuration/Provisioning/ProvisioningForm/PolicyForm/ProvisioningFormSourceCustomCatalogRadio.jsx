import {
  Container,
  Form,
} from '@edx/paragon';
import { v4 as uuidv4 } from 'uuid';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import PROVISIONING_PAGE_TEXT from '../../data/constants';
import useProvisioningContext from '../../data/hooks';

const ProvisioningFormSourceCustomCatalogRadio = ({ index }) => {
  const { CUSTOM_CATALOG } = PROVISIONING_PAGE_TEXT.FORM;
  const { setCustomerCatalog } = useProvisioningContext();

  const [value, setValue] = useState(null);

  const handleChange = (e) => {
    const newTabValue = e.target.value;
    if (newTabValue === CUSTOM_CATALOG.OPTIONS.enterpriseCustomerCatalog.yes) {
      setCustomerCatalog({ customerCatalog: true }, index);
    } else if (newTabValue === CUSTOM_CATALOG.OPTIONS.enterpriseCustomerCatalog.no) {
      setCustomerCatalog({ customerCatalog: false }, index);
    }
    setValue(newTabValue);
  };

  return (
    <div className="mt-4 mb-4">
      <Container>
        <Form.RadioSet
          name="display-enterprise-customer-catalog"
          onChange={handleChange}
          value={value}
        >
          {
          Object.keys(CUSTOM_CATALOG.OPTIONS.enterpriseCustomerCatalog).map((key) => (
            <Form.Radio
              value={CUSTOM_CATALOG.OPTIONS.enterpriseCustomerCatalog[key]}
              type="radio"
              key={uuidv4()}
              data-testid={CUSTOM_CATALOG.OPTIONS.enterpriseCustomerCatalog[key]}
            >
              {CUSTOM_CATALOG.OPTIONS.enterpriseCustomerCatalog[key]}
            </Form.Radio>
          ))
        }
        </Form.RadioSet>
      </Container>
    </div>
  );
};

ProvisioningFormSourceCustomCatalogRadio.propTypes = {
  index: PropTypes.number.isRequired,
};

export default ProvisioningFormSourceCustomCatalogRadio;
