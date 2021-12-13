import { mount } from 'enzyme';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { history } from '@edx/frontend-platform';
import { waitForComponentToPaint } from '../setupTest';
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
  let wrapper;
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
    wrapper = mount(<LinkProgramEnrollmentsWrapper />);

    const programIdInput = wrapper.find("input[name='programUUID']");
    const usernamePairInput = wrapper.find("textarea[name='usernamePairText']");
    const submitButton = wrapper.find('button.btn-primary');

    expect(programIdInput.prop('defaultValue')).toEqual(undefined);
    expect(usernamePairInput.prop('defaultValue')).toEqual(undefined);
    expect(submitButton.text()).toEqual('Submit');
  });

  it('valid search value', async () => {
    apiMock = jest
      .spyOn(api, 'default')
      .mockImplementationOnce(() => Promise.resolve(lpeSuccessResponse));
    history.push = jest.fn();

    wrapper = mount(<LinkProgramEnrollmentsWrapper />);

    wrapper.find('input[name="programUUID"]').instance().value = data.programID;
    wrapper.find('textarea[name="usernamePairText"]').instance().value = data.usernamePairText;
    wrapper.find('button.btn-primary').simulate('click');

    await waitForComponentToPaint(wrapper);
    expect(apiMock).toHaveBeenCalledTimes(1);
  });

  it('api call made on each click', async () => {
    apiMock = jest
      .spyOn(api, 'default')
      .mockImplementation(() => Promise.resolve(lpeSuccessResponse));
    history.push = jest.fn();

    wrapper = mount(<LinkProgramEnrollmentsWrapper />);

    wrapper.find('input[name="programUUID"]').instance().value = data.programID;
    wrapper.find('textarea[name="usernamePairText"]').instance().value = data.usernamePairText;
    wrapper.find('button.btn-primary').simulate('click');

    await waitForComponentToPaint(wrapper);
    expect(apiMock).toHaveBeenCalledTimes(1);

    wrapper.find('button.btn-primary').simulate('click');
    await waitForComponentToPaint(wrapper);
    expect(apiMock).toHaveBeenCalledTimes(2);
  });

  it('empty search value yields error response', async () => {
    apiMock = jest
      .spyOn(api, 'default')
      .mockImplementationOnce(() => Promise.resolve(lpeErrorResponseEmptyValues));
    history.replace = jest.fn();
    wrapper = mount(<LinkProgramEnrollmentsWrapper />);

    wrapper.find('input[name="programUUID"]').instance().value = '';
    wrapper.find('textarea[name="usernamePairText"]').instance().value = '';
    wrapper.find('button.btn-primary').simulate('click');

    await waitForComponentToPaint(wrapper);
    expect(apiMock).toHaveBeenCalledTimes(1);
    expect(wrapper.find('.error-message')).toHaveLength(1);
    expect(wrapper.find('.success-message')).toHaveLength(0);
  });

  it('Invalid Program UUID value', async () => {
    apiMock = jest
      .spyOn(api, 'default')
      .mockImplementationOnce(() => Promise.resolve(lpeErrorResponseInvalidUUID));
    history.replace = jest.fn();
    wrapper = mount(<LinkProgramEnrollmentsWrapper />);

    wrapper.find('input[name="programUUID"]').instance().value = data.programID;
    wrapper.find('textarea[name="usernamePairText"]').instance().value = data.usernamePairText;
    wrapper.find('button.btn-primary').simulate('click');

    await waitForComponentToPaint(wrapper);
    expect(apiMock).toHaveBeenCalledTimes(1);
    expect(wrapper.find('.error-message')).toHaveLength(1);
    expect(wrapper.find('.success-message')).toHaveLength(0);
  });

  it('Invalid Username value', async () => {
    apiMock = jest
      .spyOn(api, 'default')
      .mockImplementationOnce(() => Promise.resolve(lpeErrorResponseInvalidUsername));
    history.replace = jest.fn();
    wrapper = mount(<LinkProgramEnrollmentsWrapper />);

    wrapper.find('input[name="programUUID"]').instance().value = data.programID;
    wrapper.find('textarea[name="usernamePairText"]').instance().value = data.usernamePairText;
    wrapper.find('button.btn-primary').simulate('click');

    await waitForComponentToPaint(wrapper);
    expect(apiMock).toHaveBeenCalledTimes(1);
    expect(wrapper.find('.error-message')).toHaveLength(1);
    expect(wrapper.find('.success-message')).toHaveLength(0);
  });

  it('Invalid External User Key value', async () => {
    apiMock = jest
      .spyOn(api, 'default')
      .mockImplementationOnce(() => Promise.resolve(lpeErrorResponseInvalidExternalKey));
    history.replace = jest.fn();
    wrapper = mount(<LinkProgramEnrollmentsWrapper />);

    wrapper.find('input[name="programUUID"]').instance().value = data.programID;
    wrapper.find('textarea[name="usernamePairText"]').instance().value = data.usernamePairText;
    wrapper.find('button.btn-primary').simulate('click');

    await waitForComponentToPaint(wrapper);
    expect(apiMock).toHaveBeenCalledTimes(1);
    expect(wrapper.find('.error-message')).toHaveLength(1);
    expect(wrapper.find('.success-message')).toHaveLength(0);
  });

  it('Program Already Linked', async () => {
    apiMock = jest
      .spyOn(api, 'default')
      .mockImplementationOnce(() => Promise.resolve(lpeErrorResponseAlreadyLinked));
    history.replace = jest.fn();
    wrapper = mount(<LinkProgramEnrollmentsWrapper />);

    wrapper.find('input[name="programUUID"]').instance().value = data.programID;
    wrapper.find('textarea[name="usernamePairText"]').instance().value = data.usernamePairText;
    wrapper.find('button.btn-primary').simulate('click');

    await waitForComponentToPaint(wrapper);
    expect(apiMock).toHaveBeenCalledTimes(1);
    expect(wrapper.find('.error-message')).toHaveLength(1);
    expect(wrapper.find('.success-message')).toHaveLength(0);
  });
});
