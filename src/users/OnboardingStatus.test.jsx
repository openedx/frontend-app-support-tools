import { mount } from 'enzyme';
import React from 'react';
import { waitFor } from '@testing-library/react';
import OnboardingStatus from './OnboardingStatus';
import UserMessagesProvider from '../userMessages/UserMessagesProvider';
import OnboardingStatusData from './data/test/onboardingStatus';
import enrollmentsData from './data/test/enrollments';
import { titleCase, formatDate } from '../utils';

import * as api from './data/api';

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
    jest.spyOn(api, 'getOnboardingStatus').mockImplementationOnce(() => Promise.resolve(OnboardingStatusData));
    wrapper = mount(<OnboardingStatusWrapper {...props} />);
  });

  it('Onboarding props', () => {
    const username = wrapper.prop('username');

    expect(username).toEqual(props.username);
  });

  it('Onboarding Status', () => {
    const verifiedInData = wrapper.find('Table#verified-in-data');
    const verifiedInDataBody = verifiedInData.find('tbody tr td');
    waitFor(() => {
      expect(verifiedInDataBody).toHaveLength(4);
      expect(verifiedInDataBody.at(0).text()).toEqual(OnboardingStatusData.verifiedIn.courseId);
      expect(verifiedInDataBody.at(1).text()).toEqual(titleCase(OnboardingStatusData.verifiedIn.onboardingStatus));
      expect(verifiedInDataBody.at(2).text()).toEqual(formatDate(OnboardingStatusData.verifiedIn.expirationDate));
      expect(verifiedInDataBody.at(3).text()).toEqual('Link');

      const currentStatusData = wrapper.find('Table#current-status-data');
      const currentStatusDataBody = currentStatusData.find('tbody tr td');
      expect(currentStatusDataBody).toHaveLength(4);
      expect(currentStatusDataBody.at(0).text()).toEqual(OnboardingStatusData.currentStatus.courseId);
      expect(currentStatusDataBody.at(1).text()).toEqual(
        titleCase(OnboardingStatusData.currentStatus.onboardingStatus),
      );
      expect(currentStatusDataBody.at(2).text()).toEqual(formatDate(OnboardingStatusData.currentStatus.expirationDate));
      expect(currentStatusDataBody.at(3).text()).toEqual('Link');
    });
  });

  it('No Onboarding Status Data', async () => {
    const onboardingData = { verifiedIn: null, currentStatus: null };

    jest.spyOn(api, 'getOnboardingStatus').mockImplementationOnce(() => Promise.resolve(onboardingData));
    wrapper = mount(<OnboardingStatusWrapper {...props} />);

    const verifiedInDataTable = wrapper.find('div#verified-in-no-data');
    waitFor(() => {
      expect(verifiedInDataTable.text()).toEqual('No Record Found');
      const currentStatusDataTable = wrapper.find('div#current-status-no-data');
      expect(currentStatusDataTable.text()).toEqual('No Record Found');
    });
  });

  it('No Onboarding Status Data with error message', async () => {
    const onboardingData = { verifiedIn: null, currentStatus: null, error: 'Server fetched failed' };

    jest.spyOn(api, 'getOnboardingStatus').mockImplementationOnce(() => Promise.resolve(onboardingData));
    wrapper = mount(<OnboardingStatusWrapper {...props} />);

    const verifiedInDataTable = wrapper.find('div#verified-in-no-data');
    waitFor(() => {
      expect(verifiedInDataTable.text()).toEqual('Server fetched failed');
      const currentStatusDataTable = wrapper.find('div#current-status-no-data');
      expect(currentStatusDataTable.text()).toEqual('Server fetched failed');
    });
  });

  it('No Onboarding Status Data with current status data only', async () => {
    const onboardingData = { ...OnboardingStatusData, verifiedIn: null };

    jest.spyOn(api, 'getEnrollments').mockImplementationOnce(() => Promise.resolve(enrollmentsData));
    jest.spyOn(api, 'getOnboardingStatus').mockImplementationOnce(() => Promise.resolve(onboardingData));
    wrapper = mount(<OnboardingStatusWrapper {...props} />);

    const verifiedInDataTable = wrapper.find('div#verified-in-no-data');
    waitFor(() => {
      expect(verifiedInDataTable.text()).toEqual('No Record Found');

      const currentStatusData = wrapper.find('Table#current-status-data');
      const currentStatusDataBody = currentStatusData.find('tbody tr td');
      expect(currentStatusDataBody).toHaveLength(4);
      expect(currentStatusDataBody.at(0).text()).toEqual(OnboardingStatusData.currentStatus.courseId);
      expect(currentStatusDataBody.at(1).text()).toEqual(
        titleCase(OnboardingStatusData.currentStatus.onboardingStatus),
      );
      expect(currentStatusDataBody.at(2).text()).toEqual(formatDate(OnboardingStatusData.currentStatus.expirationDate));
      expect(currentStatusDataBody.at(3).text()).toEqual('Link');
    });
  });

  it('Onboarding Status Data with null values', async () => {
    const nullData = {
      onboardingStatus: null,
      onboardingLink: null,
      expirationDate: null,
      onboardingPastDue: null,
      onboardingReleaseDate: null,
      reviewRequirementsUrl: null,
      courseId: null,
      enrollmentDate: null,
      instructorDashboardLink: null,
    };
    const onboardingData = { ...OnboardingStatusData, verifiedIn: nullData };

    jest.spyOn(api, 'getOnboardingStatus').mockImplementationOnce(() => Promise.resolve(onboardingData));
    wrapper = mount(<OnboardingStatusWrapper {...props} />);

    const verifiedInData = wrapper.find('Table#verified-in-data');
    const verifiedInDataBody = verifiedInData.find('tbody tr td');
    waitFor(() => {
      expect(verifiedInDataBody).toHaveLength(4);
      expect(verifiedInDataBody.at(0).text()).toEqual('No Course');
      expect(verifiedInDataBody.at(1).text()).toEqual('See Instructor Dashboard');
      expect(verifiedInDataBody.at(2).text()).toEqual('N/A');
      expect(verifiedInDataBody.at(3).text()).toEqual('N/A');
    });
  });

  it('Onboarding Status Data is loading', async () => {
    const onboardingData = null;

    jest.spyOn(api, 'getOnboardingStatus').mockImplementationOnce(() => Promise.resolve(onboardingData));
    wrapper = mount(<OnboardingStatusWrapper {...props} />);
    expect(wrapper.find('.sr-only').text()).toEqual('Loading..');
  });
});
