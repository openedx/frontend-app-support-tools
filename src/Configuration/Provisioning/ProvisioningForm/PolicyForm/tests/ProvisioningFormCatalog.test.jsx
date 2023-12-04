/* eslint-disable react/prop-types */
import { renderWithRouter } from '@edx/frontend-enterprise-utils';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import ProvisioningFormCatalog from '../ProvisioningFormCatalog';
import { initialStateValue, ProvisioningContext } from '../../../../testData/Provisioning';
import PROVISIONING_PAGE_TEXT, {
  INITIAL_POLICIES,
  PREDEFINED_QUERIES_ENUM,
  PREDEFINED_QUERY_DISPLAY_NAMES,
} from '../../../data/constants';

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
        policies: INITIAL_POLICIES.singlePolicy,
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
    // Clicks on each radio option and checks if it is checked
    for (let i = 0; i < catalogOptions.length; i++) {
      const catalogButtonBeforeClick = screen.getByTestId(catalogOptions[i]);
      expect(catalogButtonBeforeClick.getAttribute('checked')).toBeNull();
      fireEvent.click(catalogButtonBeforeClick);
      // For some reason, we need to re-get the element to get the updated value.
      const catalogButtonAfterClick = screen.getByTestId(catalogOptions[i]);
      expect(catalogButtonAfterClick.checked).toBeTruthy();
    }
  });
  it('renders multiple policy state', () => {
    const updatedInitialState = {
      ...initialStateValue,
      multipleFunds: true,
      formData: {
        ...initialStateValue.formData,
        policies: INITIAL_POLICIES.multiplePolicies,
      },
    };
    renderWithRouter(<ProvisioningFormCatalogWrapper
      value={updatedInitialState}
      index={0}
    />);
    expect(screen.getByText(CATALOG.TITLE)).toBeTruthy();
    expect(screen.getByText(CATALOG.SUB_TITLE)).toBeTruthy();
    expect(screen.getByText(
      PREDEFINED_QUERY_DISPLAY_NAMES[INITIAL_POLICIES.multiplePolicies[0].predefinedQueryType],
      { exact: false },
    )).toBeTruthy();
  });
  it('sets context state with multipleFunds to be false', async () => {
    const updatedInitialState = {
      ...initialStateValue,
      multipleFunds: false,
      formData: {
        ...initialStateValue.formData,
        policies: [{
          predefinedQueryType: PREDEFINED_QUERIES_ENUM.openCourses,
          customCatalog: false,
          catalogUuid: undefined,
        }],
      },
    };
    renderWithRouter(<ProvisioningFormCatalogWrapper
      value={updatedInitialState}
      index={0}
    />);
  });
  it('sets context state with custom catalog', async () => {
    const updatedInitialState = {
      ...initialStateValue,
      multipleFunds: false,
      formData: {
        ...initialStateValue.formData,
        policies: INITIAL_POLICIES.singlePolicy,
      },
    };
    renderWithRouter(<ProvisioningFormCatalogWrapper
      value={updatedInitialState}
      index={0}
    />);

    const customOptionBeforeClick = screen.getByTestId('custom');
    fireEvent.click(customOptionBeforeClick);
    // For some reason, we need to re-get the element to get the updated value.
    const customOptionAfterClick = screen.getByTestId('custom');
    await waitFor(() => expect(customOptionAfterClick.checked).toBeTruthy());
  });
});
