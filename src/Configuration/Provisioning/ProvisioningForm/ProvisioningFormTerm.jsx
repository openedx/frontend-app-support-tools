import {
  Form,
} from '@edx/paragon';
import { useContextSelector } from 'use-context-selector';
import PROVISIONING_PAGE_TEXT from '../data/constants';
import useProvisioningContext from '../data/hooks';
import { ProvisioningContext } from '../ProvisioningContext';

const ProvisioningFormTerm = () => {
  const { TERM } = PROVISIONING_PAGE_TEXT.FORM;
  const { formData } = useContextSelector(ProvisioningContext, v => v[0]);
  const { setStartDate, setEndDate } = useProvisioningContext();

  const handleDateChange = (e) => {
    if (e.target.dataset.testid.includes('start')) {
      return setStartDate(e.target.value);
    }
    return setEndDate(e.target.value);
  };
  return (
    <article className="mt-4.5">
      <div className="mb-1">
        <h3>{TERM.TITLE}</h3>
      </div>
      <Form.Group className="mt-4.5 mb-1">
        <Form.Control
          type="date"
          floatingLabel={TERM.OPTIONS.startDate}
          defaultValue={formData.startDate || TERM.OPTIONS.startDate}
          onChange={handleDateChange}
          value={formData?.startDate}
          data-testid="start-date"
        />
      </Form.Group>
      <Form.Group className="mt-4.5">
        <Form.Control
          type="date"
          floatingLabel={TERM.OPTIONS.endDate}
          defaultValue={formData.endDate || TERM.OPTIONS.endDate}
          value={formData?.endDate}
          onChange={handleDateChange}
          data-testid="end-date"
        />
      </Form.Group>
    </article>
  );
};

export default ProvisioningFormTerm;
