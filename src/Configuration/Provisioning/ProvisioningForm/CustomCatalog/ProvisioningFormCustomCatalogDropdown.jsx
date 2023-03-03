import React, { useCallback, useState } from 'react';
import { Form } from '@edx/paragon';
import { v4 as uuidv4 } from 'uuid';
import PROVISIONING_PAGE_TEXT from '../../data/constants';

const ProvisioningFormCustomCatalogDropdown = () => {
  const [selected, setSelected] = useState({ title: '' });
  const { CUSTOM_CATALOG } = PROVISIONING_PAGE_TEXT.FORM;
  // TODO: Modify this once the Autosuggest component is ready to be implemented
  const generateAutosuggestOptions = useCallback(() => {
    // options reflects API response from enterpriseCatalogQuery GET endpoint
    const options = ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5'];
    const generatedOptions = [
      ...new Array(options.length),
    ].map(
      (item, index) => (
        <Form.AutosuggestOption key={uuidv4()}>
          {`${options[index]} - ${uuidv4()}`}
        </Form.AutosuggestOption>
      ),
    );
    return generatedOptions;
  });
  return (
    <Form.Autosuggest
      className="mt-4.5"
      floatingLabel={CUSTOM_CATALOG.OPTIONS.enterpriseCatalogQuery.title}
      helpMessage={CUSTOM_CATALOG.OPTIONS.enterpriseCatalogQuery.placeholder}
      value={selected.title}
      onSelected={
                (value) => setSelected(prevState => ({ selected: { ...prevState.selected, title: value } }))
            }
    >
      {generateAutosuggestOptions()}
    </Form.Autosuggest>
  );
};

export default ProvisioningFormCustomCatalogDropdown;
