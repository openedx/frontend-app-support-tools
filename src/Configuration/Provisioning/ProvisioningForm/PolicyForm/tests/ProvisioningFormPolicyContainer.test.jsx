/* eslint-disable react/prop-types */
import { renderWithRouter } from '@edx/frontend-enterprise-utils';
import { screen } from '@testing-library/react';
import ProvisioningFormPolicyContainer from '../ProvisioningFormPolicyContainer';
import { ProvisioningContext, initialStateValue } from '../../../../testData';
import PROVISIONING_PAGE_TEXT, { INITIAL_CATALOG_QUERIES } from '../../../data/constants';

const { ACCOUNT_DETAIL } = PROVISIONING_PAGE_TEXT.FORM;

const ProvisioningFormPolicyContainerWrapper = ({
  value = initialStateValue,
  sampleCatalogQuery = INITIAL_CATALOG_QUERIES.defaultQuery,
}) => (
  <ProvisioningContext value={value}>
    {sampleCatalogQuery.map(({ uuid, catalogQueryTitle }, index) => (
      <ProvisioningFormPolicyContainer
        key={uuid}
        title={catalogQueryTitle}
        index={index}
      />
    ))}
  </ProvisioningContext>
);

describe('ProvisioningFormPolicyContainer', () => {
  beforeEach(() => {
    jest.resetAllMocks();
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
      <ProvisioningFormPolicyContainerWrapper
        value={updatedInitialState}
        sampleCatalogQuery={INITIAL_CATALOG_QUERIES.defaultQuery}
      />,
    );
    expect(screen.getByText(ACCOUNT_DETAIL.TITLE)).toBeTruthy();
  });
  it('should render alert if multipleFunds is undefined', () => {
    renderWithRouter(<ProvisioningFormPolicyContainerWrapper />);
    expect(screen.getByText(PROVISIONING_PAGE_TEXT.FORM.ALERTS.unselectedAccountType)).toBeTruthy();
  });
});
