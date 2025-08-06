import PropTypes from 'prop-types';
import { renderWithRouter } from '@edx/frontend-enterprise-utils';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import ProvisioningFormCustomCatalogDropdown from '../ProvisioningFormCustomCatalogDropdown';
import { initialStateValue, ProvisioningContext } from '../../../../testData/Provisioning';
import PROVISIONING_PAGE_TEXT from '../../../data/constants';
import { MOCK_PREDEFINED_CATALOG_QUERIES, sampleCatalogs } from '../../../../testData/constants';
import LmsApiService from '../../../../../data/services/EnterpriseApiService';
import { getPredefinedCatalogQueryMappings } from '../../../data/utils';

const { CUSTOM_CATALOG } = PROVISIONING_PAGE_TEXT.FORM;

const mockData = {
  data: {
    results: sampleCatalogs,
  },
};

jest.mock('../../../../../data/services/EnterpriseApiService', () => ({
  fetchEnterpriseCustomerCatalogs: jest.fn(() => Promise.resolve(mockData)),
}));

jest.mock('@edx/frontend-platform', () => ({
  ...jest.requireActual('@edx/frontend-platform'),
  getConfig: jest.fn(() => ({
    PREDEFINED_CATALOG_QUERIES: MOCK_PREDEFINED_CATALOG_QUERIES,
  })),
}));

const ProvisioningFormCustomCatalogDropdownWrapper = ({ value }) => (
  <ProvisioningContext value={value}>
    <ProvisioningFormCustomCatalogDropdown />
  </ProvisioningContext>
);

ProvisioningFormCustomCatalogDropdownWrapper.propTypes = {
  value: PropTypes.shape({
    existingEnterpriseCatalogs: PropTypes.shape({
      data: PropTypes.arrayOf(
        PropTypes.shape({
          title: PropTypes.string,
          enterpriseCatalogQuery: PropTypes.string,
          uuid: PropTypes.string,
        }),
      ),
      isLoading: PropTypes.bool,
    }),
    isEditMode: PropTypes.bool,
    formData: PropTypes.shape({
      policies: PropTypes.arrayOf(
        PropTypes.shape({
          oldCustomCatalog: PropTypes.bool,
          oldCatalogTitle: PropTypes.string,
          customCatalog: PropTypes.bool,
          catalogTitle: PropTypes.string,
          catalogUuid: PropTypes.string,
        }),
      ),
    }),
  }),
};

ProvisioningFormCustomCatalogDropdownWrapper.defaultProps = {
  value: {
    ...initialStateValue,
    existingEnterpriseCatalogs: {
      data: sampleCatalogs,
      isLoading: false,
    },
  },
};

describe('ProvisioningFormCustomCatalogDropdown', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the custom catalog dropdown', () => {
    renderWithRouter(<ProvisioningFormCustomCatalogDropdownWrapper />);
    expect(screen.getByText(CUSTOM_CATALOG.OPTIONS.enterpriseCatalog.title)).toBeTruthy();
    expect(screen.getByText(CUSTOM_CATALOG.OPTIONS.enterpriseCatalog.subtitle)).toBeTruthy();
  });

  it('renders the custom catalog dropdown options', () => {
    renderWithRouter(<ProvisioningFormCustomCatalogDropdownWrapper />);

    const autoSuggestInput = screen.getByTestId('custom-catalog-dropdown-autosuggest');
    const autoSuggestButton = screen.getAllByRole('button')[0];
    fireEvent.click(autoSuggestButton);

    const { queryIdToQueryType } = getPredefinedCatalogQueryMappings();
    sampleCatalogs.forEach(({ title, enterpriseCatalogQuery }) => {
      if (!(enterpriseCatalogQuery in queryIdToQueryType)) {
        expect(screen.getByText(title, { exact: false })).toBeTruthy();
      }
    });

    const autoSuggestDropdownButtons = screen.getAllByRole('button');
    const filteredDropdowns = autoSuggestDropdownButtons.filter((element) => element.textContent.includes('73cb6181'));

    fireEvent.click(autoSuggestButton);

    for (let i = 0; i < filteredDropdowns.length; i++) {
      fireEvent.click(autoSuggestButton);
      fireEvent.click(filteredDropdowns[i]);
      waitFor(() => {
        expect(autoSuggestInput).toHaveValue(expect.stringContaining(filteredDropdowns[i].textContent));
      });
    }
  });

  it('renders correct dropdown when catalogs list is still loading', () => {
    LmsApiService.fetchEnterpriseCustomerCatalogs.mockResolvedValueOnce({ data: { results: [] } });
    renderWithRouter(<ProvisioningFormCustomCatalogDropdownWrapper value={initialStateValue} />);
    const autoSuggestButton = screen.getAllByRole('button')[0];
    fireEvent.click(autoSuggestButton);
    expect(screen.getByText('Loading...')).toBeTruthy();
  });

  it('renders correct dropdown when the selected customer has no custom catalogs', () => {
    LmsApiService.fetchEnterpriseCustomerCatalogs.mockResolvedValueOnce({ data: { results: [] } });
    renderWithRouter(
      <ProvisioningFormCustomCatalogDropdownWrapper
        value={{
          ...initialStateValue,
          existingEnterpriseCatalogs: {
            data: [],
            isLoading: false,
          },
        }}
      />,
    );
    const autoSuggestButton = screen.getAllByRole('button')[0];
    fireEvent.click(autoSuggestButton);
    expect(screen.getByText('No catalogs found for customer.')).toBeTruthy();
  });

  it('renders default catalog query title when isEditMode is true', async () => {
    const customSampleCatalogs = [
      ...sampleCatalogs,
      {
        title: 'Snoopy gang',
        enterpriseCatalogQuery: 'custom-query',
        uuid: '4ev3r',
      },
    ];

    LmsApiService.fetchEnterpriseCustomerCatalogs.mockResolvedValue({
      data: { results: customSampleCatalogs },
    });

    renderWithRouter(
      <ProvisioningFormCustomCatalogDropdownWrapper
        value={{
          ...initialStateValue,
          isEditMode: true,
          existingEnterpriseCatalogs: {
            data: customSampleCatalogs,
            isLoading: false,
          },
          formData: {
            policies: [
              {
                oldCustomCatalog: true,
                oldCatalogTitle: 'Snoopy gang',
                customCatalog: true,
                catalogTitle: 'Snoopy gang',
                catalogUuid: '4ev3r',
              },
            ],
          },
        }}
      />,
    );

    const input = await screen.findByTestId('custom-catalog-dropdown-autosuggest');
    const toggleButton = screen.getAllByRole('button')[0];
    fireEvent.click(toggleButton);
    const option = await screen.findByText(/Snoopy gang --- 4ev3r/i);
    fireEvent.click(option);
    expect(input).toHaveValue('Snoopy gang --- 4ev3r');
  });

  it('renders empty string title when isEditMode is false', async () => {
    renderWithRouter(
      <ProvisioningFormCustomCatalogDropdownWrapper
        value={{
          ...initialStateValue,
          isEditMode: false,
          existingEnterpriseCatalogs: {
            data: sampleCatalogs,
            isLoading: false,
          },
          formData: {
            policies: [
              {
                customCatalog: true,
                catalogTitle: 'Snoopy gang',
                catalogUuid: '4ev3r',
              },
            ],
          },
        }}
      />,
    );
    const input = await screen.findByTestId('custom-catalog-dropdown-autosuggest');
    expect(input).toHaveValue('');
  });
});
