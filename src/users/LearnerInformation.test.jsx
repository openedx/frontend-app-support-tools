import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import * as api from './data/api';
import UserSummaryData from './data/test/userSummary';
import LearnerInformation from './LearnerInformation';
import UserMessagesProvider from '../userMessages/UserMessagesProvider';
import verifiedNameHistoryData from './data/test/verifiedNameHistory';
import {
  enrollmentsData,
} from './data/test/enrollments';
import onboardingStatusData from './data/test/onboardingStatus';
import ssoRecordsData from './data/test/ssoRecords';
import licensesData from './data/test/licenses';
import enterpriseCustomerUsersData from './data/test/enterpriseCustomerUsers';
import {
  entitlementsData,
} from './data/test/entitlements';

const LearnerInformationWrapper = (props) => (
  <IntlProvider locale="en">
    <UserMessagesProvider>
      <LearnerInformation {...props} />
    </UserMessagesProvider>
  </IntlProvider>
);

describe('Learners and Enrollments component', () => {
  const props = {
    user: UserSummaryData.userData,
    changeHandler: jest.fn(() => {}),
  };

  beforeEach(() => {
    jest.spyOn(api, 'getVerifiedNameHistory').mockResolvedValue(verifiedNameHistoryData);
    jest.spyOn(api, 'getEnrollments').mockResolvedValue(enrollmentsData);
    jest.spyOn(api, 'getOnboardingStatus').mockResolvedValue(onboardingStatusData);
    jest.spyOn(api, 'getSsoRecords').mockResolvedValue(
      ssoRecordsData.map((entry) => ({
        ...entry,
        extraData: JSON.parse(entry.extraData),
      })),
    );
    jest.spyOn(api, 'getLicense').mockResolvedValue(licensesData);
    jest.spyOn(api, 'getEntitlements').mockResolvedValue(entitlementsData);
    jest.spyOn(api, 'getEnterpriseCustomerUsers').mockResolvedValue(enterpriseCustomerUsersData);
  });

  it('renders correctly', async () => {
    render(<LearnerInformationWrapper {...props} />);

    await waitFor(() => {
      const tabs = screen.getAllByRole('tab');
      expect(tabs[0]).toHaveTextContent('Account Information');
      expect(tabs[1]).toHaveTextContent('Enrollments/Entitlements');
      expect(tabs[2]).toHaveTextContent('Learner Purchases');
      expect(tabs[3]).toHaveTextContent('SSO/License Info');
      expect(tabs[4]).toHaveTextContent('Learner Credentials');
      expect(tabs[5]).toHaveTextContent('Learner Records');
      expect(tabs[6]).toHaveTextContent('Course Reset');
    });
  });

  it('Account Information Tab', async () => {
    render(<LearnerInformationWrapper {...props} />);
    const tabs = await screen.findAllByRole('tab');
    fireEvent.click(tabs[0]);

    await waitFor(() => {
      expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByText('Account Details')).toBeInTheDocument();
    });
  });

  it('Enrollments/Entitlements Tab', async () => {
    render(<LearnerInformationWrapper {...props} />);
    const tabs = await screen.findAllByRole('tab');
    fireEvent.click(tabs[1]);

    await waitFor(() => {
      expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByText(/Entitlements \(2\)/)).toBeInTheDocument();
      expect(screen.getByText(/Enrollments \(2\)/)).toBeInTheDocument();
    });
  });

  it('Learner Purchases Tab', async () => {
    render(<LearnerInformationWrapper {...props} />);
    const tabs = await screen.findAllByRole('tab');
    fireEvent.click(tabs[2]);

    await waitFor(() => {
      expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByText(/Order History/)).toBeInTheDocument();
    });
  });

  it('SSO Tab', async () => {
    render(<LearnerInformationWrapper {...props} />);
    const tabs = await screen.findAllByRole('tab');
    fireEvent.click(tabs[3]);

    await waitFor(() => {
      expect(tabs[3]).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByText(/Single Sign-on Records/)).toBeInTheDocument();
      expect(screen.getByText(/Licenses Subscription/)).toBeInTheDocument();
    });
  });

  it('Learner Credentials Tab', async () => {
    render(<LearnerInformationWrapper {...props} />);
    const tabs = await screen.findAllByRole('tab');
    fireEvent.click(tabs[4]);

    await waitFor(() => {
      expect(tabs[4]).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByRole('tabpanel', { name: /learner credentials/i })).toBeInTheDocument();
    });
  });

  it('Learner Records Tab', async () => {
    render(<LearnerInformationWrapper {...props} />);
    const tabs = await screen.findAllByRole('tab');
    fireEvent.click(tabs[5]);

    await waitFor(() => {
      expect(tabs[5]).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByRole('tabpanel', { name: /learner records/i })).toBeInTheDocument();
    });
  });

  it('Course Reset Tab', async () => {
    render(<LearnerInformationWrapper {...props} />);
    const tabs = await screen.findAllByRole('tab');
    fireEvent.click(tabs[6]);

    await waitFor(() => {
      expect(tabs[6]).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByRole('tabpanel', { name: /course reset/i })).toBeInTheDocument();
    });
  });
});
