/* eslint-disable react/prop-types */
import { renderWithRouter } from '@edx/frontend-enterprise-utils';
import { screen, waitFor } from '@testing-library/react';
import { ProvisioningContext, initialStateValue } from '../../../testData/Provisioning';
import PROVISIONING_PAGE_TEXT from '../../data/constants';
import ProvisioningForm from '../ProvisioningForm';

const { FORM } = PROVISIONING_PAGE_TEXT;

const ProvisioningFormWrapper = ({
  value = initialStateValue,
}) => (
  <ProvisioningContext value={value}>
    <ProvisioningForm />
  </ProvisioningContext>
);

// TODO: Integration Tests
describe('ProvisioningForm', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('renders on true multiple funds', () => {
    renderWithRouter(<ProvisioningFormWrapper value={{
      ...initialStateValue,
      multipleFunds: true,
    }}
    />);
    expect(screen.getByText(FORM.SUB_TITLE)).toBeTruthy();
  });
  it('renders on false multiple funds', () => {
    renderWithRouter(<ProvisioningFormWrapper value={{
      ...initialStateValue,
      multipleFunds: false,
    }}
    />);
    expect(screen.getByText(FORM.SUB_TITLE)).toBeTruthy();
  });
  it('should render policy container given a sample catalog query', async () => {
    const updatedStateValue = {
      ...initialStateValue,
      alertMessage: '',
      multipleFunds: true,
    };
    renderWithRouter(<ProvisioningFormWrapper value={updatedStateValue} />);
    await waitFor(() => expect(screen.queryByText(FORM.ALERTS.unselectedAccountType)).toBeFalsy());
  });
});
