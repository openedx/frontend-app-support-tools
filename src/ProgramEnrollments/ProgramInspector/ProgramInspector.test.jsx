import {
  fireEvent, render, screen, waitFor,
} from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import UserMessagesProvider from '../../userMessages/UserMessagesProvider';
import * as api from './data/api';
import ProgramInspector from './ProgramInspector';
import {
  programInspectorSuccessResponse,
  programInspectorErrorResponse,
} from './data/test/programInspector';
import ssoRecordsData from '../../users/data/test/ssoRecords';
import * as ssoAndUserApi from '../../users/data/api';
import samlProvidersResponseValues from './data/test/samlProviders';
import verifiedNameHistory from '../../users/data/test/verifiedNameHistory';
import UserSummaryData from '../../users/data/test/userSummary';

const mockedNavigator = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigator,
}));

const ProgramEnrollmentsWrapper = () => (
  <MemoryRouter initialEntries={['/programs?edx_user_id=123']}>
    <IntlProvider locale="en">
      <UserMessagesProvider>
        <ProgramInspector />
      </UserMessagesProvider>
    </IntlProvider>
  </MemoryRouter>
);

describe('Program Inspector', () => {
  let wrapper;
  let apiMock;
  let samlMock;
  let ssoMock;
  let verifiedNameMock;
  let getUserMock;

  const data = {
    username: 'verified',
    orgKey: samlProvidersResponseValues[0],
    externalKey: 'testuser',
  };

  beforeEach(() => {
    ssoMock = jest
      .spyOn(ssoAndUserApi, 'getSsoRecords')
      .mockImplementationOnce(() => Promise.resolve(ssoRecordsData));
    samlMock = jest
      .spyOn(api, 'getSAMLProviderList')
      .mockImplementationOnce(() => Promise.resolve(samlProvidersResponseValues));
    verifiedNameMock = jest
      .spyOn(ssoAndUserApi, 'getVerifiedNameHistory')
      .mockImplementationOnce(() => Promise.resolve(verifiedNameHistory));
    getUserMock = jest
      .spyOn(ssoAndUserApi, 'getUser')
      .mockImplementation(() => Promise.resolve(UserSummaryData.userData));
    jest.clearAllMocks();
  });

  afterEach(() => {
    if (apiMock) {
      apiMock.mockReset();
    }
    if (wrapper) {
      wrapper.unmount();
    }
    samlMock.mockReset();
    ssoMock.mockReset();
    verifiedNameMock.mockReset();
    getUserMock.mockReset();
  });

  it('default render', async () => {
    const { unmount } = render(<ProgramEnrollmentsWrapper />);
    apiMock = jest
      .spyOn(api, 'getProgramEnrollmentsInspector')
      .mockImplementationOnce(() => Promise.resolve(programInspectorErrorResponse));

    const usernameInput = document.querySelector("input[name='username']");
    const externalKeyInput = document.querySelector("input[name='externalKey']");
    expect(usernameInput.defaultValue).toEqual('');
    expect(externalKeyInput.defaultValue).toEqual('');
    unmount();
  });

  it('render when username', async () => {
    apiMock = jest
      .spyOn(api, 'getProgramEnrollmentsInspector')
      .mockImplementation(() => Promise.resolve(programInspectorSuccessResponse));

    const { unmount } = render(<ProgramEnrollmentsWrapper />);

    fireEvent.change(document.querySelector("input[name='username']"), { target: { value: data.username } });
    fireEvent.change(document.querySelector("select[name='orgKey']"), { target: { value: data.orgKey } });
    fireEvent.click(document.querySelector('button.btn-primary'));

    await waitFor(() => {
      expect(mockedNavigator).toHaveBeenCalledWith(
        `?edx_user_id=${UserSummaryData.userData.id}`,
      );
    });
    expect(document.querySelectorAll('.inspector-name-row p.h5')[0].textContent).toEqual(
      'Username',
    );
    expect(document.querySelectorAll('.inspector-name-row p.small')[0].textContent).toEqual(
      programInspectorSuccessResponse.learner_program_enrollments.user.username,
    );
    expect(document.querySelectorAll('.inspector-name-row p.h5')[1].textContent).toEqual(
      'Email',
    );
    expect(document.querySelectorAll('.inspector-name-row p.small')[1].textContent).toEqual(
      programInspectorSuccessResponse.learner_program_enrollments.user.email,
    );
    unmount();
  });

  it('render when external_user_key', async () => {
    apiMock = jest
      .spyOn(api, 'getProgramEnrollmentsInspector')
      .mockImplementation(() => Promise.resolve(programInspectorSuccessResponse));
    const { unmount } = render(<ProgramEnrollmentsWrapper />);

    fireEvent.change(document.querySelector(
      "input[name='externalKey']",
    ), { target: { value: data.externalKey } });
    fireEvent.change(document.querySelector(
      "select[name='orgKey']",
    ), { target: { value: data.orgKey } });
    fireEvent.click(document.querySelector('button.btn-primary'));

    await waitFor(() => {
      expect(mockedNavigator).toHaveBeenCalledWith(
        `?edx_user_id=${UserSummaryData.userData.id}`,
      );
    });

    expect(document.querySelectorAll('.inspector-name-row p.h5')[0].textContent).toEqual(
      'Username',
    );
    expect(document.querySelectorAll('.inspector-name-row p.small')[0].textContent).toEqual(
      programInspectorSuccessResponse.learner_program_enrollments.user.username,
    );
    expect(document.querySelectorAll('.inspector-name-row p.h5')[1].textContent).toEqual(
      'Email',
    );
    expect(document.querySelectorAll('.inspector-name-row p.small')[1].textContent).toEqual(
      programInspectorSuccessResponse.learner_program_enrollments.user.email,
    );
    unmount();
  });

  it('render nothing when no username or external_user_key', async () => {
    apiMock = jest
      .spyOn(api, 'getProgramEnrollmentsInspector')
      .mockImplementationOnce(() => Promise.resolve(programInspectorSuccessResponse));
    const { unmount } = render(<ProgramEnrollmentsWrapper />);

    fireEvent.change(document.querySelector(
      "input[name='username']",
    ), { target: { value: undefined } });
    fireEvent.change(document.querySelector(
      "input[name='externalKey']",
    ), { target: { value: undefined } });
    fireEvent.change(document.querySelector(
      "select[name='orgKey']",
    ), { target: { value: data.orgKey } });
    fireEvent.click(document.querySelector('button.btn-primary'));

    expect(mockedNavigator).toHaveBeenCalledWith(
      '/programs',
    );
    expect(document.querySelector('.inspector-name-row')).not.toBeInTheDocument();
    unmount();
  });

  it('render when getUser fails', async () => {
    apiMock = jest
      .spyOn(api, 'getProgramEnrollmentsInspector')
      .mockImplementation(() => Promise.resolve(programInspectorSuccessResponse));

    getUserMock = jest
      .spyOn(ssoAndUserApi, 'getUser')
      .mockImplementation(() => Promise.reject(new Error('Error fetching User Info')));

    const { unmount } = render(<ProgramEnrollmentsWrapper />);

    await waitFor(() => {
      expect(document.querySelectorAll('.alert')[0].textContent).toEqual('An error occurred while fetching user id');
    });

    fireEvent.change(document.querySelector(
      "input[name='username']",
    ), { target: { value: 'AnonyMouse' } });
    fireEvent.click(document.querySelector('button.btn-primary'));

    await waitFor(() => {
      expect(document.querySelectorAll('.alert')[0].textContent).toEqual('An error occurred while fetching user id');
      expect(mockedNavigator).toHaveBeenCalledTimes(3);
    });
    unmount();
  });

  it.skip('check if SSO is present', async () => {
    apiMock = jest
      .spyOn(api, 'getProgramEnrollmentsInspector')
      .mockImplementationOnce(() => Promise.resolve(programInspectorSuccessResponse));
    const { unmount } = render(<ProgramEnrollmentsWrapper />);

    fireEvent.change(document.querySelector(
      "input[name='username']",
    ), { target: { value: data.username } });
    fireEvent.change(document.querySelector(
      "select[name='orgKey']",
    ), { target: { value: data.orgKey } });
    fireEvent.click(document.querySelector('button.btn-primary'));

    const ssoRecords = await screen.findByTestId('sso-records');
    expect(ssoRecords.querySelectorAll('h4')[0].textContent).toEqual('SSO Records');
    // TODO: rather than h3 it's rendering an alert with danger variant saying "No SSO Records"
    expect(ssoRecords.querySelector('.h3').textContent).toEqual(
      'tpa-saml (Provider)',
    );
    unmount();
  });
});
