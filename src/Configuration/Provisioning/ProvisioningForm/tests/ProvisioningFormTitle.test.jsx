/* eslint-disable react/prop-types */
import { renderWithRouter } from '@edx/frontend-enterprise-utils';
import { fireEvent, screen } from '@testing-library/react';
import { ProvisioningContext, initialStateValue } from '../../../testData';
import PROVISIONING_PAGE_TEXT from '../../data/constants';
import ProvisioningFormTitle from '../ProvisioningFormTitle';

const { PLAN_TITLE } = PROVISIONING_PAGE_TEXT.FORM;

const ProvisioningFormCustomerWrapper = ({
  value = initialStateValue,
}) => (
  <ProvisioningContext value={value}>
    <ProvisioningFormTitle />
  </ProvisioningContext>
);

describe('ProvisioningFormCustomer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('renders', () => {
    renderWithRouter(<ProvisioningFormCustomerWrapper />);

    expect(screen.getByText(PLAN_TITLE.HEADER)).toBeTruthy();
  });
  it('renders customer title', () => {
    renderWithRouter(<ProvisioningFormCustomerWrapper />);

    const input = screen.getByTestId('customer-plan-title');
    fireEvent.change(input, { target: { value: 'test-title' } });
    const inputValue = input.value;
    expect(screen.getByText(PLAN_TITLE.TITLE)).toBeTruthy();
    expect(inputValue).toEqual('test-title');
  });
});
