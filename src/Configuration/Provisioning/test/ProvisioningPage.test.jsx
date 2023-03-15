import { render, screen } from '@testing-library/react';
import PROVISIONING_PAGE_TEXT from '../data/constants';
import ProvisioningPage from '../ProvisioningPage';

describe('ProvisioningPage', () => {
  it('renders', () => {
    render(<ProvisioningPage />);
    expect(screen.getByText(PROVISIONING_PAGE_TEXT.DASHBOARD.HEADER)).toBeTruthy();
  });
});
