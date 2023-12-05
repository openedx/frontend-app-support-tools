/* eslint-disable react/prop-types */
import { renderWithRouter } from '@edx/frontend-enterprise-utils';
import { fireEvent, screen } from '@testing-library/react';
import { initialStateValue, ProvisioningContext } from '../../../../testData/Provisioning';
import PROVISIONING_PAGE_TEXT, { INITIAL_POLICIES, PREDEFINED_QUERIES_ENUM } from '../../../data/constants';
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
      isEditMode: false,
      formData: {
        ...initialStateValue.formData,
        policies: INITIAL_POLICIES.singlePolicy,
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
      isEditMode: false,
      multipleFunds: false,
      formData: {
        ...initialStateValue.formData,
        policies: INITIAL_POLICIES.singlePolicy,
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
      isEditMode: false,
      multipleFunds: false,
      formData: {
        ...initialStateValue.formData,
        policies: INITIAL_POLICIES.singlePolicy,
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
  it('generates an empty budget/policy display name when no catalog options are selected', async () => {
    const updatedInitialState = {
      ...initialStateValue,
      multipleFunds: false,
      formData: {
        ...initialStateValue.formData,
        subsidyTitle: 'Test Subsidy Title',
        policies: INITIAL_POLICIES.singlePolicy,
      },
    };
    renderWithRouter(
      <ProvisioningFormAccountDetailsWrapper
        value={updatedInitialState}
        index={0}
      />,
    );

    expect(screen.getByText(ACCOUNT_DETAIL.OPTIONS.displayName)).toBeTruthy();

    // Make sure the budget display name field is empty since we haven't selected a catalog type yet.
    expect(screen.getByTestId('account-name').getAttribute('value')).toEqual('');
  });
  it('generates the correct policy display name by combining the customer and selected catalog type', async () => {
    const updatedInitialState = {
      ...initialStateValue,
      multipleFunds: false,
      formData: {
        ...initialStateValue.formData,
        subsidyTitle: 'Test Subsidy Title',
        policies: [{
          predefinedQueryType: PREDEFINED_QUERIES_ENUM.openCourses,
          customCatalog: false,
          catalogUuid: undefined,
          catalogTitle: undefined,
        }],
      },
    };
    renderWithRouter(
      <ProvisioningFormAccountDetailsWrapper
        value={updatedInitialState}
        index={0}
      />,
    );

    expect(screen.getByText(ACCOUNT_DETAIL.OPTIONS.displayName)).toBeTruthy();
    expect(screen.getByRole('textbox', {
      name: 'Display name',
    }).value).toBe('Test Subsidy Title --- Open Courses');
  });
  it('renders hydrated subsidy display value and amount if isEditMode is true', () => {
    const updatedInitialState = {
      ...initialStateValue,
      isEditMode: true,
      formData: {
        ...initialStateValue.formData,
        subsidyTitle: 'Test Subsidy Title',
        policies: [{
          accountValue: '4000',
          accountName: 'Test Subsidy Title --- Open Courses',
          predefinedQueryType: PREDEFINED_QUERIES_ENUM.openCourses,
          customCatalog: false,
          catalogUuid: undefined,
        }],
      },
    };
    renderWithRouter(
      <ProvisioningFormAccountDetailsWrapper
        value={updatedInitialState}
        index={0}
      />,
    );

    expect(screen.getByRole('textbox', {
      name: 'Display name',
    }).value).toBe('Test Subsidy Title --- Open Courses');
    expect(screen.getByText('$40')).toBeTruthy();
  });
});
