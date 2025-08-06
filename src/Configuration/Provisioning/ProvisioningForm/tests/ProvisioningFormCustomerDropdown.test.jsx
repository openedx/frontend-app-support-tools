import { renderWithRouter } from '@edx/frontend-enterprise-utils';
import { screen } from '@testing-library/react';
import PropTypes from 'prop-types';
import { ProvisioningContext, initialStateValue } from '../../../testData/Provisioning';
import PROVISIONING_PAGE_TEXT from '../../data/constants';
import ProvisioningFormCustomerDropdown from '../ProvisioningFormCustomerDropdown';
import { getSampleCustomers } from '../../../testData/constants';

const { ENTERPRISE_UUID } = PROVISIONING_PAGE_TEXT.FORM.CUSTOMER;
const sampleCustomers = getSampleCustomers(12);

const mockGetCustomers = jest.fn(() => Promise.resolve({ data: { results: sampleCustomers } }));

jest.mock('@edx/frontend-platform/auth', () => ({
  ...jest.requireActual('@edx/frontend-platform/auth'),
  getAuthenticatedHttpClient: jest.fn(() => ({
    get: mockGetCustomers,
  })),
}));

const ProvisioningFormCustomerDropdownWrapper = ({ value = { ...initialStateValue, customers: sampleCustomers } }) => (
  <ProvisioningContext value={value}>
    <ProvisioningFormCustomerDropdown />
  </ProvisioningContext>
);

ProvisioningFormCustomerDropdownWrapper.propTypes = {
  value: PropTypes.shape({
    customers: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        uuid: PropTypes.string,
      }),
    ).isRequired,
  }),
};

describe('ProvisioningFormCustomerDropdown', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders', async () => {
    renderWithRouter(<ProvisioningFormCustomerDropdownWrapper />);
    expect(screen.getByText(ENTERPRISE_UUID.TITLE)).toBeInTheDocument();
    expect(screen.getByText(ENTERPRISE_UUID.SUB_TITLE)).toBeInTheDocument();
    expect(screen.getByText('Not editable')).toBeInTheDocument();
  });
});
