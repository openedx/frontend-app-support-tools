import { mount } from 'enzyme';
import React from 'react';
import { waitFor } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import SingleSignOnRecords from './SingleSignOnRecords';
import UserMessagesProvider from '../userMessages/UserMessagesProvider';
import ssoRecordsData from './data/test/ssoRecords';

import * as api from './data/api';

const SingleSignOnRecordsWrapper = (props) => (
  <IntlProvider locale="en">
    <UserMessagesProvider>
      <SingleSignOnRecords {...props} />
    </UserMessagesProvider>
  </IntlProvider>
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
  });

  it('SSO props', () => {
    const username = wrapper.prop('username');
    expect(username).toEqual(props.username);
  });

  it('SSO Data', () => {
    const cardList = wrapper.find('Card');
    waitFor(() => {
      expect(cardList).toHaveLength(ssoRecords.length);
      expect(wrapper.find('h3#sso-title-header').text()).toEqual('Single Sign-on Records');
    });
  });

  it('No SSO Data', async () => {
    jest.spyOn(api, 'getSsoRecords').mockImplementationOnce(() => Promise.resolve([]));
    wrapper = mount(<SingleSignOnRecordsWrapper {...props} />);

    expect(wrapper.find('h3#sso-title-header').text()).toEqual('Single Sign-on Records');
    const cardList = wrapper.find('Card');
    expect(cardList).toHaveLength(0);

    const noRecordMessage = wrapper.find('p');
    waitFor(() => expect(noRecordMessage.text()).toEqual('No SSO Records were Found.'));
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

    const alert = wrapper.find('div.alert');
    waitFor(() => expect(alert.text()).toEqual(ssoErrors.errors[0].text));
  });
});
