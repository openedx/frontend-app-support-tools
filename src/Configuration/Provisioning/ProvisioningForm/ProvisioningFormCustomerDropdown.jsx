import {
  Form,
} from '@edx/paragon';
import {
  useEffect, useMemo, useState,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import debounce from 'lodash.debounce';
import PROVISIONING_PAGE_TEXT from '../data/constants';
import { selectProvisioningContext } from '../data/utils';
import useProvisioningContext from '../data/hooks';

const ProvisioningFormCustomerDropdown = () => {
  const { CUSTOMER } = PROVISIONING_PAGE_TEXT.FORM;
  const [formData, customers] = selectProvisioningContext('formData', 'customers');
  const { setCustomerUUID, getCustomers } = useProvisioningContext();
  const [selected, setSelected] = useState({ title: '' });
  const [dropdownValues, setDropdownValues] = useState(['No matching enterprise']);

  const debouncedSearch = useMemo(() => debounce(getCustomers, 500, {
    leading: false,
  }), [formData.enterpriseUUID]);
  const handleOnSelected = (value) => {
    if (value && value.includes('---')) {
      const valueUuid = value.split(' --- ')[1].trim();
      setCustomerUUID(valueUuid);
    }
    setSelected(prevState => ({ selected: { ...prevState.selected, title: value } }));
  };
  const updateDropdownList = () => {
    if (customers.length > 0) {
      const options = customers.map(customer => `${customer.name} --- ${customer.id}`);
      setDropdownValues(options);
    }
  };
  const updateDropdown = (value) => {
    setCustomerUUID(value);
    if (value?.length === 0 || customers.length === 0) {
      return setDropdownValues(['No matching enterprise']);
    }
    return updateDropdownList();
  };
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      debouncedSearch(formData.enterpriseUUID);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [formData.enterpriseUUID]);
  return (
    <Form.Autosuggest
      floatingLabel={CUSTOMER.OPTIONS.enterpriseUUID}
      value={selected.title}
      onSelected={handleOnSelected}
      onChange={updateDropdown}
      helpMessage="Select an existing enterprise to provision"
      errorMessageText="Error, no selected value"
    >
      {dropdownValues.map(option => (
        <Form.AutosuggestOption key={uuidv4()}>
          {option}
        </Form.AutosuggestOption>
      ))}
    </Form.Autosuggest>
  );
};

export default ProvisioningFormCustomerDropdown;
