import { renderWithRouter } from '@edx/frontend-enterprise-utils';
import { screen } from '@testing-library/react';
import DashboardTableBadges from '../DashboardTableBadges';

describe('DashboardTableBadges', () => {
  it('renders the \'Active\' badge', () => {
    const row = {
      values: {
        isActive: true,
      },
    };
    renderWithRouter(<DashboardTableBadges row={row} />);
    expect(screen.getByText('Active')).toBeTruthy();
  });
  it('renders the \'Inactive\' badge', () => {
    const row = {
      values: {
        isActive: false,
      },
    };
    renderWithRouter(<DashboardTableBadges row={row} />);
    expect(screen.getByText('Inactive')).toBeTruthy();
  });
});
