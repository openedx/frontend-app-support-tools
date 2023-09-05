/* eslint-disable react/prop-types */
import { renderWithRouter } from '@edx/frontend-enterprise-utils';
import { fireEvent, screen } from '@testing-library/react';
import { ProvisioningContext, initialStateValue } from '../../../../testData/Provisioning';
import PROVISIONING_PAGE_TEXT, { INITIAL_CATALOG_QUERIES } from '../../../data/constants';
import ProvisioningFormPerLearnerCapAmount from '../ProvisioningFormPerLearnerCapAmount';

const { LEARNER_CAP_DETAIL, ALERTS } = PROVISIONING_PAGE_TEXT.FORM;

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

  it('displays an error message if the input is not a whole dollar amount', () => {
    renderWithRouter(
      <ProvisioningFormPerLearnerCapAmountWrapper
        value={initialStateValue}
        index={0}
      />,
    );
    const input = screen.getByTestId('per-learner-spend-cap-amount');
    fireEvent.change(input, { target: { value: '100.50' } });
    expect(screen.getByText(ALERTS.incorrectDollarAmount)).toBeTruthy();
  });

  it('renders hydrated perLearnerCapValue if isEditMode is true', () => {
    const updatedInitialState = {
      ...initialStateValue,
      isEditMode: true,
      formData: {
        ...initialStateValue.formData,
        policies: [{
          perLearnerCap: true,
          perLearnerCapAmount: 4000,
        }],
      },
    };
    renderWithRouter(
      <ProvisioningFormPerLearnerCapAmountWrapper
        value={updatedInitialState}
        index={0}
      />,
    );
    expect(screen.getByRole('textbox', {
      name: 'Per learner spend limit ($)',
    }).value).toBe('4000');
  });
});
