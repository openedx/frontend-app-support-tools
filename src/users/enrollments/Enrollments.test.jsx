import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { getConfig } from '@edx/frontend-platform';
import Enrollments from './Enrollments';
import { enrollmentsData } from '../data/test/enrollments';
import UserMessagesProvider from '../../userMessages/UserMessagesProvider';
import * as api from '../data/api';

jest.mock('@edx/frontend-platform', () => ({
  ...jest.requireActual('@edx/frontend-platform'),
  getConfig: jest.fn(() => ({
    ECOMMERCE_BASE_URL: 'http://example.com',
    COMMERCE_COORDINATOR_ORDER_DETAILS_URL: 'http://example.com/coordinater/',
  })),
}));

const renderWithProviders = (props = {}) => (
  render(
    <IntlProvider locale="en">
      <UserMessagesProvider>
        <Enrollments {...props} />
      </UserMessagesProvider>
    </IntlProvider>,
  )
);

describe('Course Enrollments Listing', () => {
  const props = { user: 'edX', changeHandler: jest.fn() };

  afterEach(() => jest.clearAllMocks());

  it('default enrollment data', async () => {
    jest.spyOn(api, 'getEnrollments').mockResolvedValueOnce(enrollmentsData);
    renderWithProviders(props);

    await waitFor(() => {
      expect(screen.getByText(/Enrollments \(2\)/i)).toBeInTheDocument();
    });
  });

  it('No Enrollment Data', async () => {
    jest.spyOn(api, 'getEnrollments').mockResolvedValueOnce([]);
    renderWithProviders(props);

    await waitFor(() => {
      expect(screen.getByText(/Enrollments \(0\)/i)).toBeInTheDocument();
    });
  });

  it('Error fetching enrollments', async () => {
    const enrollmentErrors = {
      errors: [
        {
          code: null,
          dismissible: true,
          text: 'An unexpected error occurred. Please try refreshing the page.',
          type: 'danger',
          topic: 'enrollments',
        },
      ],
    };
    jest.spyOn(api, 'getEnrollments').mockResolvedValueOnce(enrollmentErrors);
    renderWithProviders(props);

    await waitFor(() => {
      expect(
        screen.getByText(enrollmentErrors.errors[0].text),
      ).toBeInTheDocument();
    });
  });

  it('Enrollment create form is rendered', async () => {
    jest.spyOn(api, 'getEnrollments').mockResolvedValueOnce(enrollmentsData);
    renderWithProviders(props);

    const createBtn = screen.getByRole('button', {
      name: /create new enrollment/i,
    });
    fireEvent.click(createBtn);

    const modal = screen.getByRole('dialog');
    expect(
      within(modal).getByText(/Create New Enrollment/i),
    ).toBeInTheDocument();

    const closeBtn = within(modal).getByText(/^Close$/i);
    fireEvent.click(closeBtn);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('Enrollment change form is rendered for individual enrollment', async () => {
    jest.spyOn(api, 'getEnrollments').mockResolvedValueOnce(enrollmentsData);
    renderWithProviders(props);

    const rows = await screen.findAllByRole('row');
    const dropdownBtn = within(rows[1]).getByRole('button', { name: /Actions/i });
    fireEvent.click(dropdownBtn);

    const dropdownMenu = rows[1].querySelector('.dropdown-menu');
    dropdownMenu.style.display = 'block';
    dropdownMenu.style.opacity = '1';
    dropdownMenu.style.pointerEvents = 'auto';

    const changeOption = within(rows[1]).getByRole('button', {
      name: /Change Enrollment/i,
    });
    fireEvent.click(changeOption);

    const modal = await screen.findByRole('dialog');
    expect(modal).toBeInTheDocument();

    const closeBtn = within(modal).getByText(/^Close$/i);
    fireEvent.click(closeBtn);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('Enrollment extra data and enterprise course enrollments are rendered', async () => {
    jest.spyOn(api, 'getEnrollments').mockResolvedValueOnce(enrollmentsData);
    renderWithProviders(props);

    const expandBtns = await screen.findAllByTitle('Toggle Row Expanded');
    expect(expandBtns[0].querySelector('svg')).toHaveClass('fa-plus');

    fireEvent.click(expandBtns[0]);
    expect(expandBtns[0].querySelector('svg')).toHaveClass('fa-minus');

    const tables = await screen.findAllByRole('table');
    expect(tables.length).toBeGreaterThanOrEqual(3);

    const extraTableHeaders = within(tables[1]).getAllByRole('columnheader');
    const expectedHeaders = [
      'Last Modified',
      'Last Modified By',
      'Reason',
      'Order Number',
      'Source System',
    ];
    expectedHeaders.forEach((text, idx) => {
      expect(extraTableHeaders[idx]).toHaveTextContent(text);
    });

    const enterpriseHeaders = within(tables[2]).getAllByRole('columnheader');
    const enterpriseExpected = [
      'Enterprise Name',
      'Data Sharing Consent Provided',
      'Data Sharing Consent Required',
      'License',
      'License Revoked',
    ];
    enterpriseExpected.forEach((text, idx) => {
      expect(enterpriseHeaders[idx]).toHaveTextContent(text);
    });

    fireEvent.click(expandBtns[0]);
    expect(expandBtns[0].querySelector('svg')).toHaveClass('fa-plus');
  });

  it('Enterprise course enrollments table is not rendered if no enterprise enrollments', async () => {
    getConfig.mockReturnValue({
      ECOMMERCE_BASE_URL: 'http://example.com',
      COMMERCE_COORDINATOR_ORDER_DETAILS_URL: null,
    });

    const mockEnrollments = [
      { ...enrollmentsData[0], enterpriseCourseEnrollments: [] },
      { ...enrollmentsData[0], enterpriseCourseEnrollments: undefined },
    ];

    jest.spyOn(api, 'getEnrollments').mockResolvedValueOnce(mockEnrollments);
    renderWithProviders(props);

    const expandBtns = await screen.findAllByTitle('Toggle Row Expanded');
    expect(expandBtns.length).toBeGreaterThan(0);

    fireEvent.click(expandBtns[0]);

    const extraTables = screen.queryAllByTestId('extra-data-table');
    expect(extraTables.length).toBe(0);
  });

  it('Expand all button shows extra data for all enrollments', async () => {
    jest.spyOn(api, 'getEnrollments').mockResolvedValueOnce(enrollmentsData);
    renderWithProviders(props);

    const expandAllBtn = await screen.findByTitle('Toggle All Rows Expanded');
    expect(expandAllBtn).toBeInTheDocument();

    fireEvent.click(expandAllBtn);

    const firstExpand = screen.getAllByTitle('Toggle Row Expanded')[0];
    expect(firstExpand.querySelector('svg')).toHaveClass('fa-minus');

    fireEvent.click(expandAllBtn);
    expect(firstExpand.querySelector('svg')).toHaveClass('fa-plus');
  });

  it('Expand All and Collapse All', async () => {
    jest.spyOn(api, 'getEnrollments').mockResolvedValueOnce(enrollmentsData);
    renderWithProviders(props);

    const expandAllBtn = await screen.findByTitle('Toggle All Rows Expanded');
    expect(expandAllBtn).toBeInTheDocument();

    fireEvent.click(expandAllBtn);
    expect(expandAllBtn).toHaveTextContent(/collapse all/i);

    fireEvent.click(expandAllBtn);
    expect(expandAllBtn).toHaveTextContent(/expand all/i);
  });

  it('View Certificate action', async () => {
    jest.spyOn(api, 'getEnrollments').mockResolvedValueOnce(enrollmentsData);
    renderWithProviders(props);

    const allRows = await screen.findAllByRole('row');
    const firstDataRow = allRows[1];
    const courseName = within(firstDataRow).getAllByRole('cell')[2].textContent;

    const apiMock = jest
      .spyOn(api, 'getCertificate')
      .mockResolvedValueOnce({ courseKey: courseName });

    const dropdownBtn = within(firstDataRow).getByRole('button', {
      name: /actions/i,
    });
    fireEvent.click(dropdownBtn);

    const certificateLink = await within(firstDataRow).findByRole('button', {
      name: /view certificate/i,
    });
    fireEvent.click(certificateLink);

    const certificateModal = await screen.findByRole('dialog');
    expect(certificateModal).toHaveTextContent(courseName);

    const closeBtns = within(certificateModal).getAllByRole('button', {
      name: /close/i,
    });
    fireEvent.click(closeBtns[0]);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    apiMock.mockReset();
  });

  it('Filter enrollments on the basis of searchStr', async () => {
    jest.spyOn(api, 'getEnrollments').mockResolvedValueOnce(enrollmentsData);
    renderWithProviders({ ...props, searchStr: 'test123+2040' });

    await waitFor(() => {
      expect(screen.getByText(/Enrollments \(1\)/i)).toBeInTheDocument();
    });
  });
});
