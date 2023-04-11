import { useEffect, useState } from 'react';
import { Form } from '@edx/paragon';
import { useContextSelector } from 'use-context-selector';
import useCatalogCurationContext from './data/hooks';
import { CatalogCurationContext } from './CatalogCurationContext';

const CatalogCurationDateSelection = () => {
  const TERM = {
    TITLE: 'Pick a start and end date for your query',
    OPTIONS: {
      startDate: 'Start Date',
      endDate: 'End Date',
    },
    VALIDITY: 'Please choose an end date later than the start date',
  };
  const { startDate, endDate } = useContextSelector(CatalogCurationContext, v => v[0]);
  const { setStartDate, setEndDate } = useCatalogCurationContext();
  const [hasInvalidEndDate, setHasInvalidEndDate] = useState(false);

  const handleDateChange = (e) => {
    const eventTarget = e.target;
    if (eventTarget.dataset.testid.includes('start')) {
      return setStartDate(eventTarget.value);
    }
    return setEndDate(eventTarget.value);
  };

  useEffect(() => {
    if (startDate !== '' && endDate !== '' && endDate < startDate) {
      setHasInvalidEndDate(true);
    } else {
      setHasInvalidEndDate(false);
    }
  }, [startDate, endDate]);

  return (
    <article className="mt-4.5">
      <div className="mb-1">
        <h3>{TERM.TITLE}</h3>
      </div>
      <Form.Group className="mt-4.5 mb-1">
        <Form.Control
          name="start-date"
          type="date"
          floatingLabel={TERM.OPTIONS.startDate || undefined}
          onChange={handleDateChange}
          value={startDate || ''}
          data-testid="start-date"
        />
      </Form.Group>
      <Form.Group className="mt-4.5">
        <Form.Control
          name="end-date"
          type="date"
          floatingLabel={TERM.OPTIONS.endDate}
          value={endDate || ''}
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

export default CatalogCurationDateSelection;
