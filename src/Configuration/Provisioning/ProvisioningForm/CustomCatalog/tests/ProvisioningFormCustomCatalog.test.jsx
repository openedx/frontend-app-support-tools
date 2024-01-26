/* eslint-disable react/prop-types */
import { renderWithRouter } from '@edx/frontend-enterprise-utils';
import { screen, act } from '@testing-library/react';
import ProvisioningFormCustomCatalog from '../ProvisioningFormCustomCatalog';
import { singlePolicy } from '../../../../testData';
import { initialStateValue, ProvisioningContext } from '../../../../testData/Provisioning';
import PROVISIONING_PAGE_TEXT from '../../../data/constants';
import { sampleCatalogs } from '../../../../testData/constants';

const { CUSTOM_CATALOG } = PROVISIONING_PAGE_TEXT.FORM;

const policies = singlePolicy;

const ProvisioningFormCustomCatalogWrapper = ({
  value = {
    ...initialStateValue,
    existingEnterpriseCatalogs: {
      data: sampleCatalogs,
      isLoading: false,
    },
    formData: {
      ...initialStateValue.formData,
      policies,
    },
  },
}) => (
  <ProvisioningContext value={value}>
    <ProvisioningFormCustomCatalog index={0} />
  </ProvisioningContext>
);

describe('ProvisioningFormCustomCatalog', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('renders the custom catalog form', () => {
    renderWithRouter(<ProvisioningFormCustomCatalogWrapper />);
    expect(screen.getByText(CUSTOM_CATALOG.HEADER.TITLE)).toBeTruthy();
    expect(screen.getByText(CUSTOM_CATALOG.HEADER.WARN_SUB_TITLE)).toBeTruthy();
  });
  it('renders dropdown if customerCatalog is false', () => {
    const customCatalogPolicies = singlePolicy
      .map(policy => ({ ...policy, customerCatalog: false }));
    const customInitialStateValue = {
      ...initialStateValue,
      existingEnterpriseCatalogs: {
        data: sampleCatalogs,
        isLoading: false,
      },
      formData: {
        ...initialStateValue.formData,
        policies: customCatalogPolicies,
      },
    };
    renderWithRouter(<ProvisioningFormCustomCatalogWrapper
      value={customInitialStateValue}
    />);
    act(async () => {
      const autoSuggestInput = await screen.findByRole('list');
      expect(autoSuggestInput.readOnly).toBeFalsy();
    });
  });
  it('renders null if customerCatalog is undefined', () => {
    const customCatalogPolicies = singlePolicy
      .map(policy => ({ ...policy, customerCatalog: undefined }));
    const customInitialStateValue = {
      ...initialStateValue,
      existingEnterpriseCatalogs: {
        data: [],
        isLoading: false,
      },
      formData: {
        ...initialStateValue.formData,
        policies: customCatalogPolicies,
      },
    };

    renderWithRouter(<ProvisioningFormCustomCatalogWrapper
      value={customInitialStateValue}
    />);
    act(async () => {
      const autoSuggestInput = await screen.findByRole('list');
      expect(autoSuggestInput.readOnly).toBeTruthy();
    });
  });
});
