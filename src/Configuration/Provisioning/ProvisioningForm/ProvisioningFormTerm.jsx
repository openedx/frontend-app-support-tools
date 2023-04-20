import { useEffect, useState } from 'react';
import {
  Form,
  Icon,
  Stack,
  OverlayTrigger,
  Tooltip,
} from '@edx/paragon';
import { InfoOutline } from '@edx/paragon/icons';
import PROVISIONING_PAGE_TEXT from '../data/constants';
import useProvisioningContext from '../data/hooks';
import { selectProvisioningContext } from '../data/utils';
import { isValidDateString } from '../../../utils';

const ProvisioningFormTerm = () => {
  const { TERM } = PROVISIONING_PAGE_TEXT.FORM;
  const [formData] = selectProvisioningContext('formData');
  const { setStartDate, setEndDate } = useProvisioningContext();
  const [hasInvalidEndDate, setHasInvalidEndDate] = useState(false);

  const handleDateChange = (e) => {
    const eventTarget = e.target;
    const isStartDate = eventTarget.dataset.testid.includes('start');
    if (isValidDateString(eventTarget.value)) {
      if (isStartDate) {
        return setStartDate(eventTarget.value);
      }
      return setEndDate(eventTarget.value);
    }
    if (isStartDate) {
      return setStartDate('');
    }
    return setEndDate('');
  };

  useEffect(() => {
    if (formData.endDate < formData.startDate) {
      setHasInvalidEndDate(true);
    } else {
      setHasInvalidEndDate(false);
    }
  }, [formData]);

  return (
    <article className="mt-4.5">
      <Stack direction="horizontal" className="mb-1">
        <h3>{TERM.TITLE}</h3>
        <OverlayTrigger
          placement="right"
          overlay={(
            <Tooltip
              id="term-tooltip"
            >
              {TERM.TOOLTIP}
            </Tooltip>
          )}
        >
          <Icon src={InfoOutline} size="sm" className="align-self-baseline ml-1.5" />
        </OverlayTrigger>
      </Stack>
      <Form.Group className="mt-4.5 mb-1">
        <Form.Control
          name="start-date"
          type="date"
          floatingLabel={TERM.OPTIONS.startDate || undefined}
          onChange={handleDateChange}
          value={formData.startDate || ''}
          data-testid="start-date"
        />
      </Form.Group>
      <Form.Group className="mt-4.5">
        <Form.Control
          name="end-date"
          type="date"
          floatingLabel={TERM.OPTIONS.endDate}
          value={formData.endDate || ''}
          onChange={handleDateChange}
          data-testid="end-date"
        />
        {hasInvalidEndDate && (
          <Form.Control.Feedback
            type="invalid"
          >
            {TERM.VALIDITY}
          </Form.Control.Feedback>
        )}
      </Form.Group>
    </article>
  );
};

export default ProvisioningFormTerm;
