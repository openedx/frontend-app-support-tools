import {
  fireEvent, render, screen,
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
  let unmountComponent;
  let apiMock;
  const props = {
    courseUUID: 'course-uuid',
    closeHandler: jest.fn(() => {}),
  };

  beforeEach(async () => {
    apiMock = jest.spyOn(api, 'getCourseData').mockImplementationOnce(() => Promise.resolve(courseSummaryData.courseData));
    const { unmount } = render(<CourseSummaryWrapper {...props} />);
    unmountComponent = unmount;
  });

  afterEach(() => {
    apiMock.mockRestore();
    unmountComponent();
  });

  it('Default component render with Modal', async () => {
    const dataRows = document.querySelectorAll('table.course-summary-table tbody')[0].children;
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
  });

  it('Missing Course Run Information', async () => {
    const courseData = { ...courseSummaryData.courseData, courseRuns: [] };
    const summaryData = { ...courseSummaryData, courseData };
    apiMock = jest.spyOn(api, 'getCourseData').mockImplementationOnce(() => Promise.resolve(summaryData.courseData));
    render(<CourseSummaryWrapper {...props} />);
    expect(await screen.findByText('No Course Runs available')).toBeInTheDocument();
  });

  it('Render loading page correctly', async () => {
    apiMock = jest.spyOn(api, 'getCourseData').mockImplementationOnce(() => Promise.resolve(courseSummaryData.courseData));
    render(<CourseSummaryWrapper {...props} />);
    const loadingComponent = await screen.findByTestId('page-loading');
    expect(loadingComponent.textContent).toEqual('Loading');
  });

  it('Course Summary Fetch Errors', async () => {
    unmountComponent();
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
    render(<CourseSummaryWrapper {...props} />);
    const title = await screen.findByTestId('course-summary-modal-title');
    expect(title.textContent).toEqual('Course Summary');
    const alert = document.querySelector('.alert');
    expect(alert.textContent).toEqual('No Course Summary Data found');
  });
});
