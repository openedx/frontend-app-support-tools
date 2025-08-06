import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PolicyLimitsDetail from '../PolicyLimitsDetail';
import { initialStateValue, ProvisioningContext } from '../../../../testData/Provisioning';

const PolicyLimitsDetailWrapper = ({
  // eslint-disable-next-line react/prop-types
  value = initialStateValue,
  // eslint-disable-next-line react/prop-types
  index = 0,
}) => (
  <ProvisioningContext value={value}>
    <PolicyLimitsDetail index={index} />
  </ProvisioningContext>
);

describe('PolicyLimitsDetail', () => {
  it('renders the per learner limit amount if not null', () => {
    const value = {
      ...initialStateValue,
      formData: {
        ...initialStateValue.formData,
        policies: [
          {
            perLearnerCap: true,
            perLearnerCapAmount: 1000,
          },
        ],
      },
    };
    render(<PolicyLimitsDetailWrapper value={value} />);
    expect(screen.getByText('Define limits')).toBeInTheDocument();
    expect(screen.getByText('Per learner spend limit ($)')).toBeInTheDocument();
    expect(screen.getByText('$10')).toBeInTheDocument();
  });

  it('does not render the per learner limit amount if null', () => {
    const value = {
      ...initialStateValue,
      formData: {
        ...initialStateValue.formData,
        policies: [
          {
            perLearnerCap: false,
            perLearnerCapAmount: 1000,
          },
        ],
      },
    };
    render(<PolicyLimitsDetailWrapper value={value} />);
    expect(screen.getByText('No, first come first serve')).toBeInTheDocument();
    expect(screen.queryByText('Define limits')).toBeNull();
    expect(screen.queryByText('Per learner spend limit ($)')).toBeNull();
  });
});
