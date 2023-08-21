/* eslint-disable react/prop-types */
import { renderWithRouter } from '@edx/frontend-enterprise-utils';
import { screen, fireEvent } from '@testing-library/react';
import { ProvisioningContext, initialStateValue } from '../../../../testData/Provisioning';
import PROVISIONING_PAGE_TEXT, { INITIAL_CATALOG_QUERIES } from '../../../data/constants';
import ProvisioningFormAccountDetails from '../ProvisioningFormAccountDetails';

const { ACCOUNT_DETAIL, ALERTS } = PROVISIONING_PAGE_TEXT.FORM;

const ProvisioningFormAccountDetailsWrapper = ({
  value = initialStateValue,
  index = 0,
}) => (
  <ProvisioningContext value={value}>
    <ProvisioningFormAccountDetails index={index} />
  </ProvisioningContext>
);

describe('ProvisioningFormAccountDetails', () => {
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
      <ProvisioningFormAccountDetailsWrapper
        value={updatedInitialState}
        index={0}
      />,
    );
    expect(screen.getByText(ACCOUNT_DETAIL.TITLE)).toBeTruthy();
    expect(screen.getByText(ACCOUNT_DETAIL.OPTIONS.displayName)).toBeTruthy();
    expect(screen.getByText(ACCOUNT_DETAIL.OPTIONS.totalAccountValue.title)).toBeTruthy();
    expect(screen.getByText(ACCOUNT_DETAIL.OPTIONS.totalAccountValue.subtitle)).toBeTruthy();
  });
  it('updates the form display name data on change', () => {
    const updatedInitialState = {
      ...initialStateValue,
      multipleFunds: false,
      formData: {
        ...initialStateValue.formData,
        policies: INITIAL_CATALOG_QUERIES.defaultQuery,
      },
    };
    renderWithRouter(
      <ProvisioningFormAccountDetailsWrapper
        value={updatedInitialState}
        index={0}
      />,
    );

    expect(screen.getByText(ACCOUNT_DETAIL.OPTIONS.displayName)).toBeTruthy();
    const input = screen.getByTestId('account-name');
    fireEvent.change(input, { target: { value: 'Test Account Information' } });

    expect(input.getAttribute('value')).toEqual('Test Account Information');
  });
  it('updates the form total account value data on change', () => {
    const updatedInitialState = {
      ...initialStateValue,
      multipleFunds: false,
      formData: {
        ...initialStateValue.formData,
        policies: INITIAL_CATALOG_QUERIES.defaultQuery,
      },
    };
    renderWithRouter(
      <ProvisioningFormAccountDetailsWrapper
        value={updatedInitialState}
        index={0}
      />,
    );

    expect(screen.getByText(ACCOUNT_DETAIL.OPTIONS.totalAccountValue.title)).toBeTruthy();
    expect(screen.getByText(ACCOUNT_DETAIL.OPTIONS.totalAccountValue.subtitle)).toBeTruthy();
    const input = screen.getByTestId('account-value');
    fireEvent.change(input, { target: { value: '7777777' } });

    expect(input.getAttribute('value')).toEqual('7777777');
  });
  it('displays an error message if the input is not a whole dollar amount', () => {
    renderWithRouter(
      <ProvisioningFormAccountDetailsWrapper
        value={initialStateValue}
        index={0}
      />,
    );
    const input = screen.getByTestId('account-value');
    fireEvent.change(input, { target: { value: '100.50' } });
    expect(screen.getByText(ALERTS.incorrectDollarAmount)).toBeTruthy();
  });
  it('autogenerates name from subsidyTitle', () => {
    const updatedInitialState = {
      ...initialStateValue,
      multipleFunds: false,
      formData: {
        ...initialStateValue.formData,
        subsidyTitle: 'Test Subsidy Title',
        policies: INITIAL_CATALOG_QUERIES.defaultQuery,
      },
    };
    renderWithRouter(
      <ProvisioningFormAccountDetailsWrapper
        value={updatedInitialState}
        index={0}
      />,
    );

    expect(screen.getByText(ACCOUNT_DETAIL.OPTIONS.displayName)).toBeTruthy();
    const input = screen.getByTestId('account-name');

    expect(input.getAttribute('value')).toEqual('Test Subsidy Title --- ');
  });
});
