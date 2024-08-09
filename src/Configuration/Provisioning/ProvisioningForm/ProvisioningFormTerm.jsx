import { useEffect, useState } from 'react';
import {
  Form,
  Icon,
  IconButtonWithTooltip,
  Stack,
} from '@openedx/paragon';
import { InfoOutline } from '@openedx/paragon/icons';
import PROVISIONING_PAGE_TEXT from '../data/constants';
import useProvisioningContext from '../data/hooks';
import { selectProvisioningContext } from '../data/utils';
import { isValidDateString } from '../../../utils';

const ProvisioningFormTerm = () => {
  const { TERM } = PROVISIONING_PAGE_TEXT.FORM;
  const [
    formData,
    showInvalidField,
    isEditMode,
    hasEdits,
  ] = selectProvisioningContext('formData', 'showInvalidField', 'isEditMode', 'hasEdits');
  const { subsidy } = showInvalidField;
  const areDatesDefinedAndFalse = subsidy?.startDate === false || subsidy?.endDate === false;
  const {
    setStartDate,
    setEndDate,
    setInvalidSubsidyFields,
    setHasEdits,
  } = useProvisioningContext();
  const [hasInvalidEndDate, setHasInvalidEndDate] = useState(false);
  const handleDateChange = (e) => {
    const eventTarget = e.target;
    const isStartDate = eventTarget.dataset.testid.includes('start');
    if (isEditMode && !hasEdits) {
      setHasEdits(true);
    }
    if (isValidDateString(eventTarget.value)) {
      setInvalidSubsidyFields(isStartDate ? { ...subsidy, startDate: true } : { ...subsidy, endDate: true });
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
        <h3 className="mb-0 align-self-center">{TERM.TITLE}</h3>
        <IconButtonWithTooltip
          src={InfoOutline}
          size="sm"
          tooltipPlacement="right"
          tooltipContent={TERM.TOOLTIP}
          iconAs={Icon}
          invertColors
          isActive
          alt="Plan activation tooltip"
        />
      </Stack>
      <Form.Group
        className="mt-3.5 mb-1"
        isInvalid={areDatesDefinedAndFalse || hasInvalidEndDate}
      >
        <Form.Control
          name="start-date"
          type="date"
          floatingLabel={TERM.OPTIONS.startDate || undefined}
          onChange={handleDateChange}
          value={formData.startDate || ''}
          data-testid="start-date"
        />
        <Form.Control
          name="end-date"
          type="date"
          floatingLabel={TERM.OPTIONS.endDate}
          value={formData.endDate || ''}
          onChange={handleDateChange}
          data-testid="end-date"
          className="mt-3.5"
        />
        {hasInvalidEndDate && (
          <Form.Control.Feedback
            type="invalid"
          >
            {TERM.ERROR.validity}
          </Form.Control.Feedback>
        )}
        {areDatesDefinedAndFalse && (
          <Form.Control.Feedback
            type="invalid"
          >
            {TERM.ERROR.emptyField}
          </Form.Control.Feedback>
        )}
      </Form.Group>
    </article>
  );
};

export default ProvisioningFormTerm;
