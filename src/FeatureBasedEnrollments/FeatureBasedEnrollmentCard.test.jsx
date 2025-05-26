import { render } from '@testing-library/react';
import React from 'react';
import FeatureBasedEnrollmentCard from './FeatureBasedEnrollmentCard';
import {
  fbeDurationConfigEnabled,
  fbeDurationConfigDisabled,
  fbeGatingConfigEnabled,
  fbeGatingConfigDisabled,
} from './data/test/featureBasedEnrollment';

describe('Feature Based Enrollment Card Component', () => {
  describe('Gating config', () => {
    const title = 'Gating Config';

    it('Gating config enabled', () => {
      const { unmount } = render(<FeatureBasedEnrollmentCard title={title} fbeData={fbeGatingConfigEnabled} />);
      const header = document.querySelector('.card-title');
      const dataTable = document.querySelectorAll('table.fbe-table tr');
      const dateRow = dataTable[0];
      const reasonRow = dataTable[1];

      expect(header.textContent).toEqual('Gating Config Enabled');
      expect(dateRow.querySelectorAll('th')[0].textContent).toEqual('Enabled As Of');
      expect(dateRow.querySelectorAll('td')[0].textContent).toEqual('Jan 1, 2020 12:00 AM');

      expect(reasonRow.querySelectorAll('th')[0].textContent).toEqual('Reason');
      expect(reasonRow.querySelectorAll('td')[0].textContent).toEqual('Site');
      unmount();
    });

    it('Gating config disabled', () => {
      const { unmount } = render(<FeatureBasedEnrollmentCard title={title} fbeData={fbeGatingConfigDisabled} />);
      const header = document.querySelector('.card-title');
      const dataTable = document.querySelectorAll('table.fbe-table tr');
      const dateRow = dataTable[0];
      const reasonRow = dataTable[1];

      expect(header.textContent).toEqual('Gating Config Disabled');
      expect(dateRow.querySelectorAll('th')[0].textContent).toEqual('Enabled As Of');
      expect(dateRow.querySelectorAll('td')[0].textContent).toEqual('N/A');

      expect(reasonRow.querySelectorAll('th')[0].textContent).toEqual('Reason');
      expect(reasonRow.querySelectorAll('td')[0].textContent).toEqual('');
      unmount();
    });
  });

  describe('Duration config', () => {
    const title = 'Duration Config';

    it('Duration config enabled', () => {
      const { unmount } = render(<FeatureBasedEnrollmentCard title={title} fbeData={fbeDurationConfigEnabled} />);
      const header = document.querySelector('.card-title');
      const dataTable = document.querySelectorAll('table.fbe-table tr');
      const dateRow = dataTable[0];
      const reasonRow = dataTable[1];

      expect(header.textContent).toEqual('Duration Config Enabled');
      expect(dateRow.querySelectorAll('th')[0].textContent).toEqual('Enabled As Of');
      expect(dateRow.querySelectorAll('td')[0].textContent).toEqual('Feb 1, 2020 12:00 AM');

      expect(reasonRow.querySelectorAll('th')[0].textContent).toEqual('Reason');
      expect(reasonRow.querySelectorAll('td')[0].textContent).toEqual('Site Config');
      unmount();
    });

    it('Duration config disabled', () => {
      const { unmount } = render(<FeatureBasedEnrollmentCard title={title} fbeData={fbeDurationConfigDisabled} />);
      const header = document.querySelector('.card-title');
      const dataTable = document.querySelectorAll('table.fbe-table tr');
      const dateRow = dataTable[0];
      const reasonRow = dataTable[1];

      expect(header.textContent).toEqual('Duration Config Disabled');
      expect(dateRow.querySelectorAll('th')[0].textContent).toEqual('Enabled As Of');
      expect(dateRow.querySelectorAll('td')[0].textContent).toEqual('N/A');

      expect(reasonRow.querySelectorAll('th')[0].textContent).toEqual('Reason');
      expect(reasonRow.querySelectorAll('td')[0].textContent).toEqual('');
      unmount();
    });
  });
});
