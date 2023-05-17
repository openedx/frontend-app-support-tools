/* eslint-disable react/prop-types */
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { renderWithRouter } from '@edx/frontend-enterprise-utils';
import { useHistory } from 'react-router';
import Dashboard from '../Dashboard';
import PROVISIONING_PAGE_TEXT, { toastText } from '../data/constants';
import { DashboardContext } from '../../testData/DashboardContextWrapper';

const { DASHBOARD } = PROVISIONING_PAGE_TEXT;

const DashboardWrapper = ({
  successfulPlanCreation = false,
}) => {
  const history = useHistory();
  const { location } = history;
  if (successfulPlanCreation) {
    history.push(location.pathname, { planSuccessfullyCreated: true });
  }
  return (
    <DashboardContext locale="en">
      <Dashboard />
    </DashboardContext>
  );
};

describe('<DashboardWrapper>', () => {
  it('Displays the header', () => {
    renderWithRouter(<DashboardWrapper />);
    expect(screen.getByText(DASHBOARD.TITLE)).toBeTruthy();
    expect(screen.getByText(DASHBOARD.BUTTON.new)).toBeTruthy();
  });
  it('Displays the toast plan creation', () => {
    renderWithRouter(<DashboardWrapper successfulPlanCreation />);
    expect(screen.getByText(toastText.successfulPlanCreation)).toBeTruthy();
  });
  it('Closes the toast on button click', async () => {
    renderWithRouter(<DashboardWrapper successfulPlanCreation />);
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
