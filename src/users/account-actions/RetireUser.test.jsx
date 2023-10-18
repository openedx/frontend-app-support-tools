import { mount } from 'enzyme';
import React from 'react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import * as api from '../data/api';
import RetireUser from './RetireUser';
import UserSummaryData from '../data/test/userSummary';
import { waitForComponentToPaint } from '../../setupTest';

const RetireUserWrapper = (props) => (
  <IntlProvider locale="en">
    <RetireUser {...props} />
  </IntlProvider>
);

describe('Retire User Component Tests', () => {
  let wrapper;
  const data = {
    email: UserSummaryData.userData.email,
    username: UserSummaryData.userData.username,
    changeHandler: UserSummaryData.changeHandler,
  };

  beforeEach(() => {
    wrapper = mount(<RetireUserWrapper {...data} />);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('Retire User button for a User', () => {
    const retireUserButton = wrapper.find('#retire-user').hostNodes();
    expect(retireUserButton.text()).toEqual('Retire User');
  });

  it('Retire User Modal Success', async () => {
    const mockApiCall = jest.spyOn(api, 'postRetireUser').mockImplementationOnce(() => Promise.resolve({}));
    const retireUserButton = wrapper.find('#retire-user').hostNodes();
    let retireUserModal = wrapper.find('ModalDialog#user-account-retire');

    expect(retireUserModal.prop('isOpen')).toEqual(false);
    expect(retireUserButton.text()).toEqual('Retire User');

    retireUserButton.simulate('click');
    retireUserModal = wrapper.find('ModalDialog#user-account-retire');

    expect(retireUserModal.prop('isOpen')).toEqual(true);
    expect(retireUserModal.find('h2.pgn__modal-title').text()).toEqual('Retire User Confirmation');
    const confirmAlert = retireUserModal.find('.alert-warning');
    expect(confirmAlert.text()).toEqual(
      "You are about to retire edx with the email address: edx@example.com. This is a serious action that will revoke this user's access to edX and their earned certificates. "
      + 'Furthermore, the email address associated with the retired account will not be able to be used to create a new account. By taking this action, you are affirming that you '
      + 'are following our legal/support procedures here',
    );
    retireUserModal.find('button.btn-danger').hostNodes().simulate('click');
    await waitForComponentToPaint(wrapper);
    expect(UserSummaryData.changeHandler).toHaveBeenCalled();
    retireUserModal.find('button.btn-link').simulate('click');
    retireUserModal = wrapper.find('ModalDialog#user-account-retire');
    expect(retireUserModal.prop('isOpen')).toEqual(false);

    mockApiCall.mockRestore();
  });

  it('Retire User Modal Failure', async () => {
    const retireUserErrors = {
      errors: [
        {
          code: null,
          dismissible: true,
          text: '',
          type: 'error',
          topic: 'retireUser',
        },
      ],
    };
    const mockApiCall = jest.spyOn(api, 'postRetireUser').mockImplementationOnce(() => Promise.resolve(retireUserErrors));
    const retireUserButton = wrapper.find('#retire-user').hostNodes();
    retireUserButton.simulate('click');
    let retireUserModal = wrapper.find('ModalDialog#user-account-retire');

    retireUserModal.find('button.btn-danger').hostNodes().simulate('click');
    await waitForComponentToPaint(wrapper);
    retireUserModal = wrapper.find('ModalDialog#user-account-retire');

    const confirmAlert = retireUserModal.find('.alert-danger');
    expect(confirmAlert.text()).toEqual(
      'Something went wrong. Please try again later!',
    );
    expect(retireUserModal.prop('isOpen')).toEqual(true);

    mockApiCall.mockRestore();
  });

  it('Retire User button disabled for already retired users', () => {
    wrapper = mount(<RetireUserWrapper {...data} email="invalid@retired.invalid" />);
    const retireUserButton = wrapper.find('#retire-user').hostNodes();
    expect(retireUserButton.prop('disabled')).toEqual(true);
  });
});
