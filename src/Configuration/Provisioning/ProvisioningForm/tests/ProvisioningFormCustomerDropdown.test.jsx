/* eslint-disable react/prop-types */
import { renderWithRouter } from '@edx/frontend-enterprise-utils';
import { fireEvent, screen, act } from '@testing-library/react';
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

const ProvisioningFormCustomerDropdownWrapper = ({
  value = {
    ...initialStateValue,
    customers: sampleCustomers,
  },
}) => (
  <ProvisioningContext value={value}>
    <ProvisioningFormCustomerDropdown />
  </ProvisioningContext>
);

describe('ProvisioningFormCustomerDropdown', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('renders', async () => {
    renderWithRouter(<ProvisioningFormCustomerDropdownWrapper />);

    expect(screen.getByText(ENTERPRISE_UUID.TITLE)).toBeTruthy();
    expect(screen.getByText(ENTERPRISE_UUID.SUB_TITLE)).toBeTruthy();
    expect(screen.getByText('Not editable')).toBeTruthy();
  });
  it('renders the customer dropdown options', async () => {
    renderWithRouter(<ProvisioningFormCustomerDropdownWrapper />);

    const autoSuggestInput = screen.getByTestId('customer-uuid');
    const autoSuggestButton = screen.getByRole('button');

    expect(screen.getByText(ENTERPRISE_UUID.TITLE)).toBeTruthy();
    expect(screen.getByText(ENTERPRISE_UUID.SUB_TITLE)).toBeTruthy();

    fireEvent.change(autoSuggestInput, { target: { value: '' } });

    // open dropdown
    fireEvent.click(autoSuggestButton);

    expect(screen.getByText(ENTERPRISE_UUID.DROPDOWN_DEFAULT)).toBeTruthy();

    // close dropdown
    fireEvent.click(autoSuggestButton);
    expect(screen.queryByText(ENTERPRISE_UUID.DROPDOWN_DEFAULT)).toBeFalsy();

    fireEvent.change(autoSuggestInput, { target: { value: 'Customer 1' } });
    // open dropdown
    // open dropdown
    fireEvent.click(autoSuggestButton);
    fireEvent.click(autoSuggestButton);

    act(async () => {
      const autoSuggestDropdownButtons = await screen.findAllByRole('button');
      const filteredDropdowns = autoSuggestDropdownButtons.filter((element) => element.textContent.includes('Customer'));

      expect(filteredDropdowns[1]).toBeTruthy();

      fireEvent.click(filteredDropdowns[1]);
      expect(autoSuggestInput.getAttribute('value')).toContain(filteredDropdowns[1].textContent);
    });
  });
});
