import { useState } from 'react';
import {
  Form,
} from '@edx/paragon';
import PROVISIONING_PAGE_TEXT from '../data/constants';
import useProvisioningContext from '../data/hooks';
import { selectProvisioningContext } from '../data/utils';

const ProvisioningFormTitle = () => {
  const { setSubsidyTitle } = useProvisioningContext();
  const { FORM: { PLAN_TITLE } } = PROVISIONING_PAGE_TEXT;
  const [formData, showInvalidField, isEditMode] = selectProvisioningContext('formData', 'showInvalidField', 'isEditMode');

  let submittedFormSubsidyTitle;
  if (isEditMode) {
    submittedFormSubsidyTitle = formData.subsidyTitle;
  }

  const [value, setValue] = useState(submittedFormSubsidyTitle || '');
  const { setInvalidSubsidyFields } = useProvisioningContext();
  const { subsidy } = showInvalidField;
  const isSubsidyTitleDefinedAndFalse = subsidy?.subsidyTitle === false;

  const handleChange = (e) => {
    const newEventValue = e.target.value;
    if (newEventValue === '') {
      setInvalidSubsidyFields({ ...subsidy, subsidyTitle: false });
      setSubsidyTitle('');
      setValue(newEventValue);
      return;
    }
    setValue(newEventValue);
    setSubsidyTitle(newEventValue);
    setInvalidSubsidyFields({ ...subsidy, subsidyTitle: true });
  };
  return (
    <article className="mt-4.5">
      <div className="mb-1">
        <h3>{PLAN_TITLE.HEADER}</h3>
      </div>
      <Form.Group
        className="mt-3.5"
        isInvalid={isSubsidyTitleDefinedAndFalse}
      >
        <Form.Control
          floatingLabel={PLAN_TITLE.TITLE}
          onChange={handleChange}
          data-testid="customer-plan-title"
          value={value}
        />
        {isSubsidyTitleDefinedAndFalse && (
          <Form.Control.Feedback type="invalid">
            {PLAN_TITLE.ERROR}
          </Form.Control.Feedback>
        )}
      </Form.Group>
    </article>
  );
};

export default ProvisioningFormTitle;
