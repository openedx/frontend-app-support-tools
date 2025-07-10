import {
  fireEvent, render, screen, waitFor, act,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

import ChangeEnrollmentForm from './ChangeEnrollmentForm';
import { changeEnrollmentFormData } from '../data/test/enrollments';
import UserMessagesProvider from '../../userMessages/UserMessagesProvider';
import * as api from '../data/api';

const EnrollmentFormWrapper = (props) => (
  <UserMessagesProvider>
    <ChangeEnrollmentForm {...props} />
  </UserMessagesProvider>
);

describe('Enrollment Change form', () => {
  let unmountComponent;

  beforeEach(() => {
    const { unmount } = render(<EnrollmentFormWrapper {...changeEnrollmentFormData} />);
    unmountComponent = unmount;
  });

  afterEach(() => {
    unmountComponent();
  });

  it('Default form rendering', async () => {
    let changeFormModal = await screen.findByTestId('change-enrollment-form');
    expect(changeFormModal).toBeInTheDocument();
    const modeSelectionDropdown = document.querySelector('select#mode');
    const modeChangeReasonDropdown = document.querySelector('select#reason');
    const commentsTextarea = document.querySelector('textarea#comments');
    expect(modeSelectionDropdown.querySelectorAll('option')).toHaveLength(2);
    expect(modeChangeReasonDropdown.querySelectorAll('option')).toHaveLength(5);
    expect(commentsTextarea.textContent).toEqual('');

    const closeButton = await screen.findByTestId('close-button-change-enrollment-modal');
    fireEvent.click(closeButton);
    changeFormModal = await screen.queryByTestId('change-enrollment-form');
    expect(changeFormModal).not.toBeInTheDocument();
  });

  describe('Form submission', () => {
    it('Successful form submission', async () => {
      const apiMock = jest.spyOn(api, 'patchEnrollment').mockImplementationOnce(() => Promise.resolve({}));
      expect(apiMock).toHaveBeenCalledTimes(0);

      // Use user events for better simulation
      const reasonSelect = document.querySelector('select#reason');
      const modeSelect = document.querySelector('select#mode');
      const commentsTextarea = document.querySelector('textarea#comments');

      // Fire change events with proper values
      fireEvent.change(reasonSelect, { target: { value: 'other' } });
      fireEvent.change(modeSelect, { target: { value: 'verified' } });
      fireEvent.change(commentsTextarea, { target: { value: 'test mode change' } });

      // Wait for form state to update
      await waitFor(() => {
        const submitButton = document.querySelector('button.btn-primary');
        expect(submitButton).not.toBeDisabled();
      });

      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
      let submitButton = document.querySelector('button.btn-primary');

      await act(async () => {
        fireEvent.click(submitButton);
      });

      expect(apiMock).toHaveBeenCalledTimes(1);

      await waitFor(() => {
        expect(changeEnrollmentFormData.changeHandler).toHaveBeenCalledTimes(1);
        expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
      });

      apiMock.mockReset();
      // Check that the Submit button is hidden after successful submission
      const submitButtonAfterSuccess = screen.queryByText('Submit');
      expect(submitButtonAfterSuccess).toHaveAttribute('hidden');
    });

    it('Unsuccessful form submission', async () => {
      const apiMock = jest.spyOn(api, 'patchEnrollment').mockImplementationOnce(() => Promise.resolve({
        errors: [
          {
            code: null,
            dismissible: true,
            text: 'Error changing enrollment',
            type: 'danger',
            topic: 'changeEnrollments',
          },
        ],
      }));
      expect(apiMock).toHaveBeenCalledTimes(0);

      const reasonSelect = document.querySelector('select#reason');
      const modeSelect = document.querySelector('select#mode');
      const commentsTextarea = document.querySelector('textarea#comments');

      fireEvent.change(reasonSelect, { target: { value: 'other' } });
      fireEvent.change(modeSelect, { target: { value: 'verified' } });
      fireEvent.change(commentsTextarea, { target: { value: 'test mode change' } });

      // Wait for form state to update
      await waitFor(() => {
        const submitButton = document.querySelector('button.btn-primary');
        expect(submitButton).not.toBeDisabled();
      });

      await act(async () => {
        fireEvent.click(document.querySelector('button.btn-primary'));
      });

      expect(apiMock).toHaveBeenCalledTimes(1);
      await waitFor(() => expect(screen.getByText('Error changing enrollment')).toBeInTheDocument());
    });
  });
});
