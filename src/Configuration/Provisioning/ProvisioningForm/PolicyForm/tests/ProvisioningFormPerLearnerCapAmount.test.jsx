/* eslint-disable react/prop-types */
import { renderWithRouter } from '@edx/frontend-enterprise-utils';
import { fireEvent, screen } from '@testing-library/react';
import { ProvisioningContext, initialStateValue } from '../../../../testData';
import PROVISIONING_PAGE_TEXT, { INITIAL_CATALOG_QUERIES } from '../../../data/constants';
import ProvisioningFormPerLearnerCapAmount from '../ProvisioningFormPerLearnerCapAmount';

const { LEARNER_CAP_DETAIL } = PROVISIONING_PAGE_TEXT.FORM;

const ProvisioningFormPerLearnerCapAmountWrapper = ({
  value = initialStateValue,
  index = 0,
}) => (
  <ProvisioningContext value={value}>
    <ProvisioningFormPerLearnerCapAmount index={index} />
  </ProvisioningContext>
);

describe('ProvisioningFormPerLearnerCapAmount', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('renders single policy state', () => {
    const updatedInitialState = {
      ...initialStateValue,
      multipleFunds: false,
      formData: {
        ...initialStateValue.formData,
        policies: INITIAL_CATALOG_QUERIES.defaultQuery,
      },
    };
    renderWithRouter(
      <ProvisioningFormPerLearnerCapAmountWrapper
        value={updatedInitialState}
        index={0}
      />,
    );

    expect(screen.getByText(LEARNER_CAP_DETAIL.TITLE)).toBeTruthy();
    expect(screen.getByText(LEARNER_CAP_DETAIL.OPTIONS.perLearnerSpendCap.title)).toBeTruthy();
    expect(screen.getByText(LEARNER_CAP_DETAIL.OPTIONS.perLearnerSpendCap.subtitle)).toBeTruthy();
  });
  it('updates the from data on change', () => {
    const updatedInitialState = {
      ...initialStateValue,
      multipleFunds: false,
      formData: {
        ...initialStateValue.formData,
        policies: INITIAL_CATALOG_QUERIES.defaultQuery,
      },
    };
    renderWithRouter(
      <ProvisioningFormPerLearnerCapAmountWrapper
        value={updatedInitialState}
        index={0}
      />,
    );

    expect(screen.getByText(LEARNER_CAP_DETAIL.OPTIONS.perLearnerSpendCap.title)).toBeTruthy();
    const input = screen.getByTestId('per-learner-spend-cap-amount');
    fireEvent.change(input, { target: { value: '100' } });
    expect(input.value).toBe('100');
  });
});
