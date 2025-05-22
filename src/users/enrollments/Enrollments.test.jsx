import {
  fireEvent, render, screen,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
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

const EnrollmentPageWrapper = (props) => (
  <UserMessagesProvider>
    <Enrollments {...props} />
  </UserMessagesProvider>
);

describe('Course Enrollments Listing', () => {
  let unmountComponent;
  const props = {
    user: 'edX',
    changeHandler: jest.fn(() => {}),
  };

  beforeEach(async () => {
    jest.spyOn(api, 'getEnrollments').mockImplementationOnce(() => Promise.resolve(enrollmentsData));
    const { unmount } = render(<EnrollmentPageWrapper {...props} />);
    unmountComponent = unmount;
  });

  afterEach(() => {
    unmountComponent();
  });

  it('default enrollment data', async () => {
    const componentHeader = await screen.findByTestId('enrollments-heading3');
    expect(componentHeader.textContent).toEqual('Enrollments (2)');
  });

  it('No Enrollment Data', async () => {
    unmountComponent();
    jest.spyOn(api, 'getEnrollments').mockImplementationOnce(() => Promise.resolve([]));
    render(<EnrollmentPageWrapper {...props} />);
    const componentHeader = await screen.findByTestId('enrollments-heading3');
    expect(componentHeader.textContent).toEqual('Enrollments (0)');
  });

  it('Error fetching enrollments', async () => {
    unmountComponent();
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
    jest.spyOn(api, 'getEnrollments').mockImplementationOnce(() => Promise.resolve(enrollmentErrors));
    render(<EnrollmentPageWrapper {...props} />);

    const alert = await screen.findByTestId('alert');
    expect(alert.textContent).toEqual(enrollmentErrors.errors[0].text);
  });

  it('Enrollment create form is rendered', async () => {
    const createEnrollmentButton = await screen.findByTestId('create-enrollment-button');
    fireEvent.click(createEnrollmentButton);
    let createFormModal = await screen.findByTestId('create-enrollment-form');
    const ModalTitle = await screen.findByTestId('create-enrollment-form-heading');
    // Separately inspecting Modal components
    expect(ModalTitle.textContent).toEqual('Create New Enrollment');
    expect(createFormModal).toBeInTheDocument();

    const closeButton = await screen.findByTestId('close-button-create-enrollment-modal');
    fireEvent.click(closeButton);
    createFormModal = await screen.queryByTestId('create-enrollment-form');
    expect(createFormModal).not.toBeInTheDocument();
  });

  it('Enrollment change form is rendered for individual enrollment', async () => {
    let dataRow = document.querySelectorAll('table tbody tr')[0];
    const courseId = dataRow.querySelectorAll('td')[1].textContent;
    fireEvent.click(dataRow.querySelector('.dropdown button'));
    // eslint-disable-next-line prefer-destructuring
    dataRow = document.querySelectorAll('table tbody tr')[0];
    fireEvent.click(dataRow.querySelectorAll('.dropdown-menu.show a')[0]);

    const changeFormModal = await screen.findByTestId('change-enrollment-form');
    expect(changeFormModal.textContent).toContain(courseId);
    expect(changeFormModal).toBeInTheDocument();

    const button = await screen.findByTestId('close-button-change-enrollment-modal');
    fireEvent.click(button);
    expect(await screen.queryByTestId('change-enrollment-form')).not.toBeInTheDocument();
  });

  it('Enrollment extra data and enterprise course enrollments are rendered for individual enrollment', () => {
    let expandable = document.querySelectorAll('table tbody tr')[0].querySelectorAll('td div span')[0];
    expect(expandable.innerHTML).toContain('plus');

    fireEvent.click(expandable);

    // eslint-disable-next-line prefer-destructuring
    expandable = document.querySelectorAll('table tbody tr')[0].querySelectorAll('td div span')[0];
    expect(expandable.innerHTML).toContain('minus');

    const extraTables = document.querySelectorAll('table tbody tr')[1].querySelectorAll('table');
    expect(extraTables.length).toEqual(2);

    const extraDataTable = extraTables[0];
    const extraTableHeaders = extraDataTable.querySelectorAll('thead tr th');
    expect(extraTableHeaders.length).toEqual(5);
    ['Last Modified', 'Last Modified By', 'Reason', 'Order Number', 'Source System'].forEach((expectedHeader, index) => expect(
      extraTableHeaders[index].textContent,
    ).toEqual(expectedHeader));

    const enterpriseCourseEnrollmentsTable = extraTables[1];
    const enterpriseCourseEnrollmentsTableHeaders = enterpriseCourseEnrollmentsTable.querySelectorAll('thead tr th');
    expect(enterpriseCourseEnrollmentsTableHeaders.length).toEqual(5);

    ['Enterprise Name', 'Data Sharing Consent Provided', 'Data Sharing Consent Required', 'License', 'License Revoked'].forEach(
      (expectedHeader, index) => expect(
        enterpriseCourseEnrollmentsTableHeaders[index].textContent,
      ).toEqual(expectedHeader),
    );

    fireEvent.click(expandable);

    // eslint-disable-next-line prefer-destructuring
    expandable = document.querySelectorAll('table tbody tr')[0].querySelectorAll('td div span')[0];
    expect(expandable.innerHTML).toContain('plus');
  });

  it('Enterprise course enrollments table is not rendered if are no enterprise course enrollments', async () => {
    unmountComponent();
    getConfig.mockReturnValue({
      ECOMMERCE_BASE_URL: 'http://example.com',
      COMMERCE_COORDINATOR_ORDER_DETAILS_URL: null,
    });
    const mockEnrollments = [{
      ...enrollmentsData[0],
      enterpriseCourseEnrollments: [],
    },
    {
      ...enrollmentsData[0],
      enterpriseCourseEnrollments: undefined,
    }];

    jest.spyOn(api, 'getEnrollments').mockImplementationOnce(() => Promise.resolve(mockEnrollments));

    await render(<EnrollmentPageWrapper {...props} />);

    mockEnrollments.forEach((_, index) => {
      const expandable = document.querySelectorAll('table tbody tr')[index].querySelectorAll('td div span')[0];
      fireEvent.click(expandable);

      const extraTables = document.querySelectorAll('table tbody tr')[1].querySelectorAll('table');
      expect(extraTables.length).toEqual(1);

      const extraDataTable = extraTables[0];
      const extraTableHeaders = extraDataTable.querySelectorAll('thead tr th');
      expect(extraTableHeaders.length).toEqual(5);
      ['Last Modified', 'Last Modified By', 'Reason', 'Order Number', 'Source System'].forEach((expectedHeader, idx) => expect(
        extraTableHeaders[idx].textContent,
      ).toEqual(expectedHeader));
    });
  });

  it('Expand all button shows extra data for all enrollments', () => {
    let expandable = document.querySelectorAll('table tbody tr')[0].querySelectorAll('td div span');
    expect(expandable[0].innerHTML).toContain('plus');

    const expandAll = document.querySelectorAll('table thead tr th a')[0];
    fireEvent.click(expandAll);

    expandable = document.querySelectorAll('table tbody tr')[0].querySelectorAll('td div span');
    expect(expandable[0].innerHTML).toContain('minus');
    fireEvent.click(expandAll);

    expandable = document.querySelectorAll('table tbody tr')[0].querySelectorAll('td div span');
    expect(expandable[0].innerHTML).toContain('plus');
  });

  it('Expand All and Collapse All', () => {
    let expandAll = document.querySelector('table thead tr th a.link-primary');
    expect(expandAll.textContent).toEqual('Expand All');
    fireEvent.click(expandAll);

    expandAll = document.querySelector('table thead tr th a.link-primary');
    expect(expandAll.textContent).toEqual('Collapse All');
    fireEvent.click(expandAll);

    expandAll = document.querySelector('table thead tr th a.link-primary');
    expect(expandAll.textContent).toEqual('Expand All');
  });

  it('View Certificate action', async () => {
    /**
     * Testing the certificate fetch on first row only. Async painting in the loop was causing
     * the test to pass data across the loop, causing inconsistent behavior..
     */
    let dataRow = document.querySelectorAll('table tbody tr')[0];
    const courseName = dataRow.querySelectorAll('td')[2].textContent;
    const apiMock = jest.spyOn(api, 'getCertificate').mockImplementationOnce(() => Promise.resolve({ courseKey: courseName }));
    fireEvent.click(dataRow.querySelector('.dropdown button'));
    // eslint-disable-next-line prefer-destructuring
    dataRow = document.querySelectorAll('table tbody tr')[0];
    fireEvent.click(dataRow.querySelectorAll('.dropdown-menu.show a')[1]);

    const certificates = await screen.findByTestId('certificates');
    expect(certificates.textContent).toContain(courseName);

    expect(apiMock).toHaveBeenCalledTimes(1);
    fireEvent.click(await screen.findByTestId('certificates-btn-link'));
    expect(await screen.queryByTestId('certificates')).not.toBeInTheDocument();

    apiMock.mockReset();
  });

  it('Filter enrollments on the basis of searchStr', async () => {
    unmountComponent();
    jest.spyOn(api, 'getEnrollments').mockImplementationOnce(() => Promise.resolve(enrollmentsData));
    render(<EnrollmentPageWrapper searchStr="test123+2040" {...props} />);
    const componentHeader = await screen.findByTestId('enrollments-heading3');
    expect(componentHeader.textContent).toEqual('Enrollments (1)');
  });
});
