/* eslint-disable react/prop-types */
import { renderWithRouter } from '@edx/frontend-enterprise-utils';
import {
  act,
  fireEvent,
  screen,
  waitFor,
} from '@testing-library/react';
import ProvisioningFormCustomCatalogDropdown from '../ProvisioningFormCustomCatalogDropdown';
import { ProvisioningContext, initialStateValue } from '../../../../testData/Provisioning';
import { sampleCatalogQueries } from '../../../../testData';
import PROVISIONING_PAGE_TEXT from '../../../data/constants';

const { CUSTOM_CATALOG } = PROVISIONING_PAGE_TEXT.FORM;

const catalogQueries = sampleCatalogQueries;
const mockData = {
  data: {
    results: catalogQueries.data,
  },
};

jest.mock('../../../../../data/services/EnterpriseApiService', () => ({
  fetchEnterpriseCatalogQueries: jest.fn(() => Promise.resolve(mockData)),
}));

const ProvisioningFormCustomCatalogDropdownWrapper = ({
  value = {
    ...initialStateValue,
    catalogQueries,
  },
}) => (
  <ProvisioningContext value={value}>
    <ProvisioningFormCustomCatalogDropdown />
  </ProvisioningContext>
);

describe('ProvisioningFormCustomCatalogDropdown', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('renders the custom catalog dropdown', async () => {
    await act(async () => renderWithRouter(
      <ProvisioningFormCustomCatalogDropdownWrapper />,
    ));

    expect(screen.getByText(CUSTOM_CATALOG.OPTIONS.enterpriseCatalogQuery.title)).toBeTruthy();
    expect(screen.getByText(CUSTOM_CATALOG.OPTIONS.enterpriseCatalogQuery.subtitle)).toBeTruthy();
  });
  it('renders the custom catalog dropdown options', async () => {
    await act(async () => renderWithRouter(
      <ProvisioningFormCustomCatalogDropdownWrapper />,
    ));

    const autoSuggestInput = screen.getByTestId('custom-catalog-dropdown-autosuggest');
    const autoSuggestButton = screen.getAllByRole('button')[0];
    // open dropdown
    fireEvent.click(autoSuggestButton);
    // Check values are populating
    catalogQueries.data.forEach(({ title }) => {
      expect(screen.getByText(title, { exact: false })).toBeTruthy();
    });
    const autoSuggestDropdownButtons = screen.getAllByRole('button');
    const filteredDropdowns = autoSuggestDropdownButtons.filter((element) => element.textContent.includes('Test'));
    // close dropdown
    fireEvent.click(autoSuggestButton);

    for (let i = 0; i < filteredDropdowns.length; i++) {
      fireEvent.click(autoSuggestButton);
      fireEvent.click(filteredDropdowns[i]);
      waitFor(() => expect(autoSuggestInput.getAttribute('value')).toContain(filteredDropdowns[i].textContent));
    }
  });
  it('setSelected is called when autosuggest option is selected', async () => {
    await act(async () => renderWithRouter(
      <ProvisioningFormCustomCatalogDropdownWrapper />,
    ));

    const autoSuggestInput = screen.getByTestId('custom-catalog-dropdown-autosuggest');
    const autoSuggestButton = screen.getAllByRole('button')[0];

    // open dropdown
    fireEvent.click(autoSuggestButton);

    const autoSuggestDropdownButtons = screen.getAllByRole('button');
    const filteredDropdowns = autoSuggestDropdownButtons.filter((element) => element.textContent.includes('Test'));
    fireEvent.click(filteredDropdowns[3]);
    expect(autoSuggestInput.getAttribute('value')).toContain(filteredDropdowns[3].textContent);
  });
  it('renders default dropdown when catalogQueries is empty', async () => {
    await act(async () => renderWithRouter(
      <ProvisioningFormCustomCatalogDropdownWrapper
        value={{
          ...initialStateValue,
          catalogQueries: {
            data: [],
          },
        }}
      />,
    ));

    const autoSuggestButton = screen.getAllByRole('button')[0];
    // open dropdown
    fireEvent.click(autoSuggestButton);

    expect(screen.getByText('Loading')).toBeTruthy();
  });
  it('renders default catalog query title when isEditMode is true', async () => {
    await act(async () => renderWithRouter(
      <ProvisioningFormCustomCatalogDropdownWrapper
        value={{
          ...initialStateValue,
          isEditMode: true,
          catalogQueries: {
            data: mockData.data.results,
          },
          customCatalog: true,
          formData: {
            policies: [{
              catalogQueryMetadata: {
                catalogQuery: {
                  title: 'Snoopy gang',
                  uuid: '4ev3r',
                },
              },
            }],
          },
        }}
      />,
    ));
    expect(screen.getByRole('list', {
      name: 'Enterprise Catalog Query',
    }).value).toBe('Snoopy gang --- 4ev3r');
  });
  it('renders empty string title when isEditMode is false', async () => {
    await act(async () => renderWithRouter(
      <ProvisioningFormCustomCatalogDropdownWrapper
        value={{
          ...initialStateValue,
          isEditMode: false,
          catalogQueries: {
            data: mockData.data.results,
          },
          customCatalog: true,
          formData: {
            policies: [{
              catalogQueryMetadata: {
                catalogQuery: {
                  title: 'Snoopy gang',
                  uuid: '4ev3r',
                },
              },
            }],
          },
        }}
      />,
    ));
    expect(screen.getByRole('list', {
      name: 'Enterprise Catalog Query',
    }).value).toBe('');
  });
});
