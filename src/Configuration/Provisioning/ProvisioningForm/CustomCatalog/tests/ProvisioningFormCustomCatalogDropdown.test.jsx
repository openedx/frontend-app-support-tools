/* eslint-disable react/prop-types */
import { renderWithRouter } from '@edx/frontend-enterprise-utils';
import { fireEvent, screen } from '@testing-library/react';
import ProvisioningFormCustomCatalogDropdown from '../ProvisioningFormCustomCatalogDropdown';
import { ProvisioningContext, initialStateValue } from '../../../../testData';
import PROVISIONING_PAGE_TEXT, { autoSuggestSampleOptions } from '../../../data/constants';

const { CUSTOM_CATALOG } = PROVISIONING_PAGE_TEXT.FORM;

const ProvisioningFormCustomCatalogDropdownWrapper = ({
  value = initialStateValue,
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
  it('renders the custom catalog dropdown options', () => {
    renderWithRouter(<ProvisioningFormCustomCatalogDropdownWrapper />);

    const autoSuggestInput = screen.getByTestId('autosuggest');
    const autoSuggestButton = screen.getByRole('button');

    // open dropdown
    fireEvent.click(autoSuggestButton);
    // Check values are populating
    autoSuggestSampleOptions.forEach((option) => {
      expect(screen.getByText(option, { exact: false })).toBeTruthy();
    });
    // close dropdown
    fireEvent.click(autoSuggestButton);

    const autoSuggestDropdownButtons = screen.getAllByRole('button');
    // Check values are being selected
    for (let i = 1; i < autoSuggestDropdownButtons.length; i++) {
      fireEvent.click(autoSuggestButton);
      fireEvent.click(autoSuggestDropdownButtons[i]);
      expect(autoSuggestInput.getAttribute('value')).toContain(autoSuggestDropdownButtons[i].textContent);
    }
  });
  it('setSelected is called when autosuggest option is selected', () => {
    renderWithRouter(<ProvisioningFormCustomCatalogDropdownWrapper />);

    const autoSuggestInput = screen.getByTestId('autosuggest');
    const autoSuggestButton = screen.getByRole('button');

    // open dropdown
    fireEvent.click(autoSuggestButton);

    const autoSuggestDropdownButtons = screen.getAllByRole('button');
    fireEvent.click(autoSuggestDropdownButtons[3]);
    expect(autoSuggestInput.getAttribute('value')).toContain(autoSuggestDropdownButtons[3].textContent);
  });
});
