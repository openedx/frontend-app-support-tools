import React, { useState } from 'react';
import {
  Form,
  Spinner,
  ActionRow,
  Container,
} from '@edx/paragon';
import { v4 as uuidv4 } from 'uuid';
import { logError } from '@edx/frontend-platform/logging';
import PROVISIONING_PAGE_TEXT from '../data/constants';
import useProvisioningContext from '../data/hooks';
import { selectProvisioningContext } from '../data/utils';

const ProvisioningFormAccountType = () => {
  const {
    setMultipleFunds,
    setCustomCatalog,
    hydrateCatalogQueryData,
  } = useProvisioningContext();
  const { ACCOUNT_CREATION, ALERTS } = PROVISIONING_PAGE_TEXT.FORM;
  const [formData, catalogQueries] = selectProvisioningContext('formData', 'catalogQueries');
  const [isLoadingSpinner, setIsLoadingSpinner] = useState(false);
  const [value, setValue] = useState(null);

  const handleSpinnerLoadingState = (selectedValue) => {
    setIsLoadingSpinner(selectedValue);
  };

  const handleFormChange = (selectedValue) => {
    if (selectedValue === ACCOUNT_CREATION.OPTIONS.multiple) {
      setCustomCatalog(false);
      setMultipleFunds(true);
    } else if (selectedValue === ACCOUNT_CREATION.OPTIONS.single) {
      setMultipleFunds(false);
    }
    setValue(selectedValue);
  };

  const handleChange = async (e) => {
    const newTabValue = e.target.value;
    if (catalogQueries.data.length === 0) {
      try {
        handleSpinnerLoadingState(newTabValue);
        await hydrateCatalogQueryData();
      } catch (error) {
        logError(error);
        const { customAttributes } = error;
        if (customAttributes) {
          logError(ALERTS.API_ERROR_MESSAGES.ENTERPRISE_CATALOG_QUERY[customAttributes.httpErrorStatus]);
          handleSpinnerLoadingState(false);
        }
      } finally {
        handleSpinnerLoadingState(false);
      }
    }
    handleFormChange(newTabValue);
  };

  return (
    <article className="mt-4.5">
      <div>
        <h3>{ACCOUNT_CREATION.TITLE}</h3>
      </div>
      <p className="mt-4">{ACCOUNT_CREATION.SUB_TITLE}</p>
      <Container>
        <Form.RadioSet
          name="display-account-type"
          onChange={handleChange}
          value={value || formData?.multipleFunds}
        >
          {
          Object.keys(ACCOUNT_CREATION.OPTIONS).map((key) => (
            <div key={uuidv4()} className="d-flex align-items-center position-relative">
              {catalogQueries?.isLoading && (isLoadingSpinner === ACCOUNT_CREATION.OPTIONS[key]) && (
              <Spinner
                className="position-absolute"
                data-testid={`${ACCOUNT_CREATION.OPTIONS[key]}-form-control`}
                size="sm"
                style={{
                  left: -24,
                }}
                animation="border"
                screenReaderText={`loading changes to view ${key} form type`}
              />
              )}
              <ActionRow.Spacer />
              <Form.Radio
                value={ACCOUNT_CREATION.OPTIONS[key]}
                type="radio"
                data-testid={ACCOUNT_CREATION.OPTIONS[key]}
              >
                {ACCOUNT_CREATION.OPTIONS[key]}
              </Form.Radio>
            </div>
          ))
        }
        </Form.RadioSet>
      </Container>
    </article>
  );
};

export default ProvisioningFormAccountType;
