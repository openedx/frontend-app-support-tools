import { mount } from 'enzyme';
import React from 'react';

import PasswordHistory from './PasswordHistory';
import UserSummaryData from '../../data/test/userSummary';

describe('Password History Component Tests', () => {
  let wrapper;

  beforeEach(() => {
    const data = {
      passwordStatus: UserSummaryData.userData.passwordStatus,
    };
    wrapper = mount(<PasswordHistory {...data} />);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('Password History Modal', () => {
    const passwordHistoryButton = wrapper.find('button#toggle-password-history');
    let historyModal = wrapper.find('Modal#password-history');

    expect(historyModal.prop('open')).toEqual(false);
    expect(passwordHistoryButton.text()).toEqual('Show History');
    expect(passwordHistoryButton.disabled).toBeFalsy();

    passwordHistoryButton.simulate('click');
    historyModal = wrapper.find('Modal#password-history');

    expect(historyModal.prop('open')).toEqual(true);
    expect(historyModal.find('table tbody tr')).toHaveLength(2);

    historyModal.find('button.btn-link').simulate('click');
    historyModal = wrapper.find('Modal#password-history');
    expect(historyModal.prop('open')).toEqual(false);
  });
});
