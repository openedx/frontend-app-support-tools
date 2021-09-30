import { mount } from 'enzyme';
import React from 'react';
import { waitForComponentToPaint } from '../../setupTest';
import OnboardingStatus from './OnboardingStatus';
import UserMessagesProvider from '../../userMessages/UserMessagesProvider';
import onboardingStatusData from '../data/test/onboardingStatus';
import enrollmentsData from '../data/test/enrollments';
import { titleCase, formatDate } from '../../utils';

import * as api from '../data/api';

const OnboardingStatusWrapper = (props) => (
  <UserMessagesProvider>
    <OnboardingStatus {...props} />
  </UserMessagesProvider>
);

describe('Onboarding Status', () => {
  let wrapper;
  const props = {
    username: 'edX',
  };

  beforeEach(async () => {
    jest.spyOn(api, 'getEnrollments').mockImplementationOnce(() => Promise.resolve(enrollmentsData));
    jest.spyOn(api, 'getOnboardingStatus').mockImplementationOnce(() => Promise.resolve(onboardingStatusData));
    wrapper = mount(<OnboardingStatusWrapper {...props} />);
    await waitForComponentToPaint(wrapper);
  });

  it('Onboaridng props', () => {
    const username = wrapper.prop('username');

    expect(username).toEqual(props.username);
  });
  it('Onboarding Status', () => {
    const dataTable = wrapper.find('Table#proctoring-data');
    const dataBody = dataTable.find('tbody tr td');
    expect(dataBody).toHaveLength(3);
    expect(dataBody.at(0).text()).toEqual(titleCase(onboardingStatusData.onboardingStatus));
    expect(dataBody.at(1).text()).toEqual(formatDate(onboardingStatusData.expirationDate));
    expect(dataBody.at(2).text()).toEqual('Link');
  });
  it('No Onboarding Status Data', async () => {
    const onboardingData = { ...onboardingStatusData, onboardingStatus: null, onboardingLink: null };

    jest.spyOn(api, 'getEnrollments').mockImplementationOnce(() => Promise.resolve(enrollmentsData));
    jest.spyOn(api, 'getOnboardingStatus').mockImplementationOnce(() => Promise.resolve(onboardingData));
    wrapper = mount(<OnboardingStatusWrapper {...props} />);
    await waitForComponentToPaint(wrapper);

    const dataTable = wrapper.find('Table#proctoring-data');
    const dataBody = dataTable.find('tbody tr td');
    expect(dataBody).toHaveLength(3);
    expect(dataBody.at(0).text()).toEqual('Not Started');
    expect(dataBody.at(1).text()).toEqual(formatDate(onboardingStatusData.expirationDate));
    expect(dataBody.at(2).text()).toEqual('N/A');
  });
});
