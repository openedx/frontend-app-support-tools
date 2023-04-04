/* eslint-disable react/prop-types */
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { renderWithRouter } from '@edx/frontend-enterprise-utils';
import { ProvisioningContext, initialStateValue } from '../../../../testData';
import ProvisioningFormSourceCustomCatalogRadio from '../ProvisioningFormSourceCustomCatalogRadio';
import PROVISIONING_PAGE_TEXT from '../../../data/constants';

const { CUSTOM_CATALOG } = PROVISIONING_PAGE_TEXT.FORM;

const ProvisioningFormSourceCustomCatalogRadioWrapper = ({
  value = initialStateValue,
  index = 0,
}) => (
  <ProvisioningContext value={value}>
    <ProvisioningFormSourceCustomCatalogRadio index={index} />
  </ProvisioningContext>
);

describe('ProvisioningFormSourceCustomCatalogRadio', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('renders', () => {
    renderWithRouter(<ProvisioningFormSourceCustomCatalogRadioWrapper />);

    const radioInputOptions = Object.keys(CUSTOM_CATALOG.OPTIONS.enterpriseCustomerCatalog);
    for (let i = 0; i < radioInputOptions.length; i++) {
      expect(screen.getByText(CUSTOM_CATALOG.OPTIONS.enterpriseCustomerCatalog[radioInputOptions[i]])).toBeTruthy();
    }
  });
  it('switches active radio input', () => {
    renderWithRouter(<ProvisioningFormSourceCustomCatalogRadioWrapper />);
    const radioInputOptions = Object.keys(CUSTOM_CATALOG.OPTIONS.enterpriseCustomerCatalog);
    const radioButtons = [];
    // Retrieves a list of input elements based on test ids
    for (let i = 0; i < radioInputOptions.length; i++) {
      radioButtons.push(screen.getByTestId(CUSTOM_CATALOG.OPTIONS.enterpriseCustomerCatalog[radioInputOptions[i]]));
    }
    // Clicks on each input element and checks if it is checked
    for (let i = 0; i < radioButtons.length; i++) {
      fireEvent.click(radioButtons[i]);
      waitFor(() => (expect(radioButtons[i].checked).toBeTruthy()));
    }
  });
});
