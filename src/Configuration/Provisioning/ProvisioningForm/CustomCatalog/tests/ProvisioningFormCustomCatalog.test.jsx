/* eslint-disable react/prop-types */
import { renderWithRouter } from '@edx/frontend-enterprise-utils';
import { screen } from '@testing-library/react';
import ProvisioningFormCustomCatalog from '../ProvisioningFormCustomCatalog';
import {
  ProvisioningContext, initialStateValue, sampleCatalogQueries, singlePolicy,
} from '../../../../testData';
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
  it('renders the custom catalog form', () => {
    renderWithRouter(<ProvisioningFormCustomCatalogWrapper />);
    expect(screen.getByText(CUSTOM_CATALOG.HEADER.DEFINE.TITLE)).toBeTruthy();
    expect(screen.getByText(CUSTOM_CATALOG.HEADER.DEFINE.SUB_TITLE)).toBeTruthy();
  });
});
