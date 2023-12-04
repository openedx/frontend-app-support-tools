/* eslint-disable react/prop-types */
import { renderWithRouter } from '@edx/frontend-enterprise-utils';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import ProvisioningFormCatalog from '../ProvisioningFormCatalog';
import { ProvisioningContext, initialStateValue } from '../../../../testData/Provisioning';
import PROVISIONING_PAGE_TEXT, { INITIAL_CATALOG_QUERIES, splitStringBudget } from '../../../data/constants';

const { CATALOG } = PROVISIONING_PAGE_TEXT.FORM;

const ProvisioningFormCatalogWrapper = ({
  value = initialStateValue,
  index = 0,
}) => (
  <ProvisioningContext value={value}>
    <ProvisioningFormCatalog index={index} />
  </ProvisioningContext>
);

describe('ProvisioningFormCatalog', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('renders null state', () => {
    renderWithRouter(<ProvisioningFormCatalogWrapper />);
    expect(screen.queryByText(CATALOG.TITLE)).toBeNull();
    expect(screen.queryByText(CATALOG.SUB_TITLE)).toBeNull();
  });
  it('renders single policy state', () => {
    const updatedInitialState = {
      ...initialStateValue,
      multipleFunds: false,
      formData: {
        ...initialStateValue.formData,
        policies: INITIAL_CATALOG_QUERIES.defaultQuery,
      },
    };
    renderWithRouter(
      <ProvisioningFormCatalogWrapper
        value={updatedInitialState}
        index={0}
      />,
    );

    expect(screen.getByText(CATALOG.TITLE)).toBeTruthy();
    expect(screen.getByText(CATALOG.SUB_TITLE)).toBeTruthy();

    const catalogOptions = Object.keys(CATALOG.OPTIONS);
    const catalogButtons = [];
    // Retrieves a list of input elements based on test ids
    for (let i = 0; i < catalogOptions.length; i++) {
      catalogButtons.push(screen.getByTestId(CATALOG.OPTIONS[catalogOptions[i]]));
    }
    // Clicks on each input element and checks if it is checked
    for (let i = 0; i < catalogButtons.length; i++) {
      fireEvent.click(catalogButtons[i]);
      expect(catalogButtons[i].checked).toBeTruthy();
    }
  });
  it('renders multiple policy state', () => {
    const updatedInitialState = {
      ...initialStateValue,
      multipleFunds: true,
      formData: {
        ...initialStateValue.formData,
        policies: INITIAL_CATALOG_QUERIES.multipleQueries,
      },
    };
    renderWithRouter(<ProvisioningFormCatalogWrapper
      value={updatedInitialState}
      index={0}
    />);
    expect(screen.getByText(CATALOG.TITLE)).toBeTruthy();
    expect(screen.getByText(CATALOG.SUB_TITLE)).toBeTruthy();
    expect(screen.getByText(
      INITIAL_CATALOG_QUERIES.multipleQueries[0].catalogQueryTitle.split(splitStringBudget)[0],
    )).toBeTruthy();
    expect(screen.getByText('Not editable')).toBeTruthy();
  });
  it('sets context state with multipleFunds to be false', async () => {
    const updatedInitialState = {
      ...initialStateValue,
      multipleFunds: false,
      formData: {
        ...initialStateValue.formData,
        policies: [{
          catalogCategory: 'Everything',
          catalogQueryMetadata: {
            catalogQuery: {
              title: 'Everything Budget',
              id: 29,
            },
          },
        }],
      },
    };
    renderWithRouter(<ProvisioningFormCatalogWrapper
      value={updatedInitialState}
      index={0}
    />);

    const everythingOption = screen.getByTestId(CATALOG.OPTIONS.everything);
    fireEvent.click(everythingOption);
    await waitFor(() => expect(everythingOption.checked).toBeTruthy());
  });
  it('sets context state with custom catalog', async () => {
    const updatedInitialState = {
      ...initialStateValue,
      multipleFunds: false,
      customCatalog: true,
      formData: {
        ...initialStateValue.formData,
        policies: [{
          catalogCategory: 'Custom',
          catalogQueryMetadata: {
            catalogQuery: {
              title: 'custom title',
              id: 31,
            },
          },
        }],
      },
    };
    renderWithRouter(<ProvisioningFormCatalogWrapper
      value={updatedInitialState}
      index={0}
    />);

    const customOption = screen.getByTestId(CATALOG.OPTIONS.custom);
    fireEvent.click(customOption);
    await waitFor(() => expect(customOption.checked).toBeTruthy());
  });
});
