/* eslint-disable react/prop-types */
import { renderWithRouter } from '@edx/frontend-enterprise-utils';
import { screen } from '@testing-library/react';
import ProvisioningFormCustomCatalog from '../ProvisioningFormCustomCatalog';
import { ProvisioningContext, initialStateValue } from '../../../../testData';
import PROVISIONING_PAGE_TEXT from '../../../data/constants';

const { CUSTOM_CATALOG } = PROVISIONING_PAGE_TEXT.FORM;

const ProvisioningFormCustomCatalogWrapper = ({
  value = initialStateValue,
}) => (
  <ProvisioningContext value={value}>
    <ProvisioningFormCustomCatalog />
  </ProvisioningContext>
);

describe('ProvisioningFormCustomCatalog', () => {
  it('renders the custom catalog form', () => {
    renderWithRouter(<ProvisioningFormCustomCatalogWrapper />);
    expect(screen.getByText(CUSTOM_CATALOG.TITLE)).toBeTruthy();
    expect(screen.getByText(CUSTOM_CATALOG.SUB_TITLE)).toBeTruthy();
  });
});
