import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import PolicyContainer from '../PolicyContainer';
import { initialStateValue, ProvisioningContext } from '../../../../testData/Provisioning';
import { sampleSinglePolicyPredefinedCatalogQueryFormData } from '../../../../testData/constants';

const PolicyContainerWrapper = ({
  // eslint-disable-next-line react/prop-types
  value = initialStateValue,
}) => (
  <ProvisioningContext value={value}>
    <PolicyContainer />
  </ProvisioningContext>
);

describe('PolicyContainer', () => {
  it('renders the component wih details', () => {
    const value = {
      ...initialStateValue,
      formData: {
        ...sampleSinglePolicyPredefinedCatalogQueryFormData,
        policies: sampleSinglePolicyPredefinedCatalogQueryFormData.policies,
      },
    };
    render(<PolicyContainerWrapper value={value} />);
    expect(screen.getByText('Budget details')).toBeInTheDocument();
    expect(screen.getByText('I love Executive Education Only')).toBeInTheDocument();
    expect(screen.getByText('Executive Education')).toBeInTheDocument();
    expect(screen.getByText('Browse and Enroll or LMS')).toBeInTheDocument();
    expect(screen.getByText('Create learner spend limits?')).toBeInTheDocument();
    expect(screen.getByText('Per learner spend limit ($)')).toBeInTheDocument();
    expect(screen.getByText('$2,500')).toBeInTheDocument();
    expect(screen.getByText('$20')).toBeInTheDocument();
  });
});
