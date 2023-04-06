import React, { useCallback, useState } from 'react';
import { Form, Button } from '@edx/paragon';
import { v4 as uuidv4 } from 'uuid';
import PROVISIONING_PAGE_TEXT from '../../data/constants';
import useProvisioningContext from '../../data/hooks';
import { selectProvisioningContext, sortedCatalogQueries } from '../../data/utils';

const ProvisioningFormCustomCatalogDropdown = () => {
  const [selected, setSelected] = useState({ title: '' });
  const [catalogQueries] = selectProvisioningContext('catalogQueries');
  const { hydrateCatalogQueryData, setCatalogQueryCategory } = useProvisioningContext();
  const { CUSTOM_CATALOG } = PROVISIONING_PAGE_TEXT.FORM;
  const generateAutosuggestOptions = useCallback(() => {
    const defaultDropdown = (
      <Form.AutosuggestOption key={uuidv4()}>
        Loading
      </Form.AutosuggestOption>
    );
    if (catalogQueries.data.length > 0) {
      const sortedData = sortedCatalogQueries(catalogQueries.data);
      const apiCatalogQueries = sortedData.map(
        ({ title, uuid }) => (
          <Form.AutosuggestOption key={uuid}>
            {`${title} --- ${uuid}`}
          </Form.AutosuggestOption>
        ),
      );
      return apiCatalogQueries;
    }
    return defaultDropdown;
  });
  const handleOnSelected = (value) => {
    // TODO: In the future the index will have to be brought in for custom catalogs per group
    if (value) {
      const valueUuid = value.split(' --- ')[1].trim();
      setCatalogQueryCategory({
        catalogQueryMetadata: {
          catalogQuery: catalogQueries.data.find(({ uuid }) => uuid === valueUuid),
        },
      }, 0);
    }
    setSelected(prevState => ({ selected: { ...prevState.selected, title: value } }));
  };

  return (
    <div className="row">
      <div className="col-10">
        <Form.Autosuggest
          className="mt-4.5"
          floatingLabel={CUSTOM_CATALOG.OPTIONS.enterpriseCatalogQuery.title}
          helpMessage={CUSTOM_CATALOG.OPTIONS.enterpriseCatalogQuery.subtitle}
          value={selected.title}
          onSelected={handleOnSelected}
          data-testid="autosuggest"
        >
          {generateAutosuggestOptions()}
        </Form.Autosuggest>
      </div>
      <div className="col-2 align-self-center mb-3">
        <Button onClick={hydrateCatalogQueryData}>Refresh</Button>
      </div>
    </div>
  );
};

export default ProvisioningFormCustomCatalogDropdown;
