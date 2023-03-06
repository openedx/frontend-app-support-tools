/* eslint-disable react/prop-types */
import { fireEvent, screen } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { renderWithRouter } from '@edx/frontend-enterprise-utils';
import ROUTES from '../../../data/constants/routes';
import PROVISIONING_PAGE_TEXT from '../data/constants';
import ProvisioningPage from '../ProvisioningPage';
import { ProvisioningContext, initialStateValue } from '../../testData';

const { CONFIGURATION: { SUB_DIRECTORY: { PROVISIONING } } } = ROUTES;
const useHistoryPush = jest.fn();
const historyMock = { push: useHistoryPush, location: {}, listen: jest.fn() };

const ProvisioningPageWrapper = ({
  value = initialStateValue,
}) => (
  <Router history={historyMock}>
    <ProvisioningContext value={value}>
      <ProvisioningPage />
    </ProvisioningContext>
  </Router>
);

describe('ProvisioningPage', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders the header and new button', () => {
    renderWithRouter(<ProvisioningPageWrapper value={initialStateValue} />);
    expect(screen.getByText(PROVISIONING_PAGE_TEXT.DASHBOARD.TITLE)).toBeTruthy();
    expect(screen.getByText(PROVISIONING_PAGE_TEXT.DASHBOARD.BUTTON.new)).toBeTruthy();
  });
  it('redirects to /new when the user clicks the new button', () => {
    renderWithRouter(<ProvisioningPageWrapper />);
    const newButton = screen.getByText(PROVISIONING_PAGE_TEXT.DASHBOARD.BUTTON.new);
    fireEvent.click(newButton);
    expect(useHistoryPush).toHaveBeenCalledWith(`${PROVISIONING.SUB_DIRECTORY.NEW}`);
  });
});
