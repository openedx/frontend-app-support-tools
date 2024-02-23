import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import CourseReset from './CourseReset';
import UserMessagesProvider from '../userMessages/UserMessagesProvider';

const CourseResetWrapper = (props) => (
  <IntlProvider locale="en">
    <UserMessagesProvider>
      <CourseReset {...props} />
    </UserMessagesProvider>
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

  it('clicks on the reset button', async () => {
    const user = 'John Doe';
    const screen = render(<CourseResetWrapper username={user} />);
    const btn = screen.queryAllByText(/Reset/);
    userEvent.click(btn[1]);
    await waitFor(() => {
      screen.debug(undefined, 300000000000);
      const submitButton = screen.getByText(/Yes/);
      userEvent.click(submitButton);
      expect(screen.getByText(/Yes/)).toBeInTheDocument();
    });

    userEvent.click(screen.queryByText(/Yes/));

    await waitFor(() => {
      expect(screen.queryByText(/Warning/)).not.toBeInTheDocument();
    });
    expect(screen).toBeTruthy();
  });
});
