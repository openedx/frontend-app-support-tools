import { mount } from 'enzyme';
import React from 'react';
import { waitForComponentToPaint } from '../setupTest';
import SingleSignOnRecords from './SingleSignOnRecords';
import UserMessagesProvider from '../userMessages/UserMessagesProvider';
import ssoRecordsData from './data/test/ssoRecords';

import * as api from './data/api';

const SingleSignOnRecordsWrapper = (props) => (
  <UserMessagesProvider>
    <SingleSignOnRecords {...props} />
  </UserMessagesProvider>
);

describe('Single Sign On Records', () => {
  let wrapper;
  const props = {
    username: 'edX',
  };

  beforeEach(async () => {
    const ssoData = { ...ssoRecordsData[0], extraData: [] };
    jest.spyOn(api, 'getSsoRecords').mockImplementationOnce(() => Promise.resolve([ssoData]));
    wrapper = mount(<SingleSignOnRecordsWrapper {...props} />);
    await waitForComponentToPaint(wrapper);
  });

  it('SSO props', () => {
    const username = wrapper.prop('username');

    expect(username).toEqual(props.username);
  });

  it('No extra sso data', () => {
    const ssoData = wrapper.find('Table#sso-data');
    const extraDataButton = ssoData.find('button.btn-link');
    expect(extraDataButton).toHaveLength(0);
  });

  it('Error fetching sso data', async () => {
    const ssoErrors = {
      errors: [
        {
          code: null,
          dismissible: true,
          text: 'Test Error',
          type: 'danger',
          topic: 'ssoRecords',
        },
      ],
    };
    jest.spyOn(api, 'getSsoRecords').mockImplementationOnce(() => Promise.resolve(ssoErrors));
    wrapper = mount(<SingleSignOnRecordsWrapper {...props} />);
    await waitForComponentToPaint(wrapper);

    const alert = wrapper.find('div.alert');
    expect(alert.text()).toEqual(ssoErrors.errors[0].text);
  });

  it('Extra sso data', async () => {
    const ssoExtraData = {
      type: 'Manual',
      status: 'active',
      updatedAt: Date().toLocaleString(),
    };
    const ssoRecords = [...ssoRecordsData];
    ssoRecords[0].extraData = ssoExtraData;
    jest.spyOn(api, 'getSsoRecords').mockImplementationOnce(() => Promise.resolve(ssoRecordsData));
    wrapper = mount(<SingleSignOnRecordsWrapper {...props} />);
    await waitForComponentToPaint(wrapper);

    const ssoDataTable = wrapper.find('Table#sso-data').at(0);
    const extraDataButton = ssoDataTable.find('button.btn-link').at(0);
    let extraDataModal = wrapper.find('Modal#sso-extra-data').at(0);

    expect(extraDataButton.text()).toEqual('Show');
    expect(extraDataModal.prop('open')).toEqual(false);

    extraDataButton.simulate('click');
    extraDataModal = wrapper.find('Modal#sso-extra-data');

    expect(extraDataModal.prop('open')).toEqual(true);
    // The length here corresponds to dict keys in ssoExtraData
    expect(extraDataModal.find('table tbody tr')).toHaveLength(3);

    extraDataModal.find('button.btn-link').simulate('click');
    extraDataModal = wrapper.find('Modal#sso-extra-data');
    expect(extraDataModal.prop('open')).toEqual(false);
  });
});
