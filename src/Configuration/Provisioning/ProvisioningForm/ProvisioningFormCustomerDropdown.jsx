import {
  Form,
} from '@edx/paragon';
import { useCallback, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import PROVISIONING_PAGE_TEXT from '../data/constants';
import { selectProvisioningContext } from '../data/utils';
import useProvisioningContext from '../data/hooks';

const ProvisioningFormCustomerDropdown = () => {
  const { CUSTOMER } = PROVISIONING_PAGE_TEXT.FORM;
  const [formData, customers] = selectProvisioningContext('formData', 'customers');
  const { setCustomerUUID } = useProvisioningContext();
  const [selected, setSelected] = useState({ title: '' });
  const [dropdownValues, setDropdownValues] = useState(['No matching enterprise']);
  const [isLoading, setIsLoading] = useState(false);
  console.log(formData);
  const handleOnSelected = (value) => {
    if (value) {
      const valueUuid = value.split(' --- ')[1].trim();
      setCustomerUUID(valueUuid);
    }
    setSelected(prevState => ({ selected: { ...prevState.selected, title: value } }));
  };
  const updateDropdownList = () => {
    let returnValue;
    try {
      if (formData.enterpriseUUID?.length > 0) {
        const enterpriseRegex = new RegExp(formData.enterpriseUUID.toLowerCase());
        console.log(customers.filter((customer) => `${customer.name.toLowerCase()} --- ${customer.id}`.match(enterpriseRegex)));
        const filteredCustomers = customers.filter((customer) => `${customer.name.toLowerCase()} --- ${customer.id}`.match(enterpriseRegex)).slice(0, 25);
        returnValue = filteredCustomers.map((customer) => `${customer.name} --- ${customer.id}`);
      }
      if (!formData.enterpriseUUID?.length || dropdownValues.length === 0) {
        returnValue = ['No matching enterprise'];
      }
      return setDropdownValues(returnValue);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };
  const updateDropdown = (value) => {
    setCustomerUUID(value);
    setIsLoading(true);
    updateDropdownList();
  };
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
