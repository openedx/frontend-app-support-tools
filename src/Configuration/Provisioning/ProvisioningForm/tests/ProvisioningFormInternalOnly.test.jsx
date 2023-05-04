/* eslint-disable react/prop-types */
import { renderWithRouter } from '@edx/frontend-enterprise-utils';
import { fireEvent, screen } from '@testing-library/react';
import { ProvisioningContext, initialStateValue } from '../../../testData';
import PROVISIONING_PAGE_TEXT from '../../data/constants';
import ProvisioningFormInternalOnly from '../ProvisioningFormInternalOnly';

const { INTERNAL_ONLY } = PROVISIONING_PAGE_TEXT.FORM;
const internalOnlyOptions = Object.keys(INTERNAL_ONLY.OPTIONS);

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

    // Checks value for each radio input label
    for (let i = 0; i < internalOnlyOptions.length; i++) {
      expect(screen.getByText(INTERNAL_ONLY.OPTIONS[internalOnlyOptions[i]])).toBeTruthy();
    }
  });
  it('switches active interal only flag', () => {
    renderWithRouter(<ProvisioningFormInternalOnlyWrapper />);

    const internalOnlyButtons = [];
    // Retrieves a list of input elements based on test ids
    for (let i = 0; i < internalOnlyOptions.length; i++) {
      internalOnlyButtons.push(screen.getByTestId(INTERNAL_ONLY.OPTIONS[internalOnlyOptions[i]]));
    }
    // Clicks on each input element and checks if it is checked
    for (let i = 0; i < internalOnlyButtons.length; i++) {
      fireEvent.click(internalOnlyButtons[i]);
      expect(internalOnlyButtons[i].checked).toBeTruthy();
    }
  });
});
