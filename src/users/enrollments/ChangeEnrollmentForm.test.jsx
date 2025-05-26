import {
  fireEvent, render, screen, waitFor,
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
    it.skip('Successful form submission', async () => {
      const apiMock = jest.spyOn(api, 'patchEnrollment').mockImplementationOnce(() => Promise.resolve({}));
      expect(apiMock).toHaveBeenCalledTimes(0);

      fireEvent.change(document.querySelector('select#reason'), { target: { value: 'Other' } });
      fireEvent.change(document.querySelector('select#mode'), { target: { value: 'verified' } });
      fireEvent.change(document.querySelector('textarea#comments'), { target: { value: 'test mode change' } });
      expect(document.querySelector('div.spinner-border')).not.toBeInTheDocument();
      let submitButton = document.querySelector('button.btn-primary');
      await waitFor(() => {
        fireEvent.click(submitButton);
      });
      expect(document.querySelector('div.spinner-border')).toBeInTheDocument();
      expect(apiMock).toHaveBeenCalledTimes(1);

      await waitFor(() => {
        expect(changeEnrollmentFormData.changeHandler).toHaveBeenCalledTimes(1);
        expect(document.querySelector('div.spinner-border')).not.toBeInTheDocument();
      });

      apiMock.mockReset();
      submitButton = document.querySelector('button.btn-primary');
      expect(submitButton).not.toBeInTheDocument();
    });

    it.skip('Unsuccessful form submission', async () => {
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

      fireEvent.change(document.querySelector('select#reason'), { target: { value: 'Other' } });
      fireEvent.change(document.querySelector('select#mode'), { target: { value: 'verified' } });
      fireEvent.change(document.querySelector('textarea#comments'), { target: { value: 'test mode change' } });
      fireEvent.click(document.querySelector('button.btn-primary'));

      expect(apiMock).toHaveBeenCalledTimes(1);
      await waitFor(() => expect(document.find('.alert').textContent).toEqual('Error changing enrollment'));
    });
  });
});
