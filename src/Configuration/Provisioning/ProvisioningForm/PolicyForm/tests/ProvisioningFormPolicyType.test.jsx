/* eslint-disable react/prop-types */
import { renderWithRouter } from '@edx/frontend-enterprise-utils';
import { fireEvent, screen } from '@testing-library/react';
import { ProvisioningContext, initialStateValue } from '../../../../testData/Provisioning';
import PROVISIONING_PAGE_TEXT, { INITIAL_POLICIES } from '../../../data/constants';
import ProvisioningFormPolicyType from '../ProvisioningFormPolicyType';

const { POLICY_TYPE } = PROVISIONING_PAGE_TEXT.FORM;

const ProvisioningFormPolicyTypeWrapper = ({
  value = initialStateValue,
  index = 0,
}) => (
  <ProvisioningContext value={value}>
    <ProvisioningFormPolicyType index={index} />
  </ProvisioningContext>
);

describe('ProvisioningFormPolicyType', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('renders', () => {
    const updatedInitialState = {
      ...initialStateValue,
      multipleFunds: false,
      formData: {
        ...initialStateValue.formData,
        policies: INITIAL_POLICIES.singlePolicy,
      },
    };
    renderWithRouter(
      <ProvisioningFormPolicyTypeWrapper
        value={updatedInitialState}
        index={0}
      />,
    );

    expect(screen.getByText(POLICY_TYPE.TITLE)).toBeTruthy();
    expect(screen.getByText(POLICY_TYPE.LABEL)).toBeTruthy();

    const policyTypeOptions = Object.keys(POLICY_TYPE.OPTIONS);

    // Clicks on each input element and checks if it is checked
    for (let i = 0; i < policyTypeOptions.length; i++) {
      const buttonBeforeClick = screen.getByTestId(POLICY_TYPE.OPTIONS[policyTypeOptions[i]].DESCRIPTION);
      fireEvent.click(buttonBeforeClick);
      const buttonAfterClick = screen.getByTestId(POLICY_TYPE.OPTIONS[policyTypeOptions[i]].DESCRIPTION);
      expect(buttonAfterClick.checked).toBeTruthy();
    }
    expect(screen.getByText('Not editable')).toBeTruthy();
  });
});
