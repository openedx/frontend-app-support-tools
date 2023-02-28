import { renderWithRouter } from '@edx/frontend-enterprise-utils';
import { screen } from '@testing-library/react';
import PROVISIONING_PAGE_TEXT from '../data/constants';
import ProvisioningPage from '../ProvisioningPage';

const ProvisioningPageWrapper = () => (
  <ProvisioningPage />
);

describe('ProvisioningPage', () => {
  it('renders', () => {
    renderWithRouter(<ProvisioningPageWrapper />);
    expect(screen.getByText(PROVISIONING_PAGE_TEXT.DASHBOARD.HEADER)).toBeTruthy();
  });
  it('renders zero state dashboard', () => {
    renderWithRouter(<ProvisioningPageWrapper />);
    expect(screen.getByText(PROVISIONING_PAGE_TEXT.DASHBOARD.ZERO_STATE.HEADER)).toBeTruthy();
  });
});
