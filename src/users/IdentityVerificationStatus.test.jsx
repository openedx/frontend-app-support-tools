import { mount } from 'enzyme';
import React from 'react';
import { waitForComponentToPaint } from '../setupTest';
import IdentityVerificationStatus from './IdentityVerificationStatus';
import UserMessagesProvider from '../userMessages/UserMessagesProvider';
import idvStatusData from './data/test/idvStatus';

import * as api from './data/api';

const IdentityVerificationStatusWrapper = (props) => (
  <UserMessagesProvider>
    <IdentityVerificationStatus {...props} />
  </UserMessagesProvider>
);

describe('Identity Verification Status', () => {
  let wrapper;
  const props = {
    username: 'edX',
  };

  beforeEach(async () => {
    jest.spyOn(api, 'getUserVerificationStatus').mockImplementationOnce(() => Promise.resolve(idvStatusData));
    wrapper = mount(<IdentityVerificationStatusWrapper {...props} />);
    await waitForComponentToPaint(wrapper);
  });

  it('Verification props', () => {
    const username = wrapper.prop('username');

    expect(username).toEqual(props.username);
  });

  it('No extra idv data', () => {
    const idvData = wrapper.find('Table#idv-data');
    const extraDataButton = idvData.find('button.btn-link');
    expect(extraDataButton).toHaveLength(0);
  });

  it('Error fetching idv data', async () => {
    const idvErrors = {
      errors: [
        {
          code: null,
          dismissible: true,
          text: 'Test Error',
          type: 'danger',
          topic: 'idvStatus',
        },
      ],
    };
    jest.spyOn(api, 'getUserVerificationStatus').mockImplementationOnce(() => Promise.resolve(idvErrors));
    wrapper = mount(<IdentityVerificationStatusWrapper {...props} />);
    await waitForComponentToPaint(wrapper);

    const alert = wrapper.find('div.alert');
    expect(alert.text()).toEqual(idvErrors.errors[0].text);
  });

  it('Extra idv data', async () => {
    const idvData = [
      {
        type: 'Manual',
        status: 'Denied',
        updatedAt: Date().toLocaleString(),
        expirationDatetime: Date().toLocaleString(),
        message: 'Missing Photo',
      },
      {
        type: 'Manual',
        status: 'Approved',
        updatedAt: Date().toLocaleString(),
        expirationDatetime: Date().toLocaleString(),
        message: null,
      },
    ];
    const verificationData = { ...idvStatusData, extraData: idvData };
    jest.spyOn(api, 'getUserVerificationStatus').mockImplementationOnce(() => Promise.resolve(verificationData));
    wrapper = mount(<IdentityVerificationStatusWrapper {...props} />);
    await waitForComponentToPaint(wrapper);

    const idvDataTable = wrapper.find('Table#idv-data');
    const extraDataButton = idvDataTable.find('button.btn-link');
    let extraDataModal = wrapper.find('Modal#idv-extra-data');

    expect(extraDataButton.text()).toEqual('Show');
    expect(extraDataModal.prop('open')).toEqual(false);

    extraDataButton.simulate('click');
    extraDataModal = wrapper.find('Modal#idv-extra-data');

    expect(extraDataModal.prop('open')).toEqual(true);
    expect(extraDataModal.find('table tbody tr')).toHaveLength(2);
    expect(extraDataModal.prop('title')).toEqual('ID Verification Details');

    extraDataModal.find('button.btn-link').simulate('click');
    extraDataModal = wrapper.find('Modal#idv-extra-data');
    expect(extraDataModal.prop('open')).toEqual(false);
  });
});
