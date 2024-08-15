import {
  Form,
} from '@openedx/paragon';
import { useState } from 'react';
import PROVISIONING_PAGE_TEXT from '../../data/constants';
import { indexOnlyPropType, selectProvisioningContext } from '../../data/utils';
import useProvisioningContext from '../../data/hooks';

const ProvisioningFormDescription = ({ index }) => {
  const { ACCOUNT_DESCRIPTION } = PROVISIONING_PAGE_TEXT.FORM;
  const [formData, isEditMode, hasEdits] = selectProvisioningContext('formData', 'isEditMode', 'hasEdits');
  const { setAccountDescription, setHasEdits } = useProvisioningContext();

  let submittedFormAccountDescription;
  if (isEditMode) {
    submittedFormAccountDescription = formData.policies[index].accountDescription;
  }

  const [accountDescriptionLength, setAccountDescriptionLength] = useState(
    submittedFormAccountDescription?.length || 0,
  );

  const [localAccountDescription, setLocalAccountDescription] = useState(submittedFormAccountDescription || '');

  const handleChange = (e) => {
    const newEvent = e.target;
    const { value } = newEvent;
    if (isEditMode && !hasEdits) {
      setHasEdits(true);
    }
    if (value.length > ACCOUNT_DESCRIPTION.MAX_LENGTH) {
      return;
    }
    setAccountDescriptionLength(value.length);
    setLocalAccountDescription(value);
    setAccountDescription({ accountDescription: value }, index);
  };

  return (
    <article className="mt-4.5">
      <div>
        <h3>{ACCOUNT_DESCRIPTION.TITLE}</h3>
      </div>
      <Form.Group>
        <Form.Label className="mb-2.5">{ACCOUNT_DESCRIPTION.SUB_TITLE}</Form.Label>
        <Form.Control
          className="mb-1"
          as="textarea"
          style={{ height: '100px' }}
          value={localAccountDescription}
          onChange={handleChange}
          data-testid="account-description"
        />
        <Form.Control.Feedback>
          {accountDescriptionLength}/{ACCOUNT_DESCRIPTION.MAX_LENGTH}
        </Form.Control.Feedback>
      </Form.Group>
    </article>
  );
};

ProvisioningFormDescription.propTypes = {
  ...indexOnlyPropType,
};

export default ProvisioningFormDescription;
