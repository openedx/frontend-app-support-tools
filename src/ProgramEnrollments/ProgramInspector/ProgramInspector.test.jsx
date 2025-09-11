import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
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

const renderComponent = () => render(
  <MemoryRouter initialEntries={['/programs?edx_user_id=123']}>
    <IntlProvider locale="en">
      <UserMessagesProvider>
        <ProgramInspector />
      </UserMessagesProvider>
    </IntlProvider>
  </MemoryRouter>,
);

describe('Program Inspector - RTL', () => {
  const data = {
    username: 'verified',
    orgKey: samlProvidersResponseValues[0],
    externalKey: 'testuser',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(ssoAndUserApi, 'getSsoRecords').mockResolvedValue(ssoRecordsData);
    jest.spyOn(api, 'getSAMLProviderList').mockResolvedValue(samlProvidersResponseValues);
    jest.spyOn(ssoAndUserApi, 'getVerifiedNameHistory').mockResolvedValue(verifiedNameHistory);
    jest.spyOn(ssoAndUserApi, 'getUser').mockResolvedValue(UserSummaryData.userData);
  });

  it('default render', async () => {
    jest
      .spyOn(api, 'getProgramEnrollmentsInspector')
      .mockResolvedValue(programInspectorErrorResponse);
    renderComponent();

    expect(screen.getByLabelText(/username/i)).toHaveValue('');
    expect(screen.getByPlaceholderText(/gtpersondirectoryid/i)).toHaveValue('');
  });

  it('render when username is provided', async () => {
    jest
      .spyOn(api, 'getProgramEnrollmentsInspector')
      .mockResolvedValue(programInspectorSuccessResponse);
    renderComponent();

    fireEvent.change(screen.getByLabelText(/edx username or email/i), {
      target: { value: data.username },
    });

    fireEvent.change(screen.getByLabelText(/identity-providing institution/i), {
      target: { value: data.orgKey },
    });

    fireEvent.click(screen.getByRole('button', { name: /search program records/i }));

    await waitFor(() => {
      expect(mockedNavigator).toHaveBeenCalledWith(
        `?edx_user_id=${UserSummaryData.userData.id}`,
      );
    });

    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(
      screen.getByText(
        programInspectorSuccessResponse.learner_program_enrollments.user.username,
      ),
    ).toBeInTheDocument();

    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(
      screen.getByText(
        programInspectorSuccessResponse.learner_program_enrollments.user.email,
      ),
    ).toBeInTheDocument();
  });

  it('render when external_user_key is provided', async () => {
    jest
      .spyOn(api, 'getProgramEnrollmentsInspector')
      .mockResolvedValue(programInspectorSuccessResponse);
    renderComponent();

    fireEvent.change(screen.getByLabelText(/institution user key/i), {
      target: { value: data.externalKey },
    });

    fireEvent.change(screen.getByLabelText(/identity-providing institution/i), {
      target: { value: data.orgKey },
    });

    fireEvent.click(screen.getByRole('button', { name: /search program records/i }));

    await waitFor(() => {
      expect(mockedNavigator).toHaveBeenCalledWith(
        `?edx_user_id=${UserSummaryData.userData.id}`,
      );
    });

    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(
      screen.getByText(
        programInspectorSuccessResponse.learner_program_enrollments.user.username,
      ),
    ).toBeInTheDocument();

    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(
      screen.getByText(
        programInspectorSuccessResponse.learner_program_enrollments.user.email,
      ),
    ).toBeInTheDocument();
  });

  it('render nothing when no username or external_user_key', async () => {
    jest
      .spyOn(api, 'getProgramEnrollmentsInspector')
      .mockResolvedValue(programInspectorSuccessResponse);
    renderComponent();

    fireEvent.change(screen.getByLabelText(/edx username or email/i), {
      target: { value: '' },
    });

    fireEvent.change(screen.getByLabelText(/institution user key/i), {
      target: { value: '' },
    });

    fireEvent.change(screen.getByLabelText(/identity-providing institution/i), {
      target: { value: data.orgKey },
    });

    fireEvent.click(screen.getByRole('button', { name: /search program records/i }));

    expect(mockedNavigator).toHaveBeenCalledWith('/programs');
    expect(screen.queryByText('Username')).not.toBeInTheDocument();
  });

  it('render when getUser fails', async () => {
    jest
      .spyOn(api, 'getProgramEnrollmentsInspector')
      .mockResolvedValue(programInspectorSuccessResponse);
    jest
      .spyOn(ssoAndUserApi, 'getUser')
      .mockRejectedValue(new Error('Error fetching User Info'));

    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText(/an error occurred while fetching user id/i),
      ).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/edx username or email/i), {
      target: { value: 'AnonyMouse' },
    });

    fireEvent.click(screen.getByRole('button', { name: /search program records/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/an error occurred while fetching user id/i),
      ).toBeInTheDocument();
      expect(mockedNavigator).toHaveBeenCalledTimes(3);
    });
  });

  it('check if SSO is present', async () => {
    jest
      .spyOn(api, 'getProgramEnrollmentsInspector')
      .mockResolvedValue(programInspectorSuccessResponse);
    renderComponent();

    fireEvent.change(screen.getByLabelText(/edx username or email/i), {
      target: { value: data.username },
    });

    fireEvent.change(screen.getByLabelText(/identity-providing institution/i), {
      target: { value: data.orgKey },
    });

    fireEvent.click(screen.getByRole('button', { name: /search program records/i }));

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { level: 4, name: /SSO Records/i }),
      ).toBeInTheDocument();
      expect(screen.getByText(/tpa-saml/i)).toBeInTheDocument();
      expect(screen.getByText(/\(Provider\)/i)).toBeInTheDocument();
    });
  });
});
