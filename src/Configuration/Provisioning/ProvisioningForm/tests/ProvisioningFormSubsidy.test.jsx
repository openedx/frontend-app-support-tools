/* eslint-disable react/prop-types */
import { renderWithRouter } from '@edx/frontend-enterprise-utils';
import { fireEvent, screen } from '@testing-library/react';
import ProvisioningFormSubsidy from '../ProvisioningFormSubsidy';
import { ProvisioningContext, initialStateValue } from '../../../testData/Provisioning';
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
    // Retrieves a list of input elements based on test ids
    for (let i = 0; i < subsidyTypeOptions.length; i++) {
      const subsidyTypeRadioOptionBeforeClick = screen.getByTestId(subsidyTypeOptions[i]);
      fireEvent.click(subsidyTypeRadioOptionBeforeClick);
      // For some reason, we need to re-get the element to get the updated value.
      const subsidyTypeRadioOptionAfterClick = screen.getByTestId(subsidyTypeOptions[i]);
      expect(subsidyTypeRadioOptionAfterClick.checked).toBeTruthy();
    }
  });
  it('renders hydrated subsidyReqRev selection if isEditMode is true', () => {
    const updatedInitialState = {
      ...initialStateValue,
      isEditMode: true,
      formData: {
        ...initialStateValue.formData,
        subsidyRevReq: 'bulk-enrollment-prepay',
      },
    };
    renderWithRouter(<ProvisioningFormSubsidyWrapper value={updatedInitialState} />);
    const subsidyButton = screen.getByTestId('bulk-enrollment-prepay');
    expect(subsidyButton.checked).toBeTruthy();
  });
});
