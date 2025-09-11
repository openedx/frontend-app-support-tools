import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LinkProgramEnrollments from './LinkProgramEnrollments';
import UserMessagesProvider from '../userMessages/UserMessagesProvider';
import {
  lpeSuccessResponse,
  lpeErrorResponseInvalidUUID,
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

const mockData = {
  programID: '8bee627e-d85e-4a76-be41-d58921da666e',
  usernamePairText: 'testuser,verified',
};

describe('Link Program Enrollments', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('default page render', () => {
    render(<LinkProgramEnrollmentsWrapper programID={mockData.programID} />);

    const programInput = screen.getByLabelText(/Program UUID/i);
    expect(programInput).toBeInTheDocument();

    const usernamePairTextInput = screen.getByLabelText(/List of External key and username pairings/i);
    expect(usernamePairTextInput).toBeInTheDocument();

    const submitButton = screen.getByRole('button', { name: /submit/i });
    expect(submitButton).toBeInTheDocument();
  });

  it('valid search value', async () => {
    jest.spyOn(api, 'default').mockResolvedValueOnce(lpeSuccessResponse);

    render(<LinkProgramEnrollmentsWrapper programID={mockData.programID} />);

    const programInput = screen.getByLabelText(/Program UUID/i);
    await userEvent.clear(programInput);
    await userEvent.type(programInput, mockData.programID);

    const usernamePairTextInput = screen.getByLabelText(/List of External key and username pairings/i);
    await userEvent.clear(usernamePairTextInput);
    await userEvent.type(usernamePairTextInput, mockData.usernamePairText);

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(api.default).toHaveBeenCalledTimes(1);
    });
  });

  it('api call made on each click', async () => {
    jest.spyOn(api, 'default').mockResolvedValue(lpeSuccessResponse);

    render(<LinkProgramEnrollmentsWrapper programID={mockData.programID} />);

    const programInput = screen.getByLabelText(/Program UUID/i);
    const usernamePairTextInput = screen.getByLabelText(/List of External key and username pairings/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    await userEvent.clear(programInput);
    await userEvent.type(programInput, mockData.programID);
    await userEvent.clear(usernamePairTextInput);
    await userEvent.type(usernamePairTextInput, mockData.usernamePairText);
    await userEvent.click(submitButton);

    await waitFor(() => expect(api.default).toHaveBeenCalledTimes(1));

    await userEvent.click(submitButton);
    await waitFor(() => expect(api.default).toHaveBeenCalledTimes(2));
  });

  it('empty search value yields error response', async () => {
    const lpeErrorResponseEmptyValues = {
      successes: [],
      errors: ['Please enter required fields'],
    };

    jest.spyOn(api, 'default').mockResolvedValueOnce(lpeErrorResponseEmptyValues);

    render(<LinkProgramEnrollmentsWrapper programID={mockData.programID} />);
    const programInput = screen.getByLabelText(/Program UUID/i);
    const usernamePairTextInput = screen.getByLabelText(/List of External key and username pairings/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    await userEvent.clear(programInput);
    await userEvent.clear(usernamePairTextInput);
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(api.default).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId('error-message')).toHaveTextContent('Please enter required fields');
      expect(screen.queryByTestId('success')).not.toBeInTheDocument();
    });
  });

  it('Invalid Program UUID value', async () => {
    jest.spyOn(api, 'default').mockResolvedValueOnce(lpeErrorResponseInvalidUUID);

    render(<LinkProgramEnrollmentsWrapper programID={mockData.programID} />);

    await userEvent.type(screen.getByLabelText(/program uuid/i), mockData.programID);
    await userEvent.type(screen.getByLabelText(/List of External key and username pairings/i), mockData.usernamePairText);
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(api.default).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
      expect(screen.queryByTestId('success-message')).not.toBeInTheDocument();
    });
  });

  it('Invalid Username value', async () => {
    jest.spyOn(api, 'default').mockResolvedValueOnce(lpeErrorResponseInvalidUsername);

    render(<LinkProgramEnrollmentsWrapper programID={mockData.programID} />);

    await userEvent.type(screen.getByLabelText(/program uuid/i), mockData.programID);
    await userEvent.type(screen.getByLabelText(/List of External key and username pairings/i), mockData.usernamePairText);
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(api.default).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
      expect(screen.queryByTestId('success-message')).not.toBeInTheDocument();
    });
  });

  it('Invalid External User Key value', async () => {
    jest.spyOn(api, 'default').mockResolvedValueOnce(lpeErrorResponseInvalidExternalKey);

    render(<LinkProgramEnrollmentsWrapper programID={mockData.programID} />);

    await userEvent.type(screen.getByLabelText(/program uuid/i), mockData.programID);
    await userEvent.type(screen.getByLabelText(/List of External key and username pairings/i), mockData.usernamePairText);
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(api.default).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
      expect(screen.queryByTestId('success-message')).not.toBeInTheDocument();
    });
  });

  it('Program Already Linked', async () => {
    jest.spyOn(api, 'default').mockResolvedValueOnce(lpeErrorResponseAlreadyLinked);

    render(<LinkProgramEnrollmentsWrapper programID={mockData.programID} />);

    const programInput = screen.getByLabelText(/Program UUID/i);
    await userEvent.type(programInput, mockData.programID);

    const usernamePairTextInput = screen.getByLabelText(/List of External key and username pairings/i);
    await userEvent.type(usernamePairTextInput, mockData.usernamePairText);

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(api.default).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
      expect(screen.queryByTestId('success-message')).not.toBeInTheDocument();
    });
  });
});
