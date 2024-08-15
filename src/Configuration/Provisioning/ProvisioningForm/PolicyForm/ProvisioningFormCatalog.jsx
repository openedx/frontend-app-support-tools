import React, { useState } from 'react';
import { Form } from '@openedx/paragon';
import { v4 as uuidv4 } from 'uuid';
import { useContextSelector } from 'use-context-selector';
import PROVISIONING_PAGE_TEXT from '../../data/constants';
import useProvisioningContext from '../../data/hooks';
import { generateBudgetDisplayName, indexOnlyPropType } from '../../data/utils';
import { ProvisioningContext } from '../../ProvisioningContext';
import ProvisioningFormHelpText from '../ProvisioningFormHelpText';

// TODO: Replace URL for hyperlink to somewhere to display catalog content information
const ProvisioningFormCatalog = ({ index }) => {
  const {
    setCustomCatalog,
    setInvalidPolicyFields,
    setHasEdits,
    setPredefinedQueryType,
  } = useProvisioningContext();
  const { CATALOG } = PROVISIONING_PAGE_TEXT.FORM;
  const contextData = useContextSelector(ProvisioningContext, v => v[0]);
  const {
    isEditMode,
    multipleFunds,
    formData,
    showInvalidField: { policies },
    hasEdits,
  } = contextData;
  const isFormFieldInvalid = policies[index]?.predefinedQueryType === false;

  let submittedFormAssociatedCatalog;
  if (isEditMode && !multipleFunds) {
    if (formData.policies[index]?.customCatalog) {
      submittedFormAssociatedCatalog = 'custom';
    } else {
      submittedFormAssociatedCatalog = formData.policies[index].predefinedQueryType;
    }
  }

  const [value, setValue] = useState(submittedFormAssociatedCatalog || null);
  if (multipleFunds === undefined) {
    return null;
  }

  const handleChange = (e) => {
    const newTabValue = e.target.value;
    const newPredefinedQueryType = e.target.dataset.predefinedquerytype;
    if (isEditMode && !hasEdits) {
      setHasEdits(true);
    }
    if (newTabValue === 'custom') {
      setCustomCatalog(true, index);
      // Set an unusable value for the predefined query type in state when the custom/unique/curated catalog option is
      // selected.
      setPredefinedQueryType(undefined, index);
      // The actual custom catalog in state will be set later.
    } else {
      setCustomCatalog(false, index);
      setPredefinedQueryType(newPredefinedQueryType, index);
    }
    setValue(newTabValue);
    setInvalidPolicyFields({ predefinedQueryType: true }, index);
  };

  return (
    <article className="mt-4.5">
      <div>
        <h3>{CATALOG.TITLE}</h3>
      </div>
      <Form.Group className="mt-3.5">
        <Form.Label className="mb-2.5">{CATALOG.SUB_TITLE}</Form.Label>
        {
          // Multiple funds/budgets option is selected, so each catalog for each policy should be hard-coded to use a
          // predefined catalog query (see INITIAL_POLICIES.multiplePolicies).  Do not show a radio element since we
          // want to enforce the predefined catalog query selections for each policy.
          multipleFunds && (
            <>
              <h4>
                {generateBudgetDisplayName(formData.policies[index])}
              </h4>
              <ProvisioningFormHelpText />
            </>
          )
        }
        {
          // Single fund/budget option is selected, so the catalog we use (or create) should be configurable.
          multipleFunds === false && (
            <>
              <Form.RadioSet
                name="display-catalog-content"
                onChange={handleChange}
                value={value}
              >
                {
                  Object.keys(CATALOG.OPTIONS).map((key) => (
                    <Form.Radio
                      value={key}
                      type="radio"
                      key={uuidv4()}
                      data-testid={key}
                      data-predefinedquerytype={key}
                      isInvalid={isFormFieldInvalid}
                    >
                      {CATALOG.OPTIONS[key]}
                    </Form.Radio>
                  ))
                }
              </Form.RadioSet>
              {isFormFieldInvalid && (
                <Form.Control.Feedback
                  type="invalid"
                >
                  {CATALOG.ERROR}
                </Form.Control.Feedback>
              )}
            </>
          )
        }
      </Form.Group>
    </article>
  );
};

ProvisioningFormCatalog.propTypes = indexOnlyPropType;

export default ProvisioningFormCatalog;
