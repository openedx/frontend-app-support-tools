import React from 'react';
import { act, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import CourseReset from './CourseReset';
import * as api from './data/api';
import { expectedGetData, expectedPostData } from './data/test/courseReset';

const CourseResetWrapper = (props) => (
  <IntlProvider locale="en">
    <CourseReset {...props} />
  </IntlProvider>
);

describe('CourseReset', () => {
  it('renders the component with the provided user prop', () => {
    const user = 'John Doe';
    const screen = render(<CourseResetWrapper username={user} />);
    const container = screen.getByTestId('course-reset-container');
    expect(screen).toBeTruthy();
    expect(container).toBeInTheDocument();
  });

  it('clicks on the reset button and make a post request successfully', async () => {
    jest
      .spyOn(api, 'getLearnerCourseResetList')
      .mockImplementationOnce(() => Promise.resolve(expectedGetData));
    const postRequest = jest
      .spyOn(api, 'postCourseReset')
      .mockImplementationOnce(() => Promise.resolve(expectedPostData));

    const user = 'John Doe';
    let screen;

    await waitFor(() => {
      screen = render(<CourseResetWrapper username={user} />);
    });
    const btn = screen.getByText('Reset', { selector: 'button' });
    userEvent.click(btn);
    await waitFor(() => {
      const submitButton = screen.getByText(/Yes/);
      userEvent.click(submitButton);
      expect(screen.getByText(/Yes/)).toBeInTheDocument();
    });

    userEvent.click(screen.queryByText(/Yes/));

    await waitFor(() => {
      expect(screen.queryByText(/Warning/)).not.toBeInTheDocument();
    });
    expect(postRequest).toHaveBeenCalled();
  });

  it('polls new data', async () => {
    jest.useFakeTimers();
    const data = [{
      course_id: 'course-v1:edX+DemoX+Demo_Course',
      display_name: 'Demonstration Course',
      can_reset: false,
      status: 'In progress - Created 2024-02-28 11:29:06.318091+00:00 by edx',
    }];

    const updatedData = [{
      course_id: 'course-v1:edX+DemoX+Demo_Course',
      display_name: 'Demonstration Course',
      can_reset: false,
      status: 'Completed by Support 2024-02-28 11:29:06.318091+00:00 by edx',
    }];

    jest
      .spyOn(api, 'getLearnerCourseResetList')
      .mockImplementationOnce(() => Promise.resolve(data))
      .mockImplementationOnce(() => Promise.resolve(updatedData));
    const user = 'John Doe';
    let screen;
    await act(async () => {
      screen = render(<CourseResetWrapper username={user} />);
    });

    const inProgressText = screen.getByText(/in progress/i);
    expect(inProgressText).toBeInTheDocument();

    jest.advanceTimersByTime(10000);

    const completedText = await screen.findByText(/Completed by/i);
    expect(completedText).toBeInTheDocument();
  });

  it('returns an empty table if it cannot fetch course reset list', async () => {
    jest
      .spyOn(api, 'getLearnerCourseResetList')
      .mockResolvedValueOnce({
        errors: [
          {
            code: null,
            dismissible: true,
            text: 'An error occurred fetching course reset list for user',
            type: 'danger',
          },
        ],
      });

    let screen;
    const user = 'john';
    await act(async () => {
      screen = render(<CourseResetWrapper username={user} />);
    });
    const alertText = screen.getByText(/An error occurred fetching course reset list for user/);
    expect(alertText).toBeInTheDocument();
  });

  it('returns an error when resetting a course', async () => {
    const user = 'John Doe';
    let screen;

    jest.spyOn(api, 'getLearnerCourseResetList').mockResolvedValueOnce(expectedGetData);
    jest
      .spyOn(api, 'postCourseReset')
      .mockResolvedValueOnce({
        errors: [
          {
            code: null,
            dismissible: true,
            text: 'An error occurred resetting course for user',
            type: 'danger',
            topic: 'credentials',
          },
        ],
      });

    await act(async () => {
      screen = render(<CourseResetWrapper username={user} />);
    });

    await waitFor(() => {
      const btn = screen.getByText('Reset', { selector: 'button' });
      userEvent.click(btn);
    });

    await waitFor(() => {
      const submitButton = screen.getByText(/Yes/);
      userEvent.click(submitButton);
      expect(screen.getByText(/Yes/)).toBeInTheDocument();
    });

    userEvent.click(screen.queryByText(/Yes/));

    await waitFor(() => {
      expect(screen.queryByText(/Warning/)).not.toBeInTheDocument();
    });

    expect(api.postCourseReset).toHaveBeenCalled();
    const alertText = screen.getByText(/An error occurred resetting course for user/);
    expect(alertText).toBeInTheDocument();
    const dismiss = screen.getByText(/dismiss/i);
    userEvent.click(dismiss);
    await waitFor(() => {
      expect(alertText).not.toBeInTheDocument();
    });
  });
});
