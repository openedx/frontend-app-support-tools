import React from 'react';
import {
  fireEvent, render, waitFor, screen,
} from '@testing-library/react';
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

const apiDataMocks = () => {
  jest
    .spyOn(api, 'getLearnerCourseResetList')
    .mockImplementationOnce(() => Promise.resolve(expectedGetData));
  const postRequest = jest
    .spyOn(api, 'postCourseReset')
    .mockImplementationOnce(() => Promise.resolve(expectedPostData));

  return postRequest;
};

describe('CourseReset', () => {
  it('renders the component with the provided user prop', () => {
    const user = 'John Doe';
    const { getByText, getByTestId } = render(<CourseResetWrapper username={user} />);
    const container = getByTestId('course-reset-container');
    expect(container).toBeInTheDocument();
    expect(getByText(/Course Name/)).toBeInTheDocument();
    expect(getByText(/Status/)).toBeInTheDocument();
    expect(getByText(/Comment/)).toBeInTheDocument();
    expect(getByText(/Action/)).toBeInTheDocument();
  });

  it('clicks on the reset button and make a post request successfully', async () => {
    const postRequest = apiDataMocks();

    const user = 'John Doe';

    await waitFor(() => {
      render(<CourseResetWrapper username={user} />);
    });
    const btn = await screen.findByTestId('course-reset-button');
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
    render(<CourseResetWrapper username={user} />);

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
    const user = 'john';
    render(<CourseResetWrapper username={user} />);
    const alertText = screen.getByText(/An error occurred fetching course reset list for user/);
    expect(alertText).toBeInTheDocument();
  });

  it('returns an error when resetting a course', async () => {
    const user = 'John Doe';

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

    render(<CourseResetWrapper username={user} />);

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

  it('asserts different comment state', async () => {
    const postRequest = apiDataMocks();
    const user = 'John Doe';
    render(<CourseResetWrapper username={user} />);
    const resetButton = await screen.getByTestId('course-reset-container');
    await waitFor(() => fireEvent.click(resetButton));
    await waitFor(() => expect(screen.getByText(/Yes/)).toBeInTheDocument());

    // Get the comment textarea and make assertions
    const commentInput = screen.getByRole('textbox');
    expect(commentInput).toBeInTheDocument();

    // Assert that an error occurs when the characters length of comment text is more than 255
    fireEvent.change(commentInput, { target: { value: 'hello world'.repeat(200) } });
    expect(commentInput).toHaveValue('hello world'.repeat(200));
    const commentErrorText = screen.getByText('Maximum length allowed for comment is 255 characters');
    expect(commentErrorText).toBeInTheDocument();

    // check that no error occurs with comment length less than 256 characters
    fireEvent.change(commentInput, { target: { value: 'hello world' } });
    expect(commentInput).toHaveValue('hello world');
    const errorText = screen.queryByText('Maximum length allowed for comment is 255 characters');
    expect(errorText).not.toBeInTheDocument();

    fireEvent.click(screen.getByText(/Yes/));

    await waitFor(() => expect(postRequest).toHaveBeenCalled());
  });
});
