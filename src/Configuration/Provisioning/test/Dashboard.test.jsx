/* eslint-disable react/prop-types */
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { renderWithRouter } from '@edx/frontend-enterprise-utils';
import { useLocation } from 'react-router-dom';
import Dashboard from '../Dashboard';
import PROVISIONING_PAGE_TEXT, { toastText } from '../data/constants';
import { DashboardContext, initialStateValue } from '../../testData/Dashboard';

const { DASHBOARD } = PROVISIONING_PAGE_TEXT;

jest.mock('../data/hooks', () => ({
  ...jest.requireActual('../data/hooks'),
  useDashboardContext: () => ({
    hydrateEnterpriseSubsidies: jest.fn(),
  }),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
  useNavigate: () => jest.fn(),
}));

const DashboardWrapper = ({
  value = initialStateValue,
}) => (
  <DashboardContext value={value}>
    <Dashboard />
  </DashboardContext>
);

describe('<DashboardWrapper>', () => {
  it('Displays the header', () => {
    useLocation.mockReturnValue({
      pathname: '/',
      state: {
        planSuccessfullyCreated: false,
      },
    });

    renderWithRouter(<DashboardWrapper />);
    expect(screen.getByText(DASHBOARD.TITLE)).toBeTruthy();
    expect(screen.getByText(DASHBOARD.BUTTON.new)).toBeTruthy();
  });
  it('Displays the toast plan creation', () => {
    useLocation.mockReturnValue({
      pathname: '/',
      state: {
        planSuccessfullyCreated: true,
      },
    });
    renderWithRouter(<DashboardWrapper />);
    expect(screen.getByText(toastText.successfulPlanCreation)).toBeTruthy();
  });
  it('Closes the toast on button click', async () => {
    useLocation.mockReturnValue({
      pathname: '/',
      state: {
        planSuccessfullyCreated: true,
      },
    });

    renderWithRouter(<DashboardWrapper />);
    const toastCloseButton = screen.getAllByRole('button').map((button) => {
      if (button.getAttribute('aria-label') === 'Close') {
        return button;
      }
      return null;
    }).filter((button) => {
      if (button) {
        return button;
      }
      return null;
    });
    fireEvent.click(toastCloseButton[0]);
    await waitFor(() => expect(screen.queryByText(toastText.successfulPlanCreation)).toBeFalsy());
  });
});
