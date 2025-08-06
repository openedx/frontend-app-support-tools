import React from 'react';
import {
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import OnboardingStatus from './OnboardingStatus';
import UserMessagesProvider from '../userMessages/UserMessagesProvider';
import OnboardingStatusData from './data/test/onboardingStatus';
import enrollmentsData from './data/test/enrollments';
import { titleCase, formatDate } from '../utils';
import * as api from './data/api';

const renderWithProviders = (props = {}) => (
  render(
    <UserMessagesProvider>
      <OnboardingStatus {...props} />
    </UserMessagesProvider>,
  )
);

describe('Onboarding Status', () => {
  const props = { username: 'edX' };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('Onboarding props', () => {
    renderWithProviders(props);
    expect(props.username).toEqual('edX');
  });

  it('Onboarding Status', async () => {
    jest.spyOn(api, 'getOnboardingStatus').mockResolvedValue(OnboardingStatusData);

    renderWithProviders(props);

    await waitFor(() => {
      const tables = screen.getAllByRole('table');
      expect(tables.length).toBeGreaterThanOrEqual(2);

      const verifiedInTable = tables[0];
      const verifiedCells = within(verifiedInTable).getAllByRole('cell');

      expect(verifiedCells).toHaveLength(4);
      expect(verifiedCells[0]).toHaveTextContent(OnboardingStatusData.verifiedIn.courseId);
      expect(verifiedCells[1]).toHaveTextContent(
        titleCase(OnboardingStatusData.verifiedIn.onboardingStatus),
      );
      expect(verifiedCells[2]).toHaveTextContent(
        formatDate(OnboardingStatusData.verifiedIn.expirationDate),
      );
      expect(verifiedCells[3]).toHaveTextContent('Link');

      const currentStatusTable = tables[1];
      const currentCells = within(currentStatusTable).getAllByRole('cell');

      expect(currentCells).toHaveLength(4);
      expect(currentCells[0]).toHaveTextContent(OnboardingStatusData.currentStatus.courseId);
      expect(currentCells[1]).toHaveTextContent(
        titleCase(OnboardingStatusData.currentStatus.onboardingStatus),
      );
      expect(currentCells[2]).toHaveTextContent(
        formatDate(OnboardingStatusData.currentStatus.expirationDate),
      );
      expect(currentCells[3]).toHaveTextContent('Link');
    });
  });

  it('No Onboarding Status Data', async () => {
    jest.spyOn(api, 'getOnboardingStatus').mockResolvedValue({
      verifiedIn: null,
      currentStatus: null,
    });

    renderWithProviders(props);

    await waitFor(() => {
      const noRecords = screen.getAllByText('No Record Found');
      expect(noRecords).toHaveLength(2);
    });
  });

  it('No Onboarding Status Data with error message', async () => {
    jest.spyOn(api, 'getOnboardingStatus').mockResolvedValue({
      verifiedIn: null,
      currentStatus: null,
      error: 'Server fetched failed',
    });

    renderWithProviders(props);

    await waitFor(() => {
      const errs = screen.getAllByText('Server fetched failed');
      expect(errs).toHaveLength(2);
    });
  });

  it('No Onboarding Status Data with current status data only', async () => {
    const onboardingData = { ...OnboardingStatusData, verifiedIn: null };

    jest.spyOn(api, 'getEnrollments').mockResolvedValue(enrollmentsData);
    jest.spyOn(api, 'getOnboardingStatus').mockResolvedValue(onboardingData);

    renderWithProviders(props);

    await waitFor(() => {
      const noRecords = screen.getAllByText('No Record Found');
      expect(noRecords.length).toBeGreaterThanOrEqual(1);

      const tables = screen.getAllByRole('table');
      const currentTable = tables[0];
      const currentCells = within(currentTable).getAllByRole('cell');

      expect(currentCells).toHaveLength(4);
      expect(currentCells[0]).toHaveTextContent(OnboardingStatusData.currentStatus.courseId);
      expect(currentCells[1]).toHaveTextContent(
        titleCase(OnboardingStatusData.currentStatus.onboardingStatus),
      );
      expect(currentCells[2]).toHaveTextContent(
        formatDate(OnboardingStatusData.currentStatus.expirationDate),
      );
      expect(currentCells[3]).toHaveTextContent('Link');
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

    jest.spyOn(api, 'getOnboardingStatus').mockResolvedValue(onboardingData);

    renderWithProviders(props);

    await waitFor(() => {
      const tables = screen.getAllByRole('table');
      const verifiedInTable = tables[0];
      const verifiedCells = within(verifiedInTable).getAllByRole('cell');

      expect(verifiedCells).toHaveLength(4);
      expect(verifiedCells[0]).toHaveTextContent('No Course');
      expect(verifiedCells[1]).toHaveTextContent('See Instructor Dashboard');
      expect(verifiedCells[2]).toHaveTextContent('N/A');
      expect(verifiedCells[3]).toHaveTextContent('N/A');
    });
  });

  it('Onboarding Status Data is loading', async () => {
    jest.spyOn(api, 'getOnboardingStatus').mockResolvedValue(null);

    renderWithProviders(props);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
