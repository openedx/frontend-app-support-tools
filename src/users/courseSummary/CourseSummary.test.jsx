import React from 'react';
import {
  render,
  screen,
  waitFor,
  within,
  fireEvent,
  cleanup,
} from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import UserMessagesProvider from '../../userMessages/UserMessagesProvider';
import * as api from '../data/api';
import CourseSummary from './CourseSummary';
import courseSummaryData from '../data/test/courseSummary';

const CourseSummaryWrapper = (props) => (
  <IntlProvider locale="en">
    <UserMessagesProvider>
      <CourseSummary {...props} />
    </UserMessagesProvider>
  </IntlProvider>
);

describe('Course Summary', () => {
  let apiMock;
  const props = {
    courseUUID: 'course-uuid',
    closeHandler: jest.fn(),
  };

  afterEach(() => {
    if (apiMock) {
      apiMock.mockRestore();
    }
    cleanup();
  });

  it('Default component render with Modal', async () => {
    apiMock = jest
      .spyOn(api, 'getCourseData')
      .mockResolvedValueOnce(courseSummaryData.courseData);

    render(<CourseSummaryWrapper {...props} />);

    const modal = await screen.findByRole('dialog');
    expect(modal).toBeInTheDocument();

    expect(
      within(modal).getByRole('heading', {
        name: /Course Summary: Test Course/i,
      }),
    ).toBeInTheDocument();

    const summaryTable = modal.querySelector('table.course-summary-table');
    expect(summaryTable).toBeInTheDocument();

    const summaryRows = within(summaryTable).getAllByRole('row');
    expect(summaryRows.length).toBeGreaterThan(1);

    const courseRunsTable = modal.querySelector('table.course-runs-table');
    expect(courseRunsTable).toBeInTheDocument();

    const courseRunRows = within(courseRunsTable).getAllByRole('row');
    expect(courseRunRows.length).toBe(3);

    const footer = modal.querySelector('.pgn__modal-footer');
    const closeBtn = within(footer).getByRole('button', { name: /Close/i });
    fireEvent.click(closeBtn);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('Missing Course Run Information', async () => {
    const courseData = { ...courseSummaryData.courseData, courseRuns: [] };
    const summaryData = { ...courseSummaryData, courseData };
    apiMock = jest
      .spyOn(api, 'getCourseData')
      .mockResolvedValueOnce(summaryData.courseData);

    render(<CourseSummaryWrapper {...props} />);

    await waitFor(() => {
      expect(
        screen.getByText(/No Course Runs available/i),
      ).toBeInTheDocument();
    });
  });

  it('Render loading page correctly', async () => {
    apiMock = jest
      .spyOn(api, 'getCourseData')
      .mockResolvedValueOnce(courseSummaryData.courseData);

    render(<CourseSummaryWrapper {...props} />);

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it('Course Summary Fetch Errors', async () => {
    apiMock = jest.spyOn(api, 'getCourseData').mockResolvedValueOnce({
      errors: [
        {
          code: null,
          dismissible: true,
          text: 'No Course Summary Data found',
          type: 'danger',
          topic: 'course-summary',
        },
      ],
    });

    render(<CourseSummaryWrapper {...props} />);

    const modal = await screen.findByRole('dialog');
    expect(modal).toBeInTheDocument();

    expect(
      within(modal).getByRole('heading', { name: /Course Summary/i }),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(
        within(modal).getByText(/No Course Summary Data found/i),
      ).toBeInTheDocument();
    });

    const footer = modal.querySelector('.pgn__modal-footer');
    const closeBtn = within(footer).getByRole('button', { name: /Close/i });
    fireEvent.click(closeBtn);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
