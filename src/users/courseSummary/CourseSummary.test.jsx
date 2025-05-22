import {
  fireEvent, render, screen, waitFor,
} from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import CourseSummary from './CourseSummary';
import courseSummaryData from '../data/test/courseSummary';
import UserMessagesProvider from '../../userMessages/UserMessagesProvider';
import * as api from '../data/api';

const CourseSummaryWrapper = (props) => (
  <UserMessagesProvider>
    <CourseSummary {...props} />
  </UserMessagesProvider>
);

describe('Course Summary', () => {
  let apiMock;
  const props = {
    courseUUID: 'course-uuid',
    closeHandler: jest.fn(() => {}),
  };

  beforeEach(async () => {
    apiMock = jest.spyOn(api, 'getCourseData').mockImplementationOnce(() => Promise.resolve(courseSummaryData.courseData));
  });

  afterEach(() => {
    apiMock.mockRestore();
  });

  it('Default component render with Modal', async () => {
    const { unmount } = render(<CourseSummaryWrapper {...props} />);
    const dataRows = (await screen.findByTestId('course-summary-table-body')).children;
    expect(dataRows.length).toEqual(5);

    let courseSummaryModal = await screen.findByTestId('course-summary-info');
    expect(courseSummaryModal).toBeInTheDocument();
    const title = await screen.findByTestId('course-summary-modal-title');
    expect(title.textContent).toEqual('Course Summary: Test Course');

    const courseRunsTable = await screen.findByTestId('course-runs-table');
    expect(courseRunsTable.querySelector('tbody').querySelectorAll('tr').length).toEqual(2);

    const closeButton = await screen.findByTestId('course-summary-modal-close-button');
    fireEvent.click(closeButton);
    courseSummaryModal = await screen.queryByTestId('course-summary-info');
    expect(courseSummaryModal).not.toBeInTheDocument();
    unmount();
  });

  it('Missing Course Run Information', async () => {
    const { unmount } = await render(<CourseSummaryWrapper {...props} />);
    const courseData = { ...courseSummaryData.courseData, courseRuns: [] };
    const summaryData = { ...courseSummaryData, courseData };
    apiMock = jest.spyOn(api, 'getCourseData').mockImplementationOnce(() => Promise.resolve(summaryData.courseData));
    render(<CourseSummaryWrapper {...props} />);
    expect(await screen.findByText('No Course Runs available')).toBeInTheDocument();
    unmount();
  });

  it('Render loading page correctly', async () => {
    const { unmount } = render(<CourseSummaryWrapper {...props} />);
    apiMock = jest.spyOn(api, 'getCourseData').mockImplementationOnce(() => Promise.resolve(courseSummaryData.courseData));
    await waitFor(() => render(<CourseSummaryWrapper {...props} />));
    const loadingComponent = await screen.findByTestId('page-loading');
    expect(loadingComponent.textContent).toEqual('Loading');
    unmount();
  });

  it('Course Summary Fetch Errors', async () => {
    apiMock = jest.spyOn(api, 'getCourseData').mockImplementationOnce(() => Promise.resolve({
      errors: [
        {
          code: null,
          dismissible: true,
          text: 'No Course Summary Data found',
          type: 'danger',
          topic: 'course-summary',
        },
      ],
    }));
    const { unmount } = await waitFor(() => render(<CourseSummaryWrapper {...props} />));
    const title = await screen.findByTestId('course-summary-modal-title');
    expect(title.textContent).toEqual('Course Summary');
    const alert = await screen.findByTestId('alert');
    expect(alert.textContent).toEqual('No Course Summary Data found');
    unmount();
  });
});
