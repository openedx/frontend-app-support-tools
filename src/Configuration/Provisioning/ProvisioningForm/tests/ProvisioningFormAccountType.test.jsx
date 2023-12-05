/* eslint-disable react/prop-types */
import { renderWithRouter } from '@edx/frontend-enterprise-utils';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { initialStateValue, ProvisioningContext } from '../../../testData/Provisioning';
import PROVISIONING_PAGE_TEXT from '../../data/constants';
import useProvisioningContext from '../../data/hooks';
import ProvisioningFormAccountType from '../ProvisioningFormAccountType';
import ProvisioningFormTitle from '../ProvisioningFormTitle';

const { ACCOUNT_CREATION } = PROVISIONING_PAGE_TEXT.FORM;

jest.mock('../../data/hooks');

// mock useState hook
const mockUseState = jest.fn();
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: (initialState) => [initialState, mockUseState],
}));
global.scrollTo = jest.fn();
const mockHydrateEnterpriseCatalogsData = jest.fn();
useProvisioningContext.mockReturnValue({
  setSubsidyTitle: jest.fn(),
  setMultipleFunds: jest.fn(),
  hydrateEnterpriseCatalogsData: mockHydrateEnterpriseCatalogsData,
  setCustomCatalog: jest.fn(),
  setAlertMessage: jest.fn(),
  setInvalidSubsidyFields: jest.fn(),
});
const ProvisioningFormAccountTypeWrapper = ({
  value = initialStateValue,
}) => (
  <ProvisioningContext value={value}>
    <ProvisioningFormTitle />
    <ProvisioningFormAccountType />
  </ProvisioningContext>
);

describe('ProvisioningFormAccountType', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('renders', () => {
    renderWithRouter(<ProvisioningFormAccountTypeWrapper />);

    expect(screen.getByText(ACCOUNT_CREATION.TITLE)).toBeTruthy();

    const accountTypeOptions = Object.keys(ACCOUNT_CREATION.OPTIONS);
    // Checks value for each radio input label
    for (let i = 0; i < accountTypeOptions.length; i++) {
      expect(screen.getByText(ACCOUNT_CREATION.OPTIONS[accountTypeOptions[i]])).toBeTruthy();
    }
    expect(screen.getByText('Not editable')).toBeTruthy();
  });
  it('switches active account type', () => {
    renderWithRouter(<ProvisioningFormAccountTypeWrapper />);

    const accountTypeOptions = Object.keys(ACCOUNT_CREATION.OPTIONS);
    const accountTypeButtons = [];
    // Retrieves a list of input elements based on test ids
    for (let i = 0; i < accountTypeOptions.length; i++) {
      accountTypeButtons.push(screen.getByTestId(ACCOUNT_CREATION.OPTIONS[accountTypeOptions[i]]));
    }
    // Clicks on each input element and checks if it is checked
    for (let i = 0; i < accountTypeButtons.length; i++) {
      fireEvent.click(accountTypeButtons[i]);
      expect(accountTypeButtons[i].checked).toBeTruthy();
    }
  });
  it('sets provisioning context value to false', () => {
    renderWithRouter(<ProvisioningFormAccountTypeWrapper />);

    const singleTestId = screen.getByTestId(ACCOUNT_CREATION.OPTIONS.single);
    fireEvent.click(singleTestId);

    expect(screen.getByTestId(ACCOUNT_CREATION.OPTIONS.single)).toBeTruthy();
  });
  it('hydrates catalog query data multiple', async () => {
    const value = {
      ...initialStateValue,
      existingEnterpriseCatalogs: {
        data: [],
        isLoading: false,
      },
      formData: {
        ...initialStateValue.formData,
        subsidyTitle: 'test',
        enterpriseUUID: 'someuuid',
      },
    };

    renderWithRouter(<ProvisioningFormAccountTypeWrapper value={value} />);

    // sets input value to 'test'
    const multipleTestId = screen.getByTestId(ACCOUNT_CREATION.OPTIONS.multiple);
    fireEvent.click(multipleTestId);

    await waitFor(() => expect(mockHydrateEnterpriseCatalogsData).toHaveBeenCalled());
  });
  it('hydrates catalog query data single', async () => {
    const value = {
      ...initialStateValue,
      existingEnterpriseCatalogs: {
        data: [],
        isLoading: false,
      },
      formData: {
        ...initialStateValue.formData,
        subsidyTitle: 'test',
        enterpriseUUID: uuidv4(),
      },
    };

    renderWithRouter(<ProvisioningFormAccountTypeWrapper value={value} />);

    // sets input value to 'test'
    const singleTestId = screen.getByTestId(ACCOUNT_CREATION.OPTIONS.single);
    fireEvent.click(singleTestId);
    await waitFor(() => expect(mockHydrateEnterpriseCatalogsData).toHaveBeenCalled());
  });
  it('handles error of hydrating catalog query data', async () => {
    const value = {
      ...initialStateValue,
      existingEnterpriseCatalogs: {
        data: [],
        isLoading: false,
      },
      formData: {
        ...initialStateValue.formData,
        subsidyTitle: 'test',
        enterpriseUUID: uuidv4(),
      },
    };
    const error = new Error('test');
    error.customAttributes = {
      httpErrorStatus: 500,
    };
    mockHydrateEnterpriseCatalogsData.mockImplementation(() => {
      throw error;
    });

    renderWithRouter(<ProvisioningFormAccountTypeWrapper value={value} />);

    // sets input value to 'test'
    const multipleTestId = screen.getByTestId(ACCOUNT_CREATION.OPTIONS.multiple);
    fireEvent.click(multipleTestId);
    await waitFor(() => expect(mockHydrateEnterpriseCatalogsData).toHaveBeenCalled());
  });
});
