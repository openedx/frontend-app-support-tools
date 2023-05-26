/* eslint-disable react/prop-types */
import { renderWithRouter } from '@edx/frontend-enterprise-utils';
import { fireEvent, screen } from '@testing-library/react';
import { ProvisioningContext, initialStateValue } from '../../../testData';
import PROVISIONING_PAGE_TEXT from '../../data/constants';
import ProvisioningFormCustomer from '../ProvisioningFormCustomer';

const { CUSTOMER } = PROVISIONING_PAGE_TEXT.FORM;
const testFinancialLinkage = '0000abc12a332c1444';
const ProvisioningFormCustomerWrapper = ({
  value = initialStateValue,
}) => (
  <ProvisioningContext value={value}>
    <ProvisioningFormCustomer />
  </ProvisioningContext>
);

describe('ProvisioningFormCustomer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('renders', () => {
    renderWithRouter(<ProvisioningFormCustomerWrapper />);

    expect(screen.getByText(CUSTOMER.TITLE)).toBeTruthy();
  });
  it('renders customer uuid', () => {
    renderWithRouter(<ProvisioningFormCustomerWrapper />);

    const input = screen.getByTestId('customer-uuid');
    fireEvent.change(input, { target: { value: 'test-title' } });
    const inputValue = input.getAttribute('value');

    expect(screen.getByText(CUSTOMER.ENTERPRISE_UUID.TITLE)).toBeTruthy();
    expect(inputValue).toEqual('test-title');
  });
  it('renders customer financial linkage', () => {
    renderWithRouter(<ProvisioningFormCustomerWrapper />);
    const input = screen.getByTestId('customer-financial-identifier');
    fireEvent.change(input, { target: { value: testFinancialLinkage } });
    const inputValue = input.getAttribute('value');

    expect(screen.getByText(CUSTOMER.ENTERPRISE_UUID.TITLE)).toBeTruthy();
    expect(inputValue).toEqual(testFinancialLinkage);
  });
  it('renders customer financial linkage with one additional character', () => {
    renderWithRouter(<ProvisioningFormCustomerWrapper />);
    const input = screen.getByTestId('customer-financial-identifier');
    fireEvent.change(input, { target: { value: testFinancialLinkage } });
    const inputValue = input.getAttribute('value');

    expect(screen.getByText(CUSTOMER.ENTERPRISE_UUID.TITLE)).toBeTruthy();
    expect(inputValue).toEqual(testFinancialLinkage);

    const modifiedTestFinancialLinkage = `${testFinancialLinkage}1`;
    fireEvent.change(input, { target: { value: modifiedTestFinancialLinkage } });
    const updatedInputValue = input.getAttribute('value');

    expect(updatedInputValue).toEqual(testFinancialLinkage);
  });
});
