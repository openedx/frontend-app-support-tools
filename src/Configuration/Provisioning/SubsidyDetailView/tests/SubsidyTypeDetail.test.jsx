import '@testing-library/jest-dom/extend-expect';
import { screen, render } from '@testing-library/react';
import SubsidyTypeDetail from '../SubsidyTypeDetail';

describe('SubsidyTypeDetail', () => {
  it('renders the partner-no-rev-prepay revenue category selection', () => {
    render(<SubsidyTypeDetail revenueCategory="partner-no-rev-prepay" />);
    expect(screen.getByText('No (partner no rev prepay)')).toBeInTheDocument();
  });

  it('renders the bulk-enrollment-prepay revenue category selection', () => {
    render(<SubsidyTypeDetail revenueCategory="bulk-enrollment-prepay" />);
    expect(screen.getByText('Yes (bulk enrollment prepay)')).toBeInTheDocument();
  });
});
