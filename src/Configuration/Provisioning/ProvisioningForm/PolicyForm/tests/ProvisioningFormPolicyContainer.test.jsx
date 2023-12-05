/* eslint-disable react/prop-types */
import { renderWithRouter } from '@edx/frontend-enterprise-utils';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { v4 as uuidv4 } from 'uuid';
import ProvisioningFormPolicyContainer from '../ProvisioningFormPolicyContainer';
import { initialStateValue, ProvisioningContext } from '../../../../testData/Provisioning';
import PROVISIONING_PAGE_TEXT, { INITIAL_POLICIES } from '../../../data/constants';
import { generateBudgetDisplayName } from '../../../data/utils';

const { ACCOUNT_DETAIL, POLICY_TYPE } = PROVISIONING_PAGE_TEXT.FORM;

const ProvisioningFormPolicyContainerWrapper = ({
  value = initialStateValue,
  sampleCatalogQuery = INITIAL_POLICIES.multiplePolicies,
}) => (
  <ProvisioningContext value={value}>
    {sampleCatalogQuery.map(({ predefinedQueryType }, index) => (
      <ProvisioningFormPolicyContainer
        key={uuidv4()}
        title={predefinedQueryType}
        index={index}
      />
    ))}
  </ProvisioningContext>
);

// TODO: Integration Tests
describe('ProvisioningFormPolicyContainer', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('renders single policy state', () => {
    const updatedInitialState = {
      ...initialStateValue,
      multipleFunds: false,
      formData: {
        ...initialStateValue.formData,
        policies: INITIAL_POLICIES.singlePolicy,
      },
    };
    renderWithRouter(
      <ProvisioningFormPolicyContainerWrapper
        value={updatedInitialState}
        sampleCatalogQuery={INITIAL_POLICIES.singlePolicy}
      />,
    );
    expect(screen.getAllByText(ACCOUNT_DETAIL.TITLE)).toBeTruthy();
  });
  it('renders multiple policy state', () => {
    const updatedInitialState = {
      ...initialStateValue,
      multipleFunds: true,
      formData: {
        ...initialStateValue.formData,
        policies: INITIAL_POLICIES.multiplePolicies,
      },
    };
    renderWithRouter(
      <ProvisioningFormPolicyContainerWrapper
        value={updatedInitialState}
        sampleCatalogQuery={INITIAL_POLICIES.multiplePolicies}
      />,
    );
    expect(screen.getAllByText(ACCOUNT_DETAIL.TITLE).length).toEqual(INITIAL_POLICIES.multiplePolicies.length);
    expect(screen.getByText(generateBudgetDisplayName(INITIAL_POLICIES.multiplePolicies[0]))).toBeTruthy();
    expect(screen.getByText(generateBudgetDisplayName(INITIAL_POLICIES.multiplePolicies[1]))).toBeTruthy();
  });
  it('renders policy type and selects AssignedLearnerCreditAccessPolicy', async () => {
    const updatedInitialState = {
      ...initialStateValue,
      multipleFunds: false,
      formData: {
        ...initialStateValue.formData,
        policies: INITIAL_POLICIES.singlePolicy,
      },
    };
    renderWithRouter(
      <ProvisioningFormPolicyContainerWrapper
        value={updatedInitialState}
        sampleCatalogQuery={INITIAL_POLICIES.singlePolicy}
      />,
    );
    expect(screen.getByText(POLICY_TYPE.TITLE)).toBeTruthy();
    expect(screen.getByText(POLICY_TYPE.LABEL)).toBeTruthy();
    userEvent.click(screen.getByTestId(POLICY_TYPE.OPTIONS.ADMIN_SELECTS.DESCRIPTION));
    await waitFor(() => {
      expect(screen.getByTestId(POLICY_TYPE.OPTIONS.ADMIN_SELECTS.DESCRIPTION).checked).toBeTruthy();
    });
  });
});
