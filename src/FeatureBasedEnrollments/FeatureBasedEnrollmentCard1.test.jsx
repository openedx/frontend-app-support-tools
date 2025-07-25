import React from 'react';
import { render, screen, within, cleanup } from '@testing-library/react';
import FeatureBasedEnrollmentCard from './FeatureBasedEnrollmentCard';
import {
  fbeDurationConfigEnabled,
  fbeDurationConfigDisabled,
  fbeGatingConfigEnabled,
  fbeGatingConfigDisabled,
} from './data/test/featureBasedEnrollment';

describe('Feature Based Enrollment Card Component', () => {
  afterEach(cleanup);

  describe('Gating config', () => {
    const title = 'Gating Config';

    it('Gating config enabled', () => {
      render(<FeatureBasedEnrollmentCard title={title} fbeData={fbeGatingConfigEnabled} />);
      
      expect(screen.getByText('Gating Config Enabled')).toBeInTheDocument();

      const rows = screen.getAllByRole('row');
      const dateRow = within(rows[0]);
      const reasonRow = within(rows[1]);

      expect(dateRow.getByText('Enabled As Of')).toBeInTheDocument();
      expect(dateRow.getByText('Jan 1, 2020 12:00 AM')).toBeInTheDocument();

      expect(reasonRow.getByText('Reason')).toBeInTheDocument();
      expect(reasonRow.getByText('Site')).toBeInTheDocument();
    });

    it('Gating config disabled', () => {
      render(<FeatureBasedEnrollmentCard title={title} fbeData={fbeGatingConfigDisabled} />);
      
      expect(screen.getByText('Gating Config Disabled')).toBeInTheDocument();

      const rows = screen.getAllByRole('row');
      const dateRow = within(rows[0]);
      const reasonRow = within(rows[1]);

      expect(dateRow.getByText('Enabled As Of')).toBeInTheDocument();
      expect(dateRow.getByText('N/A')).toBeInTheDocument();

      expect(reasonRow.getByText('Reason')).toBeInTheDocument();
      expect(reasonRow.queryByText('')).toBeInTheDocument();
    });
  });

  describe('Duration config', () => {
    const title = 'Duration Config';

    it('Duration config enabled', () => {
      render(<FeatureBasedEnrollmentCard title={title} fbeData={fbeDurationConfigEnabled} />);
      
      expect(screen.getByText('Duration Config Enabled')).toBeInTheDocument();

      const rows = screen.getAllByRole('row');
      const dateRow = within(rows[0]);
      const reasonRow = within(rows[1]);

      expect(dateRow.getByText('Enabled As Of')).toBeInTheDocument();
      expect(dateRow.getByText('Feb 1, 2020 12:00 AM')).toBeInTheDocument();

      expect(reasonRow.getByText('Reason')).toBeInTheDocument();
      expect(reasonRow.getByText('Site Config')).toBeInTheDocument();
    });

    it('Duration config disabled', () => {
      render(<FeatureBasedEnrollmentCard title={title} fbeData={fbeDurationConfigDisabled} />);
      
      expect(screen.getByText('Duration Config Disabled')).toBeInTheDocument();

      const rows = screen.getAllByRole('row');
      const dateRow = within(rows[0]);
      const reasonRow = within(rows[1]);

      expect(dateRow.getByText('Enabled As Of')).toBeInTheDocument();
      expect(dateRow.getByText('N/A')).toBeInTheDocument();

      expect(reasonRow.getByText('Reason')).toBeInTheDocument();
      expect(reasonRow.queryByText('')).toBeInTheDocument();
    });
  });
});
