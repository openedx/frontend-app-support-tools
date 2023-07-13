/* eslint-disable react/prop-types */
import { renderWithRouter } from '@edx/frontend-enterprise-utils';
import { fireEvent, screen } from '@testing-library/react';
import ProvisioningFormCustomCatalog from '../ProvisioningFormCustomCatalog';
import {
  sampleCatalogQueries,
  singlePolicy,
} from '../../../../testData';
import {
  ProvisioningContext,
  initialStateValue,
} from '../../../../testData/Provisioning';
import PROVISIONING_PAGE_TEXT from '../../../data/constants';

const { CUSTOM_CATALOG } = PROVISIONING_PAGE_TEXT.FORM;

const catalogQueries = sampleCatalogQueries;
const policies = singlePolicy;

const ProvisioningFormCustomCatalogWrapper = ({
  value = {
    ...initialStateValue,
    catalogQueries,
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
    expect(screen.getByText(CUSTOM_CATALOG.HEADER.DEFINE.TITLE)).toBeTruthy();
    expect(screen.getByText(CUSTOM_CATALOG.HEADER.DEFINE.SUB_TITLE)).toBeTruthy();
  });
  it('renders dropdown if customerCatalog is false', () => {
    const customCatalogPolicies = singlePolicy
      .map(policy => ({ ...policy, customerCatalog: false }));
    const customInitialStateValue = {
      ...initialStateValue,
      catalogQueries,
      formData: {
        ...initialStateValue.formData,
        policies: customCatalogPolicies,
      },
    };
    renderWithRouter(<ProvisioningFormCustomCatalogWrapper
      value={customInitialStateValue}
    />);
    // Looks for any text wrapped between tags
    const autoSuggestButton = screen.getAllByRole('button')[0];
    // open dropdown
    fireEvent.click(autoSuggestButton);

    const autoSuggestDropdownButtons = screen.getAllByRole('button');
    const filteredDropdowns = autoSuggestDropdownButtons.filter((element) => element.textContent.includes('Test'));

    fireEvent.click(filteredDropdowns[0]);

    expect(screen.getByText(CUSTOM_CATALOG.OPTIONS.enterpriseCatalogQuery.subtitle)).toBeTruthy();
  });
  it('renders null if customerCatalog is undefined', () => {
    const customCatalogPolicies = singlePolicy
      .map(policy => ({ ...policy, customerCatalog: undefined }));
    const customInitialStateValue = {
      ...initialStateValue,
      catalogQueries,
      formData: {
        ...initialStateValue.formData,
        policies: customCatalogPolicies,
      },
    };

    renderWithRouter(<ProvisioningFormCustomCatalogWrapper
      value={customInitialStateValue}
    />);

    expect(screen.queryByText(CUSTOM_CATALOG.HEADER.DEFINE.SUB_TITLE)).toBeFalsy();
  });
});
