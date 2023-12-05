import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PolicyDetailHeader from '../PolicyDetailHeader';
import { initialStateValue, ProvisioningContext } from '../../../../testData/Provisioning';

const PolicyDetailHeaderWrapper = ({
  // eslint-disable-next-line react/prop-types
  value = initialStateValue,
  // eslint-disable-next-line react/prop-types
  index = 0,
}) => (
  <ProvisioningContext value={value}>
    <PolicyDetailHeader index={index} />
  </ProvisioningContext>
);

describe('PolicyHeader', () => {
  it('renders the component with the correct budget count', () => {
    const value = {
      ...initialStateValue,
      formData: {
        ...initialStateValue.formData,
        policies: [
          {
            predefinedQueryType: 'openCourses',
          },
        ],
      },
    };

    render(<PolicyDetailHeaderWrapper value={value} />);
    expect(screen.getByText('Budget #1')).toBeInTheDocument();
  });

  it('renders Executive Education if policies length is greater than 1', () => {
    const value = {
      ...initialStateValue,
      formData: {
        ...initialStateValue.formData,
        policies: [
          {
            predefinedQueryType: 'openCourses',
          },
          {
            predefinedQueryType: 'executiveEducation',
          },
        ],
      },
    };

    render(<PolicyDetailHeaderWrapper value={value} index={1} />);
    expect(screen.getByText('Budget #2')).toBeInTheDocument();
  });
});
