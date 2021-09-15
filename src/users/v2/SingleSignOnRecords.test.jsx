import { mount } from 'enzyme';
import React from 'react';
import { waitForComponentToPaint } from '../../setupTest';
import SingleSignOnRecords from './SingleSignOnRecords';
import UserMessagesProvider from '../../userMessages/UserMessagesProvider';
import ssoRecordsData from '../data/test/ssoRecords';

import * as api from '../data/api';

const SingleSignOnRecordsWrapper = (props) => (
  <UserMessagesProvider>
    <SingleSignOnRecords {...props} />
  </UserMessagesProvider>
);

describe('Single Sign On Records', () => {
  // prepare data
  const ssoRecords = ssoRecordsData.map((entry) => ({
    ...entry,
    extraData: JSON.parse(entry.extraData),
  }));

  let wrapper;
  const props = {
    username: 'edX',
  };

  beforeEach(async () => {
    jest.spyOn(api, 'getSsoRecords').mockImplementationOnce(() => Promise.resolve(ssoRecords));
    wrapper = mount(<SingleSignOnRecordsWrapper {...props} />);
    await waitForComponentToPaint(wrapper);
  });

  it('SSO props', () => {
    const username = wrapper.prop('username');
    expect(username).toEqual(props.username);
  });

  it('SSO Data', () => {
    const cardList = wrapper.find('Card');
    expect(cardList).toHaveLength(ssoRecords.length);
    expect(wrapper.find('h3#sso-title-header').text()).toEqual('SSO Records');
  });

  it('No SSO Data', async () => {
    jest.spyOn(api, 'getSsoRecords').mockImplementationOnce(() => Promise.resolve([]));
    wrapper = mount(<SingleSignOnRecordsWrapper {...props} />);
    await waitForComponentToPaint(wrapper);

    expect(wrapper.find('h3#sso-title-header').text()).toEqual('SSO Records');
    const cardList = wrapper.find('Card');
    expect(cardList).toHaveLength(0);

    const noRecordMessage = wrapper.find('p');
    expect(noRecordMessage.text()).toEqual('No SSO Records were Found.');
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
});
