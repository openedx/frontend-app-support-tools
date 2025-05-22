import { render, screen } from '@testing-library/react';
import PolicyDistributionDetail from '../PolicyDistributionDetail';
import { initialStateValue, ProvisioningContext } from '../../../../testData/Provisioning';
import '@testing-library/jest-dom';

describe('PolicyDistributionDetail', () => {
  it('renders Learner selects option', () => {
    const value = {
      ...initialStateValue,
      formData: {
        ...initialStateValue.formData,
        policies: [
          {
            policyType: 'PerLearnerSpendCreditAccessPolicy',
          },
        ],
      },
    };
    const policyType = 'PerLearnerSpendCreditAccessPolicy';
    render(
      <ProvisioningContext value={value}>
        <PolicyDistributionDetail policyType={policyType} />
      </ProvisioningContext>,
    );
    expect(screen.getByText('Budget distribution mode')).toBeInTheDocument();
    expect(screen.getByText('How is content selected?')).toBeInTheDocument();
    expect(screen.getByText('Browse and Enroll or LMS')).toBeInTheDocument();
    expect(screen.getByText('Not editable')).toBeInTheDocument();
  });
  it('renders Admin selects option', () => {
    const value = {
      ...initialStateValue,
      formData: {
        ...initialStateValue.formData,
        policies: [
          {
            policyType: 'AssignedLearnerCreditAccessPolicy',
          },
        ],
      },
    };
    const policyType = 'AssignedLearnerCreditAccessPolicy';
    render(
      <ProvisioningContext value={value}>
        <PolicyDistributionDetail policyType={policyType} />
      </ProvisioningContext>,
    );
    expect(screen.getByText('Admin assign')).toBeInTheDocument();
    expect(screen.getByText('Not editable')).toBeInTheDocument();
  });
});
