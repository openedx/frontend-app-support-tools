/* eslint-disable react/prop-types */
import { renderWithRouter } from '@edx/frontend-enterprise-utils';
import { fireEvent, screen } from '@testing-library/react';
import { ProvisioningContext, initialStateValue } from '../../../testData/Provisioning';
import PROVISIONING_PAGE_TEXT from '../../data/constants';
import ProvisioningFormInternalOnly from '../ProvisioningFormInternalOnly';

const { INTERNAL_ONLY } = PROVISIONING_PAGE_TEXT.FORM;

const ProvisioningFormInternalOnlyWrapper = ({
  value = initialStateValue,
}) => (
  <ProvisioningContext value={value}>
    <ProvisioningFormInternalOnly />
  </ProvisioningContext>
);

describe('ProvisioningFormSubsidy', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('renders', () => {
    renderWithRouter(<ProvisioningFormInternalOnlyWrapper />);

    expect(screen.getByText(INTERNAL_ONLY.TITLE)).toBeTruthy();
    expect(screen.getByText(INTERNAL_ONLY.CHECKBOX.label)).toBeTruthy();
    expect(screen.getByText(INTERNAL_ONLY.CHECKBOX.description)).toBeTruthy();
  });
  it('default value is false', () => {
    renderWithRouter(<ProvisioningFormInternalOnlyWrapper />);

    const checkbox = screen.getByTestId('internal-only-checkbox');

    expect(checkbox.checked).toBeFalsy();
  });
  it('toggles checkbox state on click', () => {
    renderWithRouter(<ProvisioningFormInternalOnlyWrapper />);

    const checkbox = screen.getByTestId('internal-only-checkbox');

    fireEvent.click(checkbox);
    expect(checkbox.checked).toBeTruthy();

    fireEvent.click(checkbox);
    expect(checkbox.checked).toBeFalsy();
  });
});
