import {
  Container,
  Form,
} from '@edx/paragon';
import { v4 as uuidv4 } from 'uuid';
import React, { useEffect, useState } from 'react';
import PROVISIONING_PAGE_TEXT from '../../data/constants';
import useProvisioningContext from '../../data/hooks';
import { indexOnlyPropType, selectProvisioningContext } from '../../data/utils';

const ProvisioningFormSourceCustomCatalogRadio = ({ index }) => {
  const { CUSTOM_CATALOG } = PROVISIONING_PAGE_TEXT.FORM;
  const { setCustomerCatalog } = useProvisioningContext();
  const [formData] = selectProvisioningContext('formData');
  const [value, setValue] = useState(null);

  // Extra check to make sure the value is set to null if the customerCatalog is undefined
  useEffect(() => {
    if (formData.policies[index]?.customerCatalog === undefined) {
      return setValue(null);
    }
    return setValue(
      formData.policies[index].customerCatalog
        ? CUSTOM_CATALOG.OPTIONS.enterpriseCustomerCatalog.yes
        : CUSTOM_CATALOG.OPTIONS.enterpriseCustomerCatalog.no,
    );
  }, [formData.policies[index]]);

  const handleChange = (e) => {
    const newTabValue = e.target.value;
    setCustomerCatalog({
      customerCatalog: newTabValue === CUSTOM_CATALOG.OPTIONS.enterpriseCustomerCatalog.yes,
    }, index);
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

ProvisioningFormSourceCustomCatalogRadio.propTypes = indexOnlyPropType;

export default ProvisioningFormSourceCustomCatalogRadio;
