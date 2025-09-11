import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import CreateEnrollmentForm from './CreateEnrollmentForm';
import { createEnrollmentFormData } from '../data/test/enrollments';
import UserMessagesProvider from '../../userMessages/UserMessagesProvider';
import * as api from '../data/api';

const EnrollmentFormWrapper = (props) => (
  <IntlProvider locale="en">
    <UserMessagesProvider>
      <CreateEnrollmentForm {...props} />
    </UserMessagesProvider>
  </IntlProvider>
);

describe('Enrollment Create form', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    cleanup();
  });

  it('Default form rendering', () => {
    render(<EnrollmentFormWrapper {...createEnrollmentFormData} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/course run id/i)).toBeInTheDocument();
    expect(screen.getAllByRole('combobox')[0]).toBeInTheDocument(); // mode
    expect(screen.getAllByRole('combobox')[1]).toBeInTheDocument(); // reason
    expect(screen.getByPlaceholderText(/explanation/i)).toBeInTheDocument();
  });

  it('Successful form submission', async () => {
    const apiMock = jest.spyOn(api, 'postEnrollment').mockResolvedValueOnce({});

    render(<EnrollmentFormWrapper {...createEnrollmentFormData} />);

    fireEvent.change(screen.getByPlaceholderText(/course run id/i), {
      target: { value: 'course-v1:testX+test123+2030' },
    });

    fireEvent.change(screen.getAllByRole('combobox')[1], { target: { value: 'other' } }); // reason
    fireEvent.change(screen.getAllByRole('combobox')[0], { target: { value: 'verified' } }); // mode

    fireEvent.change(screen.getByPlaceholderText(/explanation/i), {
      target: { value: 'test create enrollment' },
    });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => expect(apiMock).toHaveBeenCalledTimes(1));
    await waitFor(() => {
      expect(screen.getByText(/new enrollment successfully created/i)).toBeInTheDocument();
    });
  });

  it('Unsuccessful form submission', async () => {
    const apiMock = jest.spyOn(api, 'postEnrollment').mockResolvedValueOnce({
      errors: [
        {
          code: null,
          dismissible: true,
          text: 'Error creating enrollment',
          type: 'danger',
          topic: 'createEnrollments',
        },
      ],
    });

    render(<EnrollmentFormWrapper {...createEnrollmentFormData} />);

    fireEvent.change(screen.getByPlaceholderText(/course run id/i), {
      target: { value: 'course-v1:testX+test123+2030' },
    });

    fireEvent.change(screen.getAllByRole('combobox')[1], { target: { value: 'other' } }); // reason
    fireEvent.change(screen.getAllByRole('combobox')[0], { target: { value: 'verified' } }); // mode

    fireEvent.change(screen.getByPlaceholderText(/explanation/i), {
      target: { value: 'test create enrollment' },
    });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => expect(apiMock).toHaveBeenCalledTimes(1));
    await waitFor(() => {
      expect(screen.getByText(/error creating enrollment/i)).toBeInTheDocument();
    });
  });
});
