import {
  Form,
} from '@edx/paragon';
import { useContextSelector } from 'use-context-selector';
import PROVISIONING_PAGE_TEXT from '../data/constants';
import useProvisioningContext from '../data/hooks';

const ProvisioningFormTerm = () => {
  const { TERM } = PROVISIONING_PAGE_TEXT.FORM;
  const { formData } = useContextSelector;
  const { setStartDate, setEndDate } = useProvisioningContext();
  console.log(formData);
  return (
    <article className="mt-4.5">
      <div className="mb-1">
        <h3>{TERM.TITLE}</h3>
      </div>
      <Form.Group className="mt-4.5 mb-1">
        <Form.Control
          type="date"
          floatingLabel="Start Date"
          onSelect={(e) => setStartDate(e.target.value)}
        />
      </Form.Group>
      <Form.Group className="mt-4.5">
        <Form.Control
          type="date"
          floatingLabel="End Date"
          onSelect={(e) => setEndDate(e.target.value)}
        />
      </Form.Group>
    </article>
  );
};

export default ProvisioningFormTerm;
