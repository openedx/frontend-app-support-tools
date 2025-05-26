import { render, screen } from '@testing-library/react';
import React from 'react';
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
  let unmountComponent;
  let getOnBoardingStatusMock;
  const props = {
    username: 'edX',
  };

  beforeEach(async () => {
    getOnBoardingStatusMock = jest.spyOn(api, 'getOnboardingStatus').mockImplementationOnce(() => Promise.resolve(OnboardingStatusData));
    const { unmount } = render(<OnboardingStatusWrapper {...props} />);
    unmountComponent = unmount;
  });

  it('Onboarding props', () => {
    expect(getOnBoardingStatusMock).toBeCalledWith(props.username);
  });

  it('Onboarding Status', async () => {
    const verifiedInData = await screen.findByTestId('verified-in-data');
    const verifiedInDataBody = verifiedInData.querySelectorAll('tbody tr td');
    expect(verifiedInDataBody).toHaveLength(4);
    expect(verifiedInDataBody[0].textContent).toEqual(OnboardingStatusData.verifiedIn.courseId);
    expect(verifiedInDataBody[1].textContent).toEqual(titleCase(OnboardingStatusData.verifiedIn.onboardingStatus));
    expect(verifiedInDataBody[2].textContent).toEqual(formatDate(OnboardingStatusData.verifiedIn.expirationDate));
    expect(verifiedInDataBody[3].textContent).toEqual('Link');

    const currentStatusData = await screen.findByTestId('current-status-data');
    const currentStatusDataBody = currentStatusData.querySelectorAll('tbody tr td');
    expect(currentStatusDataBody).toHaveLength(4);
    expect(currentStatusDataBody[0].textContent).toEqual(OnboardingStatusData.currentStatus.courseId);
    expect(currentStatusDataBody[1].textContent).toEqual(
      titleCase(OnboardingStatusData.currentStatus.onboardingStatus),
    );
    expect(currentStatusDataBody[2].textContent).toEqual(formatDate(OnboardingStatusData.currentStatus.expirationDate));
    expect(currentStatusDataBody[3].textContent).toEqual('Link');
  });

  it('No Onboarding Status Data', async () => {
    const onboardingData = { verifiedIn: null, currentStatus: null };

    jest.spyOn(api, 'getOnboardingStatus').mockImplementationOnce(() => Promise.resolve(onboardingData));
    render(<OnboardingStatusWrapper {...props} />);

    const verifiedInDataTable = await screen.findByTestId('verified-in-no-data');
    expect(verifiedInDataTable.textContent).toEqual('No Record Found');
    const currentStatusDataTable = await screen.findByTestId('current-status-no-data');
    expect(currentStatusDataTable.textContent).toEqual('No Record Found');
  });

  it('No Onboarding Status Data with error message', async () => {
    const onboardingData = { verifiedIn: null, currentStatus: null, error: 'Server fetched failed' };

    jest.spyOn(api, 'getOnboardingStatus').mockImplementationOnce(() => Promise.resolve(onboardingData));
    render(<OnboardingStatusWrapper {...props} />);

    const verifiedInDataTable = await screen.findByTestId('verified-in-no-data');
    expect(verifiedInDataTable.textContent).toEqual('Server fetched failed');
    const currentStatusDataTable = await screen.findByTestId('current-status-no-data');
    expect(currentStatusDataTable.textContent).toEqual('Server fetched failed');
  });

  it('No Onboarding Status Data with current status data only', async () => {
    unmountComponent();
    const onboardingData = { ...OnboardingStatusData, verifiedIn: null };

    jest.spyOn(api, 'getEnrollments').mockImplementationOnce(() => Promise.resolve(enrollmentsData));
    jest.spyOn(api, 'getOnboardingStatus').mockImplementationOnce(() => Promise.resolve(onboardingData));
    render(<OnboardingStatusWrapper {...props} />);

    const verifiedInDataTable = await screen.findByTestId('verified-in-no-data');
    expect(verifiedInDataTable.textContent).toEqual('No Record Found');

    const currentStatusData = await screen.findByTestId('current-status-data');
    const currentStatusDataBody = currentStatusData.querySelectorAll('tbody tr td');
    expect(currentStatusDataBody).toHaveLength(4);
    expect(currentStatusDataBody[0].textContent).toEqual(OnboardingStatusData.currentStatus.courseId);
    expect(currentStatusDataBody[1].textContent).toEqual(
      titleCase(OnboardingStatusData.currentStatus.onboardingStatus),
    );
    expect(currentStatusDataBody[2].textContent).toEqual(formatDate(OnboardingStatusData.currentStatus.expirationDate));
    expect(currentStatusDataBody[3].textContent).toEqual('Link');
  });

  it('Onboarding Status Data with null values', async () => {
    unmountComponent();
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
    render(<OnboardingStatusWrapper {...props} />);

    const verifiedInData = await screen.findByTestId('verified-in-data');
    const verifiedInDataBody = verifiedInData.querySelectorAll('tbody tr td');
    expect(verifiedInDataBody).toHaveLength(4);
    expect(verifiedInDataBody[0].textContent).toEqual('No Course');
    expect(verifiedInDataBody[1].textContent).toEqual('See Instructor Dashboard');
    expect(verifiedInDataBody[2].textContent).toEqual('N/A');
    expect(verifiedInDataBody[3].textContent).toEqual('N/A');
  });

  it('Onboarding Status Data is loading', async () => {
    const onboardingData = null;

    jest.spyOn(api, 'getOnboardingStatus').mockImplementationOnce(() => Promise.resolve(onboardingData));
    render(<OnboardingStatusWrapper {...props} />);
    const loading = await screen.findByTestId('page-loading');
    expect(loading.textContent).toEqual('Loading..');
  });
});
