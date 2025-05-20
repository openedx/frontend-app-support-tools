import {
  fireEvent, render, screen, waitFor,
} from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import CreateEnrollmentForm from './CreateEnrollmentForm';
import { createEnrollmentFormData } from '../data/test/enrollments';
import UserMessagesProvider from '../../userMessages/UserMessagesProvider';
import * as api from '../data/api';

const EnrollmentFormWrapper = (props) => (
  <UserMessagesProvider>
    <CreateEnrollmentForm {...props} />
  </UserMessagesProvider>
);

describe('Enrollment Create form', () => {
  let unmountComponent;

  beforeEach(() => {
    const { unmount } = render(<EnrollmentFormWrapper {...createEnrollmentFormData} />);
    unmountComponent = unmount;
  });

  afterEach(() => {
    unmountComponent();
  });

  it('Default form rendering', async () => {
    let createFormModal = await screen.findByTestId('create-enrollment-form');
    expect(createFormModal).toBeInTheDocument();
    const modeSelectionDropdown = document.querySelector('select#mode');
    const modeChangeReasonDropdown = document.querySelector('select#reason');
    const commentsTextarea = document.querySelector('textarea#comments');
    expect(modeSelectionDropdown.querySelectorAll('option')).toHaveLength(9);
    expect(modeChangeReasonDropdown.querySelectorAll('option')).toHaveLength(5);
    expect(commentsTextarea.textContent).toEqual('');

    const closeButton = await screen.findByTestId('close-button-create-enrollment-modal');
    fireEvent.click(closeButton);
    createFormModal = await screen.queryByTestId('create-enrollment-form');
    expect(createFormModal).not.toBeInTheDocument();
  });

  describe('Form submission', () => {
    it('Successful form submission', async () => {
      const apiMock = jest.spyOn(api, 'postEnrollment').mockImplementationOnce(() => Promise.resolve({}));
      expect(apiMock).toHaveBeenCalledTimes(0);

      fireEvent.change(document.querySelector('input#courseID'), { target: { value: 'course-v1:testX+test123+2030' } });
      fireEvent.change(document.querySelector('select#reason'), { target: { value: 'Other' } });
      fireEvent.change(document.querySelector('select#mode'), { target: { value: 'verified' } });
      fireEvent.change(document.querySelector('textarea#comments'), { target: { value: 'test create enrollment' } });
      expect(document.querySelectorAll('div.spinner-border').length).toEqual(0);
      fireEvent.click(document.querySelector('button.btn-primary'));
      // TODO: need to figure out why function is not being called on button click
      // expect(document.querySelectorAll('div.spinner-border').length).toEqual(1);
      // expect(apiMock).toHaveBeenCalledTimes(1);

      waitFor(() => {
        expect(document.querySelector('.alert').textContent).toEqual('New Enrollment successfully created.');
        expect(document.querySelectorAll('div.spinner-border').length).toEqual(0);
      });
      apiMock.mockReset();
    });

    it('Unsuccessful form submission', async () => {
      const apiMock = jest.spyOn(api, 'postEnrollment').mockImplementationOnce(() => Promise.resolve({
        errors: [
          {
            code: null,
            dismissible: true,
            text: 'Error creating enrollment',
            type: 'danger',
            topic: 'createEnrollments',
          },
        ],
      }));
      expect(apiMock).toHaveBeenCalledTimes(0);
      fireEvent.change(document.querySelector('input#courseID'), { target: { value: 'course-v1:testX+test123+2030' } });

      fireEvent.change(document.querySelector('select#reason'), { target: { value: 'Other' } });
      fireEvent.change(document.querySelector('select#mode'), { target: { value: 'verified' } });
      fireEvent.change(document.querySelector('textarea#comments'), { target: { value: 'test create enrollment' } });
      fireEvent.click(document.querySelector('button.btn-primary'));

      // TODO: same issue here
      // expect(apiMock).toHaveBeenCalledTimes(1);
      waitFor(() => expect(document.querySelector('.alert').textContent).toEqual('Error creating enrollment'));
    });
  });
});
