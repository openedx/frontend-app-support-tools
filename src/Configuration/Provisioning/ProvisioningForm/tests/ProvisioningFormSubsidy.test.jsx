/* eslint-disable react/prop-types */
import { renderWithRouter } from '@edx/frontend-enterprise-utils';
import { fireEvent, screen } from '@testing-library/react';
import ProvisioningFormSubsidy from '../ProvisioningFormSubsidy';
import { ProvisioningContext, initialStateValue } from '../../../testData';
import PROVISIONING_PAGE_TEXT from '../../data/constants';

const { SUBSIDY_TYPE } = PROVISIONING_PAGE_TEXT.FORM;

const ProvisioningFormSubsidyWrapper = ({
  value = initialStateValue,
}) => (
  <ProvisioningContext value={value}>
    <ProvisioningFormSubsidy />
  </ProvisioningContext>
);

describe('ProvisioningFormSubsidy', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('renders', () => {
    renderWithRouter(<ProvisioningFormSubsidyWrapper />);

    expect(screen.getByText(SUBSIDY_TYPE.TITLE)).toBeTruthy();

    const subsidyTypeOptions = Object.keys(SUBSIDY_TYPE.OPTIONS);
    // Checks value for each radio input label
    for (let i = 0; i < subsidyTypeOptions.length; i++) {
      expect(screen.getByText(SUBSIDY_TYPE.OPTIONS[subsidyTypeOptions[i]])).toBeTruthy();
    }
  });
  it('switches active subsidy type', () => {
    renderWithRouter(<ProvisioningFormSubsidyWrapper />);

    const subsidyTypeOptions = Object.keys(SUBSIDY_TYPE.OPTIONS);
    const subsidyButtons = [];
    // Retrieves a list of input elements based on test ids
    for (let i = 0; i < subsidyTypeOptions.length; i++) {
      subsidyButtons.push(screen.getByTestId(SUBSIDY_TYPE.OPTIONS[subsidyTypeOptions[i]]));
    }
    // Clicks on each input element and checks if it is checked
    for (let i = 0; i < subsidyButtons.length; i++) {
      fireEvent.click(subsidyButtons[i]);
      expect(subsidyButtons[i].checked).toBeTruthy();
    }
  });
});
