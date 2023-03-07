/* eslint-disable react/prop-types */
import { renderWithRouter } from '@edx/frontend-enterprise-utils';
import { screen } from '@testing-library/react';
import { ProvisioningContext, initialStateValue } from '../../../testData';
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
  it('renders', () => {
    renderWithRouter(<ProvisioningFormWrapper value={{
      ...initialStateValue,
      multipleFunds: true,
    }}
    />);
    expect(screen.getByText(FORM.SUB_TITLE)).toBeTruthy();
  });
});
