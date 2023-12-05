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
import ProvisioningFormHelpText from './ProvisioningFormHelpText';

const ProvisioningFormCustomerDropdown = () => {
  const { ENTERPRISE_UUID } = PROVISIONING_PAGE_TEXT.FORM.CUSTOMER;
  const [formData, customers, showInvalidField] = selectProvisioningContext('formData', 'customers', 'showInvalidField');
  const { subsidy } = showInvalidField;
  const isEnterpriseUuidDefinedAndFalse = subsidy?.enterpriseUUID === false;
  const { setCustomerUUID, getCustomers, setInvalidSubsidyFields } = useProvisioningContext();
  const [selected, setSelected] = useState({ title: '' });
  const [dropdownValues, setDropdownValues] = useState([ENTERPRISE_UUID.DROPDOWN_DEFAULT]);
  const debouncedSearch = useMemo(() => debounce(getCustomers, 500, {
    leading: false,
  }), [getCustomers]);
  const handleOnSelected = (value) => {
    /* .includes('---') and .split(' --- ') are used to get the UUID from the
    dropdown value, and populate the customerUUID state */
    if (value && value.includes('---')) {
      const valueUuid = value.split(' --- ')[1].trim();
      setCustomerUUID(valueUuid);
      setInvalidSubsidyFields({ ...subsidy, enterpriseUUID: true });
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
  }, [formData.enterpriseUUID, debouncedSearch]);
  return (
    <Form.Group>
      <Form.Autosuggest
        floatingLabel={ENTERPRISE_UUID.TITLE}
        value={selected.title}
        onSelected={handleOnSelected}
        onChange={updateDropdown}
        helpMessage={ENTERPRISE_UUID.SUB_TITLE}
        errorMessageText={ENTERPRISE_UUID.ERROR.selected}
        data-testid="customer-uuid"
        isInvalid={isEnterpriseUuidDefinedAndFalse}
      >
        {dropdownValues.map(option => (
          <Form.AutosuggestOption key={uuidv4()}>
            {option}
          </Form.AutosuggestOption>
        ))}
      </Form.Autosuggest>
      <ProvisioningFormHelpText className="my-n3" />
      {isEnterpriseUuidDefinedAndFalse && (
        <Form.Control.Feedback
          type="invalid"
        >
          {ENTERPRISE_UUID.ERROR.invalid}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};

export default ProvisioningFormCustomerDropdown;
