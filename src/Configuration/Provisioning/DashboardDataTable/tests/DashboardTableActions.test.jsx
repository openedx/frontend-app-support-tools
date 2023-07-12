/* eslint-disable react/prop-types */
import { renderWithRouter } from '@edx/frontend-enterprise-utils';
import { fireEvent, screen } from '@testing-library/react';
import { Router } from 'react-router-dom';
import DashboardTableActions from '../DashboardTableActions';
import ROUTES from '../../../../data/constants/routes';

const { HOME } = ROUTES.CONFIGURATION.SUB_DIRECTORY.PROVISIONING;

const useHistoryPush = jest.fn();
const historyMock = {
  push: useHistoryPush,
  location: jest.fn(),
  listen: jest.fn(),
  replace: jest.fn(),
};
jest.mock('@edx/frontend-platform', () => ({
  getConfig: () => {
    const DJANGO_ADMIN_SUBSIDY_BASE_URL = 'https://example.com';
    return {
      DJANGO_ADMIN_SUBSIDY_BASE_URL,
      FEATURE_CONFIGURATION_EDIT_ENTERPRISE_PROVISION: true,
    };
  },
}));

const DashboardTableActionsWrapper = ({
  row,
}) => (
  <Router history={historyMock}>
    <DashboardTableActions row={row} />
  </Router>
);

describe('DashboardTableBadges', () => {
  it('renders', () => {
    const row = {
      values: {
        uuid: 'Pikachu',
      },
    };
    renderWithRouter(<DashboardTableActionsWrapper row={row} />);
    expect(screen.getByTestId(`Edit-${row.values.uuid}`)).toBeTruthy();
    expect(screen.getByTestId(`Django-Admin-Page-${row.values.uuid}`)).toBeTruthy();
  });
  it('links to subsidy edit route', async () => {
    const row = {
      values: {
        uuid: 'Pikachu',
      },
    };
    renderWithRouter(<DashboardTableActionsWrapper row={row} />);
    const editButton = screen.getByTestId(`Edit-${row.values.uuid}`);
    fireEvent.click(editButton);
    expect(useHistoryPush).toHaveBeenCalledWith(`${HOME}/${row.values.uuid}/edit`);
    expect(useHistoryPush).toHaveBeenCalledTimes(1);
  });
});
