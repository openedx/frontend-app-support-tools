import {
  Form,
} from '@edx/paragon';
import PROVISIONING_PAGE_TEXT from '../data/constants';
import useProvisioningContext from '../data/hooks';
import {selectProvisioningContext} from '../data/utils';

const ProvisioningFormTerm = () => {
  const { TERM } = PROVISIONING_PAGE_TEXT.FORM;
  const [formData] = selectProvisioningContext('formData');
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
          floatingLabel={TERM.OPTIONS.startDate || undefined}
          defaultValue={formData.startDate}
          onChange={handleDateChange}
          value={formData?.startDate}
          data-testid="start-date"
        />
      </Form.Group>
      <Form.Group className="mt-4.5">
        <Form.Control
          type="date"
          floatingLabel={TERM.OPTIONS.endDate}
          defaultValue={formData.endDate || undefined}
          value={formData?.endDate}
          onChange={handleDateChange}
          data-testid="end-date"
        />
      </Form.Group>
    </article>
  );
};

export default ProvisioningFormTerm;
