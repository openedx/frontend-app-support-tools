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

  describe('Gating Config Enabled', () => {
    const title = 'Gating Config Enabled';

    it('Gating Config Enabled', () => {
      render(<FeatureBasedEnrollmentCard title="Gating Config Enabled" fbeData={fbeGatingConfigEnabled} />);

      expect(screen.getByText('Gating Config Enabled')).toBeInTheDocument();

      const rows = screen.getAllByRole('row');
      const dateRow = within(rows[0]);
      const reasonRow = within(rows[1]);

      expect(dateRow.getByText('Enabled As Of')).toBeInTheDocument();
      expect(dateRow.getByText('Jan 1, 2020 12:00 AM')).toBeInTheDocument();

      expect(reasonRow.getByText('Reason')).toBeInTheDocument();
      expect(reasonRow.getByText('Site')).toBeInTheDocument();
    });

    it("Gating config disabled", () => {
      render(<FeatureBasedEnrollmentCard title="Gating config disabled" fbeData={fbeGatingConfigDisabled} />);

      expect(screen.getByText("Gating config disabled")).toBeInTheDocument();

      const rows = screen.getAllByRole('row');
      const dateRow = within(rows[0]);
      const reasonRow = within(rows[1]);

      expect(dateRow.getByText('Enabled As Of')).toBeInTheDocument();
      expect(dateRow.getByText('N/A')).toBeInTheDocument();

      expect(reasonRow.getByText('Reason')).toBeInTheDocument();
      expect(reasonRow.queryByText('Site')).not.toBeInTheDocument();
    });
  });

  describe('Duration Config Enabled', () => {
    const title = 'Duration Config Enabled';

    it('Duration config enabled', () => {
      render(<FeatureBasedEnrollmentCard title="Duration Config Enabled" fbeData={fbeDurationConfigEnabled} />);

      expect(screen.getByText('Duration Config Enabled')).toBeInTheDocument();

      const rows = screen.getAllByRole('row');
      const dateRow = within(rows[0]);
      const reasonRow = within(rows[1]);

      expect(dateRow.getByText('Enabled As Of')).toBeInTheDocument();
      expect(dateRow.getByText('Feb 1, 2020 12:00 AM')).toBeInTheDocument();

      expect(reasonRow.getByText('Reason')).toBeInTheDocument();
      expect(reasonRow.getByText('Site Config')).toBeInTheDocument();
    });
    

    it('Duration Config Disabled', () => {
      render(<FeatureBasedEnrollmentCard title="Duration Config Disabled" fbeData={fbeDurationConfigDisabled} />);

      expect(screen.getByText('Duration Config Disabled')).toBeInTheDocument();

      const rows = screen.getAllByRole('row');
      const dateRow = within(rows[0]);
      const reasonRow = within(rows[1]);

      expect(dateRow.getByText('Enabled As Of')).toBeInTheDocument();
      expect(dateRow.getByText('N/A')).toBeInTheDocument();

      expect(reasonRow.getByText('Reason')).toBeInTheDocument();
      expect(reasonRow.queryByText('Site Config')).not.toBeInTheDocument();
    });
  });
});
