/* eslint-disable react/prop-types */
import { screen, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import { IntlProvider } from '@edx/frontend-platform/i18n';
import EnterpriseCustomerUsersTable from '../EnterpriseCustomerUsersTable';
import useCustomerUsersTableData from '../../data/hooks/useCustomerUsersTableData';

const mockFetchEnterpriseUsersData = jest.fn();
const mockData = {
  isLoading: false,
  enterpriseUsersTableData: {
    itemCount: 2,
    pageCount: 1,
    results: [
      {
        enterpriseCustomerUser: {
          username: 'ash ketchum',
          email: 'ash@ketchum.org',
        },
        pendingEnterpriseCustomerUser: null,
        roleAssignments: ['enterprise_learner'],
      },
      {
        enterpriseCustomerUser: {
          username: 'misty',
          email: 'misty@pokemon.org',
        },
        pendingEnterpriseCustomerUser: null,
        roleAssignments: ['enterprise_admin'],
      },
    ],
  },
  fetchEnterpriseUsersData: mockFetchEnterpriseUsersData,
};

jest.mock('../../data/hooks/useCustomerUsersTableData');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: 'test-uuid' }),
}));

describe('EnterpriseCustomerUsersTable', () => {
  it('renders the datatable with data', () => {
    useCustomerUsersTableData.mockReturnValue(mockData);

    render(
      <IntlProvider locale="en">
        <EnterpriseCustomerUsersTable />
      </IntlProvider>,
    );
    expect(screen.getByText('Search user details')).toBeInTheDocument();
    expect(screen.getByText('User details')).toBeInTheDocument();
    expect(screen.getByText('Administrator')).toBeInTheDocument();
    expect(screen.getByText('Learner')).toBeInTheDocument();
    expect(screen.getByText('ash ketchum')).toBeInTheDocument();
    expect(screen.getByText('ash@ketchum.org')).toBeInTheDocument();
    expect(screen.getByTestId('learner check'));

    expect(screen.getByText('misty')).toBeInTheDocument();
    expect(screen.getByText('misty@pokemon.org')).toBeInTheDocument();
    expect(screen.getByTestId('admin check')).toBeInTheDocument();
  });

  it('passes proper sorting and filter args to fetchEnterpriseUsersData', async () => {
    render(
      <IntlProvider locale="en">
        <EnterpriseCustomerUsersTable />
      </IntlProvider>,
    );
    await userEvent.type(screen.getByText('Search user details'), 'ash');
    await waitFor(() => {
      expect(mockFetchEnterpriseUsersData).toHaveBeenCalledWith({
        filters: [{ id: 'details', value: 'ash' }],
        pageIndex: 0,
        pageSize: 8,
        sortBy: [],
      });
    });
  });
});
