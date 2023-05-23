import React, { useState } from 'react';
import {
  Form,
  Spinner,
  ActionRow,
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
    setInvalidSubsidyFields,
  } = useProvisioningContext();
  const { ACCOUNT_CREATION, ALERTS } = PROVISIONING_PAGE_TEXT.FORM;
  const [formData, catalogQueries, showInvalidField] = selectProvisioningContext('formData', 'catalogQueries', 'showInvalidField');
  const { subsidy } = showInvalidField;
  const isMultipleFundsDefinedAndFalse = subsidy?.multipleFunds === false;
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
    setInvalidSubsidyFields({ ...subsidy, multipleFunds: true });
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
      <Form.Group className="mt-3.5">
        <Form.Label className="mb-2.5">{ACCOUNT_CREATION.SUB_TITLE}</Form.Label>
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
                isInvalid={isMultipleFundsDefinedAndFalse}
              >
                {ACCOUNT_CREATION.OPTIONS[key]}
              </Form.Radio>
            </div>
          ))
        }
        </Form.RadioSet>
        {isMultipleFundsDefinedAndFalse && (
          <Form.Control.Feedback
            type="invalid"
          >
            {ACCOUNT_CREATION.ERROR}
          </Form.Control.Feedback>
        )}
      </Form.Group>
    </article>
  );
};

export default ProvisioningFormAccountType;
