import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
  const data = {
    programID: '8bee627e-d85e-4a76-be41-d58921da666e',
    usernamePairText: 'testuser,verified',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('default page render', () => {
    render(<LinkProgramEnrollmentsWrapper />);
    expect(screen.getByRole('textbox', { name: /programUUID/i })).toHaveValue('');
    expect(screen.getByRole('textbox', { name: /usernamePairText/i })).toHaveValue('');
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('valid search value', async () => {
    jest.spyOn(api, 'default').mockResolvedValueOnce(lpeSuccessResponse);
    render(<LinkProgramEnrollmentsWrapper />);

    await userEvent.type(screen.getByRole('textbox', { name: /programUUID/i }), data.programID);
    await userEvent.type(screen.getByRole('textbox', { name: /usernamePairText/i }), data.usernamePairText);
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(api.default).toHaveBeenCalledTimes(1);
    });
  });

  it('api call made on each click', async () => {
    jest.spyOn(api, 'default').mockResolvedValue(lpeSuccessResponse);
    render(<LinkProgramEnrollmentsWrapper />);

    await userEvent.type(screen.getByRole('textbox', { name: /programUUID/i }), data.programID);
    await userEvent.type(screen.getByRole('textbox', { name: /usernamePairText/i }), data.usernamePairText);
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => expect(api.default).toHaveBeenCalledTimes(1));

    await userEvent.click(screen.getByRole('button', { name: /submit/i }));
    await waitFor(() => expect(api.default).toHaveBeenCalledTimes(2));
  });

  it('empty search value yields error response', async () => {
    jest.spyOn(api, 'default').mockResolvedValueOnce(lpeErrorResponseEmptyValues);
    render(<LinkProgramEnrollmentsWrapper />);

    await userEvent.clear(screen.getByRole('textbox', { name: /programUUID/i }));
    await userEvent.clear(screen.getByRole('textbox', { name: /usernamePairText/i }));
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(api.default).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
      expect(screen.queryByTestId('success-message')).not.toBeInTheDocument();
    });
  });

  it('Invalid Program UUID value', async () => {
    jest.spyOn(api, 'default').mockResolvedValueOnce(lpeErrorResponseInvalidUUID);
    render(<LinkProgramEnrollmentsWrapper />);

    await userEvent.type(screen.getByRole('textbox', { name: /programUUID/i }), data.programID);
    await userEvent.type(screen.getByRole('textbox', { name: /usernamePairText/i }), data.usernamePairText);
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(api.default).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
      expect(screen.queryByTestId('success-message')).not.toBeInTheDocument();
    });
  });

  it('Invalid Username value', async () => {
    jest.spyOn(api, 'default').mockResolvedValueOnce(lpeErrorResponseInvalidUsername);
    render(<LinkProgramEnrollmentsWrapper />);

    await userEvent.type(screen.getByRole('textbox', { name: /programUUID/i }), data.programID);
    await userEvent.type(screen.getByRole('textbox', { name: /usernamePairText/i }), data.usernamePairText);
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(api.default).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
      expect(screen.queryByTestId('success-message')).not.toBeInTheDocument();
    });
  });

  it('Invalid External User Key value', async () => {
    jest.spyOn(api, 'default').mockResolvedValueOnce(lpeErrorResponseInvalidExternalKey);
    render(<LinkProgramEnrollmentsWrapper />);

    await userEvent.type(screen.getByRole('textbox', { name: /programUUID/i }), data.programID);
    await userEvent.type(screen.getByRole('textbox', { name: /usernamePairText/i }), data.usernamePairText);
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(api.default).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
      expect(screen.queryByTestId('success-message')).not.toBeInTheDocument();
    });
  });

  it('Program Already Linked', async () => {
    jest.spyOn(api, 'default').mockResolvedValueOnce(lpeErrorResponseAlreadyLinked);
    render(<LinkProgramEnrollmentsWrapper />);

    await userEvent.type(screen.getByRole('textbox', { name: /programUUID/i }), data.programID);
    await userEvent.type(screen.getByRole('textbox', { name: /usernamePairText/i }), data.usernamePairText);
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(api.default).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
      expect(screen.queryByTestId('success-message')).not.toBeInTheDocument();
    });
  });
});
