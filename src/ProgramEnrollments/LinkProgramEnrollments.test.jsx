import { fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import LinkProgramEnrollments from './LinkProgramEnrollments';
import UserMessagesProvider from '../userMessages/UserMessagesProvider';
import {
  lpeSuccessResponse,
  lpeErrorResponseInvalidUUID,
  lpeErrorResponseEmptyValues,
  lpeErrorResponseInvalidUsername,
  lpeErrorResponseInvalidExternalKey,
  lpeErrorResponseAlreadyLinked,
} from './data/test/linkProgramEnrollment';

import * as api from './data/api';

const LinkProgramEnrollmentsWrapper = (props) => (
  <MemoryRouter>
    <UserMessagesProvider>
      <LinkProgramEnrollments {...props} />
    </UserMessagesProvider>
  </MemoryRouter>
);

describe('Link Program Enrollments', () => {
  let apiMock;
  const data = {
    programID: '8bee627e-d85e-4a76-be41-d58921da666e',
    usernamePairText: 'testuser,verified',
  };

  beforeEach(() => {
    if (apiMock) {
      apiMock.mockReset();
    }
  });

  it('default page render', async () => {
    render(<LinkProgramEnrollmentsWrapper />);

    const programIdInput = document.querySelector("input[name='programUUID']");
    const usernamePairInput = document.querySelector("textarea[name='usernamePairText']");
    const submitButton = document.querySelector('button.btn-primary');

    expect(programIdInput.defaultValue).toEqual('');
    expect(usernamePairInput.defaultValue).toEqual('');
    expect(submitButton.textContent).toEqual('Submit');
  });

  it('valid search value', async () => {
    apiMock = jest
      .spyOn(api, 'default')
      .mockImplementationOnce(() => Promise.resolve(lpeSuccessResponse));

    render(<LinkProgramEnrollmentsWrapper />);

    document.querySelector('input[name="programUUID"]').value = data.programID;
    document.querySelector('textarea[name="usernamePairText"]').value = data.usernamePairText;
    fireEvent.click(document.querySelector('button.btn-primary'));

    expect(apiMock).toHaveBeenCalledTimes(1);
  });

  it('api call made on each click', async () => {
    apiMock = jest
      .spyOn(api, 'default')
      .mockImplementation(() => Promise.resolve(lpeSuccessResponse));

    render(<LinkProgramEnrollmentsWrapper />);

    document.querySelector('input[name="programUUID"]').value = data.programID;
    document.querySelector('textarea[name="usernamePairText"]').value = data.usernamePairText;
    fireEvent.click(document.querySelector('button.btn-primary'));

    await waitFor(() => {
      expect(apiMock).toHaveBeenCalledTimes(1);

      fireEvent.click(document.querySelector('button.btn-primary'));
      expect(apiMock).toHaveBeenCalledTimes(2);
    });
  });

  it('empty search value yields error response', async () => {
    apiMock = jest
      .spyOn(api, 'default')
      .mockImplementationOnce(() => Promise.resolve(lpeErrorResponseEmptyValues));
    render(<LinkProgramEnrollmentsWrapper />);

    document.querySelector('input[name="programUUID"]').value = '';
    document.querySelector('textarea[name="usernamePairText"]').value = '';
    fireEvent.click(document.querySelector('button.btn-primary'));

    expect(apiMock).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(document.querySelector('.error-message')).toBeInTheDocument();
      expect(document.querySelector('.success-message')).not.toBeInTheDocument();
    });
  });

  it('Invalid Program UUID value', async () => {
    apiMock = jest
      .spyOn(api, 'default')
      .mockImplementationOnce(() => Promise.resolve(lpeErrorResponseInvalidUUID));
    render(<LinkProgramEnrollmentsWrapper />);

    document.querySelector('input[name="programUUID"]').value = data.programID;
    document.querySelector('textarea[name="usernamePairText"]').value = data.usernamePairText;
    fireEvent.click(document.querySelector('button.btn-primary'));

    await waitFor(() => {
      expect(apiMock).toHaveBeenCalledTimes(1);
      expect(document.querySelector('.error-message')).toBeInTheDocument();
      expect(document.querySelector('.success-message')).not.toBeInTheDocument();
    });
  });

  it('Invalid Username value', async () => {
    apiMock = jest
      .spyOn(api, 'default')
      .mockImplementationOnce(() => Promise.resolve(lpeErrorResponseInvalidUsername));
    render(<LinkProgramEnrollmentsWrapper />);

    document.querySelector('input[name="programUUID"]').value = data.programID;
    document.querySelector('textarea[name="usernamePairText"]').value = data.usernamePairText;
    fireEvent.click(document.querySelector('button.btn-primary'));

    await waitFor(() => {
      expect(apiMock).toHaveBeenCalledTimes(1);
      expect(document.querySelector('.error-message')).toBeInTheDocument();
      expect(document.querySelector('.success-message')).not.toBeInTheDocument();
    });
  });

  it('Invalid External User Key value', async () => {
    apiMock = jest
      .spyOn(api, 'default')
      .mockImplementationOnce(() => Promise.resolve(lpeErrorResponseInvalidExternalKey));
    render(<LinkProgramEnrollmentsWrapper />);

    document.querySelector('input[name="programUUID"]').value = data.programID;
    document.querySelector('textarea[name="usernamePairText"]').value = data.usernamePairText;
    fireEvent.click(document.querySelector('button.btn-primary'));

    expect(apiMock).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(document.querySelector('.error-message')).toBeInTheDocument();
      expect(document.querySelector('.success-message')).not.toBeInTheDocument();
    });
  });

  it('Program Already Linked', async () => {
    apiMock = jest
      .spyOn(api, 'default')
      .mockImplementationOnce(() => Promise.resolve(lpeErrorResponseAlreadyLinked));
    render(<LinkProgramEnrollmentsWrapper />);

    document.querySelector('input[name="programUUID"]').value = data.programID;
    document.querySelector('textarea[name="usernamePairText"]').value = data.usernamePairText;
    fireEvent.click(document.querySelector('button.btn-primary'));

    expect(apiMock).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(document.querySelector('.error-message')).toBeInTheDocument();
      expect(document.querySelector('.success-message')).not.toBeInTheDocument();
    });
  });
});
