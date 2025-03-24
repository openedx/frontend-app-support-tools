import { mount } from 'enzyme';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { waitFor } from '@testing-library/react';
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
  <MemoryRouter initialEntries={['/programs?edx_user=&org_key=&external_user_key=']}>
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
      .mockImplementationOnce(() => Promise.resolve(UserSummaryData.userData));
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
    wrapper = mount(<ProgramEnrollmentsWrapper />);
    apiMock = jest
      .spyOn(api, 'getProgramEnrollmentsInspector')
      .mockImplementationOnce(() => Promise.resolve(programInspectorErrorResponse));

    const usernameInput = wrapper.find("input[name='username']");
    const externalKeyInput = wrapper.find("input[name='externalKey']");
    expect(usernameInput.prop('defaultValue')).toEqual('');
    expect(externalKeyInput.prop('defaultValue')).toEqual('');
  });

  it('render when username', async () => {
    apiMock = jest
      .spyOn(api, 'getProgramEnrollmentsInspector')
      .mockImplementationOnce(() => Promise.resolve(programInspectorSuccessResponse));

    wrapper = mount(<ProgramEnrollmentsWrapper />);

    wrapper.find("input[name='username']").simulate(
      'change',
      { target: { value: data.username } },
    );
    wrapper.find("select[name='orgKey']").simulate(
      'change',
      { target: { value: data.orgKey } },
    );
    wrapper.find('button.btn-primary').simulate('click');

    await waitFor(() => {
      expect(mockedNavigator).toHaveBeenCalledWith(
        `?edx_user_id=${UserSummaryData.userData.id}`,
      );
    });

    waitFor(() => {
      expect(wrapper.find('.inspector-name-row p.h5').at(0).text()).toEqual(
        'Username',
      );
      expect(wrapper.find('.inspector-name-row p.small').at(0).text()).toEqual(
        programInspectorSuccessResponse.learner_program_enrollments.user.username,
      );
      expect(wrapper.find('.inspector-name-row p.h5').at(1).text()).toEqual(
        'Email',
      );
      expect(wrapper.find('.inspector-name-row p.small').at(1).text()).toEqual(
        programInspectorSuccessResponse.learner_program_enrollments.user.email,
      );
    });
  });

  it('render when external_user_key', async () => {
    apiMock = jest
      .spyOn(api, 'getProgramEnrollmentsInspector')
      .mockImplementationOnce(() => Promise.resolve(programInspectorSuccessResponse));
    wrapper = mount(<ProgramEnrollmentsWrapper />);

    wrapper.find(
      "input[name='externalKey']",
    ).simulate(
      'change',
      { target: { value: data.externalKey } },
    );
    wrapper.find(
      "select[name='orgKey']",
    ).simulate(
      'change',
      { target: { value: data.orgKey } },
    );
    wrapper.find('button.btn-primary').simulate('click');

    await waitFor(() => {
      expect(mockedNavigator).toHaveBeenCalledWith(
        `?edx_user_id=${UserSummaryData.userData.id}`,
      );
    });

    waitFor(() => {
      expect(wrapper.find('.inspector-name-row p.h5').at(0).text()).toEqual(
        'Username',
      );
      expect(wrapper.find('.inspector-name-row p.small').at(0).text()).toEqual(
        programInspectorSuccessResponse.learner_program_enrollments.user.username,
      );
      expect(wrapper.find('.inspector-name-row p.h5').at(1).text()).toEqual(
        'Email',
      );
      expect(wrapper.find('.inspector-name-row p.small').at(1).text()).toEqual(
        programInspectorSuccessResponse.learner_program_enrollments.user.email,
      );
    });
  });

  it('render nothing when no username or external_user_key', async () => {
    apiMock = jest
      .spyOn(api, 'getProgramEnrollmentsInspector')
      .mockImplementationOnce(() => Promise.resolve(programInspectorSuccessResponse));
    wrapper = mount(<ProgramEnrollmentsWrapper />);

    wrapper.find(
      "input[name='username']",
    ).simulate(
      'change',
      { target: { value: undefined } },
    );
    wrapper.find(
      "input[name='externalKey']",
    ).simulate(
      'change',
      { target: { value: undefined } },
    );
    wrapper.find(
      "select[name='orgKey']",
    ).simulate(
      'change',
      { target: { value: data.orgKey } },
    );
    wrapper.find('button.btn-primary').simulate('click');

    expect(mockedNavigator).toHaveBeenCalledWith(
      '/programs',
    );
    expect(wrapper.find('.inspector-name-row').exists()).toBeFalsy();
  });

  it('check if SSO is present', async () => {
    apiMock = jest
      .spyOn(api, 'getProgramEnrollmentsInspector')
      .mockImplementationOnce(() => Promise.resolve(programInspectorSuccessResponse));
    wrapper = mount(<ProgramEnrollmentsWrapper />);

    wrapper.find(
      "input[name='username']",
    ).simulate(
      'change',
      { target: { value: data.username } },
    );
    wrapper.find(
      "select[name='orgKey']",
    ).simulate(
      'change',
      { target: { value: data.orgKey } },
    );
    wrapper.find('button.btn-primary').simulate('click');

    const ssoRecords = wrapper.find('.sso-records');
    waitFor(() => {
      expect(ssoRecords.find('h4').at(0).text()).toEqual('SSO Records');
      expect(ssoRecords.find('.h3').text()).toEqual(
        'tpa-saml (Provider)',
      );
    });
  });
});
