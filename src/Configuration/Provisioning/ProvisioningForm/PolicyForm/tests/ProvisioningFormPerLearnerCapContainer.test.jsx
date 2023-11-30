/* eslint-disable react/prop-types */
import { renderWithRouter } from '@edx/frontend-enterprise-utils';
import { screen, fireEvent } from '@testing-library/react';
import { ProvisioningContext, initialStateValue } from '../../../../testData/Provisioning';
import PROVISIONING_PAGE_TEXT, { INITIAL_CATALOG_QUERIES } from '../../../data/constants';
import ProvisioningFormPerLearnerCapContainer from '../ProvisioningFormPerLearnerCapContainer';

const { LEARNER_CAP_DETAIL, LEARNER_CAP, POLICY_TYPE } = PROVISIONING_PAGE_TEXT.FORM;

const ProvisioningFormPerLearnerCapContainerWrapper = ({
  value = initialStateValue,
  index = 0,
}) => (
  <ProvisioningContext value={value}>
    <ProvisioningFormPerLearnerCapContainer index={index} />
  </ProvisioningContext>
);

const updatedInitialState = {
  ...initialStateValue,
  multipleFunds: false,
  formData: {
    ...initialStateValue.formData,
    policies: [
      {
        ...INITIAL_CATALOG_QUERIES.defaultQuery,
        policyType: POLICY_TYPE.OPTIONS.LEARNER_SELECTS.VALUE,
      },
    ],
  },
};

describe('PerLearnerCapContainer', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('renders single policy state', () => {
    renderWithRouter(
      <ProvisioningFormPerLearnerCapContainerWrapper
        value={updatedInitialState}
        index={0}
      />,
    );

    expect(screen.getByText(LEARNER_CAP.TITLE)).toBeTruthy();
    expect(screen.getByText(LEARNER_CAP.SUB_TITLE)).toBeTruthy();
  });
  it('updates the state of form on change, true', () => {
    renderWithRouter(
      <ProvisioningFormPerLearnerCapContainerWrapper
        value={updatedInitialState}
        index={0}
      />,
    );

    const input = screen.getByTestId(LEARNER_CAP.OPTIONS.yes);
    fireEvent.click(input);
    expect(screen.getByText(LEARNER_CAP_DETAIL.TITLE)).toBeTruthy();
  });
  it('updates the state of form on change, false', () => {
    renderWithRouter(
      <ProvisioningFormPerLearnerCapContainerWrapper
        value={updatedInitialState}
        index={0}
      />,
    );

    const input = screen.getByTestId(LEARNER_CAP.OPTIONS.no);
    fireEvent.click(input);
    expect(screen.queryByText(LEARNER_CAP_DETAIL.TITLE)).not.toBeTruthy();
  });
});
