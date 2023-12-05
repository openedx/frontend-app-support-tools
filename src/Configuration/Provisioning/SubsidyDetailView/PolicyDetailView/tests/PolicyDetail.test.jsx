import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PolicyDetail from '../PolicyDetail';
import { initialStateValue, ProvisioningContext } from '../../../../testData/Provisioning';
import { sampleSinglePolicyPredefinedCatalogQueryFormData } from '../../../../testData/constants';

const PolicyDetailWrapper = ({
  // eslint-disable-next-line react/prop-types
  value = initialStateValue,
  // eslint-disable-next-line react/prop-types
  index = 0,
}) => (
  <ProvisioningContext value={value}>
    <PolicyDetail index={index} />
  </ProvisioningContext>
);

describe('PolicyDetail', () => {
  it('renders the component and formats spend limit', () => {
    const value = {
      ...initialStateValue,
      formData: {
        ...sampleSinglePolicyPredefinedCatalogQueryFormData,
        policies: sampleSinglePolicyPredefinedCatalogQueryFormData.policies,
      },
    };
    render(<PolicyDetailWrapper value={value} />);
    expect(screen.getByText('Budget details')).toBeInTheDocument();
    expect(screen.getByText('Display name')).toBeInTheDocument();
    expect(screen.getByText('I love Executive Education Only')).toBeInTheDocument();
    expect(screen.getByText('Budget starting balance ($)')).toBeInTheDocument();
    expect(screen.getByText('Not editable')).toBeTruthy();
    expect(screen.getByText('$2,500')).toBeInTheDocument();
  });
});
