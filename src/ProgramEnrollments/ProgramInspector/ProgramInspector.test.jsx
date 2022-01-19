import { mount } from 'enzyme';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { history } from '@edx/frontend-platform';
import { waitForComponentToPaint } from '../../setupTest';
import UserMessagesProvider from '../../userMessages/UserMessagesProvider';
import * as api from './data/api';
import ProgramInspector from './ProgramInspector';
import {
  programInspectorSuccessResponse,
  programInspectorErrorResponse,
} from './data/test/programInspector';
import ssoRecordsData from '../../users/data/test/ssoRecords';
import * as ssoApi from '../../users/data/api';
import samlProvidersResponseValues from './data/test/samlProviders';
import verifiedNameHistory from '../../users/data/test/verifiedNameHistory';

const ProgramEnrollmentsWrapper = (props) => (
  <MemoryRouter>
    <UserMessagesProvider>
      <ProgramInspector {...props} />
    </UserMessagesProvider>
  </MemoryRouter>
);

describe('Program Inspector', () => {
  let wrapper;
  let location;
  let apiMock;
  let samlMock;
  let ssoMock;
  let verifiedNameMock;

  const data = {
    username: 'verified',
    orgKey: samlProvidersResponseValues[0],
    externalKey: 'testuser',
  };

  beforeEach(() => {
    location = {
      pathname: '/v2/programs',
      search: '?edx_user=&org_key=&external_user_key=',
    };
    ssoMock = jest
      .spyOn(ssoApi, 'getSsoRecords')
      .mockImplementationOnce(() => Promise.resolve(ssoRecordsData));
    samlMock = jest
      .spyOn(api, 'getSAMLProviderList')
      .mockImplementationOnce(() => Promise.resolve(samlProvidersResponseValues));
    verifiedNameMock = jest
      .spyOn(ssoApi, 'getVerifiedNameHistory')
      .mockImplementationOnce(() => Promise.resolve(verifiedNameHistory));
  });

  afterEach(() => {
    if (apiMock) {
      apiMock.mockReset();
    }
    samlMock.mockReset();
    ssoMock.mockReset();
    verifiedNameMock.mockReset();
  });

  it('default render', async () => {
    wrapper = mount(<ProgramEnrollmentsWrapper location={location} />);
    apiMock = jest
      .spyOn(api, 'getProgramEnrollmentsInspector')
      .mockImplementationOnce(() => Promise.resolve(programInspectorErrorResponse));

    await waitForComponentToPaint(wrapper);

    const usernameInput = wrapper.find("input[name='username']");
    const externalKeyInput = wrapper.find("input[name='externalKey']");
    expect(usernameInput.prop('defaultValue')).toEqual('');
    expect(externalKeyInput.prop('defaultValue')).toEqual('');
  });

  it('render when username', async () => {
    history.push = jest.fn();
    apiMock = jest
      .spyOn(api, 'getProgramEnrollmentsInspector')
      .mockImplementationOnce(() => Promise.resolve(programInspectorSuccessResponse));
    wrapper = mount(<ProgramEnrollmentsWrapper location={location} />);

    await waitForComponentToPaint(wrapper);

    wrapper.find("input[name='username']").simulate('change',
      { target: { value: data.username } });
    wrapper.find("select[name='orgKey']").simulate('change',
      { target: { value: data.orgKey } });
    wrapper.find('button.btn-primary').simulate('click');

    expect(history.push).toHaveBeenCalledWith(
      `/v2/programs?edx_user=${data.username}&org_key=${data.orgKey}&external_user_key=`,
    );
    await waitForComponentToPaint(wrapper);
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
    history.push.mockReset();
  });

  it('render when external_user_key', async () => {
    history.push = jest.fn();
    apiMock = jest
      .spyOn(api, 'getProgramEnrollmentsInspector')
      .mockImplementationOnce(() => Promise.resolve(programInspectorSuccessResponse));
    wrapper = mount(<ProgramEnrollmentsWrapper location={location} />);

    await waitForComponentToPaint(wrapper);

    wrapper.find("input[name='externalKey']").simulate('change',
      { target: { value: data.externalKey } });
    wrapper.find("select[name='orgKey']").simulate('change',
      { target: { value: data.orgKey } });
    wrapper.find('button.btn-primary').simulate('click');

    expect(history.push).toHaveBeenCalledWith(
      `/v2/programs?edx_user=&org_key=${data.orgKey}&external_user_key=${data.externalKey}`,
    );
    await waitForComponentToPaint(wrapper);
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

    history.push.mockReset();
  });
});
