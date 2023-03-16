/* eslint-disable react/prop-types */
import { renderWithRouter } from '@edx/frontend-enterprise-utils';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import ProvisioningFormCustomCatalogDropdown from '../ProvisioningFormCustomCatalogDropdown';
import { ProvisioningContext, initialStateValue, sampleCatalogQueries } from '../../../../testData';
import PROVISIONING_PAGE_TEXT from '../../../data/constants';

const { CUSTOM_CATALOG } = PROVISIONING_PAGE_TEXT.FORM;

const catalogQueries = sampleCatalogQueries;

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
  it('renders the custom catalog dropdown', () => {
    renderWithRouter(<ProvisioningFormCustomCatalogDropdownWrapper />);

    expect(screen.getByText(CUSTOM_CATALOG.OPTIONS.enterpriseCatalogQuery.title)).toBeTruthy();
    expect(screen.getByText(CUSTOM_CATALOG.OPTIONS.enterpriseCatalogQuery.subtitle)).toBeTruthy();
  });
  it('renders the custom catalog dropdown options', async () => {
    renderWithRouter(<ProvisioningFormCustomCatalogDropdownWrapper />);

    const autoSuggestInput = screen.getByTestId('autosuggest');
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
  it('setSelected is called when autosuggest option is selected', () => {
    renderWithRouter(<ProvisioningFormCustomCatalogDropdownWrapper />);

    const autoSuggestInput = screen.getByTestId('autosuggest');
    const autoSuggestButton = screen.getAllByRole('button')[0];

    // open dropdown
    fireEvent.click(autoSuggestButton);

    const autoSuggestDropdownButtons = screen.getAllByRole('button');
    const filteredDropdowns = autoSuggestDropdownButtons.filter((element) => element.textContent.includes('Test'));
    fireEvent.click(filteredDropdowns[3]);
    expect(autoSuggestInput.getAttribute('value')).toContain(filteredDropdowns[3].textContent);
  });
});
