/* eslint-disable react/prop-types */
import { screen } from '@testing-library/react';
import { renderWithRouter } from '@edx/frontend-enterprise-utils';
import { initialStateValue, ProvisioningContext } from '../../../../testData/Provisioning';
import ProvisioningFormCatalogContainer from '../ProvisioningFormCatalogContainer';
import PROVISIONING_PAGE_TEXT from '../../../data/constants';

const { CUSTOM_CATALOG } = PROVISIONING_PAGE_TEXT.FORM;

const ProvisioningFormCatalogContainerWrapper = ({
  value = initialStateValue,
  index = 0,
}) => (
  <ProvisioningContext value={value}>
    <ProvisioningFormCatalogContainer index={index} />
  </ProvisioningContext>
);

describe('ProvisioningFormCatalogContainer', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('renders', () => {
    const updatedInitialState = {
      ...initialStateValue,
      formData: {
        ...initialStateValue.formData,
        policies: [{
          customCatalog: true,
        }],
      },
    };
    renderWithRouter(<ProvisioningFormCatalogContainerWrapper
      value={updatedInitialState}
    />);
    expect(screen.queryByText(CUSTOM_CATALOG.HEADER.TITLE)).toBeTruthy();
  });
});
